import { useEffect, useState } from 'react'

function Home() {
  const [state, setState] = useState()

  useEffect(() => {

    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(data => setState(data))

  }, [])

  return (
    <div className='home'>
      todo - {state?.id}
    </div>
  )
}

export default Home
