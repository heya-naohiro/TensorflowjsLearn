import * as tf from "@tensorflow/tfjs-core";
import * as mobileNet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl";
import webcamVideoElement from "@tensorflow/tfjs-data";
// https://github.com/tensorflow/tfjs-models
// https://note.com/npaka/n/nfe1022f8bee9
export class TFService {
  net: mobileNet.MobileNet | null;
  webcamIter: webcamVideoElement.WebcamConfig | null;
  constructor() {
    this.net = null;
    this.webcamIter = null;
  }

  public static async loadModel(): Promise<TFService> {
    //await tf.setBackend("webgpu");
    //await tf.ready();
    const tfservice = new TFService();
    tfservice.net = await mobileNet.load();
    return tfservice;
  }

  /*
    async loadWebcam(webcamElement: HTMLVideoElement) {
        this.webcam = await tf.data.webcam(webcamElement);
    }
    */

  // pointerを渡して書き換えてもらう　ループで
  public async inference(imageElement: HTMLImageElement) {
    return this.net?.classify(imageElement);
  }
}
