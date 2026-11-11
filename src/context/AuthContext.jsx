import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  auth,
  browserLocalPersistence,
  firebaseConfigured,
  googleProvider,
} from '../config/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    // Firebase restores a saved session and sends updates on sign-in/sign-out.
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  async function runAuth(action) {
    if (!auth) {
      const setupError = new Error(
        'Firebase is not configured. Add your Firebase values to .env.local first.',
      );
      setError(setupError.message);
      throw setupError;
    }

    setError('');
    try {
      // Keep users signed in after a page refresh.
      await setPersistence(auth, browserLocalPersistence);
      return await action();
    } catch (firebaseError) {
      setError(firebaseError.message);
      throw firebaseError;
    }
  }

  function login(email, password) {
    return runAuth(() => signInWithEmailAndPassword(auth, email, password));
  }

  function signup(email, password) {
    return runAuth(() => createUserWithEmailAndPassword(auth, email, password));
  }

  function loginWithGoogle() {
    return runAuth(() => signInWithPopup(auth, googleProvider));
  }

  function logout() {
    return runAuth(() => signOut(auth));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        firebaseConfigured,
        clearError: () => setError(''),
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
