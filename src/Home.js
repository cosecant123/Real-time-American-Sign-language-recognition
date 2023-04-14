import React, { useState  } from "react";
// import Camera from "./Camera";
import MPHands from "./components/MPHands";

function Home() {
    const [isStart, setIsStart] = useState(false);
    const startCamera = () => {
        // console.log("enle!")
        setIsStart(true)
      };
  return (
    <div>
      <h1>Show Your Hand</h1>
      <button onClick={startCamera}>Start camera</button>
      {isStart? 
      (<MPHands />):
      <div></div>
      }
       {/* <MPHands /> */}
    </div>
  );
}

export default Home;
