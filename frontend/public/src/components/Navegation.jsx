import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Page404 from "../pages/404";
import AboutUs from "../pages/AboutUs";
import FinishOrder from "../pages/FinishOrder";
import LoginPage from "../pages/LoginPage";
import RegistroPage from "../pages/RegistroPage";

function Navegation() {
    const navigate = useNavigate();

    return(
    <Routes>
        <Route path="/" element={<Page404 />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/FinishOrder" element={<FinishOrder/>} />
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/RegistroPage" element={<RegistroPage/>} />
      </Routes>
  )
}

export default Navegation;