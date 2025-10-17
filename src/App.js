import React from 'react';
import Films from './Films';

function App() {
  const titleStyle = {
    textAlign: 'center',
    color: 'black',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
    padding: '30px 0 20px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  return (
    <div>
      <h1 style={titleStyle}>Gestion de Films</h1>
      <Films />
    </div>
  );
}

export default App;