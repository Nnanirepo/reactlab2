import { useState } from "react";
import "../styles/Register.css";

function Register({ onRegisterSuccess, onLoginClick }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5002/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);

                setForm({
                    name: "",
                    email: "",
                    password: ""
                });

                setTimeout(() => {
                    onRegisterSuccess();
                }, 1000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="register-page">
            <div className="register-left">
                <div className="brand-content">
                    <h1>StudentMart</h1>
                    <h2>Your Student Shopping Destination</h2>
                    <p>Create your account and start exploring StudentMart.</p>
                </div>
            </div>

            <div className="register-right">
                <div className="register-card">
                    <h1>Create Account</h1>
                    <p className="subtitle">Register to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        {message && (
                            <p className="register-message">{message}</p>
                        )}

                        <button type="submit" className="register-button">
                            Create Account
                        </button>
                    </form>

                    {onLoginClick && (
                        <div style={{ marginTop: "20px", textAlign: "center", color: "#64748b" }}>
                            <span>Already have an account? </span>
                            <button
                                onClick={onLoginClick}
                                style={{
                                    border: "none",
                                    background: "none",
                                    color: "#1e293b",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    textDecoration: "underline"
                                }}
                            >
                                Sign in
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
