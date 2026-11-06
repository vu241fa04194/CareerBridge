import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/firebaseConfig';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile as updateFirestoreUserProfile,
  seedFirestoreDefaults,
} from '../firebase/firestoreService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  // Sync auth state listener with Firebase Auth
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      console.warn('⚠️ Firebase is not configured yet. Set credentials in frontend/.env');
      setLoading(false);
      return;
    }

    // Try auto-seeding sample jobs/internships/courses on startup
    seedFirestoreDefaults().catch((e) => console.warn('Auto-seed check:', e.message));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user profile from Firestore users collection
          const userDoc = await getUserProfile(firebaseUser.uid);
          if (userDoc) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userDoc.fullName,
              role: userDoc.role || 'student',
            });
            setProfile(userDoc);
          } else {
            // Document doesn't exist yet, build fallback profile
            const fallbackProfile = {
              uid: firebaseUser.uid,
              fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email,
              role: 'student',
              education: {},
              skills: [],
            };
            setUser(fallbackProfile);
            setProfile(fallbackProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error in onAuthStateChanged listener:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 1. Student Registration
  // Strictly assigns role 'student'. Never allows self-assigned admin role.
  const register = async (studentData) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        'Firebase configuration is missing! Please paste your Firebase credentials into frontend/.env'
      );
    }

    const { email, password, fullName, name, phone, college, degree, branch, graduationYear, skills } = studentData;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // 1. Create or recover user in Firebase Auth
    let fbUser;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      fbUser = userCredential.user;
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-in-use') {
        // If the auth record was created previously but Firestore profile write failed, sign in to complete setup
        try {
          const signInCred = await signInWithEmailAndPassword(auth, email.trim(), password);
          fbUser = signInCred.user;
        } catch (signInErr) {
          throw authErr;
        }
      } else {
        throw authErr;
      }
    }

    const displayName = fullName || name || email.split('@')[0];
    try {
      await updateFirebaseProfile(fbUser, { displayName });
    } catch (e) {
      console.warn('Could not update displayName in Firebase Auth:', e.message);
    }

    // 2. Create document in Firestore 'users/{uid}'
    const newProfile = await createUserProfile(fbUser.uid, {
      uid: fbUser.uid,
      fullName: displayName,
      email: fbUser.email,
      phone: phone || '',
      education: {
        college: college || '',
        degree: degree || '',
        branch: branch || '',
        year: graduationYear || '',
      },
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
      role: 'student', // strictly enforce student role
    });

    setUser({
      uid: fbUser.uid,
      email: fbUser.email,
      displayName,
      role: 'student',
    });
    setProfile(newProfile);

    return {
      success: true,
      user: { uid: fbUser.uid, email: fbUser.email, role: 'student' },
      profile: newProfile,
    };
  };

  // 2. Student / Admin Login
  const login = async (email, password) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        'Firebase configuration is missing! Please paste your Firebase credentials into frontend/.env'
      );
    }

    if (!email || !password) {
      throw new Error('Please provide both email and password');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;

    // Fetch user document from Firestore to establish role
    const userDoc = await getUserProfile(fbUser.uid);
    const role = userDoc?.role || 'student';

    const currentUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || userDoc?.fullName || email.split('@')[0],
      role,
    };

    setUser(currentUser);
    setProfile(userDoc || currentUser);

    return {
      success: true,
      user: currentUser,
      profile: userDoc,
    };
  };

  // 3. Logout
  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setProfile(null);
  };

  // 4. Forgot Password / Password Reset
  const forgotPassword = async (email) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        'Firebase configuration is missing! Please paste your Firebase credentials into frontend/.env'
      );
    }
    if (!email) {
      throw new Error('Please enter your email address');
    }
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: 'Password reset link sent to your email address! Please check your inbox.',
    };
  };

  // 5. Update Profile
  const updateProfile = async (updateData) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const updated = await updateFirestoreUserProfile(user.uid, updateData);
    setProfile(updated);
    setUser((prev) => ({
      ...prev,
      displayName: updated.fullName || prev.displayName,
    }));
    return { success: true, profile: updated };
  };

  // 6. Refresh user
  const refreshUser = async () => {
    if (!user?.uid) return;
    const userDoc = await getUserProfile(user.uid);
    if (userDoc) {
      setProfile(userDoc);
      setUser((prev) => ({
        ...prev,
        role: userDoc.role || 'student',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        refreshUser,
        isFirebaseConfigured: isFirebaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
