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
import { getUserById, updateUser } from '../../services/authService';
import { getAllPatents } from '../../services/patentService';
import { getBattalionsPaginated } from '../../services/battalionService';
import { getAllRoles } from '../../services/roleService';
import type { UserUpdateDTO, UserDetailDTO } from '../../interfaces/IUser';
import type { PatentDTO } from '../../interfaces/IPatent';
import type { BattalionDTO } from '../../interfaces/IBattalion';
import type { RoleDTO } from '../../interfaces/IRole';

export function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cep, setCep] = useState('');

  // Form fields
  const [username, setUsername] = useState('');
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
        const userData = await getUserById(Number(id));

        // Set form values
        setUsername(userData.username || '');
        setEmail(userData.email || '');

        const phoneNumberSanitized = (userData.phoneNumber || '').replace(/\D/g, '');
        setPhoneNumber(phoneNumberSanitized);

        const cpfSanitized = (userData.cpf || '').replace(/\D/g, '');
        setCpf(cpfSanitized);

        setMatriculates(userData.matriculates || '');
        setName(userData.normalizedName || '');
        setGender(userData.gender || null);
        
        if (userData.dateBirth) {
          const date = new Date(userData.dateBirth);
          const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
          setDateBirth(localDate);
        }

        if (userData.patent?.id) {
          setPatent(userData.patent.id.toString());
        }

        if (userData.battalion?.id) {
          setBattalion(userData.battalion.id.toString());
        }

        if (userData.userRoles && userData.userRoles.length > 0) {
          const parsedRoles = userData.userRoles
            .map(ur => ur.role?.id)
            .filter((roleId): roleId is number => typeof roleId === 'number')
            .map(roleId => roleId.toString());
          setRoleIds(parsedRoles);
        }

        if (userData.address) {
          setCep((userData.address.zipCode || '').replace(/\D/g, ''));
          setEndereco({
            logradouro: userData.address.street || '',
            numero: userData.address.number?.toString() || '',
            bairro: userData.address.neighborhood || '',
            cidade: userData.address.city || '',
            estado: userData.address.state || '',
            complemento: userData.address.complement || ''
          });
        }

        try {
          const [patentsData, battalionsData, rolesData] = await Promise.all([
            getAllPatents(),
            getBattalionsPaginated(1, 100, undefined, true),
            getAllRoles()
          ]);
          setPatents(patentsData);
          setBattalions(battalionsData.items);
          setRoles(rolesData);
        } catch (optionsError) {
          notifications.show({
            title: 'Aviso',
            message: 'Não foi possível carregar todas as opções. Verifique sua conexão e tente novamente.',
            color: 'yellow'
          });
        }
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao carregar dados do usuário',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  async function buscarCep(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        console.warn('CEP não encontrado');
        return;
      }

      setEndereco((prev) => ({
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

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function formatCPF(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    // Validations
    if (!username || !email || !phoneNumber || !cpf || !matriculates || !name || !dateBirth || !gender || !battalion || !patent) {
      notifications.show({
        title: 'Erro',
        message: 'Preencha todos os campos obrigatórios',
        color: 'red'
      });
      return;
    }

    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      notifications.show({
        title: 'Telefone inválido',
        message: 'Informe um telefone com DDD (10 ou 11 dígitos)',
        color: 'red'
      });
      return;
    }

    if (cpf.length !== 11) {
      notifications.show({
        title: 'CPF inválido',
        message: 'Informe um CPF válido com 11 dígitos',
        color: 'red'
      });
      return;
    }

    if (!endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
      notifications.show({
        title: 'Erro',
        message: 'Preencha todos os campos de endereço',
        color: 'red'
      });
      return;
    }

    if (roleIds.length === 0) {
      notifications.show({
        title: 'Erro',
        message: 'Selecione pelo menos uma função',
        color: 'red'
      });
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
          state: endereco.estado,
          zipCode: cep.replace(/\D/g, '')
        },
        patent: Number(patent),
        roleIds: roleIds.map(id => Number(id))
      };

      await updateUser(Number(id), payload);

      notifications.show({
        title: 'Sucesso',
        message: 'Usuário atualizado com sucesso',
        color: 'green'
      });

      navigate('/administracao/Users');
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: error instanceof Error ? error.message : 'Erro ao atualizar usuário',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={classes.centerWrap}>
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
              placeholder="CEP"
              value={cep}
              onChange={(e) => {
                const valor = e.target.value;
                setCep(valor);
                const limpo = valor.replace(/\D/g, '');
                if (limpo.length === 8) {
                  buscarCep(limpo);
                }
              }}
              maxLength={9}
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
            <TextInput
              label="Estado"
              placeholder="UF"
              value={endereco.estado}
              onChange={(e) => setEndereco({ ...endereco, estado: e.target.value.toUpperCase() })}
              maxLength={2}
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
          variant="outline" 
          onClick={() => navigate('/administracao/Users')}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          loading={submitting}
          disabled={submitting}
        >
          Salvar Alterações
        </Button>
      </Group>
    </div>
  );
}

export default EditarUsuario;
