import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from '../../styles/RegistroOcorrencia.module.css';
import {
  Select,
  TextInput,
  Paper,
  Title,
  Button,
  MultiSelect,
  LoadingOverlay,
  Group
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useErrorHandler, notificationService } from '../../error-handling';
import { getUserById, updateUser } from '../../services/authService';
import { getAllPatents } from '../../services/patentService';
import { getBattalionsPaginated } from '../../services/battalionService';
import { getAllRoles } from '../../services/roleService';
import type { UserUpdateDTO, UserDetailDTO } from '../../interfaces/IUser';
import type { PatentDTO } from '../../interfaces/IPatent';
import type { BattalionDTO } from '../../interfaces/IBattalion';
import type { RoleDTO } from '../../interfaces/IRole';

type AddressFieldKey = 'zipCode' | 'street' | 'number' | 'neighborhood' | 'city' | 'state' | 'complement';
type AddressFields = Partial<Record<AddressFieldKey, string | number>>;

const ADDRESS_ALIASES: Record<AddressFieldKey, string[]> = {
  zipCode: ['zipCode', 'cep', 'postalCode'],
  street: ['street', 'logradouro', 'addressLine'],
  number: ['number', 'numero'],
  neighborhood: ['neighborhood', 'bairro'],
  city: ['city', 'cidade', 'cityName'],
  state: ['state', 'estado', 'uf'],
  complement: ['complement', 'complemento']
};

const hasAddressField = (candidate: Record<string, unknown>) =>
  Object.values(ADDRESS_ALIASES).some((aliases) =>
    aliases.some((alias) => alias in candidate && candidate[alias] !== undefined && candidate[alias] !== null)
  );

const normalizeAddressFields = (candidate: Record<string, unknown>): AddressFields => {
  const normalized: AddressFields = {};

  (Object.keys(ADDRESS_ALIASES) as AddressFieldKey[]).forEach((key) => {
    const aliases = ADDRESS_ALIASES[key];
    for (const alias of aliases) {
      if (alias in candidate && candidate[alias] !== undefined && candidate[alias] !== null) {
        normalized[key] = candidate[alias] as string | number;
        break;
      }
    }
  });

  return normalized;
};

const extractUserAddress = (candidate: unknown, visited = new WeakSet<object>()): AddressFields | undefined => {
  if (!candidate || typeof candidate !== 'object') {
    return undefined;
  }

  const node = candidate as Record<string, unknown>;

  if (visited.has(node)) {
    return undefined;
  }
  visited.add(node);

  if (hasAddressField(node)) {
    return normalizeAddressFields(node);
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') {
      const resolved = extractUserAddress(value, visited);
      if (resolved) {
        return resolved;
      }
    }
  }

  return undefined;
};

const STATE_OPTIONS = [
  'Acre (AC)',
  'Alagoas (AL)',
  'Amapá (AP)',
  'Amazonas (AM)',
  'Bahia (BA)',
  'Ceará (CE)',
  'Distrito Federal (DF)',
  'Espírito Santo (ES)',
  'Goiás (GO)',
  'Maranhão (MA)',
  'Mato Grosso (MT)',
  'Mato Grosso do Sul (MS)',
  'Minas Gerais (MG)',
  'Pará (PA)',
  'Paraíba (PB)',
  'Paraná (PR)',
  'Pernambuco (PE)',
  'Piauí (PI)',
  'Rio de Janeiro (RJ)',
  'Rio Grande do Norte (RN)',
  'Rio Grande do Sul (RS)',
  'Rondônia (RO)',
  'Roraima (RR)',
  'Santa Catarina (SC)',
  'São Paulo (SP)',
  'Sergipe (SE)',
  'Tocantins (TO)'
];

const findStateLabelByUF = (uf: string): string | undefined => {
  if (!uf) return undefined;
  const upperUf = uf.toUpperCase();
  return STATE_OPTIONS.find((option) => option.includes(`(${upperUf})`));
};

