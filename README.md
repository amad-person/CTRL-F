# Find And Seek

Finds phrases and words in audio and video files.

## Find And Seek API-Server

Find And Seek's backend was built using Node.js and Express.js.

Setting Up:

1. Run `npm i` in api-server folder to install the dependencies.
2. Port number can be changed in api-server/config/settings.json.
3. Start server using `npm run start` to start server.
4. Request formats available in api-server/requests. Import into Postman for use.

## Find And Seek Client

Find And Seek's frontend was built using React. 

Setting up:

1. Run `cd ctrl-f-client` and `npm install` to install the dependencies.
2. Run the app with `npm run start`. The default port is `3000`.

## Credits

Find and Seek uses [IBM Watson's Speech to Text SDK](https://github.com/watson-developer-cloud/node-sdk) and [Tesseract OCR](https://github.com/tesseract-ocr/tesseract). 
