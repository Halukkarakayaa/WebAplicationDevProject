const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());

// Veritabanı Konfigürasyonu
const dbConfig = {
  host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
  user: "4VsJKbW7Zhzmc1H.root",
  password: "vhlUKb1tloz7Bh18",
  database: "test",
  port: 4000,
  ssl: {
    rejectUnauthorized: false,
  },
};

let db;

// Bağlantıyı yöneten fonksiyon
function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.log("HATA: TiDB baglantisi kurulamadi ->", err.message);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("TEBRİKLER: Bulut veritabanina erisim saglandi!");
    }
  });

  db.on("error", (err) => {
    console.log("Veritabanı hatası:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// --- YENİ EKLENEN KISIM: GİRİŞ (LOGIN) API ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Veritabanında bu kullanıcı adı ve şifreye sahip biri var mı?
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      // Kullanıcı bulundu!
      const user = result[0];
      res.json({
        success: true,
        message: "Giriş Başarılı",
        user: { id: user.id, name: user.name, username: user.username }, // Şifreyi geri göndermiyoruz, güvenlik için.
      });
    } else {
      // Eşleşme yok
      res
        .status(401)
        .json({ success: false, message: "Kullanıcı adı veya şifre hatalı!" });
    }
  });
});
// ----------------------------------------------

// Kitapları Getir
app.get("/kitaplar", (req, res) => {
  const sql = `
        SELECT kitaplar.id, kitaplar.kitap_adi, kitaplar.yazar, kategoriler.kategori_adi 
        FROM kitaplar 
        LEFT JOIN kategoriler ON kitaplar.kategori_id = kategoriler.id
    `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Kitap Ekle
app.post("/ekle", (req, res) => {
  const sql = "INSERT INTO kitaplar (kitap_adi, yazar, kategori_id) VALUES (?)";
  const values = [req.body.kitap_adi, req.body.yazar, req.body.kategori_id];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Başarıyla eklendi");
  });
});

// Kitap Sil
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
