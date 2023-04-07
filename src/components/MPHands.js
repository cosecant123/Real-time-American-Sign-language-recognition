import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import score from "./Output2"
import pickledData from "./model.p"


// let word_dict={0: 'A', 
//                 1: 'B', 
//                 2: 'C', 
//                 3: 'D', 
//                 4: 'E', 
//                 5: 'F', 
//                 6: 'G', 
//                 7: 'H', 
//                 8: 'I', 
//                 9: 'J', 
//                 10: 'K', 
//                 11: 'L', 
//                 12: 'M', 
//                 13: 'N', 
//                 14: 'O', 
//                 15: 'P', 
//                 16: 'Q', 
//                 17: 'R', 
//                 18: 'S', 
//                 19: 'T', 
//                 20: 'U', 
//                 21: 'V', 
//                 22: 'W', 
//                 23: 'X', 
//                 24: 'Y', 
//                 25: 'Z'}
let word_dict={0: 'A', 
                1: 'B', 
                2: 'K',   
                3: 'L', 
                4: 'M', 
                5: 'N', 
                6: 'O', 
                7: 'P', 
                8: 'Q', 
                9: 'R', 
                10: 'S', 
                11: 'T', 
                12: 'C', 
                13: 'U', 
                14: 'V', 
                15: 'W', 
                16: 'X', 
                17: 'Y', 
                18: 'Z', 
                19: 'D', 
                20: 'E', 
                21: 'F', 
                22: 'G', 
                23: 'H', 
                24: 'I', 
                25: 'J'}
const MPHands = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log(Hands.VERSION);
    const hands = new Hands({
      locateFile: (file) => {
        
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1626903359/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, []);

  const onResults = (results) => {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
    canvasCtx.translate(videoWidth, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiHandLandmarks) {
      
      for (const landmarks of results.multiHandLandmarks) {
        // console.log("landmarks: ", landmarks)
        // const nodePickle = require('node-pickle');
        // nodePickle.load(pickledData)
        var data_input = []
        var data_input_x = []
        var data_input_y = []
        for (var i in landmarks){
          // console.log()
          var x= landmarks[i].x
          var y=landmarks[i].y
          data_input_x.push(x)
          data_input_y.push(y)
          // let x = landmarks[i].x
          // let y = landmarks[i].y
          // data_input.push(x - Math.min(...x_));
          // data_input.push(y - Math.min(...y_));
        }
        // console.log(data_input_x)
        // console.log(data_input_y)

        for (var j in landmarks){
          var x= landmarks[j].x
          var y=landmarks[j].y
          // console.log(x)
          // console.log(Math.min(data_input_x))
          data_input.push(x - Math.min(...data_input_x));
          data_input.push(y - Math.min(...data_input_y));
        }
        // console.log(data_input)
        let pred = score(data_input);
        let z = Math.max(...pred )
        // console.log()
        let l = pred.indexOf(z)
        console.log(word_dict[l])
        // console.log(pred)
        // console.log("Prediction results:",Math.round(pred));
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FFFFFF", lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  };

  return (
    <div>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 800,
          height: 600,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 800,
          height: 600,
        }}
      ></canvas>
    </div>
  );
};

export default MPHands;
