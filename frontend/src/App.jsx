import { signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth'
import { useEffect } from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import { getCurrentUser } from './features/getCurrentUser'


const App = () => {

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log(user);
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
