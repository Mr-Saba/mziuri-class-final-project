import { useState } from 'react'
import './styles/main.scss'
import Header from './layouts/Header'
import Footer from './layouts/Footer'
import Main from './layouts/Main'

function App() {

  return (
    <div className='app'>
      <Header />
        <Main>
          dasdas
          <LuSearch />
        </Main>
      <Footer />
    </div>
  )
}

export default App
