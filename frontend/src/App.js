import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [kitaplar, setKitaplar] = useState([]);
  const [yeniKitap, setYeniKitap] = useState({
    kitap_adi: "",
    yazar: "",
    kategori_id: 1,
  });

  // Verileri Veritabanından Çek (READ)
  const verileriGetir = () => {
    axios
      .get("https://webaplicationdevproject.onrender.com/kitaplar")
      .then((res) => setKitaplar(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    verileriGetir();
  }, []);

  // Yeni Veri Ekle (CREATE)
  const kitapEkle = (e) => {
    e.preventDefault();
    axios
      .post("https://webaplicationdevproject.onrender.com/ekle", yeniKitap)
      .then(() => {
        verileriGetir(); // Listeyi güncelle
        setYeniKitap({ kitap_adi: "", yazar: "", kategori_id: 1 });
      });
  };

  // Veri Sil (DELETE)
  const kitapSil = (id) => {
    axios
      .delete(`https://webaplicationdevproject.onrender.com/sil/${id}`)
      .then(() => verileriGetir());
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Kütüphane Yönetim Sistemi</h2>

      {/* Veri Ekleme Formu */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4>Yeni Kitap Ekle</h4>
        <form onSubmit={kitapEkle} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Kitap Adı"
              value={yeniKitap.kitap_adi}
              onChange={(e) =>
                setYeniKitap({ ...yeniKitap, kitap_adi: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Yazar"
              value={yeniKitap.yazar}
              onChange={(e) =>
                setYeniKitap({ ...yeniKitap, yazar: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              onChange={(e) =>
                setYeniKitap({ ...yeniKitap, kategori_id: e.target.value })
              }
            >
              <option value="1">Yazılım</option>
              <option value="2">Roman</option>
              <option value="3">Tarih</option>
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">
              Ekle
            </button>
          </div>
        </form>
      </div>

      {/* Veri Listeleme Tablosu */}
      <table className="table table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Kitap Adı</th>
            <th>Yazar</th>
            <th>Kategori</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {kitaplar.map((kitap) => (
            <tr key={kitap.id}>
              <td>{kitap.id}</td>
              <td>{kitap.kitap_adi}</td>
              <td>{kitap.yazar}</td>
              <td>
                <span className="badge bg-info text-dark">
                  {kitap.kategori_adi}
                </span>
              </td>
              <td>
                <button
                  onClick={() => kitapSil(kitap.id)}
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
  );
}

export default App;
