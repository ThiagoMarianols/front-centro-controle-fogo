import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
import { AuthProvider } from './context/authContext';

// PWA
import { registerSW } from 'virtual:pwa-register'

//rotas
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import { CadastroUsuario} from './pages/administracao/UserReg.tsx'
import Users from './pages/administracao/Users.tsx'
import EditarUsuario from './pages/administracao/EditarUsuario.tsx'
import { DetalhesUsuario } from './pages/administracao/DetalhesUsuario.tsx'
import Relatorios from './pages/Relatorios.tsx'
import Batalhao from './pages/administracao/batalhao.tsx'
import Dashboard from './pages/dashboard.tsx'
import Ocorrencia from './pages/Ocorrencia.tsx'
import { RegistroOcorrencia } from './pages/RegistroOcorrencia.tsx'
import EditarOcorrencia from './pages/EditarOcorrencia.tsx'
import { RegistroBatalhao } from './pages/administracao/RegistroBatalhao.tsx'
import EditarBatalhao from './pages/administracao/EditarBatalhao.tsx'
import Veiculo from './pages/administracao/Veiculo.tsx'
import { RegistroVeiculo } from './pages/administracao/RegistroVeiculo.tsx'
import EditarVeiculo from './pages/administracao/EditarVeiculo.tsx'
import { CadastroOcorrenciaSecun } from './pages/CadastroOcorrenciaSecun.tsx'
import { DetalhesOcorrencia } from './pages/DetalhesOcorrencia.tsx'
import { CompletarOcorrencia } from './pages/CompletarOcorrencia.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'administracao/CadastroUsuario', element: <ProtectedRoute><CadastroUsuario /></ProtectedRoute> },
      { path: 'administracao/Users', element: <ProtectedRoute><Users /></ProtectedRoute> },
      { path: 'administracao/EditarUsuario/:id', element: <ProtectedRoute><EditarUsuario /></ProtectedRoute> },
      { path: 'administracao/DetalhesUsuario/:id', element: <ProtectedRoute><DetalhesUsuario /></ProtectedRoute> },
      { path: 'administracao/Relatorios', element: <ProtectedRoute><Relatorios /></ProtectedRoute> },
      { path: 'administracao/Batalhao', element: <ProtectedRoute><Batalhao /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'Ocorrencia', element: <ProtectedRoute><Ocorrencia /></ProtectedRoute> },
      { path: 'DetalhesOcorrencia/:id', element: <ProtectedRoute><DetalhesOcorrencia /></ProtectedRoute> },
      { path: 'CompletarOcorrencia/:id', element: <ProtectedRoute><CompletarOcorrencia /></ProtectedRoute> },
      { path: 'RegistroOcorrencia', element: <ProtectedRoute><RegistroOcorrencia /></ProtectedRoute> },
      { path: 'EditarOcorrencia/:id', element: <ProtectedRoute><EditarOcorrencia /></ProtectedRoute> },
      { path: 'administracao/RegistroBatalhao', element: <ProtectedRoute><RegistroBatalhao /></ProtectedRoute> },
      { path: 'administracao/EditarBatalhao/:id', element: <ProtectedRoute><EditarBatalhao /></ProtectedRoute> },
      { path: 'administracao/Veiculo', element: <ProtectedRoute><Veiculo /></ProtectedRoute> },
      { path: 'administracao/RegistroVeiculo', element: <ProtectedRoute><RegistroVeiculo /></ProtectedRoute> },
      { path: 'administracao/EditarVeiculo/:id', element: <ProtectedRoute><EditarVeiculo /></ProtectedRoute> },
      { path: 'administracao/CadastroOcorrenciaSecun', element: <ProtectedRoute><CadastroOcorrenciaSecun /></ProtectedRoute> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

// Registra o Service Worker para PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova atualização disponível! Recarregar para atualizar?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline');
  },
});

// Verifica se o navegador suporta service workers
if (
  import.meta.env.PROD &&
  'serviceWorker' in navigator &&
  (window.isSecureContext || ['localhost', '127.0.0.1'].includes(location.hostname))
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registrado com sucesso: ', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar o ServiceWorker: ', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <Notifications position="top-right" autoClose={4000} zIndex={2100} />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
)
