import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadItems } from '../../components/ReadItems';
import { getUsersPaginated, deactivateUser, activateUser } from '../../services/authService';
import type { PaginatorGeneric, UserPaginatorDTO } from '../../interface/Paginator';
import { Loader, Center } from '@mantine/core';
import { useErrorHandler } from '../../error-handling';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserPaginatorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const errorHandler = useErrorHandler('user');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [activeUsers, inactiveUsers] = await Promise.all([
        getUsersPaginated(1, 1000, undefined, true),
        getUsersPaginated(1, 1000, undefined, false)
      ]);
      setUsers([...activeUsers.items, ...inactiveUsers.items]);
    } catch (err) {
      await errorHandler.handleListError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleRowClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const row = target.closest('tr');
      
      if (row && target.tagName === 'TD') {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && target === cells[0]) {
          const id = cells[0].textContent;
          if (id) {
            navigate(`/administracao/DetalhesUsuario/${id}`);
          }
        }
      }
    };

    const table = document.querySelector('table tbody');
    if (table) {
      table.addEventListener('click', handleRowClick);
    }

    return () => {
      if (table) {
        table.removeEventListener('click', handleRowClick);
      }
    };
  }, [users, navigate]);

  const handleDeactivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await deactivateUser(id);
      errorHandler.showDeactivateSuccess();
      await fetchUsers();
    } catch (error) {
      await errorHandler.handleDeactivateError(error);
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await activateUser(id);
      errorHandler.showActivateSuccess();
      await fetchUsers();
    } catch (error) {
      await errorHandler.handleActivateError(error);
    }
  };

  const handleEdit = (row: (string | number)[]) => {
    const id = row[0];
    if (id) {
      navigate(`/administracao/EditarUsuario/${id}`);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      <style>{`
        .mantine-Table-table tbody tr td:first-child {
          color: #228be6 !important;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }
        .mantine-Table-table tbody tr td:first-child:hover {
          color: #1971c2 !important;
        }
      `}</style>
      <ReadItems 
        paramsReaderItems={{
          headers: ['ID', 'Nome', 'Matrícula', 'Status'],
          body: users.map(user => [
            user.id,
            user.normalizedName || 'N/A',
            user.matriculates || 'N/A',
            user.active ? 'Ativo' : 'Inativo'
          ]),
          titulo: "Usuários",
          textButton: "Criar Usuário",
          url: "/administracao/CadastroUsuario",
          hasStatusFilter: true,
          statusColumnIndex: 3,
          onEdit: handleEdit,
          onDelete: handleDeactivate,
          onActivate: handleActivate
        }} 
      />
    </>
  );
}

export default Users;