// routes/Home.jsx
import { useEffect, useState } from "react"
import { useLoader } from "../hooks/useLoader"

function Home() {
  const { useSmartLoader } = useLoader()
  const [data, setData] = useState(null)

  useEffect(() => {
    useSmartLoader(() =>
      fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(res => res.json())
    ).then(setData)
  }, [])

  return <div>🏠 Welcome to Home {data && `- ${data.title}`}</div>
}

export default Home
