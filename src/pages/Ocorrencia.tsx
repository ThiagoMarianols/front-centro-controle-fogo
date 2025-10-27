import { useNavigate } from 'react-router-dom';
import { ReadItems } from '../components/ReadItems';
import { data, headers } from '../mock/ItenListData';

const Ocorrencia = () => {
  const navigate = useNavigate();

  const handleAtendimentoClick = (item: any) => {
    console.log('Item para atendimento:', item);
    
    navigate('/administracao/CadastroOcorrenciaSecun', { 
      state: { 
        itemId: item[0], 
      } 
    });
  };

  return (
    <>
      <ReadItems 
        paramsReaderItems={{
          headers: headers.map(header => header.toLowerCase()),
          body: data.map(item => [item.id, item.email, item.name, item.cargo, item.matricula]),
          titulo: "Ocorrências",
          textButton: "Criar Ocorrência",
          url: "/RegistroOcorrencia",
          showAtendimento: true,
          onAtendimentoClick: handleAtendimentoClick
        }} 
      />
    </>
  );
};

export default Ocorrencia;