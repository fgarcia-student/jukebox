Personal Music Streaming App

Songs on server are shown to user. The user can choose songs to stream and listen to.

INSTRUCTIONS:

1. run the following command after downloading files
	
	a. npm install

2. Create 'songs' folder inside of 'jukebox' folder
	
	ex. -'jukebox'
		
		--node_modules/
		
		--package.json
		
		--public/
		
		--README.md
		
		--server.js

		--views/
		
		--*songs/*


3. Upload songs and play!


TODO:
1. Style and Jukebox-ify!

2. Only serve 1 MP3, overwrite when new song plays.

	A. 'new.mp3' on client side will constantly update with
		new song info, sent from server side

		a. current method requires client to download all
			songs on server.(Not efficient)

3. Make mobile friendly