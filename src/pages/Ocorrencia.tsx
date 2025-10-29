import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadItems } from '../components/ReadItems';
import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceDTO } from '../interfaces/IOccurrence';
import { notifications } from '@mantine/notifications';
import { Center, Loader } from '@mantine/core';

const Ocorrencia = () => {
  const navigate = useNavigate();
  const [occurrences, setOccurrences] = useState<IOccurrenceDTO[]>([]);
  const [loading, setLoading] = useState(true);

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
      notifications.show({
        title: 'Erro',
        message: error instanceof Error ? error.message : 'Erro ao carregar ocorrências',
        color: 'red',
      });
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
      notifications.show({
        title: 'Sucesso',
        message: 'Ocorrência desativada com sucesso',
        color: 'green',
      });
      await fetchOccurrences();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao desativar ocorrência',
        color: 'red',
      });
    }
  };

  const handleActivate = async (row: (string | number)[]) => {
    try {
      const id = Number(row[0]);
      await occurrenceService.activate(id);
      notifications.show({
        title: 'Sucesso',
        message: 'Ocorrência ativada com sucesso',
        color: 'green',
      });
      await fetchOccurrences();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao ativar ocorrência',
        color: 'red',
      });
    }
  };

  const handleEdit = (row: (string | number)[]) => {
    const id = row[0];
    if (id) {
      navigate(`/EditarOcorrencia/${id}`);
    }
  };

  const handleAtendimentoClick = (item: any) => {
    const status = item[4];
    const isActive = item[5] === 'Ativo';
    
    if (!isActive) {
      notifications.show({
        title: 'Atenção',
        message: 'Não é possível atender uma ocorrência inativa',
        color: 'yellow',
      });
      return;
    }

    if (status !== 'EM_ATENDIMENTO') {
      notifications.show({
        title: 'Atenção',
        message: 'Apenas ocorrências em atendimento podem ser completadas',
        color: 'yellow',
      });
      return;
    }
    
    navigate('/CompletarOcorrencia', { 
      state: { 
        itemId: item[0], 
      } 
    });
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
          showAtendimento: true,
          onAtendimentoClick: handleAtendimentoClick,
          onEdit: handleEdit,
          onDelete: handleDeactivate,
          onActivate: handleActivate
        }} 
      />
    </>
  );
};

export default Ocorrencia;