import { signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth'
import { useEffect } from 'react'
import api from '../../utils/axios'
import { auth, googleProvider } from '../../utils/firebase'
import {FcGoogle} from "react-icons/fc"
import { useDispatch, useSelector } from 'react-redux'

import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import Artifact from '../components/Artifact'
import { setUserData } from '../redux/userSlice'


const Home = () => {

    const {userData} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    

     const handleLogin = async (token) => {
    try {
      console.log("calling...")
      const { data } = await api.post("/api/auth/login", { token })
      dispatch(setUserData(data))
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
    <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>

      <Sidebar/>
      <ChatArea/>
      <Artifact/>

        {
            !userData &&

            <div className='fixed  inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>

      <div className='w-[340px] bg-[#13151c] border border-whit/[0.08] rounded-2xl p-7 flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to Nexus AI</h2>
        <p className='text-[13px] text-slate-500'>Please login to continue using the app.</p>


      </div>

      <button className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 transition-all duration-150 cursor-pointer" 
      onClick={googleLogin}
      >
        <FcGoogle size={15} />
        Continue With Google

      </button>

      </div>

      </div>
        }

      
    </div>
  )
}

export default Home
