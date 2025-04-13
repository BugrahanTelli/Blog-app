import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EditProfilePage() {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: "",
        surname: "",
        email: ""
    });

    useEffect(() => {
        // AuthContext'teki kullanıcı bilgilerini kullanarak formu önceden dolduruyoruz.
        if (user) {
            setProfile({
                name: user.name || "",
                surname: user.surname || "",
                email: user.email || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Kullanıcı profil güncelleme isteği
            const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            const data = await response.json();
            if (response.ok) {
                login(data.user);
                navigate("/profile");
            } else {
                alert(data.error || "Profil güncellenirken hata oluştu.");
            }
        } catch (error) {
            console.error("Profil güncelleme isteğinde hata:", error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card p-4" style={{ width: "600px" }}>
                <h1 className="text-center mb-4">Profili Düzenle</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Kullanıcı Adı:</label>
                        <input
                            type="text"
                            id="name"
                            name="username"
                            className="form-control"
                            value={profile.username}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={profile.email}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Güncelle</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/profile")}>İptal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfilePage;
