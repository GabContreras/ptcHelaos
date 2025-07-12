import React from "react";
import SidebarNavbar from "./Navbar";
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <SidebarNavbar />
            <main className="main-content-area">
                <div className="content-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;