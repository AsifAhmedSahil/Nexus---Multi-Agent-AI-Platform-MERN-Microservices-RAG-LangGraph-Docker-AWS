import { signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth'
import { useEffect } from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import { getCurrentUser } from './features/getCurrentUser'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'


const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log(user);
        dispatch(setUserData(user))
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, []);

 
  return (
    <>
    <Home/>
    </>
  )
}

export default App
