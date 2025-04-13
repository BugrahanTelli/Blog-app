const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const router = express.Router();

// Signup endpoint
router.post("/signup", async (req, res) => {
    const { name, surname, username, email, password } = req.body;

    try {
        // Şifreyi hash'lemek için
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const queryText = `
      INSERT INTO users (name, surname, username, email, password)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
        const result = await pool.query(queryText, [name, surname, username, email, hashedPassword]);

        const user = result.rows[0];
        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu.", user });
    } catch (error) {
        console.error("Signup Hatası:", error);
        res.status(500).json({ error: "Kullanıcı oluşturulurken hata oluştu." });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT id, username, name, surname, email, password FROM users WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ message: "Kullanıcı bulunamadı." });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Geçersiz şifre." });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ user: userWithoutPassword }); // name, surname, email, username döner
    } catch (err) {
        console.error("Login hatası:", err);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});


module.exports = router;
