import { useEffect, useState } from 'react'
import { useLoader } from '../hooks/useLoader'

function About() {
  const { setLoading } = useLoader()

  useEffect(() => {
    // setLoading(false)
  }, [])

  return (
    <div className='about'>
      about
    </div>
  )
}

export default About
