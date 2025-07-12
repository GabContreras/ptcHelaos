import { Toaster } from "react-hot-toast";
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navegation from './components/Navegation'; // Mantén tu navegación actual

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navegation />
        <Toaster
          toastOptions={{
            duration: 1000,
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;