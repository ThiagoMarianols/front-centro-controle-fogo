import { ReadItems } from '../../components/ReadItems'
import { data, headers } from '../../mock/ItenListData'

const Users = () => {
  return (
    <>
      <ReadItems paramsReaderItems={{
        headers: headers.map(header => header.toLowerCase()),
        body: data.map(item => [item.id,item.email, item.name, item.cargo, item.matricula]),
        titulo: "Usuários",
        textButton: "Criar novo usuário"
        ,url: "/administracao/CadastroUsuario"
      }} />
    </>
  )
}

export default Users