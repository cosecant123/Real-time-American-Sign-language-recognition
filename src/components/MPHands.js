import React, { useRef, useEffect, useState  } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import score from "./Output2"

let word_dict = {
  0: 'A',
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
  25: 'J'
}
function getPredict(landmarks) {
  var data_input = []
  var data_input_x = []
  var data_input_y = []
  for (var i in landmarks) {
    var x = landmarks[i].x
    var y = landmarks[i].y
    data_input_x.push(x)
    data_input_y.push(y)

  }


  for (var j in landmarks) {
    var x = landmarks[j].x
    var y = landmarks[j].y
    data_input.push(x - Math.min(...data_input_x));
    data_input.push(y - Math.min(...data_input_y));
  }
  let pred = score(data_input);
  let z = Math.max(...pred)
  let l = pred.indexOf(z)
  return word_dict[l]
}
function getHighest(prediction) {
  for (let i in prediction) {
    if (prediction[i] > 200) {
      console.log(prediction[i])
    }
  }
}
const MPHands = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStart, setIsStart] = useState(false);
  const { onLetterOutput } = props;

  useEffect(() => {
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

  let prediction = {}
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
        let result = getPredict(landmarks)
        if (result in prediction) {
          prediction[result]++
        } else {
          prediction[result] = 1
        }
        for (let i in prediction) {
          if (prediction[i] > 50) {
            onLetterOutput(i);
            prediction = {}
            break
          }

        }

        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FFFFFF", lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  };


  const startCamera = () => {
    setIsStart(true)
  };

  return (
    <div>
      <div>
        <Webcam
          audio={false}
          mirrored={true}
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "0px",
            marginRight: "0px",
            left: "25px",
            right: "0",
            textAlign: "left",
            zindex: 9,
            width: 320,
            height: 240,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "0px",
            marginRight: "0px",
            left: "25px",
            right: "0",
            textAlign: "left",
            zindex: 9,
            width: 320,
            height: 240,
          }}
        ></canvas>
      </div>

      
    </div>
  );
};

export default MPHands;
