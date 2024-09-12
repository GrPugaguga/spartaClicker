import { getSession } from "@/app/utils/session";
import TelegramAuth from "@/app/components/TelegramAuth";


interface UserDara {
  id: number;
  first_name: string;
  last_name?:string;
  username: string;
  language_code:string;
  is_premium?: boolean;
}

export default async function Home() {
  const session = getSession()

  return(
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">JWT Authentication for telegram mini app</h1>
      <pre>{JSON.stringify(session,null,2)}</pre>
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
