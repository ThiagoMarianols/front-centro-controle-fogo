import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadItems } from '../components/ReadItems';
import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceDTO } from '../interfaces/IOccurrence';
import { Center, Loader } from '@mantine/core';
import { useErrorHandler } from '../error-handling';

const Ocorrencia = () => {
  const navigate = useNavigate();
  const [occurrences, setOccurrences] = useState<IOccurrenceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const errorHandler = useErrorHandler('occurrence');

  const fetchOccurrences = async () => {
    try {
      setLoading(true);
      const [activeResponse, inactiveResponse] = await Promise.all([
        occurrenceService.getOccurrencesPaginated(1, 100, undefined, true),
        occurrenceService.getOccurrencesPaginated(1, 100, undefined, false)
      ]);
      const allOccurrences = [...activeResponse.items, ...inactiveResponse.items];
      setOccurrences(allOccurrences);
    } catch (error) {
      await errorHandler.handleListError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccurrences();
  }, []);

  useEffect(() => {
    const handleRowClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const row = target.closest('tr');
      
      if (row && target.tagName === 'TD') {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && target === cells[0]) {
          const id = cells[0].textContent;
          if (id) {
            navigate(`/DetalhesOcorrencia/${id}`);
          }
        }
      }
    };

    const table = document.querySelector('table tbody');
    if (table) {
      table.addEventListener('click', handleRowClick);
    }

    return () => {
      if (table) {
        table.removeEventListener('click', handleRowClick);
      }
    };
  }, [occurrences, navigate]);

  const handleDeactivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await occurrenceService.deactivate(id);
      errorHandler.showDeactivateSuccess();
      await fetchOccurrences();
    } catch (error) {
      await errorHandler.handleDeactivateError(error);
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await occurrenceService.activate(id);
      errorHandler.showActivateSuccess();
      await fetchOccurrences();
    } catch (error) {
      await errorHandler.handleActivateError(error);
    }
  };

  const handleEdit = (row: (string | number)[]) => {
    const id = row[0];
    if (id) {
      navigate(`/EditarOcorrencia/${id}`);
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
    <>
      <style>{`
        .mantine-Table-table tbody tr td:first-child {
          color: #228be6 !important;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }
        .mantine-Table-table tbody tr td:first-child:hover {
          color: #1971c2 !important;
        }
      `}</style>
      <ReadItems 
        paramsReaderItems={{
          headers: ['ID', 'Solicitante', 'Telefone', 'Tipo', 'Status', 'Estado'],
          body: occurrences.map(occurrence => [
            occurrence.id,
            occurrence.occurrenceRequester,
            occurrence.occurrenceRequesterPhoneNumber,
            occurrence.occurrenceSubType,
            occurrence.status,
            occurrence.active ? 'Ativo' : 'Inativo'
          ]),
          titulo: "Ocorrências",
          textButton: "Criar Ocorrência",
          url: "/RegistroOcorrencia",
          hasStatusFilter: true,
          statusColumnIndex: 5,
          onEdit: handleEdit,
          onDelete: handleDeactivate,
          onActivate: handleActivate
        }} 
      />
    </>
  );
};

export default Ocorrencia;