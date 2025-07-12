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
import InicioPage from "../pages/incioPage";
import Menu from "../pages/Menu";
import Contactanos from "../pages/Contactanos"
import PasswordRecovery from "../pages/PasswordRecovery";
import FollowOrder from "../pages/FollowOrder";
import RateService from "../pages/RateService";
import UserAccount from "../pages/UserAccount";

function Navegation() {
    const navigate = useNavigate();

    return(
    <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/FinishOrder" element={<FinishOrder/>} />
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/RegistroPage" element={<RegistroPage/>} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/Contactanos" element={<Contactanos/>} />
        <Route path="/PasswordRecovery" element={<PasswordRecovery />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/FollowOrder" element={<FollowOrder />} />
        <Route path="/RateService" element={<RateService />} />
        <Route path="/UserAccount" element={<UserAccount />} />
      </Routes>
  )
}

export default Navegation;