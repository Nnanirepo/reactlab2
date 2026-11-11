function Logout({ onLogout }) {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (onLogout) {
            onLogout();
        } else {
            alert("Logged out successfully");
        }
    };

    return (
        <div className="logout-section">
            <h2>Account</h2>
            <p>Already logged in?</p>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
}

export default Logout;
