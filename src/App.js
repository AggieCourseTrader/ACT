import './App.css';
import EditTrades from'./comp/trades/EditTrades';
import MyTrades from  './comp/trades/MyTrades';
import Marketplace from './comp/marketplace/Marketplace';
import Login from './comp/global/authentication/Login';
import PageNotFound from './comp/global/PageNotFound';
import Messages from './comp/messages/Messages';
import { BrowserRouter, Routes, Route,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { React, useState } from 'react';
import {theme} from './assets/theme';
import {ThemeProvider } from '@mui/material/styles';
import { UserDisconnectedEvent } from '@chatscope/use-chat';



function App() {
  const [userId, setUserId] = useState('');

  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route exact path="/marketplace" element={<Marketplace setUserId={setUserId}/>} />
        <Route exact path="/my-trades" element={<MyTrades />}/>
        <Route exact path="/edit-trades" element={<EditTrades />}/>
        <Route exact path="/messages" element={<Messages userId={userId}/>}/>
        <Route exact path="/" element={<Login setUserId={setUserId}/>}/>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
