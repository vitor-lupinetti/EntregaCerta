import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastProvider, useToasts } from 'react-toast-notifications';

import Home from './pages/Home/Home';
import Routes from './routes';
import Header from './pages/Header/Header';

function App() {
  return (
    <ToastProvider>
       <div className="App">
        <Header></Header>
        <Routes></Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
