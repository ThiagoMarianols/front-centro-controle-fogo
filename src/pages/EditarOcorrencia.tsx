import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from '../styles/RegistroOcorrencia.module.css';
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
  Text,
  MultiSelect,
  TextInput as MantineTextInput
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { occurrenceService } from '../services/occurrenceService';
import { getUsersPaginated } from '../services/userService';
import type { IUpdateOccurrenceRequest } from '../interfaces/IOccurrence';

export default function EditarOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Estado para controlar se há vítimas (Sim/Não)
  const [temVitimas, setTemVitimas] = useState<string>('Não');
  const [nomeSolicitante, setNomeSolicitante] = useState('');
  const [telefoneSolicitante, setTelefoneSolicitante] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState<string>('');
  const [occurrenceDetails, setOccurrenceDetails] = useState<string>('Detalhes da ocorrência');
  const [userIds, setUserIds] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{value: string, label: string}[]>([]);
  const [occurrenceArrivalTime, setOccurrenceArrivalTime] = useState<string>(
    new Date().toISOString().slice(0, 16) // Formato YYYY-MM-DDTHH:MM
  );
  const [coordinates, setCoordinates] = useState<{latitude: number | null, longitude: number | null}>({
    latitude: -8.052240, // Valor padrão para testes
    longitude: -34.928610 // Valor padrão para testes
  });
  const [endereco, setEndereco] = useState<{
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento: string;
    numero: string;
  }>({
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    numero: ''
  });

  // Função para carregar usuários disponíveis
  const loadUsers = async () => {
    try {
      // Busca os usuários ativos (primeira página, 100 itens)
      const response = await getUsersPaginated(0, 100, '', true);
      
      // Mapeia os usuários para o formato esperado pelo MultiSelect
      const users = response.items.map((user) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email || 'Sem e-mail'})`
      }));
      
      setAvailableUsers(users);
      
      // Se não houver usuário selecionado e houver usuários disponíveis, seleciona o primeiro
      if (userIds.length === 0 && users.length > 0) {
        setUserIds([users[0].value]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar a lista de usuários',
        color: 'red'
      });
    }
  };

  // Carrega os dados da ocorrência
  const loadOccurrence = async () => {
    if (!id) return;
    
    try {
      const occurrence = await occurrenceService.getById(Number(id));
      setNomeSolicitante(occurrence.occurrenceRequester);
      setTelefoneSolicitante(occurrence.occurrenceRequesterPhoneNumber);
      setTipoOcorrencia(occurrence.occurrenceSubType);
      setTemVitimas(occurrence.occurrenceHasVictims !== undefined ? (occurrence.occurrenceHasVictims ? 'Sim' : 'Não') : 'Não');
      
      setEndereco({
        cep: occurrence.zipCode || '',
        logradouro: occurrence.street || '',
        numero: occurrence.number || '',
        bairro: occurrence.neighborhood || '',
        cidade: occurrence.city || '',
        estado: occurrence.state || '',
        complemento: occurrence.complement || ''
      });
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar os dados da ocorrência',
        color: 'red'
      });
      navigate('/Ocorrencia');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar os dados iniciais
  useEffect(() => {
    const loadData = async () => {
      await loadUsers();
      if (id) {
        await loadOccurrence();
      } else {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate]);

  // Função que consulta o ViaCEP
  async function buscarCep(valor: string): Promise<void> {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        console.warn('CEP não encontrado');
        return;
      }

      // Atualiza os campos com o retorno
      setEndereco(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || ''
      }));
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
    }
  }

  function limparEndereco() {
    setEndereco(prev => ({
      ...prev,
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      complemento: ''
    }));
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    console.log('=== INÍCIO DO HANDLE SUBMIT ===');
    e.preventDefault();
    
    // Verificar campos obrigatórios
    const camposObrigatorios = [
      { nome: 'ID', valor: id },
      { nome: 'Nome do Solicitante', valor: nomeSolicitante },
      { nome: 'Telefone', valor: telefoneSolicitante },
      { nome: 'Tipo de Ocorrência', valor: tipoOcorrencia },
      { nome: 'Tem Vítimas', valor: temVitimas },
      { nome: 'Detalhes da Ocorrência', valor: occurrenceDetails },
      { nome: 'Latitude', valor: coordinates.latitude },
      { nome: 'Longitude', valor: coordinates.longitude },
      { nome: 'Logradouro', valor: endereco.logradouro },
      { nome: 'Número', valor: endereco.numero },
      { nome: 'Bairro', valor: endereco.bairro },
      { nome: 'Cidade', valor: endereco.cidade },
      { nome: 'Estado', valor: endereco.estado }
    ];
    
    const camposFaltantes = camposObrigatorios.filter(campo => !campo.valor);
    
    if (camposFaltantes.length > 0) {
      console.log('Campos obrigatórios faltando:', camposFaltantes);
      notifications.show({
        title: 'Erro de Validação',
        message: `Preencha os campos obrigatórios: ${camposFaltantes.map(c => c.nome).join(', ')}`,
        color: 'red'
      });
      return;
    }

    // Validações adicionais
    if (!(telefoneSolicitante.length === 10 || telefoneSolicitante.length === 11)) {
      notifications.show({
        title: 'Telefone inválido',
        message: 'Informe um telefone com DDD (10 ou 11 dígitos). Ex: (81) 98765-8765',
        color: 'red'
      });
      return;
    }

    console.log('Todos os campos obrigatórios preenchidos');
    setSubmitting(true);

    try {
      console.log('Criando payload...');
      
      // Verificar se as coordenadas são números válidos
      if (isNaN(coordinates.latitude!) || isNaN(coordinates.longitude!)) {
        throw new Error('Coordenadas inválidas');
      }
      const payload: IUpdateOccurrenceRequest = {
        occurrenceHasVictims: temVitimas === 'Sim',
        occurrenceRequester: nomeSolicitante.trim(),
        occurrenceRequesterPhoneNumber: telefoneSolicitante.replace(/\D/g, ''),
        occurrenceSubType: tipoOcorrencia,
        occurrenceDetails: occurrenceDetails.trim(),
        occurrenceArrivalTime: new Date(occurrenceArrivalTime).toISOString(),
        latitude: coordinates.latitude!,
        longitude: coordinates.longitude!,
        userIds: userIds.map(id => Number(id)),
        address: {
          zipCode: endereco.cep.replace(/\D/g, ''),
          street: endereco.logradouro.trim(),
          number: endereco.numero.trim(),
          neighborhood: endereco.bairro.trim(),
          city: endereco.cidade.trim(),
          state: endereco.estado.trim().toUpperCase(),
          complement: endereco.complemento?.trim() || ''
        }
      };

      console.log('Payload criado:', JSON.stringify(payload, null, 2));
      
      console.log('Chamando occurrenceService.update...');
      const response = await occurrenceService.update(Number(id), payload);
      console.log('Resposta do servidor:', response);

      notifications.show({
        title: 'Sucesso',
        message: 'Ocorrência atualizada com sucesso',
        color: 'green'
      });

      // Redirecionar para a lista de ocorrências
      navigate('/Ocorrencia');
    } catch (error: any) {
      console.error('=== ERRO AO ATUALIZAR OCORRÊNCIA ===');
      console.error('Tipo do erro:', typeof error);
      console.error('Mensagem:', error?.message);
      console.error('Stack:', error?.stack);
      
      let errorMessage = 'Erro ao atualizar a ocorrência';
      
      if (error?.response?.data) {
        // Se for um erro do Axios
        console.error('Resposta de erro do servidor:', error.response.data);
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
      } else if (error?.message) {
        // Se for um erro padrão
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.message || error.message;
        } catch (e) {
          errorMessage = error.message;
        }
      }
      
      console.error('Mensagem de erro para o usuário:', errorMessage);
      
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
        autoClose: 10000
      });
    } finally {
      setSubmitting(false);
    }
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (loading) {
    return (
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  console.log('Renderizando formulário');
  
  return (
    <form 
      onSubmit={(e) => {
        console.log('Evento onSubmit do formulário');
        handleSubmit(e);
      }} 
      className={classes.centerWrap}
    >
      <Title order={2} className={classes.title}>Editar Ocorrência</Title>

      <div className={classes.cardsStack}>
        {/* Dados do solicitante */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Dados do solicitante</Title>
          <div className={classes.formGrid}>
            <TextInput
              label="Nome do solicitante"
              placeholder="Nome do solicitante"
              value={nomeSolicitante}
              onChange={(e) => setNomeSolicitante(e.target.value)}
              required
            />
            <TextInput
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={formatPhone(telefoneSolicitante)}
              onChange={(e) => setTelefoneSolicitante(e.target.value.replace(/\D/g, '').slice(0, 11))}
              required
              inputMode="tel"
            />
          </div>
        </Paper>

        {/* Local da ocorrência */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Local da ocorrência</Title>
          <div className={classes.formGrid}>
            <TextInput
              label="CEP"
              placeholder="CEP"
              value={endereco.cep}
              onChange={(e) => {
                const valor = e.target.value;
                setEndereco(prev => ({ ...prev, cep: valor }));
              
                const limpo = valor.replace(/\D/g, '');
              
                if (limpo.length === 8) {
                  buscarCep(limpo);
                } else {
                  limparEndereco();
                }
              }}
              maxLength={9}
              required
            />
            <TextInput
              label="Logradouro"
              placeholder="Rua, Avenida, etc."
              value={endereco.logradouro}
              onChange={(e) => setEndereco(prev => ({ ...prev, logradouro: e.target.value }))}
              required
            />
            <TextInput
              label="Número"
              placeholder="Número"
              value={endereco.numero}
              onChange={(e) => setEndereco(prev => ({ ...prev, numero: e.target.value }))}
              required
            />
            <TextInput
              label="Complemento"
              placeholder="Complemento (opcional)"
              value={endereco.complemento}
              onChange={(e) => setEndereco(prev => ({ ...prev, complemento: e.target.value }))}
            />
            <TextInput
              label="Bairro"
              placeholder="Bairro"
              value={endereco.bairro}
              onChange={(e) => setEndereco(prev => ({ ...prev, bairro: e.target.value }))}
              required
            />
            <TextInput
              label="Cidade"
              placeholder="Cidade"
              value={endereco.cidade}
              onChange={(e) => setEndereco(prev => ({ ...prev, cidade: e.target.value }))}
              required
            />
            <TextInput
              label="Estado"
              placeholder="UF"
              value={endereco.estado}
              onChange={(e) => setEndereco(prev => ({ ...prev, estado: e.target.value }))}
              maxLength={2}
              required
            />
          </div>
        </Paper>

        {/* Detalhes da ocorrência */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Detalhes da ocorrência</Title>
          <div className={classes.formGrid}>
            <Select
              label="Tipo de ocorrência"
              placeholder="Selecione o tipo"
              data={[
                { value: 'Incêndio Urbano', label: 'Incêndio Urbano' },
                { value: 'Incêndio Florestal', label: 'Incêndio Florestal' },
                { value: 'Acidente de Trânsito', label: 'Acidente de Trânsito' },
                { value: 'Afogamento', label: 'Afogamento' },
                { value: 'Queda de Altura', label: 'Queda de Altura' },
                { value: 'Desabamento', label: 'Desabamento' },
                { value: 'Outros', label: 'Outros' }
              ]}
              value={tipoOcorrencia}
              onChange={(value) => value && setTipoOcorrencia(value)}
              required
            />
            <div>
              <Text size="sm" fw={500} mb={5}>
                Há vítimas? <Text component="span" c="red">*</Text>
              </Text>
              <Radio.Group
                value={temVitimas}
                onChange={(value) => setTemVitimas(value)}
                name="temVitimas"
                required
              >
                <Group mt="xs">
                  <Radio value="Sim" label="Sim" />
                  <Radio value="Não" label="Não" />
                </Group>
              </Radio.Group>
            </div>
          </div>
        </Paper>

        {/* Detalhes adicionais */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Informações Adicionais</Title>
          <div className={classes.formGrid}>
            <Textarea
              label="Detalhes da Ocorrência"
              placeholder="Descreva os detalhes da ocorrência"
              value={occurrenceDetails}
              onChange={(e) => setOccurrenceDetails(e.target.value)}
              required
              minRows={3}
            />
            
            <MantineTextInput
              type="datetime-local"
              label="Horário de Chegada"
              value={occurrenceArrivalTime}
              onChange={(e) => setOccurrenceArrivalTime(e.target.value)}
              required
            />

            <MultiSelect
              label="Usuários Responsáveis"
              placeholder="Selecione os usuários"
              data={availableUsers}
              value={userIds}
              onChange={setUserIds}
              required
              searchable
              clearable
              className={classes.usuarios}
            />

            <Group grow>
              <TextInput
                label="Latitude"
                placeholder="Ex: -8.052240"
                value={coordinates.latitude?.toString() || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setCoordinates(prev => ({
                    ...prev,
                    latitude: isNaN(value) ? null : value
                  }));
                }}
                required
              />
              <TextInput
                label="Longitude"
                placeholder="Ex: -34.928610"
                value={coordinates.longitude?.toString() || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setCoordinates(prev => ({
                    ...prev,
                    longitude: isNaN(value) ? null : value
                  }));
                }}
                required
              />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (navigator.geolocation) {
                      setSubmitting(true);
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setCoordinates({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          });
                          notifications.show({
                            title: 'Sucesso',
                            message: 'Localização obtida com sucesso!',
                            color: 'green'
                          });
                          setSubmitting(false);
                        },
                        (error) => {
                          console.error('Erro ao obter localização:', error);
                          notifications.show({
                            title: 'Erro',
                            message: 'Não foi possível obter a localização. Por favor, preencha manualmente.',
                            color: 'red'
                          });
                          setSubmitting(false);
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                      );
                    } else {
                      notifications.show({
                        title: 'Erro',
                        message: 'Seu navegador não suporta geolocalização. Preencha manualmente.',
                        color: 'red'
                      });
                    }
                  }}
                  loading={submitting}
                  style={{ height: '36px' }}
                >
                  Minha Localização
                </Button>
              </div>
            </Group>
          </div>
        </Paper>
      </div>

      <Group justify="flex-end" mt="md" className={classes.actions}>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            navigate('/Ocorrencia');
          }}
          disabled={submitting}
          type="button"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={submitting}
        >
          Salvar alterações
        </Button>
      </Group>
    </form>
  );
}
