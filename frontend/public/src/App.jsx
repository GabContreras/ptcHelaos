import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navegation from "./components/Navegation";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <Router>
        <Navegation />
        <Toaster
          toastOptions={{
            duration: 1000,
          }}
        />
    </Router>
  );
}

export default App;
