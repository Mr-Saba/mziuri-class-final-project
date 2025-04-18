import React from 'react'

function Loading({loading}) {
  return (
    <div className={`loadingContainer ${!loading ? 'fade-out' : ''}`}>
      <div className='half'></div>
      <div className='half'></div>
      <span className="spinner"></span>
    </div>
  )
}

export default Loading