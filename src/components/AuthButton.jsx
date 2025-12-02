import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function AuthButton() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.info("Login OK");
    } catch (err) {
      console.error("Login error", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.info("Logout OK");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <div>
      {auth.currentUser ? (
        <div>
          <span style={{marginRight:8}}>Ciao, {auth.currentUser.displayName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Accedi con Google</button>
      )}
    </div>
  );
}
