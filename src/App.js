import './App.css';
import MyTrades from  './comp/trades/MyTrades';
import Marketplace from './comp/marketplace/Marketplace';
import Login from './comp/global/authentication/Login';
import Terms from './comp/global/authentication/Terms';
import PageNotFound from './comp/global/PageNotFound';
import Messages from './comp/messages/Messages';
import { BrowserRouter, Routes, Route,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, {useState} from 'react';
import {theme} from './assets/theme';
import {ThemeProvider } from '@mui/material/styles';
import {TermsProvider} from './comp/global/authentication/TermsContext'


function App() {
  const [termContext, setTermContext] = useState(null)

  return (
    <TermsProvider value={{termContext,setTermContext}}>
      <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/marketplace" element={<Marketplace />} />
          <Route exact path="/my-trades" element={<MyTrades />}/>
          <Route exact path="/messages" element={<Messages />}/>
          <Route exact path="/terms-service" element={<Terms />}/>
          <Route exact path="/" element={<Login />}/>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </TermsProvider>
  );
}

export default App;
