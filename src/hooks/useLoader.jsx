import { createContext, useState, useContext, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

const LoaderContext = createContext()

export const useLoader = () => useContext(LoaderContext)

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  // const [isSmartLoaderNeeded, setIsSmartLoaderNeeded] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const timer = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [location.pathname])


  const useSmartLoader = async (asyncFn) => {
    setLoading(true)
  
    const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000))
    const dataPromise = asyncFn()
  
    const [data] = await Promise.all([dataPromise, delayPromise]).then(()=>{
      setLoading(false)
    })
    
    return data
  }

  return (
    <LoaderContext.Provider value={{ loading, setLoading, useSmartLoader }}>
      {children}
    </LoaderContext.Provider>
  )
}
