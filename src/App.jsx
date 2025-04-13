import { useEffect, useState } from 'react'
import './styles/main.scss'
import Header from './layouts/Header'
import Footer from './layouts/Footer'
import Main from './layouts/Main'
import { Link, Route, Routes, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import About from './routes/About'
import Home from './routes/Home'
import Contact from './routes/Contact'
import Loading from './components/Loading'
import { useLoader } from './hooks/useLoader'

function App() {

  const { loading } = useLoader()

  return (
    <div className={`app ${loading ? 'fade-out' : 'fade-in'}`}>
      <Header />
      <Link to='/'>home</Link>
      <Link to='/about'>about</Link>
      <Link to='/contact'>contact</Link>
      <Main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Main>
      <Footer />
      {/* {loading && <Loading />} */}
    </div>
  )
}

export default App
