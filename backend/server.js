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

// Bağlantıyı yöneten fonksiyon (Hata durumunda otomatik yeniden bağlanır)
function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.log(
        "HATA: TiDB baglantisi kurulamadi, 2 saniye sonra tekrar denenecek ->",
        err.message
      );
      setTimeout(handleDisconnect, 2000); // Hata varsa 2 saniye sonra tekrar dene
    } else {
      console.log("TEBRİKLER: Bulut veritabanina erisim saglandi!");
    }
  });

  db.on("error", (err) => {
    console.log("Veritabanı hatası (db error):", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      console.log("Bağlantı koptu, yeniden bağlanılıyor...");
      handleDisconnect(); // Bağlantı koptuğunda fonksiyonu tekrar çalıştır
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// Kitapları Getir (GET)
app.get("/kitaplar", (req, res) => {
  const sql = `
        SELECT kitaplar.id, kitaplar.kitap_adi, kitaplar.yazar, kategoriler.kategori_adi 
        FROM kitaplar 
        LEFT JOIN kategoriler ON kitaplar.kategori_id = kategoriler.id
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Veritabanı hatası:", err);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda hazır.`);
});
