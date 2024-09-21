import { useCallback, useState } from "react";

export default function useGeoChartControls(
  initialProjectionScale: number,
  initialProjectionRotation: [number, number, number],
  scaleIncrement: number,
  rotationIncrement: number,
  minScaleValue: number,
  maxScaleValue: number,
  scaleFactor: number,
) {
  const [projectionScale, setProjectionScale] = useState(
    initialProjectionScale,
  );
  const [projectionRotation, setProjectionRotation] = useState<
    [number, number, number]
  >(initialProjectionRotation);

  const handleScaling = useCallback(
    (direction: "in" | "out") => {
      let newScale = projectionScale;

      switch (direction) {
        case "in":
          newScale += scaleIncrement;
          break;
        case "out":
          newScale -= scaleIncrement;
          break;
        default:
          break;
      }

      newScale = Math.max(minScaleValue, Math.min(maxScaleValue, newScale));

      setProjectionScale(newScale);
    },
    [maxScaleValue, minScaleValue, projectionScale, scaleIncrement],
  );

  const handleRotation = useCallback(
    (direction: "right" | "left" | "up" | "down") => {
      let newRotation = [...projectionRotation] as [number, number, number];

      switch (direction) {
        case "right":
          newRotation[0] += rotationIncrement;
          break;
        case "left":
          newRotation[0] -= rotationIncrement;
          break;
        case "up":
          newRotation[1] += rotationIncrement;
          break;
        case "down":
          newRotation[1] -= rotationIncrement;
          break;
        default:
          break;
      }

      setProjectionRotation(newRotation);
    },
    [projectionRotation, rotationIncrement],
  );

  const handleReset = useCallback(() => {
    setProjectionScale(initialProjectionScale);
    setProjectionRotation(initialProjectionRotation);
  }, [initialProjectionRotation, initialProjectionScale]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          handleRotation("left");
          break;
        case "ArrowRight":
          handleRotation("right");
          break;
        case "ArrowUp":
          handleRotation("up");
          break;
        case "ArrowDown":
          handleRotation("down");
          break;
        case "+":
          handleScaling("in");
          break;
        case "-":
          handleScaling("out");
          break;
        case "Escape":
          handleReset();
          break;
        default:
          break;
      }
    },
    [handleReset, handleRotation, handleScaling],
  );

  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isZoomingIn, setIsZoomingIn] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [previousTouchPosition, setPreviousTouchPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(
    null,
  );

  function handleMouseDown(event: React.MouseEvent) {
    setIsGrabbing(true);
    setPreviousMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (isGrabbing) {
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      const newRotation = [
        projectionRotation[0] + deltaX,
        projectionRotation[1] - deltaY,
        projectionRotation[2],
      ] as [number, number, number];

      setProjectionRotation(newRotation);
      setPreviousMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function handleMouseUp() {
    setIsGrabbing(false);
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 1) {
      setIsGrabbing(true);

      const touch = event.touches[0];

      setPreviousTouchPosition({ x: touch.clientX, y: touch.clientY });
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const initialDistance = Math.sqrt(
        (touch2.clientX - touch1.clientX) ** 2 +
          (touch2.clientY - touch1.clientY) ** 2,
      );

      setTouchStartDistance(initialDistance);
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (isGrabbing && event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - (previousTouchPosition?.x || 0);
      const deltaY = touch.clientY - (previousTouchPosition?.y || 0);

      const newRotation = [
        projectionRotation[0] + deltaX,
        projectionRotation[1] - deltaY,
        projectionRotation[2],
      ] as [number, number, number];

      setProjectionRotation(newRotation);
      setPreviousTouchPosition({ x: touch.clientX, y: touch.clientY });
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const currentDistance = Math.sqrt(
        (touch2.clientX - touch1.clientX) ** 2 +
          (touch2.clientY - touch1.clientY) ** 2,
      );

      if (touchStartDistance !== null) {
        const distanceChange = currentDistance - touchStartDistance;
        const newScale = projectionScale + distanceChange * scaleFactor;

        setProjectionScale(
          Math.max(minScaleValue, Math.min(maxScaleValue, newScale)),
        );
      }
    }
  }

  function handleTouchEnd() {
    setIsGrabbing(false);
    setTouchStartDistance(null);
  }

  function handleMouseWheel(event: React.WheelEvent) {
    const delta = event.deltaY;

    if (delta > 0) {
      setIsZoomingOut(true);
      setIsZoomingIn(false);
    } else if (delta < 0) {
      setIsZoomingOut(false);
      setIsZoomingIn(true);
    }

    const newScale = projectionScale - delta * scaleFactor;
    setProjectionScale(
      Math.max(minScaleValue, Math.min(maxScaleValue, newScale)),
    );

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    const timeoutId = setTimeout(() => {
      setIsZoomingIn(false);
      setIsZoomingOut(false);
    }, 200);

    setScrollTimeout(timeoutId);
  }

  return {
    projectionScale,
    projectionRotation,
    isGrabbing,
    isZoomingIn,
    isZoomingOut,
    handleRotation,
    handleScaling,
    handleReset,
    handleKeyPress,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
