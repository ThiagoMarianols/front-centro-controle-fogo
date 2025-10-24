//aqui a IA cantou pra me ajudar, ainda vou verificar o que dá pra usar, e o que a IA jogou de lixo aqui ....

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
  Box,
  Title,
  Stack,
} from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { IconAlertCircle, IconLock, IconMail } from '@tabler/icons-react';
import classes from '../styles/Login.module.css';
import logoCCF2 from '../assets/img/LogoCCF3.png';

// Numero de tentativas de login antes de mostrar o CAPTCHA
const MAX_LOGIN_ATTEMPTS = 3;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      captcha: '',
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
      captcha: (value) => {
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS && !value) {
          return 'Por favor, complete a verificação';
        }
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS && value !== generatedCaptcha) {
          return 'Código de verificação incorreto';
        }
        return null;
      },
    },
  });

  // Gera um CAPTCHA simples
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    return captcha;
  };

  const handleSubmit = async (values: typeof form.values, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    console.log('Formulário submetido', values);
    
    // Limpa erros anteriores
    form.clearErrors();
    
    // Validação manual
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
      console.log('Erros de validação encontrados');
      return;
    }
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS && values.captcha !== generatedCaptcha) {
      setError('Código de verificação incorreto');
      setGeneratedCaptcha(generateCaptcha()); // Regenerate CAPTCHA on failure
      form.setFieldValue('captcha', ''); // Clear the CAPTCHA input
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/');
      
    } catch (err) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        setShowCaptcha(true);
        setGeneratedCaptcha(generateCaptcha());
      }
      
      setError('Email ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  // Log para depuração
  console.log('Renderizando Login');

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius="md" p={30}>
        <Stack align="center" mb="md">
          <img 
            src={logoCCF2} 
            alt="Logo CCF" 
            className={classes.logo} 
            style={{ maxWidth: '200px', marginBottom: '1.5rem' }}
          />
          <Title order={2} className={classes.title}>
            Bem-vindo ao CCF
          </Title>
          <Text c="dimmed" size="sm" mb="xl">
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

        <form onSubmit={(e) => handleSubmit(form.values, e)}>
          <Stack>
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

            {showCaptcha && (
              <Box>
                <Text size="sm" mb="xs">Digite o código abaixo:</Text>
                <Text fw={700} mb="xs" style={{ letterSpacing: '5px', fontSize: '1.5rem' }}>
                  {generatedCaptcha}
                </Text>
                <TextInput
                  placeholder="Digite o código"
                  value={form.values.captcha}
                  onChange={(event) => {
                    form.setFieldValue('captcha', event.currentTarget.value.toUpperCase());
                  }}
                  disabled={isLoading}
                  maxLength={6}
                  style={{ textTransform: 'uppercase' }}
                />
              </Box>
            )}

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
