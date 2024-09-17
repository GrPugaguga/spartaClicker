'use client';

interface MarketProps {
  market: Array<{
    name: string;
    price: number;
    lvlBosses: number;
    damage: number;
  }> | null;
  setItem: (item: any) => void; // Adjust `any` as per your app logic
}

export default function Market({ market, setItem }: MarketProps) {
  return (
    <div className="overflow-y-auto h-64 w-full max-w-md mb-[50px]">
      <div className="grid grid-cols-4 gap-4">
        {market && market.length > 0 ? (
          market.map((item, index) => (
            <div
              onClick={() => setItem(item)}
              key={index}
              className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center"
            >
              <img src={`/images/weapon/${item.name}.jpg`} alt="" className="object-contain w-full h-full" />
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
