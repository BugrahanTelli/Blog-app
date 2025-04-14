import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Comments from "../components/Comments";
function HomePage() {
    const [posts, setPosts] = useState([]);
    const [commentsMap, setCommentsMap] = useState({});
    const [visibleComments, setVisibleComments] = useState({});
    const navigate = useNavigate();

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

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/comments?post_id=${postId}`);
            const data = await response.json();
            if (response.ok) {
                setCommentsMap((prev) => ({ ...prev, [postId]: data }));
            } else {
                console.error("Yorumlar alınamadı:", data.error);
            }
        } catch (error) {
            console.error("Yorumlar çekilirken hata:", error);
        }
    };

    const toggleComments = (postId) => {
        setVisibleComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
        if (!commentsMap[postId]) {
            fetchComments(postId);
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
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <li key={post.id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Link to={`/post/${post.id}`} className="text-decoration-none">
                                        <p className="mb-0 fw-bold">{post.title}</p>
                                    </Link>
                                    <div>
                                        <Link to={`/editpost/${post.id}`} className="btn btn-success btn-sm me-2">Edit</Link>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>X</button>
                                    </div>
                                </div>

                                <details className="mt-2">
                                    <summary className="text-primary" style={{ cursor: "pointer" }}></summary>
                                    <div className="mt-2">
                                        <Comments postId={post.id} userId={null} showReplyForm={false} />
                                    </div>
                                </details>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">Gösterilecek gönderi bulunamadı.</li>
                    )}
                </ul>
            </div>
        </div>
    );

}

export default HomePage;
