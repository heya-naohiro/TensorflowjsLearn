import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import PictureInference from "PictureInference";
import CameraInference from "CameraInference";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PictureInference />} />
        <Route path="/mobilenet" element={<PictureInference />} />
        <Route path="/mobilenet_camera" element={<CameraInference />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
