import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

function App() {
  const [winSize, setWinSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWinSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const draw = () => {
      let canvas = document.getElementById("gameboard");
      let ctx = canvas.getContext("2d");
      ctx.scale(2, 2);

      let width = window.innerWidth;
      let height = window.innerHeight;

      canvas.width = Math.min(width, height) * 2;
      canvas.height = Math.min(width, height) * 2;

      canvas.style =
        "width: " +
        Math.min(width, height) +
        "px; height: " +
        Math.min(width, height) +
        "px;";

      var w = canvas.width;

      ctx.clearRect(0, 0, w, w);
    };

    let id = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(id);
  }, [winSize]);

  useEffect(() => {
    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="App vh-100 vw-100">
      <canvas id="gameboard"></canvas>
    </div>
  );
}

export default App;
