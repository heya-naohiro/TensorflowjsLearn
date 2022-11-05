import React, { useEffect, useState, useRef } from "react";
import { TFService } from "./service/TFService";

function CameraInference() {
  const [classifyResult, setClassifyResult] = useState<
    Array<{
      className: string;
      probability: number;
    }>
  >();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [service, setService] = useState<TFService | null>(null);
  //const [fps, setFps] = useState(0);

  useEffect(() => {
    TFService.loadModel().then((service) => {
      setService(service);
    });
  }, []);

  useEffect(() => {
    if (service && videoRef) {
      getVideo();
    }
  }, [service]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;

        if (video) {
          video.srcObject = stream;
          service?.inferenceFromVideoStart(video, setClassifyResult);
        }
      })
      .catch((err) => {
        console.error("error", err);
      });
  };

  const TableList = () => {
    const result = classifyResult;
    if (result !== undefined) {
      const rows = result.map((r, index) => (
        <tr key={index}>
          <td>{r.className}</td>
          <td>{r.probability}</td>
        </tr>
      ));
      return <>{rows}</>;
    }
    return (
      <tr>
        <td>{"No data"}</td>
      </tr>
    );
  };
  return (
    <div className="CameraInference">
      <div>
        <video ref={videoRef} playsInline autoPlay></video>
      </div>
      <div>
        <table>
          <tbody>{TableList()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default CameraInference;
