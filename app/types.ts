// types.ts

export interface UserData {
    backPack: string[];
    clicks: number;
    damage: string;
    lvlBosses: number;
    uid: number;
    username: string;
    weapon: string;
  }
    
  export interface ItemData {
    name: string;
    price: number | string;
    lvlBosses: number | string;
    damage: number | string
  }