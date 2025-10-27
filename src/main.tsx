import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'

//rotas
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import { CadastroUsuario} from './pages/administracao/UserReg.tsx'
import Users from './pages/administracao/Users.tsx'
import TipoOcorrencia from './pages/administracao/TipoOcorrencia.tsx'
import Relatorios from './pages/Relatorios.tsx'
import Batalhao from './pages/administracao/batalhao.tsx'
import Dashboard from './pages/dashboard.tsx'
import Ocorrencia from './pages/Ocorrencia.tsx'
import { RegistroOcorrencia } from './pages/RegistroOcorrencia.tsx'
import { RegistroBatalhao } from './pages/administracao/RegistroBatalhao.tsx'
//
//const router = createBrowserRouter([
//  {
//    path: '/',
//    element: <App />,
//  },
//  {
//    path: '/login',
//    element: <Login />,
//  },
//])
//
// fim de rotas


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'administracao/CadastroUsuario', element: <CadastroUsuario /> },
      { path: 'administracao/Users', element: <Users /> },
      { path: 'administracao/TipoOcorrencia', element: <TipoOcorrencia /> },
      { path: 'administracao/Relatorios', element: <Relatorios /> },
      { path: 'administracao/Batalhao', element: <Batalhao /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'Ocorrencia', element: <Ocorrencia /> },
      { path: 'RegistroOcorrencia', element: <RegistroOcorrencia /> },
      { path: 'administracao/RegistroBatalhao', element: <RegistroBatalhao /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
 
])



ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider >
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
)
