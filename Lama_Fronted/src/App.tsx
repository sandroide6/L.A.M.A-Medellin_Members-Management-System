import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import "./styles.css";


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "#fff",
          fontFamily: "Segoe UI, sans-serif",
          fontSize: 20,
        }}
      >
        Cargando...
      </div>
    );
  }

  return user ? <HomePage user={user} /> : <LoginPage />;
}
