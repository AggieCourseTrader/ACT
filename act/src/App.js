import logo from './logo.svg';
import './App.css';
import Navbar from './comp/Navbar';
import EditTrades from'./comp/EditTrades';
import MyTrades from  './comp/MyTrades';
import Marketplace from './comp/Marketplace';
import Login from './comp/Login';
import { BrowserRouter, Routes, Route,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';

function App() {
  return (
    <BrowserRouter>

      <Navbar/>

      <Routes>
        <Route exact path="/" element={<Marketplace />}/>
        <Route exact path="/my-trades" element={<MyTrades />}/>
        <Route exact path="/edit-trades" element={<EditTrades />}/>
        <Route exact path="/login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
