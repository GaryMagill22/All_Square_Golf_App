import './tailwind.css';
import App from './App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
    <App />
);



// Old way
// ============================
// import './tailwind.css';
// import React, { StrictMode } from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';





// ReactDOM.render(
//   <App />,
//   document.querySelector('#root')
// );