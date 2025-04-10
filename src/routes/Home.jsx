import { useEffect, useState } from 'react'
import { useLoader } from '../context/LoaderContext'

function Home() {
  const [state, setState] = useState()
  const { setLoading } = useLoader()

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(data => {setState(data); setLoading(false);})
  }, [])

  return (
    <div className='home'>
      todo - {state?.id}
    </div>
  )
}

export default Home
