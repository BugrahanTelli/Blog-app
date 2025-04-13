const express = require("express");
const pool = require("../db/pool");
const router = express.Router();

// GET tekil postu almak için
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ post: result.rows[0] });
        } else {
            res.status(404).json({ error: "Post bulunamadı." });
        }
    } catch (error) {
        console.error("Tek post getirme hatası:", error);
        res.status(500).json({ error: "Post alınırken hata oluştu." });
    }
});

// Tüm postları al
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Postları alırken hata:", err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});

// Yeni post oluşturma
router.post("/", async (req, res) => {
    const { title, content, author_id } = req.body;
    try {
        const queryText = `
      INSERT INTO posts (title, content, author_id)
      VALUES ($1, $2, $3) RETURNING *
    `;
        const result = await pool.query(queryText, [title, content, author_id]);
        res.status(201).json({ message: "Post başarıyla oluşturuldu.", post: result.rows[0] });
    } catch (error) {
        console.error("Post Oluşturma Hatası:", error);
        res.status(500).json({ error: "Post oluşturulurken hata oluştu." });
    }
});

// Post güncelleme
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const queryText = `
      UPDATE posts
      SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *
    `;
        const result = await pool.query(queryText, [title, content, id]);
        res.status(200).json({ message: "Post güncellendi.", post: result.rows[0] });
    } catch (error) {
        console.error("Post Güncelleme Hatası:", error);
        res.status(500).json({ error: "Post güncellenirken hata oluştu." });
    }
});

// Post silme
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM posts WHERE id = $1", [id]);
        res.status(200).json({ message: "Post başarıyla silindi." });
    } catch (error) {
        console.error("Post Silme Hatası:", error);
        res.status(500).json({ error: "Post silinirken hata oluştu." });
    }
});

module.exports = router;
