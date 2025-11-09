import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔹 Configuración del proyecto (copiala desde Firebase Console)
const firebaseConfig = {
 apiKey: "AIzaSyCIv7b8I5WBDOx_axrN5M-TQgwVSI_oZNY",
  authDomain: "lama-medellin.firebaseapp.com",
  projectId: "lama-medellin",
  storageBucket: "lama-medellin.firebasestorage.app",
  messagingSenderId: "384196097859",
  appId: "1:384196097859:web:726dcabe10c67473cee1f6",
  measurementId: "G-0SYKLCFMCH"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Configurar autenticación
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
