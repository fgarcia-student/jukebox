let express = require('express');
let multer = require('multer');
let path = require('path');

let app = express();
app.use(express.static('public'));
app.use(multer({dest: './uploads'}).array('song',1));

app.post('/',(req,res) => {
	console.log(req.files);
});

app.listen('3000',() => {
	console.log('listening on 3000');
})