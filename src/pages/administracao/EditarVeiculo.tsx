import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { VehicleForm, type VehicleFormValues } from '../../components/vehicle/VehicleForm';
import { getVehicleById, updateVehicle } from '../../services/vehicleService';

export function EditarVeiculo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<VehicleFormValues>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) {
        navigate('/administracao/Veiculo');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Buscando veículo com ID:', id);
        const vehicle = await getVehicleById(Number(id));
        console.log('Veículo carregado:', vehicle);
        
        const values = {
          name: vehicle.name,
          battalion: vehicle.battalionId.toString()
        };
        console.log('Valores iniciais definidos:', values);
        setInitialValues(values);
      } catch (error: any) {
        console.error('Erro ao carregar veículo:', error);
        console.error('Detalhes do erro:', error.response);
        console.error('Status do erro:', error.response?.status);
        console.error('Dados do erro:', error.response?.data);
        
        const errorMessage = error.response?.data?.message || error.message || 'Não foi possível carregar o veículo';
        setError(errorMessage);
        
        notifications.show({
          title: 'Erro ao carregar veículo',
          message: errorMessage,
          color: 'red',
          autoClose: false
        });
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id, navigate]);

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await updateVehicle(Number(id), {
        name: values.name,
        battalion: Number(values.battalion)
      });

      notifications.show({
        title: 'Sucesso',
        message: 'Veículo atualizado com sucesso',
        color: 'green'
      });

      navigate('/administracao/Veiculo');
    } catch (error: any) {
      console.error('Erro ao atualizar veículo:', error);
      notifications.show({
        title: 'Erro',
        message: error.response?.data?.message || 'Não foi possível atualizar o veículo',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Só renderiza o formulário quando os dados estiverem carregados
  if (loading) {
    return (
      <VehicleForm
        title="Editar Veículo"
        submitLabel="Salvar"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/administracao/Veiculo')}
        loading={true}
        submitting={false}
      />
    );
  }

  // Se houve erro ao carregar
  if (error || !initialValues) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#e03131', marginBottom: '1rem' }}>Erro ao carregar veículo</h2>
        <p style={{ marginBottom: '1rem' }}>{error || 'Não foi possível carregar os dados do veículo.'}</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
          Verifique o console do navegador (F12) para mais detalhes técnicos.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
          <button 
            onClick={() => navigate('/administracao/Veiculo')}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <VehicleForm
      title="Editar Veículo"
      submitLabel="Salvar"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/administracao/Veiculo')}
      initialValues={initialValues}
      loading={false}
      submitting={submitting}
    />
  );
}

export default EditarVeiculo;
