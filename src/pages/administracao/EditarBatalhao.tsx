import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { BattalionForm, type BattalionFormValues } from '../../components/battalion/BattalionForm';
import { getBattalionById, updateBattalion } from '../../services/battalionService';
import type { BattalionDTO } from '../../interfaces/IBattalion';
import { extractBattalionAddress } from '../../utils/battalionAddress';

const mapBattalionToFormValues = (battalion: BattalionDTO): BattalionFormValues => {
  const toStringSafe = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return '';
    return typeof value === 'number' ? value.toString() : value;
  };

  const battalionAny = battalion as BattalionDTO & {
    addressResponse?: Partial<BattalionDTO['address']>;
    addressResponseDTO?: Partial<BattalionDTO['address']>;
    addressDto?: Partial<BattalionDTO['address']>;
    addressDTO?: Partial<BattalionDTO['address']>;
    addressRequest?: Partial<BattalionDTO['address']>;
    zipCode?: string;
    street?: string;
    number?: string | number;
    neighborhood?: string;
    city?: string;
    state?: string;
    complement?: string;
  };

  const address = extractBattalionAddress(battalionAny);

  const zipCode: string | number | undefined = address?.zipCode ?? battalionAny.zipCode ?? '';
  const street = address?.street ?? battalionAny.street ?? '';
  const addressNumber: string | number | undefined = address?.number ?? battalionAny.number ?? '';
  const neighborhood = address?.neighborhood ?? battalionAny.neighborhood ?? '';
  const city = address?.city ?? battalionAny.city ?? '';
  const state = address?.state ?? battalionAny.state ?? '';
  const complement = address?.complement ?? battalionAny.complement ?? '';

  return {
    name: battalion.name || '',
    email: battalion.email || '',
    phoneNumber: battalion.phoneNumber || '',
    cep: toStringSafe(zipCode),
    street,
    number: toStringSafe(addressNumber),
    neighborhood,
    city,
    state,
    complement
  };
};

export default function EditarBatalhao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<BattalionFormValues | undefined>(undefined);

  useEffect(() => {
    const loadBattalion = async () => {
      if (!id) {
        notifications.show({
          title: 'Erro',
          message: 'ID do batalhão não informado',
          color: 'red'
        });
        navigate('/administracao/Batalhao');
        return;
      }

      try {
        setLoading(true);
        const battalion = await getBattalionById(Number(id));
        setInitialValues(mapBattalionToFormValues(battalion));
      } catch (error: any) {
        console.error('Erro ao carregar batalhão:', error);
        notifications.show({
          title: 'Erro',
          message: error.response?.data?.message || 'Não foi possível carregar o batalhão',
          color: 'red'
        });
        navigate('/administracao/Batalhao');
      } finally {
        setLoading(false);
      }
    };

    loadBattalion();
  }, [id, navigate]);

  const handleSubmit = async (values: BattalionFormValues) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await updateBattalion(Number(id), {
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
        message: 'Batalhão atualizado com sucesso',
        color: 'green'
      });

      navigate('/administracao/Batalhao');
    } catch (error: any) {
      console.error('Erro ao atualizar batalhão:', error);
      notifications.show({
        title: 'Erro',
        message: error.response?.data?.message || 'Não foi possível atualizar o batalhão',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BattalionForm
      title="Editar Batalhão"
      submitLabel="Salvar Alterações"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/administracao/Batalhao')}
      initialValues={initialValues}
      loading={loading}
      submitting={submitting}
    />
  );
}
