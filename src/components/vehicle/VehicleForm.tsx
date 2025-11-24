import { useState, useEffect } from 'react';
import { Paper, Title, TextInput, Select, Group, Button, LoadingOverlay } from '@mantine/core';
import { getAllBattalions } from '../../services/battalionService';
import type { BattalionDTO } from '../../interfaces/IBattalion';
import classes from '../../styles/VehicleForm.module.css';

export interface VehicleFormValues {
  name: string;
  battalion: string;
}

interface VehicleFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  onCancel?: () => void;
  cancelLabel?: string;
  initialValues?: Partial<VehicleFormValues>;
  loading?: boolean;
  submitting?: boolean;
}

const defaultValues: VehicleFormValues = {
  name: '',
  battalion: ''
};

export function VehicleForm({
  title,
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancelar',
  initialValues,
  loading = false,
  submitting = false
}: VehicleFormProps) {
  const [formValues, setFormValues] = useState<VehicleFormValues>(defaultValues);
  const [battalions, setBattalions] = useState<{ value: string; label: string }[]>([]);
  const [loadingBattalions, setLoadingBattalions] = useState(false);

  useEffect(() => {
    loadBattalions();
  }, []);

  useEffect(() => {
    console.log('VehicleForm - initialValues recebidos:', initialValues);
    if (initialValues) {
      const newValues = {
        name: initialValues.name || '',
        battalion: initialValues.battalion || ''
      };
      console.log('VehicleForm - Atualizando formValues para:', newValues);
      setFormValues(newValues);
    }
  }, [initialValues]);

  const loadBattalions = async () => {
    try {
      setLoadingBattalions(true);
      const data = await getAllBattalions();
      setBattalions(data.map((battalion: BattalionDTO) => ({
        value: battalion.id.toString(),
        label: battalion.name
      })));
    } catch (error) {
      console.error('Erro ao carregar batalhões:', error);
    } finally {
      setLoadingBattalions(false);
    }
  };

  const handleChange = (field: keyof VehicleFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const sanitized: VehicleFormValues = {
      name: formValues.name.trim(),
      battalion: formValues.battalion
    };

    await onSubmit(sanitized);
  };

  console.log('VehicleForm - Renderizando com formValues:', formValues);
  console.log('VehicleForm - loading:', loading);

  return (
    <div className={classes.container}>
      <Paper p="md" shadow="sm" className={classes.formContainer}>
        <LoadingOverlay visible={loading} />
        <Title order={2} mb="md">{title}</Title>

        <div className={classes.formSection}>
          <Title order={4} mb="md">Dados do Veículo</Title>
          
          <TextInput
            label="Nome do Veículo"
            placeholder="Ex: ABT-01, VTR-02, etc."
            value={formValues.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={classes.formInput}
            required
          />

          <Select
            label="Batalhão"
            placeholder="Selecione o batalhão"
            value={formValues.battalion}
            onChange={(value) => handleChange('battalion', value || '')}
            data={battalions}
            className={classes.formInput}
            searchable
            disabled={loadingBattalions}
            required
          />
        </div>

        <Group justify="flex-end" mt="xl">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={submitting}>
              {cancelLabel}
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            loading={submitting} 
            disabled={submitting || !formValues.name || !formValues.battalion}
          >
            {submitLabel}
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
