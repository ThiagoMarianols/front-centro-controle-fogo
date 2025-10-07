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
import { CadastroUsuario} from './pages/cadastros/RegUser.tsx'
import Users from './pages/Users/Users.tsx'
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
      {
        path: '/home',
        element: <Home />,
      },	
      {
        path: '/registroOcorrencia',
        element: <RegistroOcorrencia />,
      },
      {
        path: 'CadastroUsuario',
        element: <CadastroUsuario />,
      },
      {
        path: 'Users',
        element: <Users />,
      },
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
