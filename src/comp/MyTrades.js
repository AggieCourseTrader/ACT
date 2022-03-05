import React, { useState } from 'react';

function MyTrades() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);


  // ALl javascript, functiosn, or fetchs to db will be up here


  return (
    <div>
      <p>You mytrades {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default MyTrades;