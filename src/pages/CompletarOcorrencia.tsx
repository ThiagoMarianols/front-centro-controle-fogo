import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import classes from '../styles/RegistroOcorrencia.module.css';
import { TextInput, Button, Paper, Title, Textarea, MultiSelect, Select, Loader } from '@mantine/core';
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
  const { id } = useParams<{ id: string }>();
  const occurrenceId = location.state?.itemId ?? (id ? Number(id) : undefined);

  const [occurrenceDetails, setOccurrenceDetails] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [occurrenceArrivalTime, setOccurrenceArrivalTime] = useState<Date | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<Array<{value: string, label: string}>>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingStatuses, setLoadingStatuses] = useState(true);

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

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/paginator?page=1&size=100&active=true`, {
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

    // Buscar viaturas ativas
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/vehicle/all`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const vehicleOptions = (Array.isArray(data) ? data : [])
            .filter((v: any) => v && v.id && v.name)
            .map((v: any) => ({ value: String(v.id), label: v.battalionName ? `${v.name} - ${v.battalionName}` : v.name }));
          setVehicles(vehicleOptions);
        } else {
          setVehicles([]);
          notifications.show({ title: 'Aviso', message: 'Não foi possível carregar as viaturas', color: 'yellow' });
        }
      } catch (e) {
        setVehicles([]);
        notifications.show({ title: 'Aviso', message: 'Erro ao buscar viaturas', color: 'yellow' });
      } finally {
        setLoadingVehicles(false);
      }
    };

    // Buscar status de ocorrência (requer endpoint no backend)
    const fetchStatuses = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('fetchStatuses: sem token, não buscando');
        setLoadingStatuses(false);
        return;
      }

      const tryFetch = async (url: string) => {
        console.log('Buscando status em:', url);
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Resposta status:', res.status, res.statusText);
        if (!res.ok) {
          try {
            const preview = await res.clone().text();
            console.log('Corpo resposta (preview):', preview);
          } catch {}
        }
        return res;
      };

      try {
        // Tenta rota principal (dentro de /occurrences)
        let response = await tryFetch(`${import.meta.env.VITE_BASE_URL}/occurrences/occurrence-status/all`);

        // Fallback: tenta rota alternativa sem /occurrences
        if (!response.ok) {
          console.log('Tentando rota alternativa /occurrence-status/all');
          response = await tryFetch(`${import.meta.env.VITE_BASE_URL}/occurrence-status/all`);
        }

        if (response.ok) {
          const data = await response.json();
          const statusOptions = (Array.isArray(data) ? data : [])
            .filter((s: any) => s && s.id && s.name)
            .map((s: any) => ({ value: String(s.id), label: s.name }));
          setStatuses(statusOptions);
          if (statusOptions.length === 0) {
            notifications.show({ title: 'Aviso', message: 'Nenhum status retornado pela API', color: 'yellow' });
          }
        } else {
          setStatuses([]);
          notifications.show({ title: 'Aviso', message: 'Não foi possível carregar os status (ver console)', color: 'yellow' });
        }
      } catch (e) {
        console.error('Erro em fetchStatuses:', e);
        setStatuses([]);
        notifications.show({ title: 'Aviso', message: 'Erro ao buscar status', color: 'yellow' });
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchVehicles();
    fetchStatuses();
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
    console.log('selectedVehicles:', selectedVehicles);
    console.log('selectedStatus:', selectedStatus);

    if (!occurrenceDetails || !latitude || !longitude || !occurrenceArrivalTime || selectedUsers.length === 0 || selectedVehicles.length === 0 || !selectedStatus) {
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

      const vehicles = selectedVehicles.map((v) => Number(v)).filter(v => !Number.isNaN(v));
      const status = Number(selectedStatus);

      if (vehicles.length === 0 || Number.isNaN(status)) {
        notifications.show({
          title: 'Erro',
          message: 'Selecione ao menos uma viatura e um status válido',
          color: 'red'
        });
        setLoading(false);
        return;
      }

      const data = {
        occurrenceDetails,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        occurrenceArrivalTime: arrivalDate.toISOString(),
        userIds: selectedUsers.map(id => parseInt(id)),
        status,
        occurrenceId: Number(occurrenceId),
        vehicles
      } as any;

      console.log('Dados a serem enviados:', data);
      console.log('Chamando API...');

      const response = await occurrenceService.complete(data);
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

            <MultiSelect
              label="Viaturas envolvidas"
              placeholder={loadingVehicles ? "Carregando viaturas..." : "Selecione as viaturas"}
              data={vehicles || []}
              value={selectedVehicles}
              onChange={setSelectedVehicles}
              searchable
              required
              disabled={loadingVehicles || vehicles.length === 0}
              className={classes.fullWidthField}
              rightSection={loadingVehicles ? <Loader size="xs" /> : null}
              nothingFoundMessage="Nenhuma viatura encontrada"
            />

            <Select
              label="Status da ocorrência"
              placeholder={loadingStatuses ? "Carregando status..." : "Selecione o status"}
              data={statuses || []}
              value={selectedStatus}
              onChange={setSelectedStatus}
              searchable
              required
              disabled={loadingStatuses}
              rightSection={loadingStatuses ? <Loader size="xs" /> : null}
              nothingFoundMessage="Nenhum status encontrado"
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
