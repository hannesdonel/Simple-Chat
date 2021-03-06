# Simple Chat

This is a real-time chat app for mobile devices (iOS and Android) built with React Native. The app will provide users with a chat interface, offline function and options to share images and location.

<a href="https://vimeo.com/manage/videos/647875608?embedded=false&source=video_title&owner=20281206">See the app in action.</a><br>
<a href="https://snack.expo.dev/@hannesdonel/9abbd0">Use app with expo snack in your browser.</a>

<img src="./assets/example1.jpg" alt="Example Image 1" width="30%">     <img src="./assets/example2.jpg" alt="Example Image 2" width="30%">


## Technologies

- React Native
- JavaScript
- Google Firebase Database
- Google Firebase authentication
- Google Firebase Cloud Storage
- expo
- Gifted Chat library


## Functionality

- Select custom background color and chat name
- Send a pic
- Take a pic and share it
- Share your location
- Ask for OS's permissions to browse data, use camera and mic
- Fully compatible with screen readers
- Reread chat timeline offline
- Data gets stored on- and offline to provide all time access


## Get started

(I'm using npm throughout this tutorial. Of course you can use anything else.)

#### Prerequisites
- Node.js

        npm install node@lts

- Expo CLI

        npm install --global expo-cli

- If you want to run the app on your device you also need the Expo app for <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www">Android</a> or <a href="https://apps.apple.com/app/apple-store/id982107779">iOS</a>. It's available through your App store.

#### Run the app
- First of all run:

        npm install

- Then start the expo server:

        npm start

- scan QR code with your phone or press a (in the console) to start the app on Android studio or i to run it on an iOS simulator.