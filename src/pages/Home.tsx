import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Grid, 
  Card, 
  Group, 
  Stack,
  Badge,
  ThemeIcon,
  Paper
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { 
  IconFlame, 
  IconShieldCheck, 
  IconPhone, 
  IconMapPin,
  IconAlertTriangle,
  IconUsers,
  IconChevronRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import classes from '../styles/Home.module.css';
import news1 from '../assets/img/img_home/news1.png';
import news2 from '../assets/img/img_home/news2.jpg';
import news3 from '../assets/img/img_home/news3.jpg';
import '@mantine/carousel/styles.css';

const Home = () => {
  const navigate = useNavigate();

  const newsSlides = [
    {
      image: news1,
      title: 'Corpo de Bombeiros em Ação',
      description: 'Acompanhe as últimas operações e treinamentos do nosso corpo de bombeiros',
      badge: 'Novidades'
    },
    {
      image: news2,
      title: 'Prevenção e Segurança',
      description: 'Conheça as medidas preventivas e dicas de segurança para a comunidade',
      badge: 'Importante'
    },
    {
      image: news3,
      title: 'Tecnologia e Inovação',
      description: 'Unidroid: Inovação 100% brasileira criada para enfrentar o fogo extremo e preservar a vida dos bombeiros.',
      badge: 'Tecnologia'
    }
  ];

  const features = [
    {
      icon: IconFlame,
      title: 'Gestão de Ocorrências',
      description: 'Registre e acompanhe ocorrências em tempo real',
      color: '#B13433',
      link: '/ocorrencia'
    },
    {
      icon: IconShieldCheck,
      title: 'Controle de Batalhões',
      description: 'Gerencie batalhões e recursos disponíveis',
      color: '#228be6',
      link: '/administracao/Batalhao'
    },
    {
      icon: IconUsers,
      title: 'Equipe Operacional',
      description: 'Administre militares e suas atribuições',
      color: '#40c057',
      link: '/administracao/Users'
    },
    {
      icon: IconMapPin,
      title: 'Mapa de Ocorrências',
      description: 'Visualize ocorrências em mapa interativo',
      color: '#fd7e14',
      link: '/administracao/Relatorios'
    }
  ];

  return (
    <div className={classes.mainContent}>
      <section className={classes.heroSection}>
        <Container size="xl">
          <Carousel
            withIndicators
            height={400}
            slideSize="100%"
            slideGap="md"
            classNames={{
              root: classes.carouselRoot,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
            }}
          >
            {newsSlides.map((slide, index) => (
              <Carousel.Slide key={index}>
                <div className={classes.slideContainer}>
                  <div 
                    className={classes.slideImage}
                    style={{ 
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className={classes.slideContent}>
                      <Badge size="lg" variant="filled" color="red" mb="md">
                        {slide.badge}
                      </Badge>
                      <Title order={1} className={classes.slideTitle}>
                        {slide.title}
                      </Title>
                      <Text size="lg" className={classes.slideDescription}>
                        {slide.description}
                      </Text>
                    </div>
                  </div>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Container>
      </section>

      <section className={classes.featuresSection}>
        <Container size="xl">
          <Stack gap="xl">
            <div className={classes.sectionHeader}>
              <Title order={2} className={classes.sectionTitle}>
                Funcionalidades do Sistema
              </Title>
              <Text size="lg" c="dimmed">
                Acesse rapidamente as principais áreas do sistema
              </Text>
            </div>

            <Grid gutter="lg">
              {features.map((feature, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder
                    className={classes.featureCard}
                    onClick={() => navigate(feature.link)}
                  >
                    <Stack gap="md" align="center" style={{ textAlign: 'center' }}>
                      <ThemeIcon 
                        size={60} 
                        radius="md" 
                        variant="light"
                        style={{ backgroundColor: `${feature.color}15` }}
                      >
                        <feature.icon size={32} color={feature.color} />
                      </ThemeIcon>
                      <div>
                        <Title order={4} mb="xs">{feature.title}</Title>
                        <Text size="sm" c="dimmed">{feature.description}</Text>
                      </div>
                      <Button 
                        variant="light" 
                        color={feature.color}
                        rightSection={<IconChevronRight size={16} />}
                        fullWidth
                      >
                        Acessar
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </section>

      <section className={classes.emergencySection}>
        <Container size="xl">
          <Paper 
            p="xl" 
            radius="md" 
            style={{ 
              background: 'linear-gradient(135deg, #B13433 0%, #8B0000 100%)',
              color: 'white'
            }}
          >
            <Grid gutter="xl" align="center">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Group gap="md">
                  <ThemeIcon size={60} radius="md" variant="light" color="rgba(255,255,255,0.2)">
                    <IconAlertTriangle size={32} />
                  </ThemeIcon>
                  <div>
                    <Title order={2} mb="xs">Emergência?</Title>
                    <Text size="lg">
                      Em caso de emergência, ligue imediatamente para o Corpo de Bombeiros
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Button 
                  size="xl" 
                  variant="white" 
                  color="red"
                  leftSection={<IconPhone size={24} />}
                  fullWidth
                  style={{ fontWeight: 700, fontSize: '1.5rem' }}
                >
                  193
                </Button>
              </Grid.Col>
            </Grid>
          </Paper>
        </Container>
      </section>
    </div>
  );
};

export default Home;