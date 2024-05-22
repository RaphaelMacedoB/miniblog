import { db } from "../firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth"

import { useState, useEffect  } from "react"

export const useAuthentication = () => {
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(null);

  // cleanup
  // deal with memory leak (vazamento de memória)

  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfIsCancelled(){
    if(cancelled){
      return;
    }
  }

  // register
  const createUser = async (data) => {
    checkIfIsCancelled();

    setLoading(true)
    setError(null);
  
    try{
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

        await updateProfile(user,{
          displayName: data.displayName
        })
        
        setLoading(false)
        return user 

    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);


      let systemErrorMessage

      if(error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres."
      } else if (error.message.includes("email-already  ")) {
        systemErrorMessage = "E-mail já cadastrado."
      }
      else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }
      
      setLoading(false)
      setError(systemErrorMessage);
    }
  };

  //logout
  const logout = () => {
    checkIfIsCancelled();
    signOut(auth)
  }

  // login - sign in
  const login = async(data) => {
    console.log(data);
    checkIfIsCancelled()
    setLoading(true)
    setError(false)

    try {
      await signInWithEmailAndPassword(auth,data.email, data.password)
      setLoading(false);
    } catch (error) {
      let systemErrorMessage
      console.log(error);
      if(error.message.includes("user-not-found") || error.message.includes("auth/invalid-credential")) {
        systemErrorMessage = "Usuário ou senha incorretos."
      }
      else if(error.message.includes("auth/too-many-requests")) {
        systemErrorMessage = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login malsucedidas. Você pode restaurá-lo imediatamente redefinindo sua senha ou tentar novamente mais tarde."
      }     
      else {
      systemErrorMessage = "Ocorreu um erro. Por favor, tente mais tarde."
      }
      setLoading(false);
      setError(systemErrorMessage);
    }
  }


  useEffect(() => {
    return () => setCancelled(true);
  }, [])
  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login
  };
}