import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// importa la configurazione Firebase se vuoi usarla in produzione
// crea src/firebaseConfig.js e aggiungi le env su Vercel prima del deploy
import "./firebaseConfig";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
