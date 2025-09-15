

🌌 Eterna

Eterna is a cross-platform mobile app built with React Native (Expo), Firebase, and Cloudinary. It provides a space for users to create and share “pebbles” — pieces of text, images, or audio — that unlock at a future date.



✨ Features

* Authentication – Secure login and signup using Firebase
* Rooms – Create or join rooms via a unique ID
* Dashboard – Overview of user activity and shared content
* Journey – Track milestones, levels, and progress
* Pebbles – Create content (text, image, audio) with scheduled unlock dates

  * Media stored in Cloudinary
  * Metadata in Firestore
* Sticky Navbar – Persistent navigation across main sections



🛠 Tech Stack

* React Native (Expo Router) – for building the mobile UI
* Firebase – handles auth and database (Firestore)
* Cloudinary – media storage for audio and images
* Expo APIs – for media picker, date picker, and device integration


📂 Project Structure


Eterna/
├── app/               
│   ├── (auth)/            Login and signup
│   ├── (main)/            Dashboard, journey, pebbles
│   ├── (room)/            Room creation and join flow
│   ├── index.js           Root navigation
├── assets/               Fonts, images, media
├── components/           Reusable UI components
├── constants/            Global constants
├── hooks/                Custom React hooks
├── scripts/              Utility functions
├── firebase.js           Firebase config
├── App.js                Main app entry
├── package.json          Dependencies
├── tsconfig.json         TypeScript config
├── eslint.config.js      ESLint rules
├── .gitignore
├── README.md



🚀 Getting Started

1. Clone the Repository


git clone https://github.com/your-username/eterna.git
cd eterna


2. Install Dependencies


npm install


or


yarn install


3. Firebase Setup

* Create a project in the Firebase Console
* Enable Authentication (Email/Password) and Firestore Database
* Replace the values in firebase.js with your config:

const firebaseConfig = {
  apiKey: "AIzaSyBZLArrWlZxP8DgxgRrr2kHs3OhQ0rSaj4",
  authDomain: "eterna-123.firebaseapp.com",
  projectId: "eterna-123",
  storageBucket: "eterna-123.firebasestorage.app",
  messagingSenderId: "106974360179",
  appId: "1:106974360179:web:460599317ff9c2b36eb006",
  measurementId: "G-2SWYV26FGP"
}; 
4. Cloudinary Setup



5. Start the App


npx expo start


* Press a to open on Android
* Press i for iOS (Mac only)
* Or scan the QR code with Expo Go


✅ How It Works

1. Sign up or log in
2. Create or join a room using a unique code
3. Access the Dashboard to see activity
4. Explore the Journey to track progress
5. Create Pebbles (text, image, or audio) with unlock dates


🔮 Future Plans

* Pebble Notifications – alerts when pebbles unlock
* AI Suggestions – for smarter pebble content
* Themes – customizable UI for journeys and rooms
* Gamification – achievements, badges, and streaks
* Offline Mode – create offline, sync later
