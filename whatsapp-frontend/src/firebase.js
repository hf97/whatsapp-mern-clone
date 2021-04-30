import firebase from 'firebase';

// API deprecated, just example, should be a environment variable
const firebaseConfig = {
    apiKey: "AIzaSyAMNv_Uf-gDV0ULCj9yTlr928D3fwwytzk",
    authDomain: "whatsapp-mern-clone-72c45.firebaseapp.com",
    databaseURL: "https://whatsapp-mern-clone-72c45.firebaseio.com",
    projectId: "whatsapp-mern-clone-72c45",
    storageBucket: "whatsapp-mern-clone-72c45.appspot.com",
    messagingSenderId: "793320990176",
    appId: "1:793320990176:web:ac6f4f8cbb5964ad78f785",
    measurementId: "G-E23HR5PHK9"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider }
export default db;