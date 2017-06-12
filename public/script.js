function Jukebox() {
	// play,pause,next,previous,increase_volume,decrease_volume,add_song,remove_song,stop,pick----methods
	// songs[array],current_song_index,volume,status{WAITING,PLAYING,PAUSED} ---state 
	const MIN_VOLUME = 0; // min
	const DEFAULT_VOLUME = .5; // out of 1
	const MAX_VOLUME = 1; // max
	const STATUS = ["WAITING","PLAYING","PAUSED"];

	this.songs = [];
	this.last_song = -1;
	this.current_song_index = 0;
	this.current_song_time = 0;
	this.current_song_duration = 0;
	this.volume = DEFAULT_VOLUME;
	this.status = STATUS[0];

	this.getSongList = function(){
		
	}

	this.playSong = function() {
		// play song indicated by user
		// set current song index to index of this song
		if(this.status == STATUS[0]){ //WAITING
			$('#currentSong').attr({
				"src" : this.songs[this.current_song_index].source
			});
			$('#currentSong').prop('volume',this.volume);
			$('#currentSong').trigger('play'); 
			// update status 
			this.status = STATUS[1]; // PLAYING
		}else if(this.status == STATUS[2]){ //PAUSED
			// resume current song
			$('#currentSong').trigger('play');
			this.status = STATUS[1]; // PLAYING
		}else if(this.status == STATUS[1]){
			this.stopSong();
			this.playSong();
		}
		console.log(this.status);
	}

	this.pauseSong = function() {
		// pause currently playing song
		if(this.status == STATUS[1]){ // playing
			$('#currentSong').trigger('pause');
			this.status = STATUS[2]; //PAUSED
		}
		console.log(this.status);
	}

	this.stopSong = function() {
		// drops song, sets status to WAITING
		if(this.status != STATUS[0]){ //if state is either PLAYING or PAUSED
			this.pauseSong();
			this.current_song_time = 0;
			this.status = STATUS[0]; //WAITING
		}
		console.log(this.status);
	}

	this.nextSong = function() {
		// skips rest of current song and begins to play next song in list
		if(this.current_song_index == this.songs.length - 1){
			this.current_song_index = 0;
			this.playSong();
		}else{
			this.current_song_index += 1;
			this.playSong();
		}
	}

	this.previousSong = function() {
		// plays previous song in list
		if(this.current_song_index == 0){
			this.current_song_index = this.songs.length - 1;
			this.playSong();
		}else{
			this.current_song_index -= 1;
			this.playSong();
		}
	}

	this.volUp = function() {
		if((this.volume+.1) >= MAX_VOLUME){
			this.volume = MAX_VOLUME;
		}else{
			$('#currentSong').prop("volume",this.volume);
			this.volume += .10;
		}
		console.log(this.volume);
	}

	this.volDown = function() {
		if((this.volume-.1) <= MIN_VOLUME){
			this.volume = MIN_VOLUME;
		}else{
			$('#currentSong').prop("volume",this.volume);
			this.volume -= .10;
		}
		console.log(this.volume);
	}

	this.loop = function(value) {
		if(value == 1){//loop current song only
			$('#currentSong').prop('loop',true);
		}else if(value == 9){//loop entire playlist
			$('#currentSong').prop('loop',false);
			if(this.current_song_time == this.current_song_duration){ //if current song is done
				this.nextSong();
			}
		}
	}
}

function Song(source,title) {

	const DEFAULT_IMG = null; //some default img later

	this.source = source;
	this.title = title;
	
}

function getSongName(song) {
	name = song.split("").reverse().join("");
	index = name.indexOf('\\');
	name = name.substring(0,index).split("").reverse().join("");
	return name;
}


$(document).ready(() => {

	$('#controls').hide();

	let jb = new Jukebox();

	$('#select_song').change(() => {
		jb.current_song_index = $('#select_song').val();
	});

	$('#currentSong').on('loadedmetadata',() => {
		jb.current_song_duration = $('#currentSong')[0].duration;
		let sec = parseInt(jb.current_song_duration % 60);
		if(sec<10){
			sec = '0' + sec;
		}
		let min = parseInt(jb.current_song_duration / 60);
		$('#duration').text(min+":"+sec);
	});

	$('#currentSong').on('timeupdate',() => {
		jb.current_song_time = $('#currentSong')[0].currentTime;
		let sec = parseInt(jb.current_song_time % 60);
		if(sec<10){
			sec = '0' + sec;
		}
		let min = parseInt(jb.current_song_time / 60);
		$('#current').text(min+":"+sec);
		jb.loop($('input[name="rd"]:checked').val());
	});

	$('#vol_up').click(() => {
		jb.volUp();
	});

	$('#vol_down').click(() => {
		jb.volDown();
	});

	$('#play').click(() => {
		jb.playSong();
	});
	$('#currentSong').on('error',(e) => {
		switch(e.target.error.code){
			case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
				showErr();
				jb.removeSong();
				break;
		}
	});

	$('#pause').click(() => {
		jb.pauseSong();
	});

	$('#stop').click(() => {
		jb.stopSong();
	});

	$('#next').click(() => {
		jb.nextSong();
	});

	$('#previous').click(() => {
		jb.previousSong();
	});
});