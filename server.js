let express = require('express');
let fileUpload = require('express-fileupload');
let mm = require('musicmetadata');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');

let app = express();
let list = [];

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('songs'));
app.use(fileUpload());

function updateSongs() {
	list = [];
	fs.readdir('songs', (err,files) => {
		files.forEach((file) => {
			mm(fs.createReadStream('./songs/'+file), (err,meta) => {
				let s = {};
				s.src = file;
				s.title = meta.title;
				s.artist = meta.artist[0];
				s.album = meta.album;
				s.year = meta.year;
				list.push(s);
			});
		});
	});
}

updateSongs();

app.post('/upload', (req,res) => {
	if(!req.files.uploadSong){
		res.redirect('/');
	}
	if(list.length == 10){
		//automatically remove first song
		//max list size 10 ATM
		songName = list[0].src;
		fs.unlink(`./songs/${songName}`);
		list.splice(0,1);
	}

	let newSong = req.files.uploadSong;
	let newSongName = newSong.name;
	newSong.mv(`./songs/${newSongName}`, (err) => {
		if(err){
			return res.status(500).send(err);
		}
		mm(fs.createReadStream('./songs/'+newSongName), (err,meta) => {
				let s = {};
				s.src = newSongName;
				s.title = meta.title;
				s.artist = meta.artist[0];
				s.album = meta.album;
				s.year = meta.year;
				list.push(s);
			});
		console.log('added');
		res.redirect('/');
	});
});

app.delete('/delete', (req,res) => {
	if(list.length >= 2){
		let id = req.query.id;
		songName = list[id].src;
		fs.unlink(`./songs/${songName}`,(err) => {
			if(err){
				return res.status(500).send(err);
			}
			list.splice(id,1);
			console.log('removed');
			res.end('removed');
		});
	}else{
		res.redirect('/');
	}
});

app.get('/',(req,res) => {
	console.log(list);
	res.render('index',{
		list: list || null,
		songPath : list[0].src || null,
		album: list[0].album || null,
		year: list[0].year || null,
		artist: list[0].artist || null,
		song: list[0].title || null
	});
});

app.get('/meta',(req,res) => {
	let index = req.query.id;
	res.send(list[index]);
});

app.listen((process.env.PORT ||'3000'),() => {
	console.log('listening on 3000');
});