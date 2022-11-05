import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import PictureInference from "PictureInference";
import CameraInference from "CameraInference";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/apps_tensorflowjs/"} element={<PictureInference />} />
          <Route
            path={"/apps_tensorflowjs/mobilenet"}
            element={<PictureInference />}
          />
          <Route
            path={"/apps_tensorflowjs/mobilenet_camera"}
            element={<CameraInference />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
