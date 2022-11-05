import React, { useEffect, useState } from "react";
import "./App.css";
import { TFService } from "./service/TFService";

function PictureInference() {
  const [classifyResult, setClassifyResult] = useState<
    Array<{
      className: string;
      probability: number;
    }>
  >();
  const [service, setService] = useState<TFService | null>(null);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    TFService.loadModel().then((service) => {
      setService(service);
      console.log("service, setted");
    });
  }, []);

  useEffect(() => {
    const imgTag = document.getElementById("preview") as HTMLImageElement;
    inferenceHandler(imgTag);
    setFlag(false);
  }, [flag]);

  const imageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }
    const file = event.target.files[0];
    if (file === null) {
      return;
    }
    const imgTag = document.getElementById("preview") as HTMLImageElement;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result: string = reader.result as string;
      imgTag.src = result;
      setFlag(true);
    };
  };
  const inferenceHandler = (element: HTMLImageElement) => {
    console.log("inference Handler start");
    if (element === null) {
      return;
    }
    if (service == null) {
      return;
    }
    service.inference(element).then(
      (
        result?: Array<{
          className: string;
          probability: number;
        }>
      ) => {
        console.log(" --- result ---");
        console.log(result);
        if (
          result &&
          result.length !== 0 &&
          result[0].className !== "" &&
          result[0].probability !== 0
        ) {
          setClassifyResult([...result]);
        }
      }
    );
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
    <div className="PictureInference">
      <h1>MobileNet Inference</h1>
      <input
        type="file"
        accept="image/png, image/jpeg, image/gif"
        onChange={imageHandler}
      ></input>
      <div>
        <img id="preview" src="" width="50%"></img>
      </div>
      <div>
        <table>
          <tbody>{TableList()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default PictureInference;
