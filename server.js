let express = require('express');
let path = require('path');

let app = express();
app.use(express.static('public'));
app.use(express.static('songs'));

app.get('/songs/',(req,res) => {
	let name = req.query.songName;
	res.sendFile(path.join(__dirname,`/songs/${name}`));
});

app.listen('3000',() => {
	console.log('listening on 3000');
})