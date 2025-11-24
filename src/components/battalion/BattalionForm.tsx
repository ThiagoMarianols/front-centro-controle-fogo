import { useState, useEffect } from 'react';
import { Paper, Title, TextInput, Group, Button, LoadingOverlay } from '@mantine/core';
import classes from '../../styles/BatalhaoForm.module.css';

export interface BattalionFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

interface BattalionFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (values: BattalionFormValues) => Promise<void>;
  onCancel?: () => void;
  cancelLabel?: string;
  initialValues?: Partial<BattalionFormValues>;
  loading?: boolean;
  submitting?: boolean;
}

const defaultValues: BattalionFormValues = {
  name: '',
  email: '',
  phoneNumber: '',
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  complement: ''
};

const formatPhoneNumber = (digits: string) => {
  const cleaned = digits.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

const formatCep = (digits: string) => {
  const cleaned = digits.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

export function BattalionForm({
  title,
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancelar',
  initialValues,
  loading = false,
  submitting = false
}: BattalionFormProps) {
  const [formValues, setFormValues] = useState<BattalionFormValues>(defaultValues);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormValues(prev => ({
        ...prev,
        ...initialValues,
        phoneNumber: (initialValues.phoneNumber ?? '').replace(/\D/g, ''),
        cep: (initialValues.cep ?? '').replace(/\D/g, ''),
        state: (initialValues.state ?? '').toUpperCase()
      }));
    }
  }, [initialValues]);

  const handleChange = (field: keyof BattalionFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const fetchCep = async (digits: string) => {
    const cep = digits.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      setCepLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data?.erro) {
        setFormValues(prev => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: (data.uf || prev.state || '').toUpperCase(),
          complement: data.complemento || prev.complement
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async () => {
    const sanitized: BattalionFormValues = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phoneNumber: formValues.phoneNumber.replace(/\D/g, ''),
      cep: formValues.cep.replace(/\D/g, ''),
      street: formValues.street.trim(),
      number: formValues.number.trim(),
      neighborhood: formValues.neighborhood.trim(),
      city: formValues.city.trim(),
      state: formValues.state.trim().toUpperCase(),
      complement: formValues.complement.trim()
    };

    await onSubmit(sanitized);
  };

  return (
    <div className={classes.container}>
      <Paper p="md" shadow="sm" className={classes.formContainer}>
        <LoadingOverlay visible={loading} />
        <Title order={2} mb="md">{title}</Title>

        <div className={classes.formSection}>
          <Title order={4} mb="md">Dados do Batalhão</Title>
          <div className={classes.formRow}>
            <TextInput
              label="Nome"
              placeholder="Nome do batalhão"
              value={formValues.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={classes.formInput}
              required
            />
            <TextInput
              label="Email"
              placeholder="email@exemplo.com"
              value={formValues.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={classes.formInput}
              type="email"
              required
            />
          </div>
          <TextInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={formatPhoneNumber(formValues.phoneNumber)}
            onChange={(e) => handleChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
            className={classes.formInput}
            required
          />
        </div>

        <div className={classes.formSection}>
          <Title order={4} mb="md">Endereço</Title>
          <div className={classes.formRow}>
            <TextInput
              label="CEP"
              placeholder="00000-000"
              value={formatCep(formValues.cep)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                handleChange('cep', digits);
                if (digits.length === 8) {
                  fetchCep(digits);
                }
              }}
              className={classes.formInput}
              rightSection={cepLoading ? '...' : undefined}
              maxLength={9}
              required
            />
            <TextInput
              label="Número"
              placeholder="Número"
              value={formValues.number}
              onChange={(e) => handleChange('number', e.target.value.replace(/[^0-9]/g, ''))}
              className={classes.formInput}
              required
            />
          </div>
          <div className={classes.formRow}>
            <TextInput
              label="Logradouro"
              placeholder="Rua, avenida, etc."
              value={formValues.street}
              onChange={(e) => handleChange('street', e.target.value)}
              className={classes.formInput}
              required
            />
            <TextInput
              label="Bairro"
              placeholder="Bairro"
              value={formValues.neighborhood}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              className={classes.formInput}
              required
            />
          </div>
          <div className={classes.formRow}>
            <TextInput
              label="Cidade"
              placeholder="Cidade"
              value={formValues.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={classes.formInput}
              required
            />
            <TextInput
              label="Estado"
              placeholder="UF"
              value={formValues.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase().slice(0, 2))}
              className={classes.formInput}
              maxLength={2}
              required
            />
          </div>
          <TextInput
            label="Complemento"
            placeholder="Opcional"
            value={formValues.complement}
            onChange={(e) => handleChange('complement', e.target.value)}
            className={classes.formInput}
          />
        </div>

        <Group justify="flex-end" mt="xl">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={submitting}>
              {cancelLabel}
            </Button>
          )}
          <Button onClick={handleSubmit} loading={submitting} disabled={submitting}>
            {submitLabel}
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
