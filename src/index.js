import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebase, FieldValue } from './lib/firebase';
import './styles/app.css'

ReactDOM.render(
  <FirebaseContext.Provider value={{firebase, FieldValue}}>
    <App />
  </FirebaseContext.Provider>,
document.getElementById('root'));


// client side rendered app: react (cra)
  // -> db : firebase
  // -> react-loading-skeleton
  // tailwind


// architecture
  // src 
    // -> components, 
    // -> constants, 
    // -> context, 
    // -> helpers, 
    // -> hooks,
    // -> pages,
    // -> lib (firebase is going to live in here)
    // -> services(firebase functions in here)
    // -> styles (talwinds's folder app/tailwind)