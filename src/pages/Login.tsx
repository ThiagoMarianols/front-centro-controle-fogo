import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Button,
  Text,
  Alert,
  Stack,
} from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { IconAlertCircle, IconLock, IconMail } from '@tabler/icons-react';
import classes from '../styles/Login.module.css';
import logoCCF2 from '../assets/img/LogoCCF3.png';
import { loginService } from '../services/authService';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => {
        if (!value) return 'Email é obrigatório';
        if (!isEmail(value)) return 'Email inválido';
        return null;
      },
      password: (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
        return null;
      },
    },
  });


  const handleSubmit = async (values: typeof form.values, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    form.clearErrors();
    let hasError = false;

    if (!values.email) {
      form.setFieldError('email', 'Email é obrigatório');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      form.setFieldError('email', 'Email inválido');
      hasError = true;
    }

    if (!values.password) {
      form.setFieldError('password', 'Senha é obrigatória');
      hasError = true;
    } else if (values.password.length < 6) {
      form.setFieldError('password', 'A senha deve ter pelo menos 6 caracteres');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await loginService({ email: values.email, password: values.password });
      console.log(result);
      if (result && result.success) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('expiresRefreshToken', result.expiresRefreshToken.toString());
        localStorage.setItem('id', result.user.id.toString());
        navigate('/');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err: any) {
      setError('Erro ao autenticar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius="md" p={30}>
        <Stack align="center" mb="md">
          <img 
            src={logoCCF2} 
            alt="Logo CCF" 
            className={classes.logo}
          />
          <Text className={`${classes.subtitle} ${classes.subtitleSpacing}`}>
            Faça login para acessar o sistema
          </Text>
        </Stack>

        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />} 
            color="red" 
            mb="lg"
            radius="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={(e) => handleSubmit(form.values, e)} className={classes.loginForm}>
          <Stack className={classes.formStack}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="seu@email.com"
              size="md"
              leftSection={<IconMail size={20} />}
              {...form.getInputProps('email')}
              disabled={isLoading}
              autoComplete="username"
              inputMode="email"
              error={form.errors.email}
            />

            <PasswordInput
              label="Senha"
              placeholder="Sua senha"
              mt="md"
              size="md"
              leftSection={<IconLock size={20} />}
              {...form.getInputProps('password')}
              disabled={isLoading}
              autoComplete="current-password"
            />


            <Group justify="space-between" mt="lg">
              <Text 
                component="a" 
                href="/forgot-password" 
                size="sm"
                c="blue"
                style={{ textDecoration: 'none' }}
              >
                Esqueceu a senha?
              </Text>
            </Group>

            <Button 
              type="submit"
              fullWidth 
              mt="xl" 
              size="md"
              className={classes.loginButton}
              onClick={(e) => {
                e.preventDefault();
                console.log('Botão de login clicado');
                handleSubmit(form.values);
              }}
              loading={isLoading}
              loaderProps={{ 
                type: 'dots',
                color: 'white'
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
