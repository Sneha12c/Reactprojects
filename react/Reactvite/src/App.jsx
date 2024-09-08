import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/Card';

function App() {
  const [counter , setCounter ] = useState(13);

  function addvalue(){
    if(counter==20)
      return;
    setCounter(counter+1);
  }

  function decval(){
    if(counter==0)
    return;
    setCounter(counter-1);
  }
  let myobj = { username: "golu" , age : 34};
  let myarr = [1 , 2, 8];

  return (
    <> 
      <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
      {/* <h1>Hello react</h1>
      <h2>Counter Value is {counter}</h2>
      <button onClick={addvalue}>Add Value : {counter}</button>
      <br/>
      <button onClick={decval}>Decrease Value : {counter} </button> */}
      <Card channel = "hellopeople" newabj={myobj} newarr = {myarr} />
    </>
  )
}

export default App
