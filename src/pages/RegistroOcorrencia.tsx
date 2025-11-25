import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import classes from '../styles/RegistroOcorrencia.module.css';
import {  
  Select,
  TextInput,
  Paper,
  Title,
  Button,
  Group,
  Radio,
  Loader
} from '@mantine/core';

import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceRequest, IOccurrenceNature, IOccurrenceType, IOccurrenceSubtype } from '../interfaces/IOccurrence';

import { useErrorHandler, notificationService } from '../error-handling';

export function RegistroOcorrencia() {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler('occurrence');
  const { handleReadError } = errorHandler;
  const [cep, setCep] = useState('');
  const [temVitimas, setTemVitimas] = useState<string | null>(null);
  const [nomeSolicitante, setNomeSolicitante] = useState('');
  const [telefoneSolicitante, setTelefoneSolicitante] = useState('');
  const [naturezaId, setNaturezaId] = useState<string | null>(null);
  const [tipoId, setTipoId] = useState<string | null>(null);
  const [subtipoId, setSubtipoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [naturezaLoading, setNaturezaLoading] = useState(false);
  const [tipoLoading, setTipoLoading] = useState(false);
  const [subtipoLoading, setSubtipoLoading] = useState(false);
  const [naturezaOptions, setNaturezaOptions] = useState<{ value: string; label: string }[]>([]);
  const [tipoOptions, setTipoOptions] = useState<{ value: string; label: string }[]>([]);
  const [subtipoOptions, setSubtipoOptions] = useState<{ value: string; label: string }[]>([]);
  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    numero: ''
  });

  const loadNatures = async () => {
    try {
      setNaturezaLoading(true);
      const natures = await occurrenceService.getNatures();
      setNaturezaOptions(natures.map((nature: IOccurrenceNature) => ({
        value: nature.id.toString(),
        label: nature.name
      })));
    } catch (error) {
      await handleReadError(error, 'Erro ao carregar naturezas da ocorrência');
    } finally {
      setNaturezaLoading(false);
    }
  };

  useEffect(() => {
    loadNatures();
  }, [handleReadError]);

  useEffect(() => {
    setTipoId(null);
    setTipoOptions([]);
    setSubtipoId(null);
    setSubtipoOptions([]);

    if (!naturezaId) {
      return;
    }

    const fetchTypes = async () => {
      try {
        setTipoLoading(true);
        const types = await occurrenceService.getTypesByNature(Number(naturezaId));
        setTipoOptions(types.map((type: IOccurrenceType) => ({
          value: type.id.toString(),
          label: type.name
        })));
      } catch (error) {
        await handleReadError(error, 'Erro ao carregar tipos para a natureza selecionada');
      } finally {
        setTipoLoading(false);
      }
    };

    fetchTypes();
  }, [naturezaId, handleReadError]);

  useEffect(() => {
    setSubtipoId(null);
    setSubtipoOptions([]);

    if (!tipoId) {
      return;
    }

    const fetchSubtypes = async () => {
      try {
        setSubtipoLoading(true);
        const subtypes = await occurrenceService.getSubtypesByType(Number(tipoId));
        setSubtipoOptions(subtypes.map((subtype: IOccurrenceSubtype) => ({
          value: subtype.id.toString(),
          label: subtype.name
        })));
      } catch (error) {
        await handleReadError(error, 'Erro ao carregar subtipos para o tipo selecionado');
      } finally {
        setSubtipoLoading(false);
      }
    };

    fetchSubtypes();
  }, [tipoId, handleReadError]);

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

    if (!nomeSolicitante || !telefoneSolicitante || temVitimas === null || !naturezaId || !tipoId || !subtipoId) {
      notificationService.showValidationError('Preencha todos os campos obrigatórios');
      return;
    }

    // telefone deve ter 10 (fixo) ou 11 (celular) dígitos
    if (!(telefoneSolicitante.length === 10 || telefoneSolicitante.length === 11)) {
      notificationService.showValidationError('Informe um telefone com DDD (10 ou 11 dígitos). Ex: (81) 98765-8765');
      return;
    }

    if (!endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
      notificationService.showValidationError('Preencha todos os campos de endereço');
      return;
    }

    setLoading(true);

    try {
      const payload: IOccurrenceRequest = {
        occurrenceHasVictims: temVitimas === 'Sim',
        occurrenceRequester: nomeSolicitante,
        occurrenceRequesterPhoneNumber: telefoneSolicitante,
        occurrenceSubType: Number(subtipoId),
        address: {
          zipCode: cep.replace(/\D/g, ''),
          street: endereco.logradouro,
          number: Number(endereco.numero),
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          complement: endereco.complemento
        },
      };

      await occurrenceService.create(payload);

      errorHandler.showCreateSuccess();
      navigate('/Ocorrencia');
    } catch (error) {
      await errorHandler.handleCreateError(error);
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
                label="Natureza"
                placeholder="Selecione a natureza"
                data={naturezaOptions}
                value={naturezaId}
                onChange={setNaturezaId}
                required
                searchable
                nothingFoundMessage="Nenhuma natureza encontrada"
                rightSection={naturezaLoading ? <Loader size="xs" /> : undefined}
              />

              <Select
                className={classes.fullWidthField}
                label="Tipo de Ocorrência"
                placeholder="Selecione o tipo"
                data={tipoOptions}
                value={tipoId}
                onChange={setTipoId}
                required
                searchable
                nothingFoundMessage="Nenhum tipo encontrado"
                rightSection={tipoLoading ? <Loader size="xs" /> : undefined}
                disabled={!naturezaId || tipoLoading}
              />

              <Select
                className={classes.fullWidthField}
                label="Subtipo da Ocorrência"
                placeholder="Selecione o subtipo"
                data={subtipoOptions}
                value={subtipoId}
                onChange={setSubtipoId}
                required
                searchable
                nothingFoundMessage="Nenhum subtipo encontrado"
                rightSection={subtipoLoading ? <Loader size="xs" /> : undefined}
                disabled={!tipoId || subtipoLoading}
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