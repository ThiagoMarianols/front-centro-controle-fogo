import { useState } from 'react';
import classes from '../styles/RegistroOcorrencia.module.css';
import {  
  Select,
  Checkbox,
  Group,
  TextInput,
  Paper,
  Title,
  Button 
} from '@mantine/core';

export function RegistroOcorrencia() {
  const [cep, setCep] = useState('');
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

  // Função para limpar os campos de endereço
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
              />
              <TextInput
                label="Telefone"
                placeholder="Telefone"
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
            <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
              <Select
                className={classes.fullWidthField}
                label="Tipo de Ocorrência"
                placeholder="Informe o tipo de ocorrência"
                data={[
                  'Incêndio urbano',
                  'Acidente de trânsito',
                  'Resgate em altura',
                  'Afogamento',
                  'Acidente com produtos perigosos'
                ]}
              />

              <Checkbox.Group
                className={classes.fullWidthField}
                label="Existência de vítimas"
                description="Existem vítimas?"
                withAsterisk
              >
                <Group mt="xs">
                  <Checkbox value="Sim" label="Sim" />
                  <Checkbox value="Não" label="Não" />
                </Group>
              </Checkbox.Group>
            </form>
          </Paper>
        </div>

        <Button variant="filled" className={classes.button}>Registrar</Button>
      </div>
    </>
  );
}