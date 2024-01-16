import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Register from './components/Register/Register';

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
