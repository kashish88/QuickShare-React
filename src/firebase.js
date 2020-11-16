import firebase from "firebase"


const firebaseApp =firebase.initializeApp( {
  apiKey: "AIzaSyDiW55YyEmNFTTr7wfAGX884RI9Et9V8Fw",
  authDomain: "instagramclone-1e505.firebaseapp.com",
  databaseURL: "https://instagramclone-1e505.firebaseio.com",
  projectId: "instagramclone-1e505",
  storageBucket: "instagramclone-1e505.appspot.com",
  messagingSenderId: "882224299278",
  appId: "1:882224299278:web:558d2ea376c56ef6baab5f",
  measurementId: "G-2YNLWW2H4L"
  });


  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();


  export {db,auth,storage};





  