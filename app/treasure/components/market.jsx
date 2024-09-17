'use client';


export default function Market({market,setItem}) {
  console.log(market)
  return (
    <div className="overflow-y-auto h-64 w-full max-w-md mb-[50px]"> {/* Adjust h-96 as needed */}
      <div className="grid grid-cols-4 gap-4">

      {market && market.length > 0 ? (
          market.map((item, index) => (
            <div
            onClick={() => setItem(item)}
              key={index}
              className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center"
            >
                <img src={`/images/weapon/${item.name}.jpg`} alt="" className="object-contain w-full h-full"/>
            </div>
          ))
        ) : (
          <></>
        )}
        
        {/* {[...Array(12-(market ? market.length : 0))].map((_, i) => (
          <div
            key={i+ (market ? market.length : 0)}
            className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center"
          ></div>
        ))} */}
      </div>
    </div>
  );
}
