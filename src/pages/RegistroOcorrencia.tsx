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
    return (
    <div className={classes.mainContent}>
      <div className={classes.centerWrap}>
        <Title order={2} className={classes.title}>Registro de Ocorrência</Title>

        <div className={classes.cardsStack}>
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Dados da ocorrência</Title>
            <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
              <Select
                className={classes.fullWidthField}
                label="Tipo de Ocorrência"
                placeholder="Informe o tipo de ocorrência"
                data={['Incêndio urbano', 'Acidente de trânsito', 'Resgate em altura', 'Afogamento', 'Acidente com produtos perigosos']}
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

          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Local da ocorrência</Title>
            <div className={classes.formGrid}>
              <TextInput
                label="Endereço"
                placeholder="Endereço"
                description="Endereço do local"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Referência"
                placeholder="Referência"
                description="Referência do local"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Tipo de local"
                placeholder="Tipo de local"
                description="incêndio urbano, florestal, etc."
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Riscos adicionais"
                placeholder="Riscos adicionais"
                description="Ex: gás, energia, produtos químicos"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <Checkbox.Group
                className={classes.fullWidthField}
                label="Atendimento prioritário?"
                description="Exige atendimento prioritário?"
                withAsterisk
              >
                <Group mt="xs">
                  <Checkbox value="Sim" label="Sim" />
                  <Checkbox value="Não" label="Não" />
                </Group>
              </Checkbox.Group>
            </div>
          </Paper>

          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Dados do solicitante</Title>
            <div className={classes.formGrid}>
              <TextInput
                label="Nome do solicitante"
                placeholder="Nome do solicitante"
                description="Nome do solicitante"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Telefone"
                placeholder="Telefone"
                description="Telefone do solicitante"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
            </div>
            <Checkbox.Group
                className={classes.fullWidthField}
                label="Atendimento prioritário?"
                description="Exige atendimento prioritário?"
                withAsterisk
              >
                <Group mt="xs">
                  <Checkbox value="Sim" label="Sim" />
                  <Checkbox value="Não" label="Não" />
                </Group>
              </Checkbox.Group>
          </Paper>
        </div>
        <Button variant="filled" className={classes.button}>Registrar</Button>
      </div>
    </div>
  );
}

