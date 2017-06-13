let express = require('express');
let fileUpload = require('express-fileupload');
let fs = require('fs');
let path = require('path');

let app = express();
let list = [];

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('songs'));
app.use(fileUpload());

fs.readdir('songs', (err,files) => {
	files.forEach((file) => {
		list.push(file);
	});
});	

app.post('/upload', (req,res) => {
	if(!req.files){
		res.status(400).send('No files uploaded');
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
		songPath : list[0]
	});
});

app.listen('3000',() => {
	console.log('listening on 3000');
})