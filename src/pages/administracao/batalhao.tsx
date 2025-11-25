import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadItems } from '../../components/ReadItems';
import { 
  getBattalionsPaginated, 
  deactivateBattalion, 
  activateBattalion
} from '../../services/battalionService';
import type { BattalionDTO } from '../../interfaces/IBattalion';
import { extractBattalionAddress } from '../../utils/battalionAddress';
import { Center, Loader } from '@mantine/core';
import { useErrorHandler } from '../../error-handling';

const Batalhao = () => {
  const [battalions, setBattalions] = useState<BattalionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const errorHandler = useErrorHandler('battalion');

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
      await errorHandler.handleListError(error);
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
      errorHandler.showDeactivateSuccess();
      await fetchBattalions();
    } catch (error) {
      await errorHandler.handleDeactivateError(error);
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await activateBattalion(id);
      errorHandler.showActivateSuccess();
      await fetchBattalions();
    } catch (error) {
      await errorHandler.handleActivateError(error);
    }
  };

  const handleEdit = (row: (string | number)[]) => {
    const id = Number(row[0]);
    if (!Number.isNaN(id)) {
      navigate(`/administracao/EditarBatalhao/${id}`);
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
        headers: ['ID', 'Nome', 'Email', 'Telefone', 'Cidade', 'Status'],
        body: battalions.map(battalion => {
          const address = extractBattalionAddress(battalion);
          return [
            battalion.id,
            battalion.name,
            battalion.email,
            battalion.phoneNumber,
            address?.city || '-',
            battalion.active ? 'Ativo' : 'Inativo'
          ];
        }),
        titulo: "Batalhões",
        textButton: "Criar Batalhão",
        url: "/administracao/RegistroBatalhao",
        hasStatusFilter: true,
        statusColumnIndex: 5,
        onEdit: handleEdit,
        onDelete: handleDeactivate,
        onActivate: handleActivate
      }} 
    />
  );
};

export default Batalhao;