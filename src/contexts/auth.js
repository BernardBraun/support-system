import { createContext, useState, useEffect } from "react";
import firebase from '../services/firebaseConnection'

import {toast} from 'react-toastify'

export const AuthContext = createContext({});

function AuthProvider({children}){
    
    const [user,setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        function loadStorage(){
            
            const storageUser = localStorage.getItem('SystemUser');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoadingAuth(false);
            }
            setLoading(false);
        }
        loadStorage();
    },[])

    //Login do usuário
    async function signIn(email, senha){
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(async(value)=>{
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                email: value.user.email,
                avatarUrl: userProfile.data().avatarUrl,
            };
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem-vindo de volta!')
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops... Algo deu errado!')
            setLoadingAuth(false);
        })

    }

    //Criando conta do usuário
    async function signUp(email, senha, nome){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email,senha)
        .then(async(value)=>{
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome:nome,
                email: email,
                avatarUrl:null,
            })
            .then(()=>{
                let data ={
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                };
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem-vindo a plataforma!')
            })
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops! Algo deu errado!');
            setLoadingAuth(false);
        })

    }
    
    function storageUser(data){
        localStorage.setItem('SystemUser', JSON.stringify(data))
    }

    //Logout do usuário
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SystemUser');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
        value={{ 
            signed: !!user,
            user,
            loading,
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser
               }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;