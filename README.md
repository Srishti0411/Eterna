
# Eternal 💞

Strengthen your bond, one step at a time.

Eternal is a React Native (Expo) app that helps couples grow closer through **guided journeys** of tasks and journals. Two users share a private room, complete levels together, and reflect on each other’s answers — making relationships stronger, more mindful, and fun.


## ✨ What the App Does

* **Couple Rooms**: Each pair shares a private space where all progress is stored.
* **Guided Journey**: Unlock and complete levels with tasks & journal prompts.
* **Media Entries**: Upload text, images, or audio responses (stored via Cloudinary).
* **Partner Reflection**: After submitting your entry, instantly view your partner’s.
* **Sync in Real-Time**: Powered by Firebase, both users always see the same progress.



## 🏗️ Currently Building

We’re actively working on these pages:

* **Journey Page** → Interactive map of levels (locked, unlocked, completed).
* **Dashboard Page** → Overview of your relationship journey, showing progress, past entries, and upcoming tasks.



## 🛠️ Tech Stack

* **Frontend**: React Native (Expo)
* **Database**: Firebase Firestore
* **Storage**: Cloudinary (media uploads)
* **Auth**: Firebase Authentication



## ⚡ Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/your-username/eternal.git
cd eternal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

* Create a Firebase project.
* Enable **Authentication** and **Firestore**.
* Add your Firebase config to the project (e.g. `firebaseConfig.js`).

### 4. Cloudinary Setup

* Create a free [Cloudinary](https://cloudinary.com/) account.
* Note your **Cloud Name** and create an **Upload Preset** (unsigned).
* Add these to your environment:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 5. Run App

```bash
npx expo start
```


## 📌 Next Steps

* Polish the **Journey Page UI** (animated, interactive).
* Build the **Dashboard Page** for better tracking.
* Add notifications to remind partners about pending tasks.
* Support video entries.



PRs and feedback are welcome! If you have ideas for improving the experience, open an issue or submit a pull request.


Want me to add a **“Screenshots & Demo”** section at the top (with placeholders for images/gifs), so once your Journey + Dashboard UI is done, you can just paste them in? That will instantly give your repo a "wow factor" when someone opens it.
