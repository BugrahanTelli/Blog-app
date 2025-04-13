import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CreatePostPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get("title");
        const content = formData.get("content");

        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    author_id: user.id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate("/");
            } else {
                alert(data.error || "Post oluşturulurken hata oluştu.");
            }
        } catch (error) {
            console.error("Post oluşturma isteğinde hata:", error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card p-4" style={{ width: "600px" }}>
                <h1 className="text-center mb-4">Create New Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Post Title:</label>
                        <input type="text" name="title" id="title" className="form-control" placeholder="Enter Post Title" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">Post Content:</label>
                        <textarea name="content" id="content" className="form-control" placeholder="Enter Post Content" rows="4" required></textarea>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Create Post</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePostPage;
