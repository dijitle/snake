import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

function App() {
  const [winSize, setWinSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const [appleLocation, setAppleLocation] = useState({ x: 0, y: 0 });
  const [snakeHead, setSnakeHead] = useState({ x: 0, y: 0, d: 0 });
  const [snakeBody, setSnakeBody] = useState([]);
  const [alive, setAlive] = useState(true);

  const [gridSize, setGridSize] = useState(30);

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

      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      for (let i = 1; i < gridSize; i++) {
        ctx.moveTo((w / gridSize) * i, 0);
        ctx.lineTo((w / gridSize) * i, w);

        ctx.moveTo(0, (w / gridSize) * i);
        ctx.lineTo(w, (w / gridSize) * i);
      }
      ctx.stroke();

      //apple
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();

      ctx.arc(
        (w / gridSize) * appleLocation.x + w / gridSize / 2,
        (w / gridSize) * appleLocation.y + w / gridSize / 2,
        w / gridSize / 2.5,
        2 * Math.PI,
        false
      );
      ctx.fill();

      //snakeHead
      ctx.fillStyle = "#00ff00";
      ctx.beginPath();

      ctx.arc(
        (w / gridSize) * snakeHead.x + w / gridSize / 2,
        (w / gridSize) * snakeHead.y + w / gridSize / 2,
        w / gridSize / 2.1,
        2 * Math.PI,
        false
      );
      ctx.fill();

      //snakeBody
      ctx.fillStyle = "#00ff00";
      ctx.beginPath();

      snakeBody.forEach((b) => {
        ctx.rect(
          (w / gridSize) * b.x + w / gridSize / 30,
          (w / gridSize) * b.y + w / gridSize / 30,
          w / gridSize - w / gridSize / 15,
          w / gridSize - w / gridSize / 15
        );
      });
      ctx.fill();
    };

    let id = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(id);
  }, [winSize, snakeHead, snakeBody, appleLocation]);

  let moveSnake = () => {
    if (!alive) return;

    if (
      (snakeHead.x === 0 && snakeHead.d === 3) ||
      (snakeHead.x === gridSize - 1 && snakeHead.d === 1) ||
      (snakeHead.y === 0 && snakeHead.d === 0) ||
      (snakeHead.y === gridSize - 1 && snakeHead.d === 2)
    ) {
      setAlive(false);
      return;
    }

    setSnakeBody([...snakeBody.splice(1), { x: snakeHead.x, y: snakeHead.y }]);
    setSnakeHead({
      x: snakeHead.x + (snakeHead.d === 1 ? 1 : snakeHead.d === 3 ? -1 : 0),
      y: snakeHead.y + (snakeHead.d === 2 ? 1 : snakeHead.d === 0 ? -1 : 0),
      d: snakeHead.d,
    });
  };

  let isOnSnake = (x, y) => {
    if (x === snakeHead.x && y === snakeHead.y) {
      return true;
    }
    return snakeBody.includes({ x: x, y: y });
  };

  useEffect(() => {
    let initalX = Math.floor(gridSize / 2);
    let initalY = Math.floor(gridSize / 2);

    setSnakeHead({ x: initalX, y: initalY, d: 1 });
    setSnakeBody([
      { x: initalX - 3, y: initalY },
      { x: initalX - 2, y: initalY },
      { x: initalX - 1, y: initalY },
    ]);

    let appleX = 0;
    let appleY = 0;
    do {
      appleX = Math.floor(Math.random() * gridSize);
      appleY = Math.floor(Math.random() * gridSize);
    } while (isOnSnake(appleX, appleY));

    setAppleLocation({ x: appleX, y: appleY });
  }, []);

  useEffect(() => {
    if (!alive) return;
    const timer = setInterval(moveSnake, 1000);
    return () => clearInterval(timer);
  }, [appleLocation, snakeHead, alive]);

  return (
    <div className="App vh-100 vw-100">
      <canvas id="gameboard"></canvas>
    </div>
  );
}

export default App;
