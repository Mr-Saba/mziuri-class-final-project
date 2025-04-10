import { useEffect, useState } from 'react'
import { useLoader } from '../context/LoaderContext'

function About() {
  const { setLoading } = useLoader()

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className='about'>
      about
    </div>
  )
}

export default About
