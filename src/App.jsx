import { useEffect, useState } from 'react'
import './styles/main.scss'
import Header from './layouts/Header'
import Footer from './layouts/Footer'
import Main from './layouts/Main'
import { Route, Routes, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import About from './routes/About'
import Home from './routes/Home'
import Contact from './routes/Contact'

function App() {

  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className='app'>
      <Header />
        <Main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
        </Main>
      <Footer />
    </div>
  )
}

export default App
