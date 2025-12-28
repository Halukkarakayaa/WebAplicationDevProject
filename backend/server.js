const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"] }));
app.use(express.json());

// Veritabanı Konfigürasyonu
const dbConfig = {
  host: "gateway01.eu-central-1.prod.aws.tidbcloud.com", // Senin hostun
  user: "4VsJKbW7Zhzmc1H.root", // Senin kullanıcı adın
  password: "vhlUKb1tloz7Bh18", // Senin şifren
  database: "test",
  port: 4000,
  ssl: { rejectUnauthorized: false },
};

let db;
function handleDisconnect() {
  db = mysql.createConnection(dbConfig);
  db.connect((err) => {
    if (err) {
      console.log("HATA:", err.message);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Veritabanına bağlanıldı!");
    }
  });
  db.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") handleDisconnect();
    else throw err;
  });
}
handleDisconnect();

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      const user = result[0];
      res.json({
        success: true,
        message: "Giriş Başarılı",
        user: { id: user.id, name: user.name, username: user.username },
      });
    } else {
      res.status(401).json({ success: false, message: "Hatalı giriş!" });
    }
  });
});

// GET - Kitapları Getir (Yeni sütunlar dahil)
app.get("/kitaplar", (req, res) => {
  const sql = `
        SELECT kitaplar.*, kategoriler.kategori_adi 
        FROM kitaplar 
        LEFT JOIN kategoriler ON kitaplar.kategori_id = kategoriler.id
    `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST - Kitap Ekle (Özet ve Sayfa Sayısı eklendi)
app.post("/ekle", (req, res) => {
  const sql =
    "INSERT INTO kitaplar (kitap_adi, yazar, kategori_id, sayfa_sayisi, ozet) VALUES (?)";
  // Verileri sırasıyla dizi içine koyuyoruz
  const values = [
    req.body.kitap_adi,
    req.body.yazar,
    req.body.kategori_id,
    req.body.sayfa_sayisi,
    req.body.ozet,
  ];

  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Başarıyla eklendi");
  });
});

// DELETE - Kitap Sil
app.delete("/sil/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM kitaplar WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Başarıyla silindi");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda hazır.`);
});
