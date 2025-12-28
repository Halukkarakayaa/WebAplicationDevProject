import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [kitaplar, setKitaplar] = useState([]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [secilenKategori, setSecilenKategori] = useState("Tümü"); // Filtre için state
  const [secilenKitap, setSecilenKitap] = useState(null); // Modal için state

  const API_URL = "https://webaplicationdevproject.onrender.com";

  useEffect(() => {
    fetchKitaplar();
  }, []);

  const fetchKitaplar = async () => {
    try {
      const res = await axios.get(`${API_URL}/kitaplar`);
      setKitaplar(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // --- FİLTRELEME MANTIĞI ---
  const filtrelenmisKitaplar = kitaplar.filter((kitap) => {
    const metinUyumu =
      kitap.kitap_adi.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      kitap.yazar.toLowerCase().includes(aramaMetni.toLowerCase());

    const kategoriUyumu =
      secilenKategori === "Tümü" || kitap.kategori_adi === secilenKategori;

    return metinUyumu && kategoriUyumu;
  });

  return (
    <div className="container mt-5 pb-5 position-relative">
      <style>
        {`
          .ieee-text { color: #00629B; }
          .btn-ieee { border: 2px solid #00629B; color: #00629B; font-weight: 600; transition: all 0.3s ease; }
          .btn-ieee:hover { background-color: #00629B; color: white; }
          .book-card { border: none; border-left: 5px solid #00629B; transition: transform 0.3s ease, box-shadow 0.3s ease; background-color: #f8f9fa; cursor: pointer; }
          .book-card:hover { transform: translateY(-7px); box-shadow: 0 10px 20px rgba(0, 98, 155, 0.15) !important; background-color: #fff; }
          
          /* MODAL STİLLERİ */
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); z-index: 1000;
            display: flex; justify-content: center; align-items: center;
          }
          .modal-content-box {
            background: white; padding: 30px; border-radius: 15px; width: 500px; max-width: 90%;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3); position: relative;
            border-top: 10px solid #00629B;
          }
          .close-btn {
            position: absolute; top: 15px; right: 20px; font-size: 24px; cursor: pointer; color: #aaa;
          }
          .close-btn:hover { color: red; }
        `}
      </style>

      {/* MODAL (Sadece bir kitap seçiliyse görünür) */}
      {secilenKitap && (
        <div className="modal-overlay" onClick={() => setSecilenKitap(null)}>
          <div
            className="modal-content-box"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-btn" onClick={() => setSecilenKitap(null)}>
              &times;
            </span>

            <h3 className="ieee-text fw-bold mb-3">{secilenKitap.kitap_adi}</h3>
            <h5 className="text-secondary mb-3">✍️ {secilenKitap.yazar}</h5>

            <div className="d-flex gap-2 mb-4">
              <span className="badge bg-primary">
                {secilenKitap.kategori_adi || "Genel"}
              </span>
              <span className="badge bg-secondary">
                {secilenKitap.sayfa_sayisi
                  ? `${secilenKitap.sayfa_sayisi} Sayfa`
                  : "Sayfa sayısı yok"}
              </span>
            </div>

            <h6 className="fw-bold">Özet:</h6>
            <p className="text-muted">
              {secilenKitap.ozet || "Bu kitap için henüz bir özet girilmemiş."}
            </p>
          </div>
        </div>
      )}

      {/* ÜST KISIM */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h1 className="fw-bold ieee-text">
          <i className="bi bi-book-half me-2"></i>Kütüphane Kataloğu
        </h1>
        <Link to="/login" className="btn btn-ieee px-4 py-2 rounded-pill">
          Admin Girişi
        </Link>
      </div>

      {/* ARAMA VE FİLTRE ALANI */}
      <div className="row justify-content-center mb-5 g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder="Kitap adı veya yazar ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          {/* KATEGORİ DROPDOWN */}
          <select
            className="form-select form-select-lg shadow-sm"
            value={secilenKategori}
            onChange={(e) => setSecilenKategori(e.target.value)}
          >
            <option value="Tümü">Tüm Kategoriler</option>
            <option value="Tarih">Tarih</option>
            <option value="Yazılım">Yazılım</option>
            <option value="Roman">Roman</option>
          </select>
        </div>
      </div>

      {/* KİTAP LİSTESİ */}
      <div className="row">
        {filtrelenmisKitaplar.length > 0 ? (
          filtrelenmisKitaplar.map((kitap) => (
            <div
              key={kitap.id}
              className="col-md-4 mb-4"
              onClick={() => setSecilenKitap(kitap)}
            >
              <div className="card h-100 shadow-sm book-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-primary border border-primary rounded-pill px-3">
                      {kitap.kategori_adi || "Genel"}
                    </span>
                    {/* ID ARTIK GİZLİ (Buraya koymadık) */}
                  </div>
                  <h4 className="card-title fw-bold ieee-text mt-3 mb-2">
                    {kitap.kitap_adi}
                  </h4>
                  <h6 className="card-subtitle text-secondary mb-3">
                    <span className="text-muted">Yazar:</span> {kitap.yazar}
                  </h6>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <h4 className="text-muted">
              Aradığınız kriterde kitap bulunamadı.
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