const extractUfFromStateLabel = (label?: string | null) => {
  if (!label) return '';
  const match = label.match(/\(([^)]+)\)/);
  return match ? match[1] : label;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler('user');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cep, setCep] = useState('');

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cpf, setCpf] = useState('');
  const [matriculates, setMatriculates] = useState('');
  const [name, setName] = useState('');
  const [dateBirth, setDateBirth] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [battalion, setBattalion] = useState<string | null>(null);
  const [patent, setPatent] = useState<string | null>(null);
  const [roleIds, setRoleIds] = useState<string[]>([]);

  // Address fields
  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    numero: ''
  });

  // Options for selects
  const [patents, setPatents] = useState<PatentDTO[]>([]);
  const [battalions, setBattalions] = useState<BattalionDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [patentsData, battalionsResponse, rolesData, userData] = await Promise.all([
          getAllPatents(),
          getBattalionsPaginated(1, 100, undefined, true),
          getAllRoles(),
          getUserById(Number(id))
        ]);

        const activePatents = patentsData.filter((patentItem) => patentItem.active);
        const battalionItems = battalionsResponse.items;
        const activeRoles = rolesData.filter((role) => role.active);

        setPatents(activePatents);
        setBattalions(battalionItems);
        setRoles(activeRoles);

        setUsername(userData.username || '');
        setEmail(userData.email || '');

        setPhoneNumber((userData.phoneNumber || '').replace(/\D/g, ''));
        setCpf((userData.cpf || '').replace(/\D/g, ''));
        setMatriculates(userData.matriculates || '');
        setName(userData.name || userData.normalizedName || '');
        setGender(userData.gender || null);

        if (userData.dateBirth) {
          const date = new Date(userData.dateBirth);
          const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
          setDateBirth(localDate);
        }

        const resolvedPatentId =
          userData.patent?.id ??
          activePatents.find((item) => item.name?.toLowerCase() === (userData.patent?.name || '').toLowerCase())?.id;
        setPatent(resolvedPatentId ? resolvedPatentId.toString() : null);

        const resolvedBattalionId =
          userData.battalion?.id ??
          battalionItems.find((item) => item.name?.toLowerCase() === (userData.battalion?.name || '').toLowerCase())?.id;
        setBattalion(resolvedBattalionId ? resolvedBattalionId.toString() : null);

        if (userData.userRoles && userData.userRoles.length > 0) {
          const parsedRoles = userData.userRoles
            .map((userRole) => {
              if (userRole.role?.id) {
                return userRole.role.id;
              }
              const fallback = activeRoles.find(
                (role) => role.name?.toLowerCase() === (userRole.role?.name || '').toLowerCase()
              );
              return fallback?.id;
            })
            .filter((roleId): roleId is number => typeof roleId === 'number')
            .map((roleId) => roleId.toString());
          setRoleIds(parsedRoles);
        } else {
          setRoleIds([]);
        }

        const resolvedAddress = extractUserAddress(userData as UserDetailDTO & Record<string, unknown>);

        if (resolvedAddress) {
          const zipValue = resolvedAddress.zipCode ? resolvedAddress.zipCode.toString() : '';
          const resolvedStateValue = (resolvedAddress.state ?? '') as string;
          const stateLabel = findStateLabelByUF(resolvedStateValue);
          setCep(zipValue.replace(/\D/g, ''));
          setEndereco({
            logradouro: (resolvedAddress.street ?? '') as string,
            numero: String(resolvedAddress.number ?? ''),
            bairro: (resolvedAddress.neighborhood ?? '') as string,
            cidade: (resolvedAddress.city ?? '') as string,
            estado: stateLabel ?? resolvedStateValue ?? '',
            complemento: (resolvedAddress.complement ?? '') as string
          });
        } else if (userData.address) {
          setCep((userData.address.zipCode || '').replace(/\D/g, ''));
          setEndereco({
            logradouro: userData.address.street || '',
            numero: userData.address.number?.toString() || '',
            bairro: userData.address.neighborhood || '',
            cidade: userData.address.city || '',
            estado: (findStateLabelByUF(userData.address.state || '') ?? (userData.address.state || '')),
            complemento: userData.address.complement || ''
          });
        } else {
          setEndereco({
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
            complemento: ''
          });
        }
      } catch (error) {
        await errorHandler.handleReadError(error, 'Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // errorHandler é estável para este ciclo específico e não precisa entrar nas dependências,
    // evitando reexecuções infinitas que mantinham o overlay carregando.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function buscarCep(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        notifications.show({
          title: 'CEP não encontrado',
          message: 'Verifique o CEP informado e tente novamente.',
          color: 'yellow'
        });
        return;
      }

      setEndereco((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: (findStateLabelByUF(data.uf || '') ?? (data.uf || prev.estado)),
        complemento: data.complemento || ''
      }));
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível buscar o CEP informado.',
        color: 'red'
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    // Validations
    if (!username || !email || !phoneNumber || !cpf || !matriculates || !name || !dateBirth || !gender || !battalion || !patent) {
      notificationService.showValidationError('Preencha todos os campos obrigatórios');
      return;
    }

    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      notificationService.showValidationError('Informe um telefone com DDD (10 ou 11 dígitos)');
      return;
    }

    if (cpf.length !== 11) {
      notificationService.showValidationError('Informe um CPF válido com 11 dígitos');
      return;
    }

    if (!cep || !endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
      notificationService.showValidationError('Preencha todos os campos de endereço');
      return;
    }

    if (roleIds.length === 0) {
      notificationService.showValidationError('Selecione pelo menos uma função');
      return;
    }

    setSubmitting(true);

    try {
      const payload: UserUpdateDTO = {
        username,
        email,
        phoneNumber,
        cpf,
        matriculates,
        name,
        dateBirth: new Date(dateBirth).toISOString(),
        gender,
        battalion: Number(battalion),
        address: {
          street: endereco.logradouro,
          number: Number(endereco.numero),
          complement: endereco.complemento,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: extractUfFromStateLabel(endereco.estado) || endereco.estado,
          zipCode: cep.replace(/\D/g, '')
        },
        patent: Number(patent),
        roleIds: roleIds.map(id => Number(id))
      };

      // Only include password if it was provided
      if (password.trim()) {
        payload.password = password;
      }

      await updateUser(Number(id), payload);

      errorHandler.showUpdateSuccess();
      navigate('/administracao/Users');
    } catch (error) {
      await errorHandler.handleUpdateError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={classes.centerWrap} onSubmit={handleSubmit}>
      <LoadingOverlay visible={loading} />

      <Title order={2} className={classes.title}>Editar Usuário</Title>

      <div className={classes.cardsStack}>
        {/* Dados de Acesso */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Dados de Acesso</Title>
          <div className={classes.formGrid}>
            <TextInput
              label="Nome de usuário"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextInput
              label="Email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
            <TextInput
              label="Nova Senha (opcional)"
              placeholder="Deixe em branco para manter a senha atual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              description="Preencha apenas se desejar alterar a senha"
            />
          </div>
        </Paper>

        {/* Dados Pessoais */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Dados Pessoais</Title>
          <div className={classes.formGrid}>
            <TextInput
              label="Nome completo"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextInput
              label="CPF"
              placeholder="000.000.000-00"
              value={formatCPF(cpf)}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
              required
            />
            <TextInput
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={formatPhone(phoneNumber)}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
              required
              inputMode="tel"
            />
            <TextInput
              label="Data de Nascimento"
              placeholder="Data de nascimento"
              value={dateBirth}
              onChange={(e) => setDateBirth(e.target.value)}
              required
              type="date"
            />
            <Select
              label="Gênero"
              placeholder="Selecione o gênero"
              value={gender}
              onChange={setGender}
              data={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' }
              ]}
              required
            />
          </div>
        </Paper>

        {/* Dados Profissionais */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Dados Profissionais</Title>
          <div className={classes.formGrid}>
            <TextInput
              label="Matrícula"
              placeholder="BM-000000"
              value={matriculates}
              onChange={(e) => setMatriculates(e.target.value)}
              required
            />
            <Select
              label="Patente"
              placeholder="Selecione a patente"
              value={patent}
              onChange={setPatent}
              data={patents.map(p => ({ value: p.id.toString(), label: p.name }))}
              required
              searchable
            />
            <Select
              label="Batalhão"
              placeholder="Selecione o batalhão"
              value={battalion}
              onChange={setBattalion}
              data={battalions.map(b => ({ value: b.id.toString(), label: b.name }))}
              required
              searchable
            />
            <MultiSelect
              label="Perfil"
              placeholder="Selecione o perfil"
              value={roleIds}
              onChange={setRoleIds}
              data={roles.map(r => ({ value: r.id.toString(), label: r.name }))}
              required
              searchable
            />
          </div>
        </Paper>

        {/* Endereço */}
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
          <Title order={3} className={classes.cardTitle}>Endereço</Title>
          <div className={classes.formGrid}>
            <TextInput
              label="CEP"
              placeholder="00000-000"
              value={formatCep(cep)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                setCep(digits);
                if (digits.length === 8) {
                  buscarCep(digits);
                }
              }}
              maxLength={9}
              required
            />
            <TextInput
              label="Logradouro"
              placeholder="Logradouro"
              value={endereco.logradouro}
              onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
            />
            <TextInput
              label="Número"
              placeholder="Número"
              value={endereco.numero}
              onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
            />
            <TextInput
              label="Bairro"
              placeholder="Bairro"
              value={endereco.bairro}
              onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
            />
            <TextInput
              label="Cidade"
              placeholder="Cidade"
              value={endereco.cidade}
              onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
            />
            <Select
              label="Estado"
              placeholder="Selecione o estado"
              data={STATE_OPTIONS}
              value={endereco.estado || null}
              onChange={(value) => setEndereco({ ...endereco, estado: value || '' })}
              searchable
              nothingFoundMessage="Nenhum estado"
            />
            <TextInput
              label="Complemento"
              placeholder="Complemento"
              value={endereco.complemento}
              onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
            />
          </div>
        </Paper>
      </div>

      <Group justify="center" mt="xl">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => navigate('/administracao/Users')}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          loading={submitting}
          disabled={submitting}
        >
          Salvar Alterações
        </Button>
      </Group>
    </form>
  );
}

export default EditarUsuario;
