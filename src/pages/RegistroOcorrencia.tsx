import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from '../styles/RegistroOcorrencia.module.css';
import {  
  Select,
  TextInput,
  Paper,
  Title,
  Button,
  Group,
  Radio
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceRequest } from '../interfaces/IOccurrence';

export function RegistroOcorrencia() {
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [temVitimas, setTemVitimas] = useState<string | null>(null);
  const [nomeSolicitante, setNomeSolicitante] = useState('');
  const [telefoneSolicitante, setTelefoneSolicitante] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    numero: ''
  });

  // Função que consulta o ViaCEP
  async function buscarCep(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return; // só consulta quando tiver 8 dígitos

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        console.warn('CEP não encontrado');
        return;
      }

      // Atualiza os campos com o retorno
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

  function limparEndereco() {
    setEndereco({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      complemento: '',
      numero: ''
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nomeSolicitante || !telefoneSolicitante || !tipoOcorrencia || temVitimas === null) {
      notifications.show({
        title: 'Erro',
        message: 'Preencha todos os campos obrigatórios',
        color: 'red'
      });
      return;
    }

    // telefone deve ter 10 (fixo) ou 11 (celular) dígitos
    if (!(telefoneSolicitante.length === 10 || telefoneSolicitante.length === 11)) {
      notifications.show({
        title: 'Telefone inválido',
        message: 'Informe um telefone com DDD (10 ou 11 dígitos). Ex: (81) 98765-8765',
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

    setLoading(true);

    try {
      const payload: IOccurrenceRequest = {
        occurrenceHasVictims: temVitimas === 'Sim',
        occurrenceRequester: nomeSolicitante,
        occurrenceRequesterPhoneNumber: telefoneSolicitante,
        occurrenceSubType: tipoOcorrencia,
        address: {
          zipCode: cep.replace(/\D/g, ''),
          street: endereco.logradouro,
          number: endereco.numero,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          complement: endereco.complemento
        }
      };

      await occurrenceService.create(payload);

      notifications.show({
        title: 'Sucesso',
        message: 'Ocorrência criada com sucesso',
        color: 'green'
      });

      // Redirecionar para a lista de ocorrências
      navigate('/Ocorrencia');
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor',
        color: 'red'
      });
    } finally {
      setLoading(false);
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

  return (
    <>
      <div className={classes.centerWrap}>
        <Title order={2} className={classes.title}>Registro de Ocorrência</Title>

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
                value={cep}
                onChange={(e) => {
                  const valor = e.target.value;
                  setCep(valor);
                
                  const limpo = valor.replace(/\D/g, '');
                
                  if (limpo.length === 8) {
                    buscarCep(limpo);
                  } else {
                    limparEndereco();
                  }
                }}
                maxLength={9}
              />

              <TextInput
                label="Logradouro"
                placeholder="Logradouro"
                value={endereco.logradouro}
                onChange={(e) =>
                  setEndereco({ ...endereco, logradouro: e.target.value })
                }
              />

              <TextInput
                label="Número"
                placeholder="Número do local"
                value={endereco.numero}
                onChange={(e) =>
                  setEndereco({ ...endereco, numero: e.target.value })
                }
              />

              <TextInput
                label="Bairro"
                placeholder="Bairro"
                value={endereco.bairro}
                onChange={(e) =>
                  setEndereco({ ...endereco, bairro: e.target.value })
                }
              />

              <TextInput
                label="Cidade"
                placeholder="Cidade"
                value={endereco.cidade}
                onChange={(e) =>
                  setEndereco({ ...endereco, cidade: e.target.value })
                }
              />

              <TextInput
                label="Estado"
                placeholder="Estado"
                value={endereco.estado}
                onChange={(e) =>
                  setEndereco({ ...endereco, estado: e.target.value })
                }
              />

              <TextInput
                label="Complemento"
                placeholder="Complemento"
                value={endereco.complemento}
                onChange={(e) =>
                  setEndereco({ ...endereco, complemento: e.target.value })
                }
              />
            </div>
          </Paper>

          {/* Dados da ocorrência */}
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Dados da ocorrência</Title>
            <form className={classes.form}>
              <Select
                className={classes.fullWidthField}
                label="Tipo de Ocorrência"
                placeholder="Informe o tipo de ocorrência"
                value={tipoOcorrencia}
                onChange={setTipoOcorrencia}
                data={[
                  'Incêndio urbano',
                  'Acidente de trânsito',
                  'Resgate em altura',
                  'Afogamento',
                  'Acidente com produtos perigosos'
                ]}
                required
              />

              <Radio.Group
                className={classes.fullWidthField}
                label="Existência de vítimas"
                description="Existem vítimas?"
                withAsterisk
                value={temVitimas || ''}
                onChange={(value) => setTemVitimas(value)}
              >
                <Group mt="xs" justify="center">
                  <Radio value="Sim" label="Sim" />
                  <Radio value="Não" label="Não" />
                </Group>
              </Radio.Group>
            </form>
          </Paper>
        </div>

        <Button 
          variant="filled" 
          className={classes.button}
          onClick={handleSubmit}
          loading={loading}
        >
          Registrar
        </Button>
      </div>
    </>
  );
}