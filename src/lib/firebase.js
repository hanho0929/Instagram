import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import see file 
// import { seedDatabase } from '../seed';

const config = {
    apiKey: "AIzaSyAZKDh-HRQYxP9DzXHfAszbfl6aw5aMFW4",
    authDomain: "instagram-34f1f.firebaseapp.com",
    projectId: "instagram-34f1f",
    storageBucket: "instagram-34f1f.appspot.com",
    messagingSenderId: "138633903870",
    appId: "1:138633903870:web:db13df7c321cccfcd36faf"
}

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;


// here is where I want to call the seed.js ( only ONCE!!! )
// seedDatabase(firebase);

// console.log('firebase', firebase);

export { firebase, FieldValue };