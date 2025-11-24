import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadItems } from '../../components/ReadItems';
import { 
  getVehiclesPaginated, 
  deactivateVehicle, 
  activateVehicle
} from '../../services/vehicleService';
import type { VehicleDTO } from '../../interfaces/IVehicle';
import { notifications } from '@mantine/notifications';
import { Center, Loader } from '@mantine/core';

const Veiculo = () => {
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // Buscar ativos e inativos
      const [activeResponse, inactiveResponse] = await Promise.all([
        getVehiclesPaginated(1, 100, undefined, true),
        getVehiclesPaginated(1, 100, undefined, false)
      ]);
      const allVehicles = [...activeResponse.items, ...inactiveResponse.items];
      setVehicles(allVehicles);
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar veículos',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDeactivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await deactivateVehicle(id);
      notifications.show({
        title: 'Sucesso',
        message: 'Veículo desativado com sucesso',
        color: 'green',
      });
      await fetchVehicles();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao desativar veículo',
        color: 'red',
      });
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await activateVehicle(id);
      notifications.show({
        title: 'Sucesso',
        message: 'Veículo ativado com sucesso',
        color: 'green',
      });
      await fetchVehicles();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao ativar veículo',
        color: 'red',
      });
    }
  };

  const handleEdit = (row: (string | number)[]) => {
    const id = Number(row[0]);
    if (!Number.isNaN(id)) {
      navigate(`/administracao/EditarVeiculo/${id}`);
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
        headers: ['ID', 'Nome', 'Batalhão', 'Status'],
        body: vehicles.map(vehicle => [
          vehicle.id,
          vehicle.name,
          vehicle.battalionName,
          vehicle.active ? 'Ativo' : 'Inativo'
        ]),
        titulo: "Veículos",
        textButton: "Criar Veículo",
        url: "/administracao/RegistroVeiculo",
        hasStatusFilter: true,
        statusColumnIndex: 3,
        onEdit: handleEdit,
        onDelete: handleDeactivate,
        onActivate: handleActivate
      }} 
    />
  );
};

export default Veiculo;
