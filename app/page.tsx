'use client';

import TelegramAuth from "@/app/components/TelegramAuth.jsx";

export default function Home() {
  

  return(
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black m-0 p-0">
      <>home</>
      <TelegramAuth/>
    </main>
  )
}


// export default function Home() {

//   const [userData,setUserDara] = useState<UserDara | null>(null);

//   useEffect(()=> {
//     if(WebApp.initDataUnsafe.user){
//       setUserDara(WebApp.initDataUnsafe.user as UserDara)
//     }

//   },[])

//   return (
//    <main className="p-4">
//     {
//       userData ? 
//       (
//         <>
//         <h1 className="text-2xl font-bold mb-4"> User Data</h1>
//         <ul>
//           <li>ID: {userData.id}</li>
//           <li>First Name: {userData.first_name}</li>
//           <li>Second Name: {userData.last_name}</li>
//           <li>Username: {userData.username}</li>
//           <li>Language code: {userData.language_code}</li>
//           <li>Is premium: {userData.is_premium ? 'Yes' : 'No'}</li>

//         </ul>
//         </>
//       ) :
//       (
//         <div>
//           loading ...
//         </div>
//       )
//     }
//    </main>
//   );
// }
