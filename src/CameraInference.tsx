import { env } from "process";
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

  useEffect(() => {
    console.log(process.env.REACT_APP_ROUTE_ENV);
    TFService.loadModel().then((service) => {
      setService(service);
      console.log("service, setted");
    });
  }, []);

  useEffect(() => {
    if (service && videoRef) {
      getVideo();
    }
  }, [videoRef, service]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
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
        <video ref={videoRef}></video>
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
