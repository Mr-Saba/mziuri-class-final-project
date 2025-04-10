import { useEffect, useState } from 'react'
import './styles/main.scss'
import Header from './layouts/Header'
import Footer from './layouts/Footer'
import Main from './layouts/Main'
import { Route, Routes, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import About from './routes/About'
import Home from './routes/Home'
import Contact from './routes/Contact'
import Loading from './components/Loading'
import { useLoader } from './context/LoaderContext'

function App() {

  const { loading } = useLoader()

  return (
    <div className='app'>
      <Header />
      <Main>
        {loading ? <Loading /> : 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
        }
      </Main>
      <Footer />
    </div>
  )
}

export default App
