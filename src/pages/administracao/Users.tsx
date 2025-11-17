import { useState, useEffect } from 'react';
import { ReadItems } from '../../components/ReadItems';
import { getUsersPaginated, deactivateUser, activateUser } from '../../services/authService';
import type { PaginatorGeneric, UserPaginatorDTO } from '../../interface/Paginator';
import { Loader, Center, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const Users = () => {
  const [users, setUsers] = useState<UserPaginatorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const [activeUsers, inactiveUsers] = await Promise.all([
          getUsersPaginated(1, 1000, undefined, true),
          getUsersPaginated(1, 1000, undefined, false)
        ]);
        setUsers([...activeUsers.items, ...inactiveUsers.items]);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError('Erro ao carregar usuários. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDeactivate = async (row: (string | number)[]) => {
    const userId = row[0] as number;
    const userName = row[1] as string;

    try {
      await deactivateUser(userId);
      notifications.show({
        title: 'Sucesso',
        message: `Usuário ${userName} desativado com sucesso`,
        color: 'green',
      });
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, active: false } : user
        )
      );
    } catch (err) {
      console.error('Erro ao desativar usuário:', err);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao desativar usuário. Tente novamente.',
        color: 'red',
      });
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    const userId = row[0] as number;
    const userName = row[1] as string;

    try {
      await activateUser(userId);
      notifications.show({
        title: 'Sucesso',
        message: `Usuário ${userName} ativado com sucesso`,
        color: 'green',
      });
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, active: true } : user
        )
      );
    } catch (err) {
      console.error('Erro ao ativar usuário:', err);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao ativar usuário. Tente novamente.',
        color: 'red',
      });
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Erro" color="red">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <ReadItems paramsReaderItems={{
        headers: ['ID', 'Nome', 'Matrícula', 'Status'],
        body: users.map(user => [
          user.id,
          user.normalizedName || 'N/A',
          user.matriculates || 'N/A',
          user.active ? 'Ativo' : 'Inativo'
        ]),
        titulo: "Usuários",
        textButton: "Criar novo usuário",
        url: "/administracao/CadastroUsuario",
        onDelete: handleDeactivate,
        onActivate: handleActivate,
        statusColumnIndex: 3,
        hasStatusFilter: true
      }} />
    </>
  );
}

export default Users;