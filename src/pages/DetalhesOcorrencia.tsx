import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Title, Button, Grid, Text, Badge, Loader, Center, Group, Divider, Card } from '@mantine/core';
import { IconArrowLeft, IconMapPin, IconPhone, IconUser, IconClock, IconFileText, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceDTO } from '../interfaces/IOccurrence';
import classes from '../styles/RegistroOcorrencia.module.css';

export function DetalhesOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [occurrence, setOccurrence] = useState<IOccurrenceDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccurrence = async () => {
      if (!id) {
        notifications.show({
          title: 'Erro',
          message: 'ID da ocorrência não encontrado',
          color: 'red',
        });
        navigate('/Ocorrencia');
        return;
      }

      try {
        setLoading(true);
        const data = await occurrenceService.getById(Number(id));
        setOccurrence(data);
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: error instanceof Error ? error.message : 'Erro ao carregar ocorrência',
          color: 'red',
        });
        navigate('/Ocorrencia');
      } finally {
        setLoading(false);
      }
    };

    fetchOccurrence();
  }, [id, navigate]);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!occurrence) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EM_ATENDIMENTO': return 'blue';
      case 'CONCLUIDA': return 'green';
      case 'CANCELADA': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className={classes.centerWrap}>
      <Group justify="space-between" mb="xl" style={{ alignItems: 'center' }}>
        <div>
          <Group gap="md">
            <Title order={2} style={{ color: '#B13433', fontWeight: 700 }}>
              Ocorrência #{occurrence.id}
            </Title>
            <Badge size="lg" color={occurrence.active ? 'green' : 'red'} variant="filled">
              {occurrence.active ? 'Ativa' : 'Inativa'}
            </Badge>
            <Badge size="lg" color={getStatusColor(occurrence.status)} variant="light">
              {occurrence.status.replace('_', ' ')}
            </Badge>
          </Group>
        </div>
        <Button 
          leftSection={<IconArrowLeft size={18} />}
          style={{ backgroundColor: '#B13433' }}
          onClick={() => navigate('/Ocorrencia')}
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
              <Text size="sm" fw={500} style={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo de Ocorrência</Text>
              <Title order={3} mt={5}>{occurrence.occurrenceSubType || 'Não especificado'}</Title>
            </div>
            <IconInfoCircle size={48} opacity={0.7} />
          </Group>
          <Divider my="md" color="rgba(255,255,255,0.3)" />
          <Grid gutter="lg">
            <Grid.Col span={6}>
              <Text size="xs" fw={600} style={{ opacity: 0.8, textTransform: 'uppercase' }}>Possui Vítimas</Text>
              <Text size="xl" fw={700} mt={5}>{occurrence.occurrenceHasVictims ? 'SIM' : 'NÃO'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" fw={600} style={{ opacity: 0.8, textTransform: 'uppercase' }}>Data de Registro</Text>
              <Text size="md" mt={5}>
                {(occurrence as any).createDate 
                  ? new Date((occurrence as any).createDate).toLocaleString('pt-BR')
                  : '-'}
              </Text>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Dados do Solicitante */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="md">
            <IconUser size={24} style={{ color: '#B13433' }} />
            <Title order={4} style={{ color: '#B13433' }}>Dados do Solicitante</Title>
          </Group>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Paper p="md" radius="md" style={{ background: '#f8f9fa' }}>
                <Text size="xs" fw={600} c="dimmed" mb={5}>Nome do Solicitante</Text>
                <Text size="lg" fw={600}>{occurrence.occurrenceRequester}</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" style={{ background: '#f8f9fa' }}>
                <Group gap="xs" mb={5}>
                  <IconPhone size={16} style={{ color: '#868e96' }} />
                  <Text size="xs" fw={600} c="dimmed">Telefone</Text>
                </Group>
                <Text size="lg" fw={600}>{occurrence.occurrenceRequesterPhoneNumber}</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Endereço */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="md">
            <IconMapPin size={24} style={{ color: '#B13433' }} />
            <Title order={4} style={{ color: '#B13433' }}>Local da Ocorrência</Title>
          </Group>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">CEP</Text>
              <Text size="md" mt={5}>{(occurrence as any).zipCode || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Logradouro</Text>
              <Text size="md" mt={5}>{(occurrence as any).street || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Número</Text>
              <Text size="md" mt={5}>{(occurrence as any).number || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Bairro</Text>
              <Text size="md" mt={5}>{(occurrence as any).neighborhood || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Cidade</Text>
              <Text size="md" mt={5}>{(occurrence as any).city || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} c="dimmed">Estado</Text>
              <Text size="md" mt={5}>{(occurrence as any).state || '-'}</Text>
            </Grid.Col>
            {(occurrence as any).complement && (
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">Complemento</Text>
                <Text size="md" mt={5}>{(occurrence as any).complement}</Text>
              </Grid.Col>
            )}
          </Grid>
        </Card>

        {/* Detalhes do Atendimento (se houver) */}
        {((occurrence as any).occurrenceDetails || (occurrence as any).latitude || (occurrence as any).longitude) && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconFileText size={24} style={{ color: '#B13433' }} />
              <Title order={4} style={{ color: '#B13433' }}>Detalhes do Atendimento</Title>
            </Group>
            <Grid gutter="lg">
              {(occurrence as any).latitude && (
                <Grid.Col span={4}>
                  <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #B13433 0%, #8B0000 100%)', color: 'white' }}>
                    <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Latitude</Text>
                    <Text size="lg" fw={700} mt={5}>{(occurrence as any).latitude}</Text>
                  </Paper>
                </Grid.Col>
              )}
              {(occurrence as any).longitude && (
                <Grid.Col span={4}>
                  <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)', color: 'white' }}>
                    <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Longitude</Text>
                    <Text size="lg" fw={700} mt={5}>{(occurrence as any).longitude}</Text>
                  </Paper>
                </Grid.Col>
              )}
              {(occurrence as any).occurrenceArrivalTime && (
                <Grid.Col span={4}>
                  <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#2c3e50' }}>
                    <Group gap="xs" mb={5}>
                      <IconClock size={18} style={{ color: '#2c3e50' }} />
                      <Text size="xs" fw={600} style={{ color: '#2c3e50', opacity: 0.9 }}>Chegada</Text>
                    </Group>
                    <Text size="md" fw={700} style={{ color: '#2c3e50' }}>
                      {new Date((occurrence as any).occurrenceArrivalTime).toLocaleString('pt-BR')}
                    </Text>
                  </Paper>
                </Grid.Col>
              )}
              {(occurrence as any).occurrenceDetails && (
                <Grid.Col span={12}>
                  <Paper p="lg" radius="md" style={{ background: '#f8f9fa', border: '2px dashed #dee2e6' }}>
                    <Text size="sm" fw={700} c="dimmed" mb={10}>Descrição Detalhada</Text>
                    <Text size="md" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {(occurrence as any).occurrenceDetails}
                    </Text>
                  </Paper>
                </Grid.Col>
              )}
            </Grid>
          </Card>
        )}
      </div>
    </div>
  );
}
