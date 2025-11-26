import { useState, useEffect } from 'react';
import {
  Table,
  Pagination,
  Group,
  Text,
  TextInput,
  ActionIcon,
  SegmentedControl
} from '@mantine/core';
import { IconSearch, IconEdit, IconTrash, IconCheck, IconArrowsSort, IconChevronUp, IconChevronDown } from '@tabler/icons-react';

import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { ParamsReaderItems } from '../interface/IReaderItems';
import classes from '../styles/administracao/ReadItems.module.css';
import { usePermissions } from '../hooks/usePermissions';

const formatPhoneNumber = (value: string | number) => {
  const digits = String(value).replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export function ReadItems({ paramsReaderItems }: { paramsReaderItems: ParamsReaderItems }) {
  const { isObservador, canEdit, canCreate, canDelete } = usePermissions();
  
  // Determina se deve esconder ações baseado nas permissões
  const hideActions = paramsReaderItems.hideActions ?? isObservador;
  // Esconde o botão de criar apenas para OBSERVADOR (que não pode criar)
  const hideCreateButton = paramsReaderItems.hideCreateButton ?? isObservador;

  const handleEdit = (row: (string | number)[], index: number) => {
    if (paramsReaderItems.onEdit) {
      paramsReaderItems.onEdit(row, index);
    } else {
      console.log('Edit item at index:', index);
    }
  };

  const handleDelete = async (row: (string | number)[], index: number) => {
    if (paramsReaderItems.onDelete) {
      await paramsReaderItems.onDelete(row, index);
    } else {
      console.log('Delete item at index:', index);
    }
  };

  const navigate = useNavigate();
  const [activePage, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ativos');
  const idColumnIndex = paramsReaderItems.headers.findIndex((header) => header.toLowerCase().includes('id'));
  const [sortConfig, setSortConfig] = useState<{ columnIndex: number | null; direction: 'asc' | 'desc' }>(() => ({
    columnIndex: idColumnIndex !== -1 ? idColumnIndex : null,
    direction: 'asc'
  }));

  const itemsPerPage = 10;
  const url = paramsReaderItems.url;

  let filteredData = paramsReaderItems.body.filter(row => 
    row.some(cell => 
      String(cell).toLowerCase().includes(search.toLowerCase())
    )
  );

  if (paramsReaderItems.hasStatusFilter && paramsReaderItems.statusColumnIndex !== undefined) {
    filteredData = filteredData.filter(row => {
      const status = String(row[paramsReaderItems.statusColumnIndex!]).toLowerCase();
      if (statusFilter === 'ativos') {
        return status === 'ativo';
      } else if (statusFilter === 'inativos') {
        return status === 'inativo';
      }
      return true;
    });
  }
  if (sortConfig.columnIndex !== null) {
    const columnIndex = sortConfig.columnIndex;
    const direction = sortConfig.direction === 'desc' ? -1 : 1;
    filteredData = [...filteredData].sort((a, b) => {
      const valueA = a[columnIndex];
      const valueB = b[columnIndex];
      const numA = Number(valueA);
      const numB = Number(valueB);
      const bothNumbers = !Number.isNaN(numA) && !Number.isNaN(numB);
      let comparison = 0;
      if (bothNumbers) {
        comparison = numA - numB;
      } else {
        comparison = String(valueA).localeCompare(String(valueB), 'pt-BR', { sensitivity: 'base' });
      }
      return comparison * direction;
    });
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const start = (activePage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = filteredData.slice(start, end);
  
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortConfig]);

  const handleSort = (columnIndex: number) => {
    setSortConfig((prev) => {
      if (prev.columnIndex === columnIndex) {
        return {
          columnIndex,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { columnIndex, direction: 'asc' };
    });
  };

  const renderSortIcon = (columnIndex: number) => {
    if (sortConfig.columnIndex !== columnIndex) {
      return <IconArrowsSort size={14} />;
    }
    return sortConfig.direction === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
  };

  const isRowActive = (row: (string | number)[]) => {
    if (paramsReaderItems.statusColumnIndex !== undefined) {
      const status = String(row[paramsReaderItems.statusColumnIndex]).toLowerCase();
      return status === 'ativo';
    }
    return true;
  };

  const handleToggleStatus = async (row: (string | number)[], index: number) => {
    const active = isRowActive(row);
    if (active && paramsReaderItems.onDelete) {
      await handleDelete(row, index);
    } else if (!active && paramsReaderItems.onActivate) {
      await paramsReaderItems.onActivate(row, index);
    }
  };

  return (
    <div className={classes.header}>
      <div className={classes.headerRow}>
        <h1 className={classes.title}>{paramsReaderItems.titulo}</h1>
        <div className={classes.searchAndButtonContainer}>
          {paramsReaderItems.hasStatusFilter && (
            <SegmentedControl
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { label: 'Ativos', value: 'ativos' },
                { label: 'Inativos', value: 'inativos' },
                { label: 'Todos', value: 'todos' }
              ]}
              style={{ marginRight: '1rem' }}
            />
          )}
          <TextInput
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            rightSection={<IconSearch size={16} />}
            className={classes.searchInput}
          />
          {!hideCreateButton && (
            <Button
              variant="filled"
              className={classes.button}
              onClick={() => navigate(url)}
            >
              {paramsReaderItems.textButton}
            </Button>
          )}
        </div>
      </div>
      <Table.ScrollContainer minWidth={300} className={classes.tableContainer}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {paramsReaderItems.headers.map((header, index) => (
                <Table.Th className={`${classes.tableTh} ${classes.capitalize}`} key={header}>
                  <button
                    type="button"
                    className={`${classes.sortButton} ${sortConfig.columnIndex === index ? classes.sortButtonActive : ''}`}
                    onClick={() => handleSort(index)}
                  >
                    <span>{header}</span>
                    {renderSortIcon(index)}
                  </button>
                </Table.Th>
              ))}
              {!hideActions && (
                <Table.Th className={`${classes.tableTh} ${classes.actionsHeader}`}>Ações</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.map((row, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {row.map((item, cellIndex) => {
                  const headerLabel = paramsReaderItems.headers[cellIndex]?.toLowerCase();
                  const isPhoneColumn = headerLabel?.includes('telefone');
                  const displayValue = isPhoneColumn ? formatPhoneNumber(item) : item;

                  return (
                    <Table.Td key={cellIndex}>{displayValue}</Table.Td>
                  );
                })}
                {!hideActions && (
                  <Table.Td className={classes.actionsCell}>
                    <Group gap="sm" className={classes.actionsGroup}>
                      <ActionIcon 
                        variant="subtle" 
                        color="blue"
                        onClick={() => handleEdit(row, rowIndex)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      {isRowActive(row) ? (
                        <ActionIcon 
                          variant="subtle" 
                          color="red"
                          onClick={() => handleToggleStatus(row, rowIndex)}
                          title="Desativar"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      ) : (
                        <ActionIcon 
                          variant="subtle" 
                          color="green"
                          onClick={() => handleToggleStatus(row, rowIndex)}
                          title="Ativar"
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      
      <div className={classes.paginationContainer}>
          <Text size="sm">
              Mostrando {filteredData.length === 0 ? 0 : start + 1}-{Math.min(end, filteredData.length)} de {filteredData.length} itens
              {search && ` (${filteredData.length} resultados encontrados)`}
          </Text>
          <Pagination
              total={totalPages}
              value={activePage}
              onChange={setPage}
              withEdges
              className={classes.pagination}
          />
      </div>
    </div>
  )
}