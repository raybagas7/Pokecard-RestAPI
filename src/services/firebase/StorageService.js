const { initializeApp } = require('firebase/app');
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require('firebase/storage');
const { Pool } = require('pg');

class StorageService {
  constructor() {
    this._pool = new Pool();
  }

  async writeFile(file, meta, ownerId) {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    };
    const metadata = {
      contentType: meta.headers['content-type'],
    };

    const app = initializeApp(firebaseConfig);

    const storage = getStorage(app);
    const storageRef = ref(storage, `profile_images/${ownerId}`);

    const uploadTask = uploadBytesResumable(storageRef, file._data, metadata);

    return getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      return downloadURL;
    });
  }

  async addPPtoUser(userId, profileImageUrl) {
    const query = {
      text: 'UPDATE users SET profile_img = $1 WHERE id = $2',
      values: [profileImageUrl, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = StorageService;
