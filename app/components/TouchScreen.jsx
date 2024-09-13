// components/TouchScreen.js
"use client"; // используем для того, чтобы компонент работал на стороне клиента

import useTouchTracking from "@/hooks/useTouchTracker";

export default function TouchScreen({setLocalClicks}) {
  const { touchInfo, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchTracking(setLocalClicks);


  return (
    <div className="p-4 text-white">
        <h3 className="text-xl font-bold mb-2">Информация о касаниях:</h3>
        <p className="mb-2">
          <strong>Количество касаний:</strong> {touchInfo.touches}
        </p>
        <p className="mb-4">
          <strong>Общее количество нажатий:</strong> {touchInfo.touchCount}
        </p>
      <div
        className="w-full h-96 bg-gray-200 border-2 border-gray-300 flex justify-center items-center mb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <p className="text-center">Нажмите на эту область</p>
      </div>

      <div>
        {touchInfo.touchPoints.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Координаты касаний:</h4>
            <ul>
              {touchInfo.touchPoints.map((touch, index) => (
                <li key={touch.identifier} className="mb-1">
                  Палец {index + 1}: X: {touch.clientX}, Y: {touch.clientY}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}