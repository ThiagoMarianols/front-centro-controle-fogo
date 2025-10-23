import { ReadItems } from '../components/ReadItems'
import { data, headers } from '../mock/ItenListData'

const Ocorrencia = () => {
  return (
      <>
        <ReadItems paramsReaderItems={{
                headers: headers.map(header => header.toLowerCase()),
                body: data.map(item => [item.id,item.email, item.name, item.cargo, item.matricula]),
                titulo: "Ocorrências",
                textButton: "Criar Ocorrência"
                ,url: "/RegistroOcorrencia"
              }} />
      </>
  )
}
export default Ocorrencia