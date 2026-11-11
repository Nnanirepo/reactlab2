import { useState } from "react";
import "../styles/Login.css";

function Login({ onLoginSuccess, onRegister }) {
    const [form, setForm] = useState({
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
                "http://localhost:5002/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage(data.message);
            onLoginSuccess();
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    StudentMart
                </div>

                <h1>Welcome Back!</h1>

                <p className="login-subtitle">
                    Login to access your account
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {message && (
                        <p className="login-message">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>
                </form>

                <div className="register-link">
                    <span>
                        Don't have an account?
                    </span>

                    <button onClick={onRegister}>
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
