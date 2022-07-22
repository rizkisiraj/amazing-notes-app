import { createContext, useEffect, useState } from "react";
import { onAuthStateChangeListener, setUserObject } from "../utils/firebase/firebase";

export const userContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
    userData: null,
    setUserData: () => null
})

export const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const value = { currentUser,setCurrentUser, userData, setUserData }

    useEffect(() => {
        const unsubscribe = onAuthStateChangeListener(user => {
            if(user) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
                setUserData(null)
            }
        })

        return unsubscribe;
    },[])
    
    useEffect(() => {
        const settingUser = async () => {
            if(currentUser && !userData) {
                const userCred = await setUserObject(currentUser);
                setUserData(userCred)
            }
        }

        settingUser()
    },[currentUser, userData])

    return <userContext.Provider value={value}>{children}</userContext.Provider>
}