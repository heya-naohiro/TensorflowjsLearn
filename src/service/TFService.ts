//import * as tf from "@tensorflow/tfjs-core";
import * as tf from "@tensorflow/tfjs";
import * as mobileNet from "@tensorflow-models/mobilenet";

import "@tensorflow/tfjs-backend-webgl";
// https://github.com/tensorflow/tfjs-models
// https://note.com/npaka/n/nfe1022f8bee9
export class TFService {
  model: mobileNet.MobileNet | null;
  webcam_stopflag: boolean;
  webcam_already: boolean;
  frame: number;
  constructor() {
    this.model = null;
    this.webcam_stopflag = false;
    this.webcam_already = false;
    this.frame = 0;
  }

  public static async loadModel(): Promise<TFService> {
    //await tf.setBackend("webgpu");
    //await tf.ready();
    const tfservice = new TFService();
    tfservice.model = await mobileNet.load();
    return tfservice;
  }

  public async inferenceFromVideoStart(
    webcamElement: HTMLVideoElement,
    stateChange: (
      state: Array<{
        className: string;
        probability: number;
      }>
    ) => void,
    setFrameCount: React.Dispatch<React.SetStateAction<number>>
  ) {
    const webcam = await tf.data.webcam(webcamElement);

    while (true) {
      const img = await webcam.capture();
      if (this.model) {
        const result = await this.model.classify(img);
        stateChange(result);
        setFrameCount((prev) => prev + 1);
      }

      img.dispose();
      await tf.nextFrame();
      if (this.webcam_stopflag) {
        break;
      }
    }
    console.log("stop");
    webcam.stop();
  }
  public inferenceVideoStop() {
    this.webcam_stopflag = true;
  }
  // pointerを渡して書き換えてもらう　ループで
  public async inference(imageElement: HTMLImageElement) {
    return this.model?.classify(imageElement);
  }
}
