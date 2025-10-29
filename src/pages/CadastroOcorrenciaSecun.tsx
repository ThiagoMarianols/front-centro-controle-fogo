import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import classes from '../styles/CadastroOcorrenciaSecun.module.css';
import {  
  TextInput, 
  Button, 
  Paper, 
  Title, 
  Select, 
  Textarea, 
  ActionIcon, 
  MultiSelect,
  Checkbox,
  Group
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';
import '@mantine/dates/styles.css';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

export function CadastroOcorrenciaSecun() {
  const [cep, setCep] = useState('');
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => {
        const preview = URL.createObjectURL(file);
        console.log('Nova imagem capturada:', { 
          name: file.name, 
          type: file.type, 
          size: file.size,
          previewUrl: preview 
        });
        return {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          file,
          preview,
          timestamp: new Date()
        };
      });

      setCapturedImages(prev => [...prev, ...newImages]);
    }
    
    // Resetar o input para permitir selecionar a mesma imagem novamente se necessário
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    // Encontrar a imagem para revogar a URL
    const imageToRemove = capturedImages.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    // Remover a imagem do estado
    setCapturedImages(prev => prev.filter(img => img.id !== id));
  };

  // Limpar as URLs de pré-visualização quando o componente for desmontado
  useEffect(() => {
    return () => {
      capturedImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [capturedImages]);

  return (
    <>
      <div className={classes.centerWrap}>
        <Title order={2} className={classes.title}>Registro de atendimento</Title>

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
          {/* Registro de atendimento */}
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Registro de atendimento</Title>
            <div className={classes.formGrid}>

              <DateTimePicker label="Horário de chegada ao local" placeholder="Horário de chegada ao local"  />

              <TextInput
                label="Latitude"
                placeholder="Latitude"
                value={endereco.logradouro}
                onChange={(e) =>
                  setEndereco({ ...endereco, logradouro: e.target.value })
                }
              />

              <TextInput
                label="Longitude"
                placeholder="Longitude"
                value={endereco.numero}
                onChange={(e) =>
                  setEndereco({ ...endereco, numero: e.target.value })
                }
              />

              <TextInput
                label="Detalhes da ocorrência"
                placeholder="Detalhes da ocorrência"
                value={endereco.bairro}
                onChange={(e) =>
                  setEndereco({ ...endereco, bairro: e.target.value })
                }
              />

              <MultiSelect
                label="Militares envolvidos"
                placeholder="Selecione o nome dos militares envolvidos"
                data={['Pedro Silva', 'João da Figueira', 'Maria Santos', 'Pedro Francisco']}
                searchable
              />

              <MultiSelect
                label="Veículos envolvidos"
                placeholder="Selecione o nome dos veículos envolvidos"
                data={['6453 - Carro', '6454 - Ambulância', '6455 - Caminhão', '6456 - Carro de Fogo']}
                searchable
              />

              <Textarea
                label="Detalhes da ocorrência"
                placeholder="Detalhes da ocorrência"
                autosize
                minRows={2}
                maxRows={4}
              />

              <DateTimePicker label="Horário de chegada ao local" placeholder="Horário de chegada ao local" locale="pt-br"/>
            </div>
          </Paper>
          {/* Anexos e Câmera */}
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={4} mb="md">Anexos</Title>
            
            {/* Input de arquivo oculto */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleImageCapture}
              style={{ display: 'none' }}
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              mb="md"
              fullWidth
            >
              Tirar Foto
            </Button>


            {/* Lista de anexos */}
            <div className={classes.attachmentsContainer}>
              <div className={classes.attachmentsHeader}>
                <div>Arquivo</div>
                <div style={{ textAlign: 'right' }}>Ações</div>
              </div>
              
              <div className={classes.attachmentsList}>
                {capturedImages.length === 0 ? (
                  <div className={classes.noAttachments}>
                    Nenhum arquivo anexado
                  </div>
                ) : (
                  capturedImages.map((image) => (
                    <div key={image.id} className={classes.attachmentItem}>
                      <div className={classes.attachmentName}>
                        <div className={classes.attachmentIcon}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 20V4H13V9H18V20H6Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <span className={classes.attachmentText}>
                          {image.file.name || `foto-${image.id.slice(0, 6)}.jpg`}
                        </span>
                      </div>
                      <div className={classes.attachmentActions}>
                        <ActionIcon 
                          variant="subtle" 
                          color="red"
                          size="sm"
                          title="Remover"
                          onClick={() => removeImage(image.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </Paper>
        </div>

        <Button variant="filled">Atualizar ocorrência</Button>
      </div>
    </>
  );
}