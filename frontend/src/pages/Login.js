import React, { useState } from "react";
import axios from "axios";
// Eğer router kullanıyorsak useNavigate ekleyelim
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend adresin (Render)
      const response = await axios.post(
        "https://webaplicationdevproject.onrender.com/login",
        {
          username: username,
          password: password,
        }
      );

      if (response.data.success) {
        alert("Giriş Başarılı! Hoşgeldin " + response.data.user.name);
        navigate("/admin");
      }
    } catch (err) {
      setError("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Admin Girişi</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
