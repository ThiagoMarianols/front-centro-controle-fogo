import React from 'react'
import { UserList } from '../../components/UserList'
import classes from '../../styles/Users/Users.module.css'


const Users = () => {
  return (
    <div className={classes.mainContent}>
        <h1>Usuarios</h1>
        <UserList />
    </div>
  )
}

export default Users