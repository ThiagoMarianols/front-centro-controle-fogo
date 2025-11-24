import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { VehicleForm, type VehicleFormValues } from '../../components/vehicle/VehicleForm';
import { createVehicle } from '../../services/vehicleService';

export function RegistroVeiculo() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: VehicleFormValues) => {
    try {
      setSubmitting(true);
      await createVehicle({
        name: values.name,
        battalion: Number(values.battalion)
      });

      notifications.show({
        title: 'Sucesso',
        message: 'Veículo criado com sucesso',
        color: 'green'
      });

      navigate('/administracao/Veiculo');
    } catch (error: any) {
      console.error('Erro ao criar veículo:', error);
      notifications.show({
        title: 'Erro',
        message: error.response?.data?.message || 'Não foi possível criar o veículo',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VehicleForm
      title="Registro de Veículo"
      submitLabel="Registrar"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/administracao/Veiculo')}
      submitting={submitting}
    />
  );
}

export default RegistroVeiculo;
