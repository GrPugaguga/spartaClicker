const getItemDamage = (weapon:string): number => {
    switch(weapon){
        case 'knife':
            return 4;
        case 'axe':
            return 11
        case 'bigSword':
            return 64
        case 'none':
            return 1
        case 'oldSword':
            return 7
        case 'undefined':
            return 9999
        case 'legendaryToothpick':
            return 21
        default:
            return 0; // или другое подходящее значение по умолчанию
    }
}

export default getItemDamage;
