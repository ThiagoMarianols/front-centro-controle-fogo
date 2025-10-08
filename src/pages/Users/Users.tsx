import React from 'react'
import { UserList } from '../../components/UserList'
import classes from '../../styles/Users/Users.module.css'
import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

const Users = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.mainContent}>
      <div className={classes.header}>
        <h1 className={classes.title}>Usuários</h1>
        <Button
          variant="filled"
          className={classes.button}
          onClick={() => navigate('/CadastroUsuario')}
        >
          Cadastrar Usuário
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

export default Users