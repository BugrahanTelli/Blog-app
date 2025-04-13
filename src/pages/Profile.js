import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Profile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return <div>Profil bilgisi yükleniyor...</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card p-4" style={{ width: "600px" }}>
                <h1 className="text-center mb-4">{user.name}'ın Profili</h1>
                <div className="mb-3">
                    <p><strong>Kullanıcı Adı:</strong> <span className="badge bg-info">{user.username}</span></p>
                </div>
                <div className="mb-3">
                    <p><strong>Email:</strong> <span className="badge bg-info">{user.email}</span></p>
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <Link to="/edit-profile" className="btn btn-primary">Profili Düzenle</Link>
                    <Link to="/" className="btn btn-success">Anasayfa</Link>
                    <button onClick={handleLogout} className="btn btn-danger">Çıkış Yap</button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
