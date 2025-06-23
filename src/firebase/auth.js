import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Sign up new user
export const signUpUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userData = {
      name: name,
      role: 'user', // Regular user role
      email: email,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return { user, userData };
  } catch (error) {
    throw error;
  }
};

// Sign in with email and password (updated to support both admin and regular users)
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { user, userData };
    } else {
      throw new Error('User data not found.');
    }
  } catch (error) {
    throw error;
  }
};

// Sign in admin (for admin-only access)
export const signInAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === 'admin') {
        return { user, userData };
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } else {
      throw new Error('User data not found.');
    }
  } catch (error) {
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
