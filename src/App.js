import './App.css';
import EditTrades from'./comp/EditTrades';
import MyTrades from  './comp/MyTrades';
import Marketplace from './comp/Marketplace';
import Login from './comp/Login';
import PageNotFound from './comp/PageNotFound';
import { BrowserRouter, Routes, Route,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import {theme} from './assets/theme';
import {ThemeProvider } from '@mui/material/styles';


function App() {
  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route exact path="/marketplace" element={<Marketplace />} />
        <Route exact path="/my-trades" element={<MyTrades />}/>
        <Route exact path="/edit-trades" element={<EditTrades />}/>
        <Route exact path="/" element={<Login />}/>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
