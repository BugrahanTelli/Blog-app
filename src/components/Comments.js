import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Comments({ postId, userId }) {
    const [comments, setComments] = useState([]);
    const [nestedComments, setNestedComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyFor, setReplyFor] = useState(null); 

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/comments?post_id=${postId}`);
            const data = await response.json();
            if (response.ok) {
                setComments(data);
                setNestedComments(nestComments(data));
            } else {
                console.error("Yorumlar alınamadı:", data.error);
            }
        } catch (error) {
            console.error("Yorumlar çekilirken hata:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const nestComments = (comments) => {
        const map = {};
        comments.forEach((comment) => {
            map[comment.id] = { ...comment, children: [] };
        });
        const nested = [];
        comments.forEach((comment) => {
            if (comment.parent_id) {
                if (map[comment.parent_id]) {
                    map[comment.parent_id].children.push(map[comment.id]);
                }
            } else {
                nested.push(map[comment.id]);
            }
        });
        return nested;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: userId,         
                    content: newComment,
                    parent_id: replyFor      
                }),
            });
            const result = await response.json();
            if (response.ok) {                
                setNewComment("");
                setReplyFor(null);
                fetchComments();
            } else {
                console.error("Yorum eklenemedi:", result.error);
            }
        } catch (error) {
            console.error("Yorum eklenirken hata:", error);
        }
    };

    const renderComments = (commentsArray) => {
        return commentsArray.map((comment) => (
            <li key={comment.id} className="list-group-item">
                <p className="mb-1">{comment.content}</p>
                <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                <button
                    type="button"
                    className="btn btn-link btn-sm"
                    onClick={() => setReplyFor(comment.id)}
                >
                    Reply
                </button>
                {comment.children && comment.children.length > 0 && (
                    <ul className="list-group mt-2">
                        {renderComments(comment.children)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <div className="card my-4">
            <div className="card-header">
                <h5 className="mb-0">Yorumlar</h5>
            </div>
            <div className="card-body">
                {nestedComments.length === 0 ? (
                    <p className="text-muted">Henüz yorum yok.</p>
                ) : (
                    <ul className="list-group mb-3">
                        {renderComments(nestedComments)}
                    </ul>
                )}
                <form onSubmit={handleSubmit}>
                    {replyFor && (
                        <div className="alert alert-info">
                            <p>
                                Cevap veriyorsunuz.{" "}
                                <button
                                    type="button"
                                    className="btn btn-link btn-sm"
                                    onClick={() => setReplyFor(null)}
                                >
                                    Cevabı iptal et
                                </button>
                            </p>
                        </div>
                    )}
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            placeholder="Yorumunuzu yazın..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            rows="3"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {replyFor ? "Cevap Gönder" : "Yorum Gönder"}
                    </button>
                    <Link to="/" className="btn btn-success ms-2">Anasayfa</Link>
                </form>
            </div>
        </div>
    );
}


export default Comments;
