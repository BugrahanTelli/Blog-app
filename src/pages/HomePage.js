import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/posts");
            const data = await response.json();
            if (response.ok) {
                setPosts(data);
            } else {
                console.error("Postlar alınamadı:", data.error);
            }
        } catch (error) {
            console.error("Postları çekerken hata:", error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Bu postu silmek istediğine emin misin?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (response.ok) {
                // Silme sonrası listeyi güncelle
                fetchPosts();
            } else {
                console.error("Silme hatası:", data.error);
            }
        } catch (error) {
            console.error("Post silinirken hata oluştu:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card p-4" style={{ width: "600px" }}>
                <h1 className="text-center mb-4">Home Page</h1>
                <div className="d-flex justify-content-between mb-4">
                    <Link to="/profile" className="btn btn-info">Go to Profile</Link>
                    <Link to="/createpost" className="btn btn-success">Create a New Post</Link>
                </div>
                <ul className="list-group">
                    {posts?.map((post) => (
                        <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <p className="mb-0">{post.title}</p>
                            <div>
                                <Link to={`/editpost/${post.id}`} className="btn btn-success me-2">Edit</Link>
                                <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>X</button>
                            </div>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
}

export default HomePage;
