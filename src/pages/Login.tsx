import {
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import classes from '../styles/Login.module.css';
import logoCCF2 from '../assets/img/LogoCCF3.png';

export default function Login() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>

        <h1 className={classes.title}>Bem vindo</h1>
        <h2 className={classes.subtitle}>Centro de Controle de Fogo</h2>
        <img src={logoCCF2} alt="Logo" className={classes.logoCCF}/>

        <TextInput id='input-login' label="Endereço de e-mail" placeholder="Seu@email.com" size="md" radius="md" className={classes.inputLogin} />
        <PasswordInput id='input-password' label="Senha" placeholder="***********" size="md" radius="md" className={classes.inputPassword} />
        <Checkbox label="Lembrar de mim" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" radius="md" className={classes.buttonLogin} >
          Login
        </Button>
      </Paper>
    </div>
  );
}
