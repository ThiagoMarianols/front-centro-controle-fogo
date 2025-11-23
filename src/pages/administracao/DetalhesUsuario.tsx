import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Title, Button, Grid, Text, Badge, Loader, Center, Group, Divider, Card } from '@mantine/core';
import { IconArrowLeft, IconMapPin, IconPhone, IconUser, IconMail, IconId, IconCalendar, IconShield } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getUserById } from '../../services/authService';
import type { UserDetailDTO } from '../../interfaces/IUser';
import classes from '../../styles/RegistroOcorrencia.module.css';

export function DetalhesUsuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        notifications.show({
          title: 'Erro',
          message: 'ID do usuário não encontrado',
          color: 'red',
        });
        navigate('/administracao/Users');
        return;
      }

      try {
        setLoading(true);
        const data = await getUserById(Number(id));
        setUser(data);
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: error instanceof Error ? error.message : 'Erro ao carregar usuário',
          color: 'red',
        });
        navigate('/administracao/Users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!user) {
    return null;
  }

  const formatCPF = (cpf: string) => {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className={classes.centerWrap}>
      <Group justify="space-between" mb="xl" style={{ alignItems: 'center' }}>
        <div>
          <Group gap="md">
            <Title order={2} style={{ color: '#B13433', fontWeight: 700 }}>
              Usuário #{user.id}
            </Title>
            <Badge size="lg" color={user.active ? 'green' : 'red'} variant="filled">
              {user.active ? 'Ativo' : 'Inativo'}
            </Badge>
            {user.usingDefaultPassword && (
              <Badge size="lg" color="yellow" variant="light">
                Senha Padrão
              </Badge>
            )}
          </Group>
        </div>
        <Button 
          leftSection={<IconArrowLeft size={18} />}
          style={{ backgroundColor: '#B13433' }}
          onClick={() => navigate('/administracao/Users')}
          size="md"
        >
          Voltar
        </Button>
      </Group>

      <div className={classes.cardsStack}>
        {/* Informações Gerais */}
        <Card shadow="md" padding="xl" radius="lg" withBorder style={{ background: 'linear-gradient(135deg, #B13433 0%, #8B0000 100%)', color: 'white' }}>
          <Group justify="space-between" mb="md">
            <div>
              <Text size="sm" fw={500} style={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Nome Completo</Text>
              <Title order={3} mt={5}>{user.normalizedName}</Title>
            </div>
            <IconUser size={48} opacity={0.7} />
          </Group>
          <Divider my="md" color="rgba(255,255,255,0.3)" />
          <Grid gutter="lg">
            <Grid.Col span={6}>
              <Text size="xs" fw={600} style={{ opacity: 0.8, textTransform: 'uppercase' }}>Matrícula</Text>
              <Text size="xl" fw={700} mt={5}>{user.matriculates}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" fw={600} style={{ opacity: 0.8, textTransform: 'uppercase' }}>Patente</Text>
              <Text size="xl" fw={700} mt={5}>{user.patent.name}</Text>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Dados de Acesso */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="md">
            <IconShield size={24} style={{ color: '#B13433' }} />
            <Title order={4} style={{ color: '#B13433' }}>Dados de Acesso</Title>
          </Group>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Paper p="md" radius="md" style={{ background: '#f8f9fa' }}>
                <Text size="xs" fw={600} c="dimmed" mb={5}>Nome de Usuário</Text>
                <Text size="lg" fw={600}>{user.username}</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" style={{ background: '#f8f9fa' }}>
                <Group gap="xs" mb={5}>
                  <IconMail size={16} style={{ color: '#868e96' }} />
                  <Text size="xs" fw={600} c="dimmed">Email</Text>
                </Group>
                <Text size="lg" fw={600}>{user.email}</Text>
                {user.emailConfirmed && (
                  <Badge size="sm" color="green" mt={5}>Confirmado</Badge>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Dados Pessoais */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="md">
            <IconId size={24} style={{ color: '#B13433' }} />
            <Title order={4} style={{ color: '#B13433' }}>Dados Pessoais</Title>
          </Group>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">CPF</Text>
              <Text size="md" mt={5}>{formatCPF(user.cpf)}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" style={{ background: '#f8f9fa' }}>
                <Group gap="xs" mb={5}>
                  <IconPhone size={16} style={{ color: '#868e96' }} />
                  <Text size="xs" fw={600} c="dimmed">Telefone</Text>
                </Group>
                <Text size="lg" fw={600}>{formatPhone(user.phoneNumber)}</Text>
                {user.phoneNumberConfirmed && (
                  <Badge size="sm" color="green" mt={5}>Confirmado</Badge>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Gênero</Text>
              <Text size="md" mt={5}>{user.gender === 'M' ? 'Masculino' : 'Feminino'}</Text>
            </Grid.Col>
            {user.dateBirth && (
              <Grid.Col span={6}>
                <Group gap="xs" mb={5}>
                  <IconCalendar size={16} style={{ color: '#868e96' }} />
                  <Text size="sm" fw={500} c="dimmed">Data de Nascimento</Text>
                </Group>
                <Text size="md" mt={5}>
                  {new Date(user.dateBirth).toLocaleDateString('pt-BR')}
                </Text>
              </Grid.Col>
            )}
          </Grid>
        </Card>

        {/* Dados Profissionais */}
        {user.battalion && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconShield size={24} style={{ color: '#B13433' }} />
              <Title order={4} style={{ color: '#B13433' }}>Dados Profissionais</Title>
            </Group>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)', color: 'white' }}>
                  <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Batalhão</Text>
                  <Text size="lg" fw={700} mt={5}>{user.battalion.name}</Text>
                </Paper>
              </Grid.Col>
              {user.userRoles && user.userRoles.length > 0 && (
                <Grid.Col span={12}>
                  <Text size="sm" fw={500} c="dimmed" mb={10}>Funções</Text>
                  <Group gap="xs">
                    {user.userRoles.map((ur, index) => (
                      <Badge key={index} size="lg" variant="light" color="blue">
                        {ur.role.name}
                      </Badge>
                    ))}
                  </Group>
                </Grid.Col>
              )}
            </Grid>
          </Card>
        )}

        {/* Endereço */}
        {user.address && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconMapPin size={24} style={{ color: '#B13433' }} />
              <Title order={4} style={{ color: '#B13433' }}>Endereço</Title>
            </Group>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">CEP</Text>
                <Text size="md" mt={5}>{user.address.zipCode}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">Logradouro</Text>
                <Text size="md" mt={5}>{user.address.street}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">Número</Text>
                <Text size="md" mt={5}>{user.address.number}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">Bairro</Text>
                <Text size="md" mt={5}>{user.address.neighborhood}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">Cidade</Text>
                <Text size="md" mt={5}>{user.address.city}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">Estado</Text>
                <Text size="md" mt={5}>{user.address.state}</Text>
              </Grid.Col>
              {user.address.complement && (
                <Grid.Col span={12}>
                  <Text size="sm" fw={500} c="dimmed">Complemento</Text>
                  <Text size="md" mt={5}>{user.address.complement}</Text>
                </Grid.Col>
              )}
            </Grid>
          </Card>
        )}

        {/* Informações do Sistema */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md" style={{ color: '#B13433' }}>Informações do Sistema</Title>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Data de Criação</Text>
              <Text size="md" mt={5}>
                {new Date(user.createdAt).toLocaleString('pt-BR')}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Última Atualização</Text>
              <Text size="md" mt={5}>
                {new Date(user.updatedAt).toLocaleString('pt-BR')}
              </Text>
            </Grid.Col>
          </Grid>
        </Card>
      </div>
    </div>
  );
}

export default DetalhesUsuario;
