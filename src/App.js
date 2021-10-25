import logo from './logo.svg';
import './App.css';
import {
BrowserRouter as Router,
Switch,
Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null);
    }, 3000);
  }
return (
<div>
  <NoteState>
    <Router>
      <Navbar />
      <Alert alert={alert} />
        <Switch>
          <Route path="/" exact={true}>
            <Home showAlert={showAlert} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login showAlert={showAlert} />
          </Route>
          <Route path="/signup">
            <Signup showAlert={showAlert} />
          </Route>
        </Switch>
    </Router>
  </NoteState>
</div>
);
}

export default App;