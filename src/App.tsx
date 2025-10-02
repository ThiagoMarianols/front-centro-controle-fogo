import { Outlet } from 'react-router-dom';
import '@mantine/core/styles.css';
import { NavBar2 } from './components/NavBar2';



function App() {
  return (
    <div className="App">
      <NavBar2 />
      <Outlet />
    </div>
  )
}

export default App
