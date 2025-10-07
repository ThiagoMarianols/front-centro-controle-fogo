import classes from '../../styles/cadastros/RegUser.module.css';
import {  
  Select,
  TextInput,
  Paper,
  Title,
  Button 
} from '@mantine/core';

export function CadastroUsuario() {
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
              />
              <TextInput
                label="Email"
                placeholder="Email"
                description="Forneça o email do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="CPF"
                placeholder="CPF"
                description="Forneça o CPF do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Matricula"
                placeholder="Matricula"
                description="Forneça a matricula do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Numero de telefone"
                placeholder="Numero de telefone"
                description="Forneça o numero de telefone do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />              
              <Select
                className={classes.fullWidthField}
                label="Sexo"
                placeholder="Informe o sexo do usuario"
                data={['Masculino', 'Feminino']}
              />
              <Select
                className={classes.fullWidthField}
                label="Cargo"
                placeholder="Informe o cargo do usuario"
                data={['Atendente', 'Oficial', 'Soldado', 'Capitão', 'Major', 'General']}
              />
              <Select
                className={classes.fullWidthField}
                label="Batalhão"
                placeholder="Informe o batalhão do usuario"
                data={['Ativo', 'Inativo']}
              />
            </div>
          </Paper>
          <Paper withBorder shadow="sm" p="md" radius="md" className={classes.paper}>
            <Title order={3} className={classes.cardTitle}>Endereço</Title>
            <div className={classes.formGrid}>
            <TextInput
                label="CEP"
                placeholder="CEP"
                description="Forneça o cep do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Logradouro"
                placeholder="Logradouro"
                description="Forneça o logradouro do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Numero"
                placeholder="Numero"
                description="Forneça o numero do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Complemento"
                placeholder="Complemento"
                description="Forneça o complemento do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Bairro"
                placeholder="Bairro"
                description="Forneça o bairro do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Cidade"
                placeholder="Cidade"
                description="Forneça a cidade do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <Select
                className={classes.fullWidthField}
                label="Estado"
                placeholder="Informe o estado do usuário"
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
              <TextInput
                label="Senha"
                placeholder="Senha"
                description="Forneça a senha do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
              <TextInput
                label="Confirme a senha"
                placeholder="Confirme a senha"
                description="Confirme a senha do usuario"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
              />
            </div>
          </Paper>
        </div>
        <Button variant="filled" className={classes.button}>Cadastrar Usuário</Button>
      </div>
    </div>
  );
}

