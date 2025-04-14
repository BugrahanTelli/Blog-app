const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
    const { post_id } = req.query;
    try {
        const result = await pool.query("SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC", [post_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Yorumları alırken hata:", err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
})

router.post("/", async (req, res) => {
    const { post_id, user_id, content, parent_id } = req.body;
    try {
        const queryText = `
            INSERT INTO comments (post_id, user_id, content, parent_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(queryText, [post_id, user_id, content, parent_id] || null);
        res.status(201).json({ message: "Yorum başarıyla oluşturuldu.", comment: result.rows[0] });
    } catch (error) {
        console.error("Yorum oluşturulurken hata:", error);
        res.status(500).json({ error: "Yorum oluşturulurken hata oluştu." });
    }
})  

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const queryText = `
            UPDATE comments
            SET content = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(queryText, [content, id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Yorum basariyla guncellendi.", comment: result.rows[0] });
        } else {
            res.status(404).json({ error: "Yorum bulunamadi." });
        }
    } catch (error) {
        console.error("Yorum güncellenirken hata:", error);
        res.status(500).json({ error: "Yorum guncellenirken hata olustu." });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM comments WHERE id = $1", [id]);
        res.status(200).json({ message: "Yorum basariyla silindi." });
    } catch (error) {
        console.error("Yorum silinirken hata:", error);
        res.status(500).json({ error: "Yorum silinirken hata olustu." });
    }
})

module.exports = router;
