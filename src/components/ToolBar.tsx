import { IconHistory, IconSticker2 , IconArchive } from '@tabler/icons-react';
import {
  Card,
  Container,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import classes from '../styles/toolbar.module.css';

const colorred = '#B13433';

const mockdata = [
  {
    title: 'Abrir Ocorrência',
    description:
      'Registre uma nova ocorrência em poucos cliques, informando local, tipo e detalhes do chamado.',
    icon: IconSticker2,
  },
  {
    title: 'Consultar Registros',
    description:
      'Acesse rapidamente todas as ocorrências já cadastradas, com filtros por data, status e tipo.',
    icon: IconArchive,
  },
  {
    title: 'Histórico',
    description:
      'Visualize o histórico completo de atendimentos realizados pelo Corpo de Bombeiros.',
    icon: IconHistory,
  },

];

export function ToolBar() {
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon size={50} stroke={1.5} color={colorred} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Registre e acompanhe ocorrências de forma rápida e segura. 
      </Title>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}