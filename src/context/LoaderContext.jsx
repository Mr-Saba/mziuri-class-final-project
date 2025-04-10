import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom'

const LoaderContext = createContext() 

const useLoader = () => useContext(LoaderContext)

const LoaderProvider = ({children}) => {
    const [loading, setLoading] = useState(false)

    const location = useLocation()
    useEffect(() => {
      setLoading(true)
    }, [location.pathname])

    return (
        <LoaderContext.Provider value={{loading, setLoading}}>
            {children}
        </LoaderContext.Provider>
    )
}

export {LoaderProvider, useLoader}