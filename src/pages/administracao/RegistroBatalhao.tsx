import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { BattalionForm, type BattalionFormValues } from '../../components/battalion/BattalionForm';
import { createBattalion } from '../../services/battalionService';

export function RegistroBatalhao() {
  const navigate = useNavigate();
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

      notifications.show({
        title: 'Sucesso',
        message: 'Batalhão criado com sucesso',
        color: 'green'
      });

      navigate('/administracao/Batalhao');
    } catch (error: any) {
      console.error('Erro ao criar batalhão:', error);
      notifications.show({
        title: 'Erro',
        message: error.response?.data?.message || 'Não foi possível criar o batalhão',
        color: 'red'
      });
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

