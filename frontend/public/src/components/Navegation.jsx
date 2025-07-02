import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Page404 from "../pages/404";

function Navegation() {
    const navigate = useNavigate();

    return(
    <Routes>
        <Route path="/" element={<Page404 />} />
              
      </Routes>
  )
}

export default Navegation;