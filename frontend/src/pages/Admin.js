import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [kitaplar, setKitaplar] = useState([]);

  // State'e 'kutuphane' alanını ekledik
  const [yeniKitap, setYeniKitap] = useState({
    kitap_adi: "",
    yazar: "",
    kategori_id: 1,
    sayfa_sayisi: "",
    ozet: "",
    kutuphane: "",
  });

  const [duzenlenecekKitap, setDuzenlenecekKitap] = useState(null);
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const value =
      e.target.name === "kategori_id" || e.target.name === "sayfa_sayisi"
        ? Number(e.target.value)
        : e.target.value;
    setYeniKitap({ ...yeniKitap, [e.target.name]: value });
  };

  const handleEkle = async () => {
    if (!yeniKitap.kitap_adi || !yeniKitap.yazar) return alert("Eksik bilgi!");
    try {
      await axios.post(`${API_URL}/ekle`, yeniKitap);
      fetchKitaplar();
      setYeniKitap({
        kitap_adi: "",
        yazar: "",
        kategori_id: 1,
        sayfa_sayisi: "",
        ozet: "",
        kutuphane: "",
      });
    } catch (err) {
      alert("Hata oluştu");
    }
  };

  const handleSil = async (id) => {
    if (window.confirm("Silmek istediğine emin misin?")) {
      await axios.delete(`${API_URL}/sil/${id}`);
      fetchKitaplar();
    }
  };

  const handleDuzenleClick = (kitap) => {
    setDuzenlenecekKitap(kitap);
  };

  const handleEditChange = (e) => {
    const value =
      e.target.name === "kategori_id" || e.target.name === "sayfa_sayisi"
        ? Number(e.target.value)
        : e.target.value;
    setDuzenlenecekKitap({ ...duzenlenecekKitap, [e.target.name]: value });
  };

  const handleGuncelle = async () => {
    try {
      await axios.put(
        `${API_URL}/guncelle/${duzenlenecekKitap.id}`,
        duzenlenecekKitap
      );
      alert("Kitap başarıyla güncellendi!");
      setDuzenlenecekKitap(null);
      fetchKitaplar();
    } catch (error) {
      alert("Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="container mt-5 pb-5">
      <style>
        {`
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); z-index: 1000;
            display: flex; justify-content: center; align-items: center;
          }
          .modal-box {
            background: white; padding: 30px; border-radius: 15px; width: 500px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            border-top: 10px solid #ffc107;
          }
        `}
      </style>

      {/* --- DÜZENLEME MODALI --- */}
      {duzenlenecekKitap && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="mb-4 text-warning fw-bold">Kitabı Düzenle</h3>

            <div className="mb-3">
              <label className="form-label">Kitap Adı</label>
              <input
                type="text"
                name="kitap_adi"
                className="form-control"
                value={duzenlenecekKitap.kitap_adi}
                onChange={handleEditChange}
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Yazar</label>
                <input
                  type="text"
                  name="yazar"
                  className="form-control"
                  value={duzenlenecekKitap.yazar}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Sayfa Sayısı</label>
                <input
                  type="number"
                  name="sayfa_sayisi"
                  className="form-control"
                  value={duzenlenecekKitap.sayfa_sayisi}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Konum / Kütüphane</label>
              <input
                type="text"
                name="kutuphane"
                className="form-control"
                placeholder="Örn: Merkez Kütüphane, Raf A5"
                value={duzenlenecekKitap.kutuphane || ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Kategori</label>
              <select
                name="kategori_id"
                className="form-select"
                value={duzenlenecekKitap.kategori_id}
                onChange={handleEditChange}
              >
                <option value={1}>Tarih</option>
                <option value={2}>Yazılım</option>
                <option value={3}>Roman</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Özet</label>
              <textarea
                name="ozet"
                className="form-control"
                rows="3"
                value={duzenlenecekKitap.ozet || ""}
                onChange={handleEditChange}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                onClick={() => setDuzenlenecekKitap(null)}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleGuncelle}
                className="btn btn-warning text-dark fw-bold"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÜST PANEL */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
        <h2 className="mb-0 text-primary">📚 Yönetim Paneli</h2>
        <button
          onClick={() => navigate("/")}
          className="btn btn-outline-danger btn-sm"
        >
          Çıkış Yap
        </button>
      </div>

      {/* EKLEME FORMU */}
      <div className="card p-4 mb-4 shadow-sm border-0">
        <h5 className="mb-3">Yeni Kitap Ekle</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              name="kitap_adi"
              className="form-control"
              placeholder="Kitap Adı"
              value={yeniKitap.kitap_adi}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="yazar"
              className="form-control"
              placeholder="Yazar Adı"
              value={yeniKitap.yazar}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              name="sayfa_sayisi"
              className="form-control"
              placeholder="Sayfa Sayısı"
              value={yeniKitap.sayfa_sayisi}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            {/* YENİ ALAN: Kütüphane */}
            <input
              type="text"
              name="kutuphane"
              className="form-control"
              placeholder="Kütüphane / Raf Bilgisi"
              value={yeniKitap.kutuphane}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <select
              name="kategori_id"
              className="form-select"
              value={yeniKitap.kategori_id}
              onChange={handleChange}
            >
              <option value={1}>Tarih</option>
              <option value={2}>Yazılım</option>
              <option value={3}>Roman</option>
            </select>
          </div>

          <div className="col-md-12">
            <textarea
              name="ozet"
              className="form-control"
              rows="3"
              placeholder="Kitap Özeti..."
              value={yeniKitap.ozet}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="col-md-12 text-end">
            <button onClick={handleEkle} className="btn btn-success px-4">
              + Kitabı Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* LİSTE */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Kitap Adı</th>
              <th>Yazar</th>
              <th>Konum</th> {/* Yeni Başlık */}
              <th>Kategori</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {kitaplar.map((kitap) => (
              <tr key={kitap.id}>
                <td>{kitap.id}</td>
                <td>{kitap.kitap_adi}</td>
                <td>{kitap.yazar}</td>
                <td>
                  <small className="text-muted">{kitap.kutuphane || "-"}</small>
                </td>
                <td>
                  <span className="badge bg-info text-dark">
                    {kitap.kategori_adi}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDuzenleClick(kitap)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleSil(kitap.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;
