let express = require('express');
let fs = require('fs');
let path = require('path');

let app = express();
let list = [];

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('songs'));

fs.readdir('songs', (err,files) => {
	files.forEach((file) => {
		list.push(file);
	});
});

app.get('/',(req,res) => {
	res.render('index',{
		list: null || list,
		songPath : list[0]
	});
});

app.listen('3000',() => {
	console.log('listening on 3000');
})