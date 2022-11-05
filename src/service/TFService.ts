//import * as tf from "@tensorflow/tfjs-core";
import * as tf from "@tensorflow/tfjs";
import * as mobileNet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl";
// https://github.com/tensorflow/tfjs-models
// https://note.com/npaka/n/nfe1022f8bee9
export class TFService {
  net: mobileNet.MobileNet | null;
  webcam_stopflag: boolean;
  webcam_already: boolean;
  constructor() {
    this.net = null;
    this.webcam_stopflag = false;
    this.webcam_already = false;
  }

  public static async loadModel(): Promise<TFService> {
    //await tf.setBackend("webgpu");
    //await tf.ready();
    const tfservice = new TFService();
    tfservice.net = await mobileNet.load();
    return tfservice;
  }

  public async inferenceFromVideoStart(
    webcamElement: HTMLVideoElement,
    stateChange: (
      state: Array<{
        className: string;
        probability: number;
      }>
    ) => void
  ) {
    const webcam = await tf.data.webcam(webcamElement);

    console.log("start");
    while (true) {
      //console.log("ppppp");
      const img = await webcam.capture();
      if (this.net) {
        const result = await this.net.classify(img);
        stateChange(result);
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
    return this.net?.classify(imageElement);
  }
}
