'use client';

import { UserData as UserType } from './../../types';

interface UserDataProps {
  userData: UserType;
  activeWeapon: string | null;
  setActiveWeapon: (weapon: string) => void;
}

export default function UserData({ userData, activeWeapon, setActiveWeapon }: UserDataProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-700 border border-gray-600 rounded-md">
      <div className="text-xl font-bold text-yellow-300 mb-4">{userData.username || 'Loading...'}</div>
      <div className="flex flex-col gap-2 text-left">
        <span className="text-lg">
          Lvl: <span className="text-yellow-400">{userData.lvlBosses || 0}</span>
        </span>
        <span className="text-lg">
          Gold: <span className="text-yellow-400">{userData.clicks || 0}</span>
        </span>
        <span className="text-lg">
          Damage: <span className="text-yellow-400">{userData.damage || 0}</span>
        </span>
      </div>
      <div
        className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center"
        onDoubleClick={() => setActiveWeapon('none')}
      >
        {activeWeapon ? (
          <img src={`/images/weapon/${activeWeapon}.jpg`} alt="" className="object-contain w-full h-full" />
        ) : (
          'None'
        )}
      </div>
    </div>
  );
}
