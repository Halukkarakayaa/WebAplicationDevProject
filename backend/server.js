const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*", // Her yerden gelen isteğe izin ver
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());

// Veritabanı Bağlantısı
const db = mysql.createConnection({
  host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
  user: "4VsJKbW7Zhzmc1H.root",
  password: "vhlUKb1tloz7Bh18",
  database: "test",
  port: 4000,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false, // Bu ayar bağlantı hatalarını genellikle çözer
  },
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Bağlantı Hatası:", err);
  } else {
    console.log("MySQL Bağlantısı Başarılı!");
  }
});

// Kitapları Listeleme Rotası
app.get("/kitaplar", (req, res) => {
  // Karmaşık JOIN yerine önce sadece kitapları çekmeyi deneyelim
  db.query("SELECT * FROM kitaplar", (err, result) => {
    if (err) {
      console.error("DETAYLI HATA:", err); // Bu log Render terminaline düşer
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Kitap Ekleme Rotası
app.post("/ekle", (req, res) => {
  const sql = "INSERT INTO kitaplar (kitap_adi, yazar, kategori_id) VALUES (?)";
  const values = [req.body.kitap_adi, req.body.yazar, req.body.kategori_id];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Başarıyla eklendi");
  });
});

// Kitap Silme Rotası
app.delete("/sil/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM kitaplar WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Başarıyla silindi");
  });
});

app.listen(5000, () => {
  console.log("Backend 5000 portunda hazır.");
});
