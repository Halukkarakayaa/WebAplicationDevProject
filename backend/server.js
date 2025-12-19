const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanı Bağlantısı
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wad-project",
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
  const sql =
    "SELECT kitaplar.*, kategoriler.kategori_adi FROM kitaplar JOIN kategoriler ON kitaplar.kategori_id = kategoriler.id";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
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
