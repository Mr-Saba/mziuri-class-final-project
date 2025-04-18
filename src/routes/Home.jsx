// routes/Home.jsx
import { useEffect, useState } from "react"
import { useLoader } from "../hooks/useLoader"

function Home() {
  const { useDataLoader } = useLoader()
  const [data, setData] = useState(null)

  useEffect(() => {
    useDataLoader(() => fetch('https://jsonplaceholder.typicode.com/todos/1')).then((data) => {
      setData(data)
    })
  }, [])

  return <div>🏠 Welcome to Home {data && `- ${data.title}`}</div>
}

export default Home
