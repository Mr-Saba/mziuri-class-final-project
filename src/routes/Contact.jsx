import { useEffect, useState } from 'react'
import { useLoader } from '../hooks/useLoader'

function Contact() {

  const { useFakeLoader } = useLoader()

  useEffect(() => useFakeLoader(), [])
  
  return (
    <div className='contact'>
      contact
    </div>
  )
}

export default Contact
