const express = require("express");
const cors = require("cors");
const pool = require("./db/pool"); 
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((err, req, res, next) => {
    console.error("Global hata yakalandı:", err.stack);
    res.status(500).json({ error: "Sunucu hatası." });
});

pool.connect()
    .then(() => {
        console.log("Veritabanına başarıyla bağlanıldı.");
    })
    .catch(err => {
        console.error("Veritabanı bağlantı hatası:", err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
