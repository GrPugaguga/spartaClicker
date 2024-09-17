'use client';

import { UserData } from './../../types';

interface BackPackProps {
  userData: UserData;
  setActiveWeapon: (weapon: string) => void;
}

export default function BackPack({ userData, setActiveWeapon }: BackPackProps) {
  return (
    <div className="overflow-y-auto h-64 w-full max-w-md mb-[50px]">
      <div className="grid grid-cols-4 gap-4">
        {userData.backPack && userData.backPack.length > 0 ? (
          userData.backPack.map((item, index) => (
            <div
              onDoubleClick={() => setActiveWeapon(item)}
              key={index}
              className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center"
            >
              <img src={`/images/weapon/${item}.jpg`} alt="" className="object-contain w-full h-full" />
            </div>
          ))
        ) : (
          <span className="text-gray-500 col-span-3">Your backpack is empty</span>
        )}

        {/* Render remaining empty cells */}
        {[...Array(12 - (userData.backPack ? userData.backPack.length : 0))].map((_, i) => (
          <div
            key={i + (userData.backPack ? userData.backPack.length : 0)}
            className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center"
          ></div>
        ))}
      </div>
    </div>
  );
}
