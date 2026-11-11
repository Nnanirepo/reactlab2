import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

const API = "http://localhost:5002/api/profile";

function Dashboard({ onLogout, onViewProducts }) {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        address: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const token = localStorage.getItem("token");

    const loadProfile = async () => {
        try {
            const response = await fetch(`${API}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.status === 401) {
                onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to load profile");
            }

            setUser(data.user);
            setForm({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                department: data.user.department || "",
                year: data.user.year || "",
                address: data.user.address || ""
            });

            localStorage.setItem("user", JSON.stringify({
                id: data.user._id,
                name: data.user.name,
                email: data.user.email
            }));
        } catch (err) {
            setError(err.message || "Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            onLogout();
            return;
        }

        loadProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!form.name.trim()) {
            setError("Name is required");
            return;
        }

        try {
            const response = await fetch(`${API}/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.status === 401) {
                onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Profile update failed");
            }

            setUser(data.user);
            localStorage.setItem("user", JSON.stringify({
                id: data.user._id,
                name: data.user.name,
                email: data.user.email
            }));

            setForm({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                department: data.user.department || "",
                year: data.user.year || "",
                address: data.user.address || ""
            });

            setEditing(false);
            setMessage("Profile updated successfully");
        } catch (err) {
            setError(err.message || "Unable to update profile");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch(`${API}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(passwordForm)
            });

            const data = await response.json();

            if (response.status === 401) {
                onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Password change failed");
            }

            setMessage(data.message || "Password updated. Please log in again.");
            setPasswordForm({
                currentPassword: "",
                newPassword: ""
            });
            setChangingPassword(false);

            setTimeout(() => {
                onLogout();
            }, 1200);
        } catch (err) {
            setError(err.message || "Unable to change password");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-card">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-card">
                    <h2>Profile not available</h2>
                    {error && <p style={{ color: "#dc2626" }}>{error}</p>}
                    <button onClick={onLogout}>Back to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar">
                <div className="dashboard-logo">StudentMart</div>
                <div className="dashboard-nav-actions">
                    {onViewProducts && (
                        <button onClick={onViewProducts} className="nav-products-button">
                            View Products
                        </button>
                    )}
                    <button onClick={onLogout} className="nav-logout-button">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome, {user.name}! 👋</h1>
                    <p>Manage your StudentMart profile information and security settings.</p>
                </div>

                <div className="dashboard-card">
                    <h2>My Profile</h2>

                    <div className="profile-icon">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    {message && (
                        <p style={{ color: "#15803d", fontWeight: "bold", marginBottom: "15px" }}>
                            {message}
                        </p>
                    )}

                    {error && (
                        <p style={{ color: "#dc2626", fontWeight: "bold", marginBottom: "15px" }}>
                            {error}
                        </p>
                    )}

                    {editing ? (
                        <form onSubmit={saveProfile}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />

                            <label>Department</label>
                            <input
                                type="text"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                            />

                            <label>Year</label>
                            <input
                                type="text"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                            />

                            <label>Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                            />

                            <button type="submit">Save Changes</button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setError("");
                                    setForm({
                                        name: user.name || "",
                                        email: user.email || "",
                                        phone: user.phone || "",
                                        department: user.department || "",
                                        year: user.year || "",
                                        address: user.address || ""
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <div className="profile-details">
                            <div className="profile-row">
                                <span>Name</span>
                                <strong>{user.name}</strong>
                            </div>
                            <div className="profile-row">
                                <span>Email</span>
                                <strong>{user.email}</strong>
                            </div>
                            <div className="profile-row">
                                <span>Phone</span>
                                <strong>{user.phone || "Not provided"}</strong>
                            </div>
                            <div className="profile-row">
                                <span>Department</span>
                                <strong>{user.department || "Not provided"}</strong>
                            </div>
                            <div className="profile-row">
                                <span>Year</span>
                                <strong>{user.year || "Not provided"}</strong>
                            </div>
                            <div className="profile-row">
                                <span>Address</span>
                                <strong>{user.address || "Not provided"}</strong>
                            </div>

                            <button onClick={() => {
                                setMessage("");
                                setError("");
                                setEditing(true);
                            }}>
                                Edit Profile
                            </button>
                        </div>
                    )}

                    <hr style={{ margin: "25px 0", border: "0", borderTop: "1px solid #e2e8f0" }} />

                    <button onClick={() => {
                        setMessage("");
                        setError("");
                        setChangingPassword(!changingPassword);
                    }}>
                        {changingPassword ? "Cancel Password Change" : "Change Password"}
                    </button>

                    {changingPassword && (
                        <form onSubmit={changePassword}>
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value
                                })}
                                required
                            />

                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value
                                })}
                                minLength={6}
                                required
                            />

                            <button type="submit">Update Password</button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
