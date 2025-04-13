import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const formData = new FormData(e.target);
        const name = formData.get("name");
        const surname = formData.get("surname");
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirm_password = formData.get("confirm_password");

        if (password !== confirm_password) {
            alert("Şifreler eşleşmiyor!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, surname, username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {                
                login(data.user);                
                navigate("/");
            } else {                
                console.error("Signup hatası:", data.error);
                alert(data.error || "Signup işlemi sırasında bir hata oluştu.");
            }
        } catch (error) {
            console.error("Signup isteğinde hata oluştu:", error);
            alert("Signup isteği başarısız oldu.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-4">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input type="text" id="name" name="name" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="surname" className="form-label">Surname:</label>
                        <input type="text" id="surname" name="surname" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input type="text" id="username" name="username" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" name="email" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" id="password" name="password" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirm_password" className="form-label">Confirm Password:</label>
                        <input type="password" id="confirm_password" name="confirm_password" className="form-control" required />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                        <p className="mb-0">
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
