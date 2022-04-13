import './App.css';
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
import { React} from 'react';
import {theme} from './assets/theme';
import {ThemeProvider } from '@mui/material/styles';

import { SnackbarProvider } from 'notistack';
import { ResponsiveProvider } from '@farfetch/react-context-responsive';

const breakpoints = {
  xs: "320px",
  sm: "576px",
  md: "960px",
  lg: "1280px",
  xl: "1800px"
};

const breakpointsMax = {
  xs: "319px",
  sm: "575px",
  md: "959px",
  lg: "1279px",
  xl: "1799px"
};


function App() {

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveProvider breakpoints={breakpoints} breakpointsMax={breakpointsMax}>
      <SnackbarProvider 
        maxSnack={10}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
          <BrowserRouter>
            <Routes>
              <Route exact path="/marketplace" element={<Marketplace />} />
              <Route exact path="/my-trades" element={<MyTrades />}/>
              <Route exact path="/messages" element={<Messages />}/>
              <Route exact path="/" element={<Login />}/>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
      </SnackbarProvider>
      </ResponsiveProvider>
    </ThemeProvider>
  );
}

export default App;
