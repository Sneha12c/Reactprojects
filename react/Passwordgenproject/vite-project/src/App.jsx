import { useEffect, useRef, useState } from 'react'
import './App.css';
import { useCallback } from 'react';

function App() {
  const [ length , setLength] = useState(8);
  const [numallow , setNumallow ] = useState(false);
  const [charallow , setCharallow ] = useState(false);
  
  const [Password , setPassword] = useState("");
  
  const Passwordref = useRef(null);
  
  const copypasswordtoclipboard = useCallback(()=>{
   Passwordref.current?.select();
   Passwordref.current?.setSelectionRange(0 , 56);
   window.navigator.clipboard.writeText(Password);
  } , [Password])

  const passwordgenerator = useCallback(()=>{
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if(numallow) str += "0123456789";
    if(charallow) str += "!@#$%^&*(){}[]~`+-"
    for(let i=0; i<length; i++){
    let char = Math.floor(Math.random()*str.length + 1);
    pass += str.charAt(char);
    }   
    setPassword(pass)

  } , [length , numallow , charallow , setPassword]);

  useEffect(()=>{
   passwordgenerator();
  } , [length , numallow , charallow , passwordgenerator])

  return (
    <>
      <div className='w-full  mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500'>
        <h1 className='text-white text-center my-3'>Password Generator</h1>
        <div className='flex shadow rounded-md overflow-hidden mb-4'>
          <input type="text" value={Password} className='outline-none w-full py-1 px-3' 
          placeholder='password' ref={Passwordref}
          readOnly />
          <button onClick={copypasswordtoclipboard} 
          className='outline-none text-white-200 bg-blue-400 px-3 py-0.3 shrink-0'>Copy</button>
        </div>
        <div className='flex text-sm gap-x-2'>
      <div className='flex items-center gap-x-1'>
        <input 
        type="range"
        min={6}
        max={100}
        value={length}
         className='cursor-pointer'
         onChange={(e) => {setLength(e.target.value)}}
          />
          <label>Length: {length}</label>
      </div>
      <div className="flex items-center gap-x-1">
      <input
          type="checkbox"
          defaultChecked={numallow}
          id="numberInput"
          onChange={() => {
              setNumallow((prev) => !prev);
          }}
      />
      <label htmlFor="numberInput">Numbers</label>
      </div>
      <div className="flex items-center gap-x-1">
          <input
              type="checkbox"
              defaultChecked={charallow}
              id="characterInput"
              onChange={() => {
                  setCharallow((prev) => !prev )
              }}
          />
          <label htmlFor="characterInput">Characters</label>
      </div>
      </div>
      </div>
    </>
  )
}

export default App
