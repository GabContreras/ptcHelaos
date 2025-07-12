import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FollowOrder.css";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import imgStatus from "../imgs/InWayStatus.png";

function FollowOrder() {
    const navigate = useNavigate();

    return (
        <>
        <Navbar />
        <div className="follow-container">
            <div className="follow-status">
                <div className="status-header">
                    <div className="status-text">
                        <h2>Tu pedido esta:</h2>
                        <h1>En camino</h1>
                    </div>
                    <img src={imgStatus} onClick={() => navigate("/RateService")}/>
                </div>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7751.636619526111!2d-89.20199709999994!3d13.729447400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2ssv!4v1751664838209!5m2!1ses-419!2ssv" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default FollowOrder;