import { createContext, useState, useContext, useEffect } from "react"
import { useLocation } from "react-router-dom"

const LoaderContext = createContext()

export const useLoader = () => useContext(LoaderContext)

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const loadingDelay = 300

  // hook: useDataLoader (for routes that fetch data)
  const useDataLoader = async (fetchReq) => {
    setLoading(true)

    const delayPromise = new Promise((resolve) => setTimeout(resolve, loadingDelay))
    const dataPromise = fetchReq()

    const [data] = await Promise.all([dataPromise, delayPromise])

    setLoading(false)

    return data.json()
  }

  // hook: useFakeLoader (for routes that simulate loading without fetch)
  const useFakeLoader = () => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
      clearTimeout(timer)
    }, loadingDelay)
  }

  return (
    <LoaderContext.Provider value={{ loading, setLoading, useDataLoader, useFakeLoader }}>
      {children}
    </LoaderContext.Provider>
  )
}
