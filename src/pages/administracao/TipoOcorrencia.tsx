import { ReadItems } from '../../components/ReadItems'
import { data, headers } from '../../mock/ItenListData'

const TipoOcorrencia = () => {
  return (
    <>
        <ReadItems paramsReaderItems={{
        headers: headers.map(header => header.toLowerCase()),
        body: data.map(item => [item.id,item.email, item.name, item.cargo, item.matricula]),
        titulo: "Tipos de Ocorrência",
        textButton: "Criar Tipo de Ocorrência"
        ,url: "/CadastroTipoOcorrencia"
      }} />
    </>
  )
}

export default TipoOcorrencia