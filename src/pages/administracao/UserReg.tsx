import { useState, useEffect } from 'react';
import classes from '../../styles/administracao/RegUser.module.css';
import {  
  Select,
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
import { useNavigate } from 'react-router-dom';

export function CadastroUsuario() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [battalions, setBattalions] = useState<Array<{ value: string; label: string }>>([]);
    const [patents, setPatents] = useState<Array<{ value: string; label: string }>>([]);
    
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
          cpf: cpf.replace(/\D/g, ''),
          matriculates,
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          gender: gender === 'Masculino' ? 'M' : 'F',
          patent: parseInt(patent!),
          battalion: parseInt(battalion!),
          dateBirth: new Date(dateBirth).toISOString(),
          password,
          address: {
            zipCode: zipCode.replace(/\D/g, ''),
            street,
            number: parseInt(number),
            complement,
            neighborhood,
            city,
            state: state!.split('(')[1].replace(')', '').trim()
          }
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
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
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
                data={[
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
                  'Tocantins (TO)',
                ]}
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

