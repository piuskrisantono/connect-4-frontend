import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './common-components/Header/Header';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';

export default function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Register />} />
            <Route exact path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}
