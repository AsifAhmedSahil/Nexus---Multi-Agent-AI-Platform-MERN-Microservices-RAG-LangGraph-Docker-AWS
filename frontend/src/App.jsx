import { signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth'
import { useEffect } from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'

const App = () => {

  const handleLogin = async (token) => {
    try {
      console.log("calling...")
      const { data } = await api.post("/auth/login", { token })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   getRedirectResult(auth).then(async (result) => {
  //     if (result) {
  //       const token = await result.user.getIdToken()
  //       console.log("Firebase Token:", token)
  //       await handleLogin(token)
  //       console.log(result)
  //     }
  //   }).catch((err) => {
  //     console.error(err)
  //   })
  // }, [])

  const googleLogin =async () => {
    // signInWithRedirect(auth, googleProvider)
    const data = await signInWithPopup(auth,googleProvider)
    const token = await data.user.getIdToken()
    console.log(token)

    await handleLogin(token)
    console.log(data)
  }

  return (
    <div className='w-full h-screen bg-black flex items-center justify-center'>
      <button className='w-50 h-24 bg-white' onClick={googleLogin}>
        continue with Google
      </button>
    </div>
  )
}

export default App
