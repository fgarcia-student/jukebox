let express = require('express');
let fileUpload = require('express-fileupload');
let mm = require('musicmetadata');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');

let app = express();
let list = [];
let details = [];

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('songs'));
app.use(fileUpload());

fs.readdir('songs', (err,files) => {
	files.forEach((file) => {
		//TODO: fix metadata
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

app.post('/upload', (req,res) => {
	if(!req.files.uploadSong){
		res.redirect('/');
	}

	let newSong = req.files.uploadSong;
	let newSongName = newSong.name;
	newSong.mv(`./songs/${newSongName}`, (err) => {
		if(err){
			return res.status(500).send(err);
		}
		list.push(newSongName);
		console.log('added');
		res.redirect('/');
	});
});

app.delete('/delete', (req,res) => {
	let songName = req.query.songName;
	fs.unlink(`./songs/${songName}`,(err) => {
		if(err){
			return res.status(500).send(err);
		}
		let index = list.indexOf(songName);
		list.splice(index,1);
		console.log('removed');
		res.end('removed');
	});
});

app.get('/',(req,res) => {
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

app.listen('3000',() => {
	console.log('listening on 3000');
});