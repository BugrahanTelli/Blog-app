import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/posts/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setPost(data.post);
                } else {
                    console.error("Post alınamadı:", data.error);
                }
            } catch (error) {
                console.error("Post getirme hatası:", error);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get("title");
        const content = formData.get("content");

        try {
            const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate("/");
            } else {
                alert(data.error || "Post güncellenirken hata oluştu.");
            }
        } catch (error) {
            console.error("Post güncelleme isteğinde hata:", error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card p-4" style={{ width: "600px" }}>
                <h1 className="text-center mb-4">Edit Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Post Title:</label>
                        <input type="text" name="title" id="title" className="form-control" defaultValue={post.title} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">Post Content:</label>
                        <textarea name="content" id="content" className="form-control" defaultValue={post.content} rows="4" required></textarea>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Update Post</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPostPage;
