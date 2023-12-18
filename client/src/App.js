import logo from './logo.svg';
import './App.css';
import Login from './login';
import todos from './todos';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
          <Route exact path='/' element={<Login/>}>
          </Route>
          <Route path='/todos' element= {<todos/>}></Route>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
