import { ItenList } from '../components/ItenList'
import classes from '../styles/administracao/TipoOcorrencia.module.css'
import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

const Ocorrencia = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.mainContent}>
      <div className={classes.header}>
        <h1 className={classes.title}>Ocorrencias</h1>
        <Button
          variant="filled"
          className={classes.button}
          onClick={() => navigate('/RegistroOcorrencia')}
        >
          Registrar Ocorrencia
        </Button>
      </div>
      <div className={classes.userListContainer}>
        <div className={classes.userList}>
          <ItenList />
        </div>
      </div>
    </div>
  )
}

export default Ocorrencia