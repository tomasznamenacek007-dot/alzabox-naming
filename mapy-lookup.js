import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{fontFamily:'Arial', padding:'40px'}}>
      <h1>Generátor názvů boxů</h1>
      <p>Aplikace běží správně 🙂</p>
      <input placeholder="Sem přijde GPS" style={{padding:'10px', width:'300px'}} />
      <button style={{marginLeft:'10px', padding:'10px'}}>Generovat název</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
