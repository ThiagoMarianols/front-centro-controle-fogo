import { Outlet } from 'react-router-dom';
import '@mantine/core/styles.css';
import { NavBar2 } from './components/NavBar';
import './styles/App.css';



function App() {
  return (
    <div className="App">
      <div className='navbar'>
        <NavBar2 />
      </div>
      <div className="mainContent">
        <Outlet />
      </div>
    </div>
  )
}

export default App