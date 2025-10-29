import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from '../styles/RegistroOcorrencia.module.css';
import { TextInput, Button, Paper, Title, Textarea, MultiSelect, Loader } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import '@mantine/dates/styles.css';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { occurrenceService } from '../services/occurrenceService';

dayjs.locale('pt-br');

export function CompletarOcorrencia() {
  const location = useLocation();
  const navigate = useNavigate();
  const occurrenceId = location.state?.itemId;

  const [occurrenceDetails, setOccurrenceDetails] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [occurrenceArrivalTime, setOccurrenceArrivalTime] = useState<Date | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<Array<{value: string, label: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Buscar usuários ativos do backend
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          notifications.show({
            title: 'Erro de Autenticação',
            message: 'Você precisa estar logado para acessar esta página',
            color: 'red'
          });
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8088/api/auth/paginator?page=1&size=100&active=true', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          notifications.show({
            title: 'Sessão Expirada',
            message: 'Sua sessão expirou. Faça login novamente.',
            color: 'red'
          });
          navigate('/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          console.log('Dados recebidos do backend:', data);
          
          if (data.items && Array.isArray(data.items)) {
            const userOptions = data.items
              .filter((user: any) => user && user.id && user.normalizedName)
              .map((user: any) => ({
                value: String(user.id),
                label: user.normalizedName
              }));
            console.log('Usuários mapeados:', userOptions);
            setUsers(userOptions);
          } else {
            console.warn('Formato de dados inesperado:', data);
            setUsers([]);
          }
        } else {
          throw new Error('Erro ao carregar usuários');
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setUsers([]); // Define array vazio para evitar erro no MultiSelect
        notifications.show({
          title: 'Aviso',
          message: 'Não foi possível carregar a lista de usuários',
          color: 'yellow'
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    // Buscar localização atual
    const getLocation = () => {
      if (navigator.geolocation) {
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude.toFixed(7));
            setLongitude(position.coords.longitude.toFixed(7));
            setLoadingLocation(false);
            notifications.show({
              title: 'Localização obtida',
              message: 'Sua localização foi capturada automaticamente',
              color: 'green'
            });
          },
          () => {
            setLoadingLocation(false);
            notifications.show({
              title: 'Erro de Localização',
              message: 'Não foi possível obter sua localização. Preencha manualmente.',
              color: 'yellow'
            });
          }
        );
      }
    };

    fetchUsers();
    getLocation();
  }, []);

  const handleSubmit = async () => {
    console.log('=== INICIANDO SUBMIT ===');
    console.log('occurrenceId:', occurrenceId);
    
    if (!occurrenceId) {
      notifications.show({
        title: 'Erro',
        message: 'ID da ocorrência não encontrado',
        color: 'red'
      });
      return;
    }

    console.log('Validando campos...');
    console.log('occurrenceDetails:', occurrenceDetails);
    console.log('latitude:', latitude);
    console.log('longitude:', longitude);
    console.log('occurrenceArrivalTime:', occurrenceArrivalTime);
    console.log('selectedUsers:', selectedUsers);

    if (!occurrenceDetails || !latitude || !longitude || !occurrenceArrivalTime || selectedUsers.length === 0) {
      notifications.show({
        title: 'Erro',
        message: 'Preencha todos os campos obrigatórios',
        color: 'red'
      });
      return;
    }

    setLoading(true);

    try {
      // Converter occurrenceArrivalTime para Date se necessário
      const arrivalDate = occurrenceArrivalTime instanceof Date 
        ? occurrenceArrivalTime 
        : new Date(occurrenceArrivalTime as any);

      const data = {
        occurrenceDetails,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        occurrenceArrivalTime: arrivalDate.toISOString(),
        userIds: selectedUsers.map(id => parseInt(id))
      };

      console.log('Dados a serem enviados:', data);
      console.log('Chamando API...');

      const response = await occurrenceService.complete(occurrenceId, data);
      console.log('Resposta da API:', response);

      notifications.show({
        title: 'Sucesso',
        message: 'Ocorrência completada com sucesso',
        color: 'green'
      });

      navigate('/Ocorrencia');
    } catch (error) {
      console.error('Erro ao completar ocorrência:', error);
      notifications.show({
        title: 'Erro',
        message: error instanceof Error ? error.message : 'Erro ao completar ocorrência',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.centerWrap}>
      <Title order={2} className={classes.title} style={{ color: '#B13433' }}>
        Completar Atendimento da Ocorrência #{occurrenceId}
      </Title>

      <div className={classes.cardsStack}>
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Dados do Atendimento</Title>
          <div className={classes.formGrid}>
            
            <DateTimePicker 
              label="Horário de chegada ao local" 
              placeholder="Selecione a data e hora"
              value={occurrenceArrivalTime}
              onChange={(value) => setOccurrenceArrivalTime(value as Date | null)}
              locale="pt-br"
              required
            />

            <TextInput
              label="Latitude"
              placeholder={loadingLocation ? "Obtendo localização..." : "Ex: -8.0476"}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              disabled={loadingLocation}
              rightSection={loadingLocation ? <Loader size="xs" /> : null}
            />

            <TextInput
              label="Longitude"
              placeholder={loadingLocation ? "Obtendo localização..." : "Ex: -34.8770"}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              disabled={loadingLocation}
              rightSection={loadingLocation ? <Loader size="xs" /> : null}
            />

            <MultiSelect
              label="Militares envolvidos"
              placeholder={loadingUsers ? "Carregando usuários..." : "Selecione os militares"}
              data={users || []}
              value={selectedUsers}
              onChange={setSelectedUsers}
              searchable
              required
              disabled={loadingUsers || users.length === 0}
              className={classes.fullWidthField}
              rightSection={loadingUsers ? <Loader size="xs" /> : null}
              nothingFoundMessage="Nenhum usuário encontrado"
            />

            <Textarea
              label="Detalhes da ocorrência"
              placeholder="Descreva o que foi encontrado no local e as ações realizadas"
              value={occurrenceDetails}
              onChange={(e) => setOccurrenceDetails(e.target.value)}
              autosize
              minRows={4}
              maxRows={8}
              required
              className={classes.fullWidthField}
            />
          </div>
        </Paper>
      </div>

      <Button 
        style={{ backgroundColor: '#B13433' }}
        onClick={handleSubmit}
        loading={loading}
        size="md"
      >
        Completar Ocorrência
      </Button>
    </div>
  );
}
