import { useState, useEffect } from 'react';
import { ReadItems } from '../../components/ReadItems';
import { 
  getBattalionsPaginated, 
  deactivateBattalion, 
  activateBattalion
} from '../../services/battalionService';
import type { BattalionDTO } from '../../services/battalionService';
import { notifications } from '@mantine/notifications';
import { Center, Loader } from '@mantine/core';

const Batalhao = () => {
  const [battalions, setBattalions] = useState<BattalionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBattalions = async () => {
    try {
      setLoading(true);
      // Buscar ativos e inativos
      const [activeResponse, inactiveResponse] = await Promise.all([
        getBattalionsPaginated(1, 100, undefined, true),
        getBattalionsPaginated(1, 100, undefined, false)
      ]);
      const allBattalions = [...activeResponse.items, ...inactiveResponse.items];
      setBattalions(allBattalions);
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar batalhões',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattalions();
  }, []);

  const handleDeactivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await deactivateBattalion(id);
      notifications.show({
        title: 'Sucesso',
        message: 'Batalhão desativado com sucesso',
        color: 'green',
      });
      await fetchBattalions();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao desativar batalhão',
        color: 'red',
      });
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await activateBattalion(id);
      notifications.show({
        title: 'Sucesso',
        message: 'Batalhão ativado com sucesso',
        color: 'green',
      });
      await fetchBattalions();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao ativar batalhão',
        color: 'red',
      });
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
    <ReadItems 
      paramsReaderItems={{
        headers: ['ID', 'Nome', 'Email', 'Telefone', 'Status'],
        body: battalions.map(battalion => [
          battalion.id,
          battalion.name,
          battalion.email,
          battalion.phoneNumber,
          battalion.active ? 'Ativo' : 'Inativo'
        ]),
        titulo: "Batalhões",
        textButton: "Criar Batalhão",
        url: "/CadastroBatalhao",
        hasStatusFilter: true,
        statusColumnIndex: 4,
        onDelete: handleDeactivate,
        onActivate: handleActivate
      }} 
    />
  );
};

export default Batalhao;