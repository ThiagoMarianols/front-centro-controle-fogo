import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from '../styles/EditarOcorrencia.module.css';
import { 
  Select,
  TextInput,
  Textarea,
  Paper,
  Title,
  Button,
  Group,
  Radio,
  LoadingOverlay,
  MultiSelect,
  Loader
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from '../config/axiosConfig';
import type { IUpdateOccurrenceRequest } from '../interfaces/IOccurrence';
import type { INature } from '../interfaces/INature';
import type { IType } from '../interfaces/IType';
import type { ISubType } from '../interfaces/ISubType';
import type { IVehicle } from '../interfaces/IVehicle';
import type { BattalionDTO } from '../interfaces/IBattalion';

interface IUser {
  id: number;
  name: string;
}

const STATUS_OPTIONS = [
  { value: '1', label: 'Aguardando Atendimento' },
  { value: '2', label: 'Em Atendimento' },
  { value: '3', label: 'Concluída' },
  { value: '4', label: 'Falso Alarme' },
  { value: '5', label: 'Cancelada' }
];

const normalizeStatusLabel = (value: string) =>
  value
    ? value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\s_-]/g, '')
        .toUpperCase()
    : '';

const STATUS_NAME_MAP: Record<string, string> = {
  [normalizeStatusLabel('Aguardando Atendimento')]: '1',
  [normalizeStatusLabel('Em Atendimento')]: '2',
  [normalizeStatusLabel('Concluída')]: '3',
  [normalizeStatusLabel('Concluida')]: '3',
  [normalizeStatusLabel('Falso Alarme')]: '4',
  [normalizeStatusLabel('Cancelada')]: '5',
  [normalizeStatusLabel('Cancelado')]: '5',
  [normalizeStatusLabel('Pendente')]: '1',
  [normalizeStatusLabel('Aguardando')]: '1'
};

const formatPhoneNumber = (digits: string) => {
  const cleaned = digits.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

const formatCep = (digits: string) => {
  const cleaned = digits.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

interface IOccurrenceDetail {
  id: number;
  occurrenceHasVictims: boolean;
  occurrenceRequester: string;
  occurrenceRequesterPhoneNumber: string;
  occurrenceSubType: number;
  occurrenceDetails: string;
  latitude?: number;
  longitude?: number;
  occurrenceArrivalTime?: string;
  status: number;
  address?: {
    street: string;
    number: number;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  userIds?: number[];
  vehicles?: number[];
  battalionIds?: number[];
  photoUrls?: string[];
}

export default function EditarOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados principais
  const [temVitimas, setTemVitimas] = useState<string>('Não');
  const [nomeSolicitante, setNomeSolicitante] = useState('');
  const [telefoneSolicitante, setTelefoneSolicitante] = useState('');
  const [occurrenceDetails, setOccurrenceDetails] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [occurrenceArrivalTime, setOccurrenceArrivalTime] = useState<string>('');
  
  const [rawOccurrence, setRawOccurrence] = useState<any>(null);

  // Estados para seleção múltipla
  const [userIds, setUserIds] = useState<string[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [battalionIds, setBattalionIds] = useState<string[]>([]);
  
  // Estados para os dados da API
  const [availableUsers, setAvailableUsers] = useState<{value: string, label: string}[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<{value: string, label: string}[]>([]);
  const [availableBattalions, setAvailableBattalions] = useState<{value: string, label: string}[]>([]);
  const [statusOptions, setStatusOptions] = useState<{value: string; label: string}[]>(STATUS_OPTIONS);
  const [natureOptions, setNatureOptions] = useState<{value: string; label: string}[]>([]);
  const [typeOptions, setTypeOptions] = useState<{value: string; label: string}[]>([]);
  const [subTypeOptions, setSubTypeOptions] = useState<{value: string; label: string}[]>([]);
  
  // Estados para seleção
  const [statusId, setStatusId] = useState<string>('');
  const [natureId, setNatureId] = useState<string>('');
  const [typeId, setTypeId] = useState<string>('');
  const [subTypeId, setSubTypeId] = useState<string>('');
  
  // Estados de loading
  const [loadingNatures, setLoadingNatures] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingSubTypes, setLoadingSubTypes] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingBattalions, setLoadingBattalions] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Estado para endereço
  const [endereco, setEndereco] = useState({
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    numero: ''
  });

  // Carrega as naturezas disponíveis
  const loadNatures = async () => {
    try {
      setLoadingNatures(true);
      const response = await axios.get<INature[]>(`${import.meta.env.VITE_BASE_URL}/occurrences/natures`);
      setNatureOptions(response.data.map(nature => ({
        value: nature.id.toString(),
        label: nature.name
      })));
    } catch (error) {
      console.error('Erro ao carregar naturezas:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar as naturezas',
        color: 'red'
      });
    } finally {
      setLoadingNatures(false);
    }
  };

  // Carrega os tipos disponíveis
  const loadTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await axios.get<IType[]>(`${import.meta.env.VITE_BASE_URL}/occurrences/types`);
      setTypeOptions(response.data.map(type => ({
        value: type.id.toString(),
        label: type.name
      })));
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os tipos',
        color: 'red'
      });
    } finally {
      setLoadingTypes(false);
    }
  };

  // Carrega os subtipos disponíveis
  const loadSubTypes = async () => {
    try {
      setLoadingSubTypes(true);
      const response = await axios.get<ISubType[]>(`${import.meta.env.VITE_BASE_URL}/occurrences/subtypes`);
      setSubTypeOptions(response.data.map(subType => ({
        value: subType.id.toString(),
        label: subType.name
      })));
    } catch (error) {
      console.error('Erro ao carregar subtipos:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os subtipos',
        color: 'red'
      });
    } finally {
      setLoadingSubTypes(false);
    }
  };

  // Carrega as viaturas disponíveis
  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const response = await axios.get<IVehicle[]>(`${import.meta.env.VITE_BASE_URL}/vehicle/all`);
      setAvailableVehicles(response.data.map(vehicle => ({
        value: vehicle.id.toString(),
        label: vehicle.name
      })));
    } catch (error) {
      console.error('Erro ao carregar viaturas:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar as viaturas',
        color: 'red'
      });
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Carrega os batalhões disponíveis
  const loadBattalions = async () => {
    try {
      setLoadingBattalions(true);
      const response = await axios.get<BattalionDTO[]>(`${import.meta.env.VITE_BASE_URL}/battalion/all`);
      setAvailableBattalions(response.data.map(battalion => ({
        value: battalion.id.toString(),
        label: battalion.name
      })));
    } catch (error) {
      console.error('Erro ao carregar batalhões:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os batalhões',
        color: 'red'
      });
    } finally {
      setLoadingBattalions(false);
    }
  };

  // Carrega os usuários disponíveis
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axios.get<IUser[]>(`${import.meta.env.VITE_BASE_URL}/auth/all`);
      setAvailableUsers(response.data.map(user => ({
        value: user.id.toString(),
        label: user.name
      })));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os militares',
        color: 'red'
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Carrega os status disponíveis (0-5 conforme documentação)
  const loadStatus = () => {
    setStatusOptions(STATUS_OPTIONS);
  };

  const getStatusIdFromLabel = (label?: string | null) => {
    if (!label) return '';
    const normalized = normalizeStatusLabel(label);
    return STATUS_NAME_MAP[normalized] || '';
  };

  // Carrega os dados da ocorrência
  const loadOccurrence = async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/occurrences/${id}`);
      const occurrence = response.data;
      
      console.log('Dados da ocorrência recebidos:', occurrence);
      
      // Preenche os campos do formulário
      setNomeSolicitante(occurrence.occurrenceRequester || '');
      setTelefoneSolicitante((occurrence.occurrenceRequesterPhoneNumber || '').replace(/\D/g, ''));
      setTemVitimas(occurrence.occurrenceHasVictims ? 'Sim' : 'Não');
      setOccurrenceDetails(occurrence.occurrenceDetails || '');
      setLatitude(occurrence.latitude?.toString() || '');
      setLongitude(occurrence.longitude?.toString() || '');
      
      if (occurrence.occurrenceArrivalTime) {
        // Converte ISO string para datetime-local format
        const date = new Date(occurrence.occurrenceArrivalTime);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setOccurrenceArrivalTime(localDateTime);
      }
      
      // Preenche endereço
      if (occurrence.address) {
        setEndereco({
          cep: (occurrence.address.zipCode || '').replace(/\D/g, ''),
          logradouro: occurrence.address.street || '',
          numero: occurrence.address.number?.toString() || '',
          bairro: occurrence.address.neighborhood || '',
          cidade: occurrence.address.city || '',
          estado: occurrence.address.state || '',
          complemento: occurrence.address.complement || ''
        });
      }
      
      // Preenche status - API retorna string, precisa encontrar o ID correspondente
      if (occurrence.status) {
        setStatusId(getStatusIdFromLabel(occurrence.status));
      }
      
      // Armazena dados brutos para mapear depois que as opções forem carregadas
      setRawOccurrence(occurrence);
      
      // Preenche usuários - API retorna array de objetos com id
      if (occurrence.users && occurrence.users.length > 0) {
        setUserIds(occurrence.users.map((user: any) => user.id?.toString()));
      }
      
      // Preenche veículos - API retorna array de objetos com id
      if (occurrence.vehicles && occurrence.vehicles.length > 0) {
        setVehicleIds(occurrence.vehicles.map((v: any) => v.id?.toString()));
      }
      
    } catch (error) {
      console.error('Erro ao carregar ocorrência:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os dados da ocorrência',
        color: 'red'
      });
      navigate('/ocorrencia');
    }
  };

  // Carrega os dados iniciais
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      loadStatus();
      await Promise.all([
        loadNatures(),
        loadTypes(),
        loadSubTypes(),
        loadUsers(),
        loadVehicles(),
        loadBattalions()
      ]);
      
      if (id) {
        await loadOccurrence();
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os dados iniciais',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Efeito para carregar os dados iniciais
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Efeito para mapear nomes para IDs quando as opções forem carregadas
  useEffect(() => {
    if (!rawOccurrence) return;

    // Mapeia natureza
    if (rawOccurrence.occurrenceNature && natureOptions.length > 0) {
      const nature = natureOptions.find(n => n.label === rawOccurrence.occurrenceNature);
      if (nature) {
        setNatureId(nature.value);
      }
    }

    // Mapeia tipo
    if (rawOccurrence.occurrenceType && typeOptions.length > 0) {
      const type = typeOptions.find(t => t.label === rawOccurrence.occurrenceType);
      if (type) {
        setTypeId(type.value);
      }
    }

    // Mapeia subtipo
    if (rawOccurrence.occurrenceSubType && subTypeOptions.length > 0) {
      const subType = subTypeOptions.find(st => st.label === rawOccurrence.occurrenceSubType);
      if (subType) {
        setSubTypeId(subType.value);
      }
    }

    // Mapeia batalhões
    if (rawOccurrence.battalions && rawOccurrence.battalions.length > 0 && availableBattalions.length > 0) {
      const battalionIds = rawOccurrence.battalions
        .map((name: string) => {
          const battalion = availableBattalions.find(b => b.label === name);
          return battalion?.value;
        })
        .filter((id: string | undefined) => id !== undefined);
      setBattalionIds(battalionIds);
    }
  }, [rawOccurrence, natureOptions, typeOptions, subTypeOptions, availableBattalions]);

  // Função para buscar CEP
  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        notifications.show({
          title: 'Aviso',
          message: 'CEP não encontrado',
          color: 'yellow'
        });
        return;
      }

      setEndereco(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || ''
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível buscar o CEP',
        color: 'red'
      });
    }
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    if (!id) return;

    // Validações
    if (!nomeSolicitante.trim()) {
      notifications.show({
        title: 'Atenção',
        message: 'Nome do solicitante é obrigatório',
        color: 'yellow'
      });
      return;
    }

    if (!telefoneSolicitante.trim()) {
      notifications.show({
        title: 'Atenção',
        message: 'Telefone do solicitante é obrigatório',
        color: 'yellow'
      });
      return;
    }

    if (!subTypeId) {
      notifications.show({
        title: 'Atenção',
        message: 'Subtipo da ocorrência é obrigatório',
        color: 'yellow'
      });
      return;
    }

    if (!statusId) {
      notifications.show({
        title: 'Atenção',
        message: 'Status é obrigatório',
        color: 'yellow'
      });
      return;
    }

    if (!endereco.logradouro.trim() || !endereco.numero.trim() || !endereco.bairro.trim() || 
        !endereco.cidade.trim() || !endereco.estado.trim() || !endereco.cep.trim()) {
      notifications.show({
        title: 'Atenção',
        message: 'Todos os campos de endereço são obrigatórios',
        color: 'yellow'
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const updateData: IUpdateOccurrenceRequest = {
        occurrenceRequester: nomeSolicitante,
        occurrenceRequesterPhoneNumber: telefoneSolicitante,
        occurrenceHasVictims: temVitimas === 'Sim',
        occurrenceDetails: occurrenceDetails || '',
        occurrenceSubType: parseInt(subTypeId),
        status: parseInt(statusId),
        userIds: userIds.map(id => parseInt(id)),
        vehicles: vehicleIds.map(id => parseInt(id)),
        battalionIds: battalionIds.map(id => parseInt(id)),
        address: {
          zipCode: endereco.cep.replace(/\D/g, ''), // Remove hífen e outros caracteres
          street: endereco.logradouro,
          number: parseInt(endereco.numero),
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          complement: endereco.complemento || ''
        },
        latitude: latitude && !isNaN(parseFloat(latitude)) ? parseFloat(latitude) : 0,
        longitude: longitude && !isNaN(parseFloat(longitude)) ? parseFloat(longitude) : 0,
        occurrenceArrivalTime: occurrenceArrivalTime 
          ? new Date(occurrenceArrivalTime).toISOString() 
          : new Date().toISOString(),
        photoUrls: []
      };

      console.log('Payload enviado:', JSON.stringify(updateData, null, 2));

      await axios.put(`${import.meta.env.VITE_BASE_URL}/occurrences/${id}`, updateData);
      
      notifications.show({
        title: 'Sucesso',
        message: 'Ocorrência atualizada com sucesso!',
        color: 'green'
      });
      
      navigate('/ocorrencia');
    } catch (error: any) {
      console.error('Erro ao atualizar ocorrência:', error);
      const errorMessage = error.response?.data?.message || 'Não foi possível atualizar a ocorrência';
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.container}>
      <LoadingOverlay visible={loading} />
      
      <Paper p="md" shadow="sm" className={classes.formContainer}>
        <Title order={2} mb="md">Editar Ocorrência</Title>
        
        <div className={classes.formSection}>
          <Title order={4} mb="md">Informações Básicas</Title>
          
          <div className={classes.formRow}>
            <TextInput
              label="Nome do Solicitante"
              value={nomeSolicitante}
              onChange={(e) => setNomeSolicitante(e.target.value)}
              className={classes.formInput}
              required
              placeholder="Digite o nome do solicitante"
            />
            
            <TextInput
              label="Telefone do Solicitante"
              value={formatPhoneNumber(telefoneSolicitante)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                setTelefoneSolicitante(digits);
              }}
              className={classes.formInput}
              required
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className={classes.formRow}>
            <Select
              label="Status"
              placeholder="Selecione o status"
              value={statusId}
              onChange={(value) => setStatusId(value || '')}
              data={statusOptions}
              className={classes.formInput}
              required
              searchable
              clearable
              nothingFoundMessage="Nenhum status encontrado"
            />
            
            <Select
              label="Natureza da Ocorrência"
              placeholder="Selecione a natureza"
              value={natureId}
              onChange={(value) => setNatureId(value || '')}
              data={natureOptions}
              className={classes.formInput}
              searchable
              clearable
              nothingFoundMessage="Nenhuma natureza encontrada"
              disabled={loadingNatures}
              rightSection={loadingNatures ? <Loader size="xs" /> : null}
            />
          </div>
          
          <div className={classes.formRow}>
            <Select
              label="Tipo de Ocorrência"
              placeholder="Selecione o tipo"
              value={typeId}
              onChange={(value) => setTypeId(value || '')}
              data={typeOptions}
              className={classes.formInput}
              searchable
              clearable
              nothingFoundMessage="Nenhum tipo encontrado"
              disabled={loadingTypes}
              rightSection={loadingTypes ? <Loader size="xs" /> : null}
            />
            
            <Select
              label="Subtipo da Ocorrência"
              placeholder="Selecione o subtipo"
              value={subTypeId}
              onChange={(value) => setSubTypeId(value || '')}
              data={subTypeOptions}
              className={classes.formInput}
              required
              searchable
              clearable
              nothingFoundMessage="Nenhum subtipo encontrado"
              disabled={loadingSubTypes}
              rightSection={loadingSubTypes ? <Loader size="xs" /> : null}
            />
          </div>
          
          <div className={classes.formRow}>
            <MultiSelect
              label="Militares Envolvidos"
              placeholder="Selecione os militares"
              value={userIds}
              onChange={setUserIds}
              data={availableUsers}
              className={classes.formInput}
              searchable
              clearable
              nothingFoundMessage="Nenhum militar encontrado"
              disabled={loadingUsers}
            />
            
            <MultiSelect
              label="Viaturas"
              placeholder="Selecione as viaturas"
              value={vehicleIds}
              onChange={setVehicleIds}
              data={availableVehicles}
              className={classes.formInput}
              searchable
              clearable
              nothingFoundMessage="Nenhuma viatura encontrada"
              disabled={loadingVehicles}
            />
          </div>
          
          <div className={classes.formRow}>
            <MultiSelect
              label="Batalhões"
              placeholder="Selecione os batalhões"
              value={battalionIds}
              onChange={setBattalionIds}
              data={availableBattalions}
              className={classes.formInput}
              searchable
              clearable
              nothingFoundMessage="Nenhum batalhão encontrado"
              disabled={loadingBattalions}
            />
            
            <Radio.Group
              name="temVitimas"
              label="Tem Vítimas?"
              value={temVitimas}
              onChange={setTemVitimas}
              className={classes.formInput}
              required
            >
              <Group mt="xs" justify="center">
                <Radio value="Sim" label="Sim" />
                <Radio value="Não" label="Não" />
              </Group>
            </Radio.Group>
          </div>
          
          <Textarea
            label="Detalhes da Ocorrência"
            value={occurrenceDetails}
            onChange={(e) => setOccurrenceDetails(e.target.value)}
            className={classes.formTextArea}
            minRows={4}
            placeholder="Descreva os detalhes da ocorrência"
          />
        </div>
        
        <div className={classes.formSection}>
          <Title order={4} mb="md">Localização</Title>
          
          <div className={classes.formRow}>
            <TextInput
              label="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={classes.formInput}
              placeholder="Ex: -15.7801"
              type="number"
              step="any"
            />
            
            <TextInput
              label="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={classes.formInput}
              placeholder="Ex: -47.9292"
              type="number"
              step="any"
            />
          </div>
          
          <TextInput
            label="Horário de Chegada"
            value={occurrenceArrivalTime}
            onChange={(e) => setOccurrenceArrivalTime(e.target.value)}
            className={classes.formInput}
            type="datetime-local"
          />
        </div>
        
        <div className={classes.formSection}>
          <Title order={4} mb="md">Endereço</Title>
          
          <div className={classes.formRow}>
            <TextInput
              label="CEP"
              value={formatCep(endereco.cep)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                setEndereco(prev => ({ ...prev, cep: digits }));

                if (digits.length === 8) {
                  buscarCep(digits);
                }
              }}
              className={classes.formInput}
              placeholder="00000-000"
              maxLength={9}
              required
            />
            
            <TextInput
              label="Logradouro"
              value={endereco.logradouro}
              onChange={(e) => setEndereco(prev => ({ ...prev, logradouro: e.target.value }))}
              className={classes.formInput}
              required
              placeholder="Rua, Avenida, etc."
            />
          </div>
          
          <div className={classes.formRow}>
            <TextInput
              label="Número"
              value={endereco.numero}
              onChange={(e) => setEndereco(prev => ({ ...prev, numero: e.target.value }))}
              className={classes.formInput}
              required
              placeholder="Número"
            />
            
            <TextInput
              label="Bairro"
              value={endereco.bairro}
              onChange={(e) => setEndereco(prev => ({ ...prev, bairro: e.target.value }))}
              className={classes.formInput}
              required
              placeholder="Bairro"
            />
          </div>
          
          <div className={classes.formRow}>
            <TextInput
              label="Cidade"
              value={endereco.cidade}
              onChange={(e) => setEndereco(prev => ({ ...prev, cidade: e.target.value }))}
              className={classes.formInput}
              required
              placeholder="Cidade"
            />
            
            <TextInput
              label="Estado"
              value={endereco.estado}
              onChange={(e) => setEndereco(prev => ({ ...prev, estado: e.target.value.toUpperCase() }))}
              className={classes.formInput}
              maxLength={2}
              required
              placeholder="UF"
            />
          </div>
          
          <TextInput
            label="Complemento"
            value={endereco.complemento}
            onChange={(e) => setEndereco(prev => ({ ...prev, complemento: e.target.value }))}
            className={classes.formInput}
            placeholder="Apartamento, bloco, etc."
          />
        </div>
        
        <Group justify="flex-end" mt="xl">
          <Button 
            variant="outline" 
            onClick={() => navigate('/ocorrencia')}
            disabled={submitting}
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={handleSave}
            loading={submitting}
            disabled={submitting}
          >
            Salvar Alterações
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
