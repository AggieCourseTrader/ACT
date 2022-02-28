import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../firebase-config'


function EditTrades() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  let navigate = useNavigate();
 useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
       const uid = user.uid;
    } else {
      navigate("/")
    }
   });

  }, [])


  return (
    <div>
      <p>You clieditrades cked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default EditTrades;