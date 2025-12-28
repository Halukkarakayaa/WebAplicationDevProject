import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [kitaplar, setKitaplar] = useState([]);
  const [yeniKitap, setYeniKitap] = useState({
    kitap_adi: "",
    yazar: "",
    kategori_id: 1,
    sayfa_sayisi: "", // Yeni alan
    ozet: "", // Yeni alan
  });

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
    setYeniKitap({ ...yeniKitap, [e.target.name]: e.target.value });
  };

  const handleEkle = async () => {
    if (!yeniKitap.kitap_adi || !yeniKitap.yazar) {
      alert("Lütfen en az kitap adı ve yazar giriniz!");
      return;
    }
    try {
      await axios.post(`${API_URL}/ekle`, yeniKitap);
      fetchKitaplar();
      // Formu sıfırla
      setYeniKitap({
        kitap_adi: "",
        yazar: "",
        kategori_id: 1,
        sayfa_sayisi: "",
        ozet: "",
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

  return (
    <div className="container mt-5 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
        <h2 className="mb-0 text-primary">📚 Yönetim Paneli</h2>
        <button
          onClick={() => navigate("/")}
          className="btn btn-outline-danger btn-sm"
        >
          Çıkış Yap
        </button>
      </div>

      {/* GELİŞMİŞ EKLEME FORMU */}
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
            <select
              name="kategori_id"
              className="form-select"
              value={yeniKitap.kategori_id}
              onChange={handleChange}
            >
              <option value="1">Tarih</option>
              <option value="2">Yazılım</option>
              <option value="3">Roman</option>
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
              <th>Sayfa</th>
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
                <td>{kitap.sayfa_sayisi || "-"}</td>
                <td>
                  <span className="badge bg-info text-dark">
                    {kitap.kategori_adi}
                  </span>
                </td>
                <td>
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
