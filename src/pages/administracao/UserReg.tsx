import { useState, useEffect } from 'react';
import classes from '../../styles/administracao/RegUser.module.css';
import {  
  Select,
  MultiSelect,
  TextInput,
  Paper,
  Title,
  Button,
  PasswordInput 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { registerUser } from '../../services/userService';
import type { UserRegisterDTO } from '../../interfaces/IUser';
import { getBattalionsPaginated } from '../../services/battalionService';
import { getAllPatents } from '../../services/patentService';
import { getAllRoles } from '../../services/roleService';
import { useNavigate } from 'react-router-dom';

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

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
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

export function CadastroUsuario() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [battalions, setBattalions] = useState<Array<{ value: string; label: string }>>([]);
    const [patents, setPatents] = useState<Array<{ value: string; label: string }>>([]);
    const [roles, setRoles] = useState<Array<{ value: string; label: string }>>([]);
    
    // Personal data
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [matriculates, setMatriculates] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [patent, setPatent] = useState<string | null>(null);
    const [battalion, setBattalion] = useState<string | null>(null);
    const [roleIds, setRoleIds] = useState<string[]>([]);
    const [dateBirth, setDateBirth] = useState('');
    
    // Address data
    const [zipCode, setZipCode] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState<string | null>(null);
    
    // Access data
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
      fetchBattalions();
      fetchPatents();
      fetchRoles();
    }, []);

    const fetchBattalions = async () => {
      try {
        const [activeResponse] = await Promise.all([
          getBattalionsPaginated(1, 100, undefined, true)
        ]);
        const options = activeResponse.items.map(b => ({
          value: b.id.toString(),
          label: b.name
        }));
        setBattalions(options);
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao carregar batalhões',
          color: 'red',
        });
      }
    };

    const fetchPatents = async () => {
      try {
        const patentList = await getAllPatents();
        const options = patentList
          .filter(p => p.active)
          .map(p => ({
            value: p.id.toString(),
            label: p.name
          }));
        setPatents(options);
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao carregar patentes',
          color: 'red',
        });
      }
    };

    const fetchRoles = async () => {
      try {
        const roleList = await getAllRoles();
        const options = roleList
          .filter((role) => role.active)
          .map((role) => ({ value: role.id.toString(), label: role.name }));
        setRoles(options);
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao carregar perfis',
          color: 'red',
        });
      }
    };

    const fetchAddressByCep = async (value: string) => {
      const sanitized = value.replace(/\D/g, '');
      if (sanitized.length !== 8) return;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
        const data = await response.json();

        if (data.erro) {
          notifications.show({
            title: 'CEP não encontrado',
            message: 'Verifique o CEP informado e tente novamente.',
            color: 'yellow',
          });
          return;
        }

        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setComplement(data.complemento || '');
        const stateLabel = findStateLabelByUF(data.uf || '');
        if (stateLabel) {
          setState(stateLabel);
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        notifications.show({
          title: 'Erro',
          message: 'Não foi possível buscar o CEP informado.',
          color: 'red',
        });
      }
    };

    const handleSubmit = async () => {

      const missingFields = [];
      if (!name) missingFields.push('Nome');
      if (!username) missingFields.push('Username');
      if (!email) missingFields.push('Email');
      if (!cpf) missingFields.push('CPF');
      if (!matriculates) missingFields.push('Matrícula');
      if (!phoneNumber) missingFields.push('Telefone');
      if (!gender) missingFields.push('Sexo');
      if (!patent) missingFields.push('Patente');
      if (!battalion) missingFields.push('Batalhão');
      if (!dateBirth) missingFields.push('Data de Nascimento');
      if (roleIds.length === 0) missingFields.push('Perfil');
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        notifications.show({
          title: 'Campos obrigatórios faltando',
          message: `Preencha: ${missingFields.join(', ')}`,
          color: 'red',
        });
        return;
      }

      if (!zipCode || !street || !number || !neighborhood || !city || !state) {
        notifications.show({
          title: 'Erro',
          message: 'Preencha todos os campos de endereço obrigatórios',
          color: 'red',
        });
        return;
      }

      if (!password || !confirmPassword) {
        notifications.show({
          title: 'Erro',
          message: 'Preencha os campos de senha',
          color: 'red',
        });
        return;
      }

      if (password !== confirmPassword) {
        notifications.show({
          title: 'Erro',
          message: 'As senhas não coincidem',
          color: 'red',
        });
        return;
      }

      console.log('Validation passed, preparing to send...');
      
      try {
        setLoading(true);
        console.log('Loading set to true');

        const userData: UserRegisterDTO = {
          name,
          username,
          email,
          cpf,
          matriculates,
          phoneNumber,
          gender: gender === 'Masculino' ? 'M' : 'F',
          patent: parseInt(patent!),
          battalion: parseInt(battalion!),
          dateBirth: new Date(dateBirth).toISOString(),
          password,
          address: {
            zipCode,
            street,
            number: parseInt(number),
            complement,
            neighborhood,
            city,
            state: state!.split('(')[1].replace(')', '').trim()
          },
          roleIds: roleIds.map((id) => Number(id))
        };

        console.log('Sending userData to backend:', userData);
        await registerUser(userData);
        console.log('User registered successfully!');
        
        notifications.show({
          title: 'Sucesso',
          message: 'Usuário cadastrado com sucesso!',
          color: 'green',
        });

        // Redirect to users list
        navigate('/administracao/Users');
      } catch (error: any) {
        console.error('Error registering user:', error);
        console.error('Error response:', error.response);
        notifications.show({
          title: 'Erro',
          message: error.response?.data?.mensagem || error.message || 'Erro ao cadastrar usuário',
          color: 'red',
        });
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    return (
    <div className={classes.mainContent}>
      <div className={classes.centerWrap}>
        <Title order={2} className={classes.title}>Cadastro de Usuário</Title>
        <div className={classes.cardsStack}>
        <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Dados pessoais</Title>
            <div className={classes.formGrid}>
              <TextInput
                label="Nome do usuário"
                placeholder="Nome"
                description="Forneça o nome completo do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextInput
                label="Username"
                placeholder="Username"
                description="Nome de usuário para login (5-30 caracteres)"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextInput
                label="Email"
                placeholder="Email"
                description="Forneça o email do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <TextInput
                label="CPF"
                placeholder="000.000.000-00"
                description="Forneça o CPF do usuario (apenas números)"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={formatCPF(cpf)}
                onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
                maxLength={14}
                required
              />
              <TextInput
                label="Matricula"
                placeholder="Matricula"
                description="Forneça a matricula do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={matriculates}
                onChange={(e) => setMatriculates(e.target.value)}
                required
              />
              <TextInput
                label="Numero de telefone"
                placeholder="(00) 00000-0000"
                description="Forneça o numero de telefone do usuario (11 dígitos)"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={formatPhone(phoneNumber)}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                maxLength={15}
                required
              />
              <TextInput
                label="Data de Nascimento"
                placeholder="DD/MM/AAAA"
                description="Data de nascimento do usuário"
                type="date"
                value={dateBirth}
                onChange={(e) => setDateBirth(e.target.value)}
                required
              />
              <Select
                className={classes.fullWidthField}
                label="Sexo"
                placeholder="Informe o sexo do usuario"
                data={['Masculino', 'Feminino']}
                value={gender}
                onChange={setGender}
                required
              />
              <Select
                className={classes.fullWidthField}
                label="Patente"
                placeholder="Informe a patente do usuario"
                data={patents}
                value={patent}
                onChange={setPatent}
                required
              />
              <Select
                className={classes.fullWidthField}
                label="Batalhão"
                placeholder="Informe o batalhão do usuario"
                data={battalions}
                value={battalion}
                onChange={setBattalion}
                required
              />
              <MultiSelect
                className={classes.fullWidthField}
                label="Perfil"
                placeholder="Selecione o perfil"
                data={roles}
                value={roleIds}
                onChange={setRoleIds}
                required
                searchable
              />
            </div>
          </Paper>
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Endereço</Title>
            <div className={classes.formGrid}>
            <TextInput
                label="CEP"
                placeholder="00000-000"
                description="Forneça o cep do usuario (8 dígitos)"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={formatCep(zipCode)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setZipCode(digits);
                  if (digits.length === 8) {
                    fetchAddressByCep(digits);
                  }
                }}
                maxLength={9}
                required
              />
              <TextInput
                label="Logradouro"
                placeholder="Logradouro"
                description="Forneça o logradouro do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
              <TextInput
                label="Numero"
                placeholder="Numero"
                description="Forneça o numero do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
              <TextInput
                label="Complemento"
                placeholder="Complemento"
                description="Forneça o complemento do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
              <TextInput
                label="Bairro"
                placeholder="Bairro"
                description="Forneça o bairro do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
              />
              <TextInput
                label="Cidade"
                placeholder="Cidade"
                description="Forneça a cidade do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Select
                className={classes.fullWidthField}
                label="Estado"
                placeholder="Informe o estado do usuário"
                value={state}
                onChange={setState}
                required
                data={STATE_OPTIONS}
              />


            </div>
          </Paper>
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Dados de acesso</Title>
            <div className={classes.formGrid}>
              <PasswordInput
                label="Senha"
                placeholder="Senha"
                description="Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 especial"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordInput
                label="Confirme a senha"
                placeholder="Confirme a senha"
                description="Confirme a senha do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </Paper>
        </div>
        <Button 
          variant="filled" 
          className={classes.button}
          onClick={() => {
            handleSubmit();
          }}
          loading={loading}
          type="button"
        >
          Cadastrar Usuário
        </Button>
      </div>
    </div>
  );
}

