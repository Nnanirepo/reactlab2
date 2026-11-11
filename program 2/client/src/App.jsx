import { useState, useEffect } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

import "./App.css";

function App() {
    const [page, setPage] = useState("login");

    // Auto login if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setPage("dashboard");
        }
    }, []);

    const handleRegisterSuccess = () => {
        setPage("login");
    };

    const handleLoginSuccess = () => {
        setPage("dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setPage("login");
    };

    return (
        <div className="app">
            {page === "register" && (
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onLoginClick={() => setPage("login")}
                />
            )}

            {page === "login" && (
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onRegister={() => setPage("register")}
                />
            )}

            {page === "dashboard" && (
                <Dashboard onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
