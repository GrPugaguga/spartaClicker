import { useEffect, useState } from "react";

function useTouchTracking(setter) {
    
  const [touchInfo, setTouchInfo] = useState({
    touches: 0,
    touchPoints: [],
    touchCount: 0,
    activeTouches: new Set(),
  });

  useEffect(() => {
    if(touchInfo.touches < 1)  return
    setter(prevClicks => prevClicks + touchInfo.touches)
    setTouchInfo(
        {
            touches: 0,
            touchPoints: [],
            touchCount: 0,
            activeTouches: new Set(),
          }
    )
  }, [touchInfo])


  const handleTouchStart = (e) => {
    const newActiveTouches = new Set(touchInfo.activeTouches);

    Array.from(e.touches).forEach((touch) => {
      newActiveTouches.add(touch.identifier);
    });

    setTouchInfo((prevInfo) => ({
      touches: e.touches.length,
      touchPoints: Array.from(e.touches).map((touch) => ({
        clientX: touch.clientX,
        clientY: touch.clientY,
        identifier: touch.identifier,
      })),
      touchCount:
        prevInfo.touchCount +
        newActiveTouches.size -
        prevInfo.activeTouches.size,
      activeTouches: newActiveTouches,
    }));
  };

  const handleTouchMove = (e) => {
    setTouchInfo((prevInfo) => ({
      touches: e.touches.length,
      touchPoints: Array.from(e.touches).map((touch) => ({
        clientX: touch.clientX,
        clientY: touch.clientY,
        identifier: touch.identifier,
      })),
      touchCount: prevInfo.touchCount,
      activeTouches: prevInfo.activeTouches,
    }));
  };

  const handleTouchEnd = (e) => {
    const remainingTouches = new Set(touchInfo.activeTouches);

    Array.from(e.changedTouches).forEach((touch) => {
      remainingTouches.delete(touch.identifier);
    });

    setTouchInfo((prevInfo) => ({
      touches: e.touches.length,
      touchPoints: [],
      touchCount: prevInfo.touchCount,
      activeTouches: remainingTouches,
    }));
  };

  return { touchInfo, handleTouchStart, handleTouchMove, handleTouchEnd };
}

export default useTouchTracking;