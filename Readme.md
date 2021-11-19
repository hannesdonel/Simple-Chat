# Simple Chat

This is a real-time chat app for mobile devices (iOS and Android) built with React Native. The app will provide users with a chat interface, offline function and options to share images and location.

<img src="./assets/example1.jpg" alt="Example Image 1" height="50vh">     <img src="./assets/example2.jpg" alt="Example Image 2" height="50vh">

<div style="padding:56.25% 0 0 0;position:relative;">
        <iframe src="https://player.vimeo.com/video/647875608?h=0eda7b1bcf&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:auto;" title="Simple Chat - Presentation"></iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>


## Technologies

- React Native
- JavaScript
- Google Firebase Database
- Google Firebase authentication
- Google Firebase Cloud Storage
- Expo
- Gifted Chat library


## Functionality

- You can pick a custom background color and set your chat name
- You can send a pic
- You can take a pic and share it
- You can share your location
- The entire app is fully compatible with screen readers
- You can reread your chat timeline offline
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

- The start the expo server:

        npm start

- scan QR code with your phone or press a (in the console) to start the app on Android studio or i to run it on an iOS simulator.