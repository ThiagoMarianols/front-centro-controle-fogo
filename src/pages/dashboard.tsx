import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  Title, 
  Text, 
  Paper, 
  Group, 
  Stack,
  Loader,
  Center,
  Badge,
  RingProgress,
  ThemeIcon
} from '@mantine/core';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  DonutChart 
} from '@mantine/charts';
import { 
  IconFlame, 
  IconAlertTriangle, 
  IconCheck, 
  IconClock,
  IconTrendingUp,
  IconUsers,
  IconMapPin
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceMapInfo } from '../interfaces/IOccurrence';
import classes from '../styles/dashboard.module.css';
import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";



const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [occurrences, setOccurrences] = useState<IOccurrenceMapInfo[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await occurrenceService.getMapInfo();
      setOccurrences(data);
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar dados do dashboard',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // Estatísticas gerais
  const totalOccurrences = occurrences.length;
  
  // Normalizar status para uppercase e remover acentos
  const normalizeStatus = (status: string) => {
    return status
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const inProgress = occurrences.filter(o => {
    const status = normalizeStatus(o.statusName);
    return status.includes('ATENDIMENTO') || status.includes('EM ATENDIMENTO');
  }).length;
  
  const waiting = occurrences.filter(o => {
    const status = normalizeStatus(o.statusName);
    return status.includes('AGUARDANDO') || status.includes('PENDENTE');
  }).length;
  
  const completed = occurrences.filter(o => {
    const status = normalizeStatus(o.statusName);
    return status.includes('CONCLUIDA') || 
           status.includes('CONCLUIDO') || 
           status.includes('FINALIZADA') || 
           status.includes('FINALIZADO') ||
           status.includes('COMPLETA') ||
           status.includes('COMPLETO');
  }).length;

  // Dados para gráfico de status (Donut)
  const statusData = [
    { name: 'Em Atendimento', value: inProgress, color: '#228be6' },
    { name: 'Aguardando', value: waiting, color: '#fab005' },
    { name: 'Concluídas', value: completed, color: '#40c057' },
    { name: 'Outros', value: totalOccurrences - inProgress - waiting - completed, color: '#868e96' }
  ].filter(item => item.value > 0);

  // Dados para gráfico de tipos (Bar Chart)
  const typeCount = occurrences.reduce((acc, occ) => {
    acc[occ.typeName] = (acc[occ.typeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(typeCount)
    .map(([name, count]) => ({ type: name, ocorrencias: count }))
    .sort((a, b) => b.ocorrencias - a.ocorrencias)
    .slice(0, 8);

  // Dados para gráfico de natureza (Pie Chart)
  const natureCount = occurrences.reduce((acc, occ) => {
    acc[occ.natureName] = (acc[occ.natureName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const natureData = Object.entries(natureCount)
    .map(([name, value]) => ({ name, value, color: getRandomColor() }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Dados para gráfico de linha (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyData = last7Days.map(date => {
    const count = occurrences.filter(o => {
      const occDate = new Date(o.date).toISOString().split('T')[0];
      return occDate === date;
    }).length;
    
    return {
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      ocorrencias: count
    };
  });

  // Dados para gráfico de subtipos mais comuns (Bar Chart horizontal)
  const subtypeCount = occurrences.reduce((acc, occ) => {
    acc[occ.subtypeName] = (acc[occ.subtypeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const subtypeData = Object.entries(subtypeCount)
    .map(([name, count]) => ({ subtipo: name, quantidade: count }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 6);

  // Porcentagem de conclusão
  const completionRate = totalOccurrences > 0 ? Math.round((completed / totalOccurrences) * 100) : 0;

  function getRandomColor() {
    const colors = ['#B13433', '#228be6', '#40c057', '#fab005', '#fd7e14', '#be4bdb', '#15aabf', '#82c91e'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div className={classes.mainContent}>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#B13433', fontWeight: 700 }}>
              Dashboard
            </Title>
            <Text size="sm" c="dimmed">
              Visão geral das ocorrências
            </Text>
          </div>
          <Badge size="lg" variant="light" color="blue">
            Atualizado agora
          </Badge>
        </Group>

        {/* Cards de Estatísticas */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #B13433 0%, #8B0000 100%)', color: 'white', height: '100%' }}>
              <Group justify="space-between">
                <div>
                  <Text size="xs" fw={600} style={{ opacity: 0.9, textTransform: 'uppercase' }}>Total</Text>
                  <Text size="xl" fw={700} mt={5}>{totalOccurrences}</Text>
                  <Text size="xs" mt={5} style={{ opacity: 0.8 }}>Ocorrências</Text>
                </div>
                <ThemeIcon size={60} radius="md" variant="light" color="rgba(255,255,255,0.2)">
                  <IconFlame size={32} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #228be6 0%, #1864ab 100%)', color: 'white', height: '100%' }}>
              <Group justify="space-between">
                <div>
                  <Text size="xs" fw={600} style={{ opacity: 0.9, textTransform: 'uppercase' }}>Em Atendimento</Text>
                  <Text size="xl" fw={700} mt={5}>{inProgress}</Text>
                  <Text size="xs" mt={5} style={{ opacity: 0.8 }}>Ativas agora</Text>
                </div>
                <ThemeIcon size={60} radius="md" variant="light" color="rgba(255,255,255,0.2)">
                  <IconTrendingUp size={32} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #fab005 0%, #f08c00 100%)', color: 'white', height: '100%' }}>
              <Group justify="space-between">
                <div>
                  <Text size="xs" fw={600} style={{ opacity: 0.9, textTransform: 'uppercase' }}>Aguardando</Text>
                  <Text size="xl" fw={700} mt={5}>{waiting}</Text>
                  <Text size="xs" mt={5} style={{ opacity: 0.8 }}>Pendentes</Text>
                </div>
                <ThemeIcon size={60} radius="md" variant="light" color="rgba(255,255,255,0.2)">
                  <IconClock size={32} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #40c057 0%, #2f9e44 100%)', color: 'white', height: '100%' }}>
              <Group justify="space-between">
                <div>
                  <Text size="xs" fw={600} style={{ opacity: 0.9, textTransform: 'uppercase' }}>Concluídas</Text>
                  <Text size="xl" fw={700} mt={5}>{completed}</Text>
                  <Text size="xs" mt={5} style={{ opacity: 0.8 }}>{completionRate}% do total</Text>
                </div>
                <ThemeIcon size={60} radius="md" variant="light" color="rgba(255,255,255,0.2)">
                  <IconCheck size={32} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Gráficos - Linha 1 */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={600} size="lg">Ocorrências nos Últimos 7 Dias</Text>
                  <Text size="xs" c="dimmed">Tendência diária de registros</Text>
                </div>
              </Group>
              <LineChart
                h={300}
                data={dailyData}
                dataKey="date"
                series={[
                  { name: 'ocorrencias', label: 'Ocorrências', color: '#B13433' },
                ]}
                curveType="monotone"
                withLegend
                legendProps={{ verticalAlign: 'bottom', height: 50 }}
                gridAxis="xy"
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={600} size="lg">Status das Ocorrências</Text>
                  <Text size="xs" c="dimmed">Distribuição atual</Text>
                </div>
              </Group>
              <Center>
                <DonutChart
                  data={statusData}
                  size={200}
                  thickness={30}
                  chartLabel={`${totalOccurrences}`}
                />
              </Center>
              <Stack gap="xs" mt="md">
                {statusData.map((item, index) => (
                  <Group key={index} justify="space-between">
                    <Group gap="xs">
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
                      <Text size="sm">{item.name}</Text>
                    </Group>
                    <Text size="sm" fw={600}>{item.value}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Gráficos - Linha 2 */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={600} size="lg">Tipos Mais Comuns</Text>
                  <Text size="xs" c="dimmed">Top 8 tipos de ocorrências</Text>
                </div>
              </Group>
              <BarChart
                h={300}
                data={typeData}
                dataKey="type"
                series={[
                  { name: 'ocorrencias', label: 'Quantidade', color: '#228be6' },
                ]}
                tickLine="y"
                gridAxis="y"
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={600} size="lg">Distribuição por Natureza</Text>
                  <Text size="xs" c="dimmed">Top 6 naturezas</Text>
                </div>
              </Group>
              <Center>
                <PieChart
                  data={natureData}
                  size={250}
                  withLabelsLine
                  labelsPosition="outside"
                  labelsType="value"
                  withTooltip
                />
              </Center>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Gráfico - Linha 3 */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={600} size="lg">Subtipos Mais Frequentes</Text>
                  <Text size="xs" c="dimmed">Top 6 subtipos registrados</Text>
                </div>
              </Group>
              <BarChart
                h={300}
                data={subtypeData}
                dataKey="subtipo"
                series={[
                  { name: 'quantidade', label: 'Quantidade', color: '#40c057' },
                ]}
                orientation="vertical"
                tickLine="x"
                gridAxis="x"
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
              <Text fw={600} size="lg" mb="md">Taxa de Conclusão</Text>
              <Center style={{ minHeight: 200 }}>
                <RingProgress
                  size={200}
                  thickness={20}
                  sections={[
                    { value: completionRate, color: '#40c057' },
                  ]}
                  label={
                    <Center>
                      <div style={{ textAlign: 'center' }}>
                        <Text size="xl" fw={700}>{completionRate}%</Text>
                        <Text size="xs" c="dimmed">Concluídas</Text>
                      </div>
                    </Center>
                  }
                />
              </Center>
              <Stack gap="md" mt="md">
                <Paper p="sm" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Total</Text>
                    <Text size="sm" fw={600}>{totalOccurrences}</Text>
                  </Group>
                </Paper>
                <Paper p="sm" radius="md" style={{ backgroundColor: '#d3f9d8' }}>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Finalizadas</Text>
                    <Text size="sm" fw={600} c="green">{completed}</Text>
                  </Group>
                </Paper>
                <Paper p="sm" radius="md" style={{ backgroundColor: '#fff3bf' }}>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Pendentes</Text>
                    <Text size="sm" fw={600} c="orange">{totalOccurrences - completed}</Text>
                  </Group>
                </Paper>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </div>
  );
};

export default Dashboard;