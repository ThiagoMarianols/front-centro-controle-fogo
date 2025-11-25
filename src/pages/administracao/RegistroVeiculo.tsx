import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleForm, type VehicleFormValues } from '../../components/vehicle/VehicleForm';
import { createVehicle } from '../../services/vehicleService';
import { useErrorHandler } from '../../error-handling';

export function RegistroVeiculo() {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler('vehicle');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: VehicleFormValues) => {
    try {
      setSubmitting(true);
      await createVehicle({
        name: values.name,
        battalion: Number(values.battalion)
      });

      errorHandler.showCreateSuccess();
      navigate('/administracao/Veiculo');
    } catch (error: any) {
      console.error('Erro ao criar veículo:', error);
      await errorHandler.handleCreateError(error);
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
