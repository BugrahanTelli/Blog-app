const express = require("express");
const pool = require("../db/pool");
const router = express.Router();

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, surname, email } = req.body;
    try {
        const queryText = `
      UPDATE users
      SET name = $1, surname = $2, email = $3
      WHERE id = $4
      RETURNING *
    `;
        const result = await pool.query(queryText, [name, surname, email, id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Profil başarıyla güncellendi.", user: result.rows[0] });
        } else {
            res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Profil güncelleme hatası:", error);
        res.status(500).json({ error: "Profil güncellenirken hata oluştu." });
    }
});

module.exports = router;
