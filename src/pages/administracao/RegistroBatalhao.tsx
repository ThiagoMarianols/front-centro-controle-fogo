import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BattalionForm, type BattalionFormValues } from '../../components/battalion/BattalionForm';
import { createBattalion } from '../../services/battalionService';
import { useErrorHandler } from '../../error-handling';

export function RegistroBatalhao() {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler('battalion');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: BattalionFormValues) => {
    try {
      setSubmitting(true);
      await createBattalion({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: {
          street: values.street,
          number: Number(values.number),
          complement: values.complement,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          zipCode: values.cep
        }
      });

      errorHandler.showCreateSuccess();
      navigate('/administracao/Batalhao');
    } catch (error: any) {
      console.error('Erro ao criar batalhão:', error);
      await errorHandler.handleCreateError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BattalionForm
      title="Registro de Batalhão"
      submitLabel="Registrar"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/administracao/Batalhao')}
      submitting={submitting}
    />
  );
}

