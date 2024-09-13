'use client'
export default async function ProtectedPage() {


    const getUserData = async () => {
        const WebApp = (await import('@twa-dev/sdk')).default 
        WebApp.ready()
        const initData = WebApp.initData

        if(initData){
            try{
                const res = await fetch('/api/user', {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({initData})
                })
                console.log(res)
            } catch( error) {
                console.error("Error during authentication: " , error)
            }
        }
    }


    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
            <p className="text-xl">Welcome to the protected page </p>
            <button
                        onClick={() => getUserData()}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Authenticate                
                    </button>
        </div>
    )
}