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
    rejectUnauthorized: true,
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
  // Kitaplar ile kategorileri birleştirerek isimleri alıyoruz
  const sql = `
        SELECT kitaplar.id, kitaplar.kitap_adi, kitaplar.yazar, kategoriler.kategori_adi 
        FROM kitaplar 
        JOIN kategoriler ON kitaplar.kategori_id = kategoriler.id
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Hata:", err);
      return res.status(500).send(err);
    }
    res.send(result);
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
