import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* YENİ HİYERARŞİ: */}

        {/* 1. Sitenin kökü (/) artık Ana Sayfa */}
        <Route path="/" element={<Home />} />

        {/* 2. Giriş yapmak isteyenler /login adresine gidecek */}
        <Route path="/login" element={<Login />} />

        {/* 3. Giriş başarılı olursa buraya yönlenecek */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
