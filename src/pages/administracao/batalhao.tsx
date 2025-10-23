
import { ReadItems } from '../../components/ReadItems'
import { data, headers } from '../../mock/ItenListData'

const Batalhao = () => {
  return (
    <>
      <ReadItems paramsReaderItems={{
        headers: headers.map(header => header.toLowerCase()),
        body: data.map(item => [item.id,item.email, item.name, item.cargo, item.matricula]),
        titulo: "Batalhões",
        textButton: "Criar Batalhão"
        ,url: "/CadastroBatalhao"
      }} />
    </>
  )
}

export default Batalhao