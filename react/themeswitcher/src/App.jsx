
import { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider } from './Context/ThemeContext'
import Button from './Components/Button';
import Card from './Components/Card';

function App(){
  const [thememode , setThememode] = useState("light");
  
  function darkTheme(){
    setThememode("dark");
  }

  function lightTheme(){
    setThememode("light");
  }
  
  useEffect(()=>{
  document.querySelector('html').classList.remove("dark" , "light");
  document.querySelector('html').classList.add(thememode);
  } , [thememode])

  return (
    <ThemeProvider value={{thememode , darkTheme , lightTheme}}>
    <div className="flex flex-wrap min-h-screen items-center">
          <div className="w-full">
              <div className="w-full max-w-sm mx-auto flex justify-end mb-4">
                  <Button/>
              </div>

              <div className="w-full max-w-sm mx-auto">
                  <Card/>
              </div>
          </div>
      </div>        
    </ThemeProvider>
  )
}

export default App;
