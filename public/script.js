function Jukebox() {
	// play,pause,next,previous,increase_volume,decrease_volume,add_song,remove_song,stop,pick----methods
	// songs[array],current_song_index,volume,status{WAITING,PLAYING,PAUSED} ---state 
	const STATUS = ["WAITING","PLAYING","PAUSED"];

	this.current_song_time = 0;
	this.current_song_duration = 0;
	this.status = STATUS[0];

	this.playSong = function() {
		// play song indicated by user
		// set current song index to index of this song
		if(this.status == STATUS[0]){ //WAITING
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
			$('#currentSong')[0].currentTime = 0;
			this.status = STATUS[0]; //WAITING
		}
		console.log(this.status);
	}

	this.nextSong = function() {
		$('#select_song > option:selected').prop({
			'selected' : false
		}).next().prop({
			'selected' : true
		});
		updateCurrentSong();
		setTimeout(() => {
			this.playSong();
		},500);	
	}

	this.previousSong = function() {
		//previous song
		$('#select_song > option:selected').prop({
			'selected' : false
		}).prev().prop({
			'selected' : true
		});
		updateCurrentSong();
		setTimeout(() => {
			this.playSong();
		},500);		
	}

	this.loop = function(value) {
		let endOfSong = (this.current_song_time == this.current_song_duration);
		if(endOfSong){
			if(value == 1){
				this.playSong();
			}else if(value == 9){
				this.nextSong();
			}
		}
	}
}

function updateCurrentSong() {
	index = $('#select_song').val();
	console.log(index);
	$.ajax({
		type: 'GET',
		url: `/meta?id=${index}`,
		success: function(result) {
			if(result.img){
				$('#jukebox_bg').attr('src', result.img);
			}else{
				$('#jukebox_bg').attr('src', null);
			}
			$('#currentSong').attr('src',result.src);
			$('#album_details').text((result.album || 'Unknown'));
			$('#year_details').text((result.year || 'Unknown'));
			$('#artist_details').text((result.artist || 'Unknown'));
			$('#song_details').text((result.title || result.src));
		}

	})
}
function detailsSlide() {
	$('#song').show();
	$('#artist').hide();
	$('#album').hide();
	$('#year').hide();
	setTimeout(() => {
		$('#song').hide();
		$('#artist').show();
	},2000);
	setTimeout(() => {
		$('#artist').hide();
		$('#album').show();
	},4000);
	setTimeout(() => {
		$('#album').hide();
		$('#year').show();
	},6000);
	setTimeout(() => {
		$('#year').hide();
	},8000);
}

$(document).ready(() => {

	let jb = new Jukebox();
	let playing = false;

	setInterval(() => {
		detailsSlide();
	},8000);

	updateCurrentSong();

	$('#select_song').change(() => {
		updateCurrentSong();
	});

	$('#remove').click(() => {
		let remove = $('#select_song').val();
		console.log(remove);
		$.ajax({
			type: 'DELETE',
			url: `/delete?id=${remove}`,
			success: function(res) {
				window.location.href = '/';
			},
			error: function(err) {
				console.log(err);
				window.location.href = '/';
			}
		})
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

	$('#play').click(() => {
		if(playing){
			jb.pauseSong();
			playing = false;
			$('#play').text('Play');
		}else{
			jb.playSong();
			playing = true;
			$('#play').text('Pause');
		}
	});

	$('#stop').click(() => {
		jb.stopSong();
		playing = false;
		$('#play').text('Play');
	});

	$('#next').click(() => {
		jb.nextSong();
	});

	$('#previous').click(() => {
		jb.previousSong();
	});
});