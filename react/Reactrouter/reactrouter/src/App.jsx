
import './App.css';
import { Route , Routes } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/Footer/footer';
import Home from './components/Home/Home';
import About from './components/About/about';
import Contact from './components/Contact/Contact';
import User from './components/User/User';

const App = () => {
  return (
     <> 
        <Header/>
        <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/about" element={<About/>} />
           <Route path="/contact" element={<Contact/>} />
           <Route path="/user/:userid" element={ <User/>}/>
        </Routes>
        <Footer/>
     </>
  );
};

export default App;

