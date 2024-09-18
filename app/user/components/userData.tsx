'use client';

import { UserData as UserType } from './../../types';

interface UserDataProps {
  userData: UserType;
  activeWeapon: string | null;
  setActiveWeapon: (weapon: string) => void;
}

export default function UserData({ userData, activeWeapon, setActiveWeapon }: UserDataProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-roman-wood border-2 border-roman-gold rounded-md">
      <div className="text-xl font-bold text-roman-gold mb-4">{userData.username || 'Loading...'}</div>
      <div className="flex flex-col gap-2 text-left text-roman-gold">
        <span className="text-lg">
          Lvl: <span className="text-roman-red">{userData.lvlBosses || 0}</span>
        </span>
        <span className="text-lg">
          Gold: <span className="text-roman-red">{userData.clicks || 0}</span>
        </span>
        <span className="text-lg">
          Damage: <span className="text-roman-red">{userData.damage || 0}</span>
        </span>
      </div>
      <div
        className="cell bg-roman-black border-2 border-roman-gold rounded-lg h-24 w-24 flex justify-center items-center"
        onDoubleClick={() => setActiveWeapon('none')}
      >
        {activeWeapon ? (
          <div className="cell bg-roman-black border-2 border-roman-gold rounded-lg h-24 w-24 flex justify-center items-center overflow-hidden">
            <img src={`/images/weapon/${activeWeapon}.jpg`} alt="" className="object-contain w-full h-full" />
          </div>
        ) : (
          <span className="text-roman-gold">None</span>
        )}
      </div>
    </div>
  );
}
