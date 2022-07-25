// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,  } from "firebase/auth"
import { doc, getFirestore, getDoc, setDoc, collection, addDoc, serverTimestamp, onSnapshot, where, query, deleteDoc, getDocs, updateDoc } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCreGFhj9-5BzKVvtA4QxIEQ2KE_5TU_4g",
  authDomain: "amazing-notes-app.firebaseapp.com",
  projectId: "amazing-notes-app",
  storageBucket: "amazing-notes-app.appspot.com",
  messagingSenderId: "899953139980",
  appId: "1:899953139980:web:89d616f7c1bec78af6a929"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
    const userDocRef = doc(db, 'users', userAuth.uid);

    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      try {
        await setDoc(userDocRef, {
          displayName,
          email,
          createdAt,
          sharedNotes: null,
          ...additionalInfo
        });
      } catch(e)  {
        console.log("error creating this user",e.message);
      }
    } else {
      console.log(userSnapshot.data());
    }
    return userDocRef;


  }

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const signAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
}

export const setUserObject = async (user) => {


    const userDocRef = doc(db, 'users', user.uid);

    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()) {
      return;
    }
    

    return userSnapshot.data()
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangeListener = (callback) => onAuthStateChanged(auth, callback);

export const addNotes = async (user,{title, details, category}) => {
  const collectionRef = collection(db, "users", user.uid, "notelist");
  await addDoc(collectionRef, {
    createdAt: serverTimestamp(),
    title,
    details,
    category,
    pinned: false,
    type: "Private"
  })
}

export const addPublicNotes = async (user,{title, details, category}) => {
  const collectionRef = collection(db, "shared notes", user.sharedNotes, "notelist");
  await addDoc(collectionRef, {
    createdAt: serverTimestamp(),
    title,
    details,
    category,
    pinned: false,
    type: "Public"
  })
}

export const deletePublicNotes = async (user, createdAt) => {
  const collectionRef = collection(db, "shared notes", user.sharedNotes, "notelist");
  const docRef = query(collectionRef, where("createdAt","==",createdAt));

  const querySnapshot = await getDocs(docRef);
  querySnapshot.forEach(theDoc => {
    deleteDoc(doc(db,"shared notes",user.sharedNotes,"notelist",theDoc.id));
  })
}


export const deleteNotes = async (user, createdAt) => {
  const collectionRef = collection(db, "users", user.uid, "notelist")
  const docRef = query(collectionRef, where("createdAt", "==", createdAt));

  const querySnapshot = await getDocs(docRef);
   querySnapshot.forEach((theDoc) => {
    // doc.data() is never undefined for query doc snapshots
    deleteDoc(doc(db,"users",user.uid,"notelist",theDoc.id));
  });

}

export const updateNotes = async (user, createdAt,note) => {
  const collectionRef = collection(db, "users", user.uid, "notelist")
  const docRef = query(collectionRef, where("createdAt", "==", createdAt));

  const querySnapshot = await getDocs(docRef);
  querySnapshot.forEach((theDoc) => {
    // doc.data() is never undefined for query doc snapshots
    updateDoc(doc(db,"users",user.uid,"notelist",theDoc.id),{
      ...note
    });
  });

}

export const updatePublicNotes = async (user, createdAt,note) => {
  const collectionRef = collection(db, "shared notes", user.sharedNotes, "notelist")
  const docRef = query(collectionRef, where("createdAt", "==", createdAt));

  const querySnapshot = await getDocs(docRef);
  querySnapshot.forEach((theDoc) => {
    // doc.data() is never undefined for query doc snapshots
    updateDoc(doc(db,"shared notes",user.sharedNotes,"notelist",theDoc.id),{
      ...note
    });
  });

}
export const pinNote = async (user, createdAt,pinned) => {
  const collectionRef = collection(db, "users", user.uid, "notelist")
  const docRef = query(collectionRef, where("createdAt", "==", createdAt));

  const querySnapshot = await getDocs(docRef);
  querySnapshot.forEach((theDoc) => {
    // doc.data() is never undefined for query doc snapshots
    updateDoc(doc(db,"users",user.uid,"notelist",theDoc.id),{
      pinned
    });
  });

}

export const searchNote = async (docsId) => {
  const docsRef = collection(db, "shared notes");
  const docsQuery = query(docsRef,where("id","==",docsId));
  
  const querySnapshot = await getDocs(docsQuery);
  let targetedDoc = null;
  querySnapshot.forEach((theDoc) => {
    targetedDoc = theDoc.id;
  })
  return targetedDoc;
}

export const addPublicUser = async (user,notesId) => {
  const userDocRef = doc(db,"users",user.uid);
  updateDoc(userDocRef, {
    sharedNotes: notesId
  })
}

export const onDocumentSnapshotListener = (ref, callback) => onSnapshot(ref,callback);