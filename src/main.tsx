import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'

//rotas
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import {RegistroOcorrencia} from './pages/RegistroOcorrencia.tsx'
import { CadastroUsuario} from './pages/administracao/RegUser.tsx'
import Users from './pages/administracao/Users.tsx'
import RPA from './pages/administracao/RPA.tsx'
import TipoOcorrencia from './pages/administracao/TipoOcorrencia.tsx'
import Relatorios from './pages/Relatorios.tsx'

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
      { path: '/home', element: <Home /> },
      { path: '/registroOcorrencia', element: <RegistroOcorrencia /> },
      { path: 'administracao/RPA', element: <RPA /> },
      { path: 'administracao/CadastroUsuario', element: <CadastroUsuario /> },
      { path: 'administracao/Users', element: <Users /> },
      { path: 'administracao/TipoOcorrencia', element: <TipoOcorrencia /> },
      { path: 'administracao/Relatorios', element: <Relatorios /> },
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
