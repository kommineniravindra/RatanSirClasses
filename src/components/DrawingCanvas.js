import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import "../css/DrawingCanvas.css";

const DrawingCanvas = forwardRef(
  (
    {
      activeTool,
      color,
      brushSize,
      brushType,
      isDrawingMode,
      onClear,
      clearTrigger,
      undoTrigger,
      redoTrigger,
    },
    ref
  ) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const snapshot = useRef(null);

    // History for Undo/Redo
    const history = useRef([]);
    const historyStep = useRef(-1);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      getCanvasData: () => {
        return canvasRef.current ? canvasRef.current.toDataURL() : null;
      },
      loadCanvasData: (dataUrl) => {
        if (!canvasRef.current || !dataUrl) {
          // If no data, just clear
          if (contextRef.current) {
            contextRef.current.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            saveHistory();
          }
          return;
        }
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const context = contextRef.current;
          context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          context.drawImage(
            img,
            0,
            0,
            canvasRef.current.width / 2,
            canvasRef.current.height / 2
          );
          saveHistory(); // Save this loaded state as a new history step? Or just reset history?
          // For pagination, usually we might want to reset undo/redo or keep it.
          // Let's just save it as the current state.
        };
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = brushSize || 5;
      contextRef.current = context;

      // Save initial blank state
      saveHistory();
    }, []);

    // Handle Undo/Redo Triggers
    useEffect(() => {
      if (undoTrigger > 0) undo();
    }, [undoTrigger]);

    useEffect(() => {
      if (redoTrigger > 0) redo();
    }, [redoTrigger]);

    const saveHistory = () => {
      if (!canvasRef.current) return;
      // Remove any forward history if we were in middle of stack
      if (historyStep.current < history.current.length - 1) {
        history.current = history.current.slice(0, historyStep.current + 1);
      }
      history.current.push(canvasRef.current.toDataURL());
      historyStep.current++;
    };

    const undo = () => {
      if (historyStep.current > 0) {
        historyStep.current--;
        restoreHistory(history.current[historyStep.current]);
      }
    };

    const redo = () => {
      if (historyStep.current < history.current.length - 1) {
        historyStep.current++;
        restoreHistory(history.current[historyStep.current]);
      }
    };

    const restoreHistory = (dataUrl) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const context = contextRef.current;
        context.globalCompositeOperation = "source-over"; // Reset for restore
        context.shadowBlur = 0;
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        context.drawImage(
          img,
          0,
          0,
          canvasRef.current.width / 2,
          canvasRef.current.height / 2
        );
      };
    };

    useEffect(() => {
      if (contextRef.current) {
        const ctx = contextRef.current;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 0; // Reset shadow
        ctx.globalAlpha = 1; // Reset alpha

        if (activeTool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = brushSize ? brushSize * 4 : 40;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = brushSize || 5;

          // Brush Effects
          if (brushType === "highlighter") {
            // Highlighter: Transparent and thick
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 0.25; // More transparent
            ctx.lineWidth = (brushSize || 5) * 4; // Much thicker
            ctx.lineCap = "butt"; // Marker tip
            ctx.strokeStyle = color; // Ensure color is applied
          } else if (brushType === "neon") {
            // Neon: Bright with glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.lineWidth = brushSize || 5;
            ctx.lineCap = "round";
            ctx.globalAlpha = 1;
          }
        }
      }
    }, [color, activeTool, brushSize, brushType]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas && contextRef.current) {
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        contextRef.current.globalAlpha = 1; // Reset alpha for clear
        saveHistory();
      }
    }, [clearTrigger]);

    const startDrawing = ({ nativeEvent }) => {
      if (!isDrawingMode) return;

      let clientX, clientY;
      if (nativeEvent.type.startsWith("touch")) {
        clientX = nativeEvent.touches[0].clientX;
        clientY = nativeEvent.touches[0].clientY;
      } else {
        clientX = nativeEvent.clientX;
        clientY = nativeEvent.clientY;
      }

      const { offsetX, offsetY } = getCoordinates(clientX, clientY);

      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);

      setIsDrawing(true);
      startPos.current = { x: offsetX, y: offsetY };

    
      if (["rectangle", "circle", "triangle", "line", "arrow", "diamond", "pentagon", "hexagon", "star", "cube", "check"].includes(activeTool)) {
        snapshot.current = contextRef.current.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };

    const draw = ({ nativeEvent }) => {
      if (!isDrawing || !isDrawingMode) return;

      let clientX, clientY;
      if (nativeEvent.type.startsWith("touch")) {
        clientX = nativeEvent.touches[0].clientX;
        clientY = nativeEvent.touches[0].clientY;
      } else {
        clientX = nativeEvent.clientX;
        clientY = nativeEvent.clientY;
      }

      const { offsetX, offsetY } = getCoordinates(clientX, clientY);

      if (activeTool === "pen" || activeTool === "eraser") {
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      } else {
        // Shapes
        contextRef.current.putImageData(snapshot.current, 0, 0);
        contextRef.current.beginPath();

        if (activeTool === "rectangle") {
          contextRef.current.rect(
            startPos.current.x,
            startPos.current.y,
            offsetX - startPos.current.x,
            offsetY - startPos.current.y
          );
        } else if (activeTool === "circle") {
          const radius = Math.sqrt(
            Math.pow(offsetX - startPos.current.x, 2) +
              Math.pow(offsetY - startPos.current.y, 2)
          );
          contextRef.current.arc(
            startPos.current.x,
            startPos.current.y,
            radius,
            0,
            2 * Math.PI
          );
        } else if (activeTool === "triangle") {
          contextRef.current.moveTo(startPos.current.x, startPos.current.y);
          contextRef.current.lineTo(offsetX, offsetY);
          contextRef.current.lineTo(
            startPos.current.x - (offsetX - startPos.current.x),
            offsetY
          );
          contextRef.current.closePath();
        } else if (activeTool === "line") {
          contextRef.current.moveTo(startPos.current.x, startPos.current.y);
          contextRef.current.lineTo(offsetX, offsetY);
        } else if (activeTool === "arrow") {
          const headlen = 15; // length of head in pixels
          const dx = offsetX - startPos.current.x;
          const dy = offsetY - startPos.current.y;
          const angle = Math.atan2(dy, dx);

          contextRef.current.moveTo(startPos.current.x, startPos.current.y);
          contextRef.current.lineTo(offsetX, offsetY);
          contextRef.current.lineTo(
            offsetX - headlen * Math.cos(angle - Math.PI / 6),
            offsetY - headlen * Math.sin(angle - Math.PI / 6)
          );
          contextRef.current.moveTo(offsetX, offsetY);
          contextRef.current.lineTo(
            offsetX - headlen * Math.cos(angle + Math.PI / 6),
            offsetY - headlen * Math.sin(angle + Math.PI / 6)
          );
        } else if (activeTool === "diamond") {
          const width = offsetX - startPos.current.x;
          const height = offsetY - startPos.current.y;
          const centerX = startPos.current.x + width / 2;
          const centerY = startPos.current.y + height / 2;

          contextRef.current.moveTo(centerX, startPos.current.y); // Top
          contextRef.current.lineTo(offsetX, centerY); // Right
          contextRef.current.lineTo(centerX, offsetY); // Bottom
          contextRef.current.lineTo(startPos.current.x, centerY); // Left
          contextRef.current.closePath();
        } else if (activeTool === "pentagon") {
          const sides = 5;
          const radius = Math.sqrt(
            Math.pow(offsetX - startPos.current.x, 2) +
              Math.pow(offsetY - startPos.current.y, 2)
          );
          const angle = (Math.PI * 2) / sides;
          const rot = (Math.PI / 2) * 3; // Rotate to point up

          for (let i = 0; i < sides; i++) {
            const x = startPos.current.x + radius * Math.cos(angle * i + rot);
            const y = startPos.current.y + radius * Math.sin(angle * i + rot);
            if (i === 0) contextRef.current.moveTo(x, y);
            else contextRef.current.lineTo(x, y);
          }
          contextRef.current.closePath();
        } else if (activeTool === "hexagon") {
          const sides = 6;
          const radius = Math.sqrt(
            Math.pow(offsetX - startPos.current.x, 2) +
              Math.pow(offsetY - startPos.current.y, 2)
          );
          const angle = (Math.PI * 2) / sides;

          for (let i = 0; i < sides; i++) {
            const x = startPos.current.x + radius * Math.cos(angle * i);
            const y = startPos.current.y + radius * Math.sin(angle * i);
            if (i === 0) contextRef.current.moveTo(x, y);
            else contextRef.current.lineTo(x, y);
          }
          contextRef.current.closePath();
        } else if (activeTool === "star") {
          const spikes = 5;
          const outerRadius = Math.sqrt(
            Math.pow(offsetX - startPos.current.x, 2) +
              Math.pow(offsetY - startPos.current.y, 2)
          );
          const innerRadius = outerRadius / 2;
          const cx = startPos.current.x;
          const cy = startPos.current.y;
          let rot = (Math.PI / 2) * 3;
          let x = cx;
          let y = cy;
          const step = Math.PI / spikes;

          contextRef.current.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            contextRef.current.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            contextRef.current.lineTo(x, y);
            rot += step;
          }
          contextRef.current.lineTo(cx, cy - outerRadius);
          contextRef.current.closePath();
        } else if (activeTool === "cube") {
          // Simple Cube
          const width = offsetX - startPos.current.x;
          const height = offsetY - startPos.current.y;
          const x = startPos.current.x;
          const y = startPos.current.y;
          const offset = width * 0.25; // Depth offset

          // Front face
          contextRef.current.rect(x, y + offset, width, height);
          // Back face lines
          contextRef.current.moveTo(x, y + offset);
          contextRef.current.lineTo(x + offset, y);
          contextRef.current.lineTo(x + width + offset, y);
          contextRef.current.lineTo(x + width, y + offset);
          contextRef.current.lineTo(x + width + offset, y);
          contextRef.current.lineTo(x + width + offset, y + height);
          contextRef.current.lineTo(x + width, y + height + offset);
        } else if (activeTool === "check") {
          const width = offsetX - startPos.current.x;
          const height = offsetY - startPos.current.y;
          const x = startPos.current.x;
          const y = startPos.current.y;

          contextRef.current.moveTo(x, y + height * 0.5);
          contextRef.current.lineTo(x + width * 0.4, y + height);
          contextRef.current.lineTo(x + width, y);
        }

        contextRef.current.stroke();
      }
    };

    const stopDrawing = () => {
      if (isDrawing) {
        contextRef.current.closePath();
        setIsDrawing(false);
        saveHistory(); // Save state after stroke/shape
      }
    };

    const getCoordinates = (clientX, clientY) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: clientX - rect.left,
        offsetY: clientY - rect.top,
      };
    };

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`drawing-canvas ${isDrawingMode ? "active" : ""}`}
      />
    );
  }
);

export default DrawingCanvas;
