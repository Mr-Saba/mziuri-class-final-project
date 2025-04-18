import { useEffect, useState } from 'react'
import { useLoader } from '../hooks/useLoader'

function About() {

  const { useFakeLoader } = useLoader()

  useEffect(() => useFakeLoader(), [])

  return (
    <div className='about'>
      about
    </div>
  )
}

export default About
