import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Replace this with your own config details
var config = {
  apiKey: "AIzaSyBmQQTjMxs26VchNFw_SV4d8Pofj9dug3I",
  authDomain: "react-big-calendar-dnd.firebaseapp.com",
  databaseURL: "https://react-big-calendar-dnd.firebaseio.com",
  projectId: "react-big-calendar-dnd",
  storageBucket: "",
  messagingSenderId: "325943994261",
  appId: "1:325943994261:web:68ebee60378c5341"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase 