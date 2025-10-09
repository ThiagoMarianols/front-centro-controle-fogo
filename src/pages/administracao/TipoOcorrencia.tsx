import { UserList } from '../../components/UserList'
import classes from '../../styles/administracao/TipoOcorrencia.module.css'
import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

const TipoOcorrencia = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.mainContent}>
      <div className={classes.header}>
        <h1 className={classes.title}>Tipos de Ocorrencia</h1>
        <Button
          variant="filled"
          className={classes.button}
          onClick={() => navigate('/CadastroUsuario')}
        >
          Criar Tipo de Ocorrencia
        </Button>
      </div>
      <div className={classes.userListContainer}>
        <div className={classes.userList}>
          <UserList />
        </div>
      </div>
    </div>
  )
}

export default TipoOcorrencia