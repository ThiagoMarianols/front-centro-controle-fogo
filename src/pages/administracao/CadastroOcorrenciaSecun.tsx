import React, { useState } from 'react';
import { 
  Paper, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Title
 } from '@mantine/core';
import classes from '../../styles/administracao/CadastroOcorrenciaSecun.module.css';

function CadastroOcorrenciaSecun() {
  //const [localizacao, setLocalizacao] = useState('');
  const [horarioChegada,] = useState('');
  const [detalhesOcorrencia, setDetalhesOcorrencia] = useState('');
  const [envolvidosPessoas, setEnvolvidosPessoas] = useState('');
  const [envolvidosVeiculos, setEnvolvidosVeiculos] = useState('');
  const [percentualPerda, setPercentualPerda] = useState('');
  const [gpsLatitude, setGpsLatitude] = useState('');
  const [gpsLongitude, setGpsLongitude] = useState('');

  const capturarLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

            setGpsLatitude(latitude.toString());
            setGpsLongitude(longitude.toString());
        },
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Verificando se as coordenadas e o horário foram preenchidos
    if (!gpsLatitude || !gpsLongitude || !horarioChegada) {
      alert('Por favor, capture a localização e o horário de chegada antes de enviar.');
      return;
    }
  };

  return (
      <Paper p="md" shadow="sm" className={classes.paper}>
        <Title order={2} className={classes.title}>
          Formulário de Ocorrência
        </Title>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Horário de Chegada ao Local"
            placeholder="Horário de chegada"
            className={classes.field}
          />

          <Button variant="filled" color="blue" fullWidth onClick={capturarLocalizacao} className={classes.button}>
            Capturar Localização
          </Button>

          <TextInput
            label="Latitude"
            placeholder="Latitude do local"
            value={gpsLatitude}
            onChange={(e) => setGpsLatitude(e.target.value)}
            disabled
          />

          <TextInput
            label="Longitude"
            placeholder="Longitude do local"
            value={gpsLongitude}
            onChange={(e) => setGpsLongitude(e.target.value)}
            disabled
          />

          <Textarea
            label="Detalhes da Ocorrência"
            placeholder="Descreva melhor a ocorrência"
            value={detalhesOcorrencia}
            onChange={(e) => setDetalhesOcorrencia(e.target.value)}
            className={classes.field}
          />

          <Textarea
            label="Envolvidos (Pessoas)"
            placeholder="Informe as pessoas envolvidas"
            value={envolvidosPessoas}
            onChange={(e) => setEnvolvidosPessoas(e.target.value)}
            className={classes.field}
          />

          <Textarea
            label="Envolvidos (Veículos)"
            placeholder="Informe os veículos envolvidos"
            value={envolvidosVeiculos}
            onChange={(e) => setEnvolvidosVeiculos(e.target.value)}
            className={classes.field}
          />

          <TextInput
            label="Percentual de Perda do Estabelecimento (%)"
            placeholder="Informe o percentual de perda"
            type="number"
            value={percentualPerda}
            onChange={(e) => setPercentualPerda(e.target.value)}
            className={classes.field}
          />

          <Group justify="center" className={classes.submitButton}>
            <Button variant="filled" color="green" type="submit">
              Enviar
            </Button>
          </Group>
        </form>
      </Paper>
  );
}

export default CadastroOcorrenciaSecun;