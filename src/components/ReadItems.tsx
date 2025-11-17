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
import { IconSearch, IconEdit, IconTrash, IconClipboardList, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { ParamsReaderItems } from '../interface/IReaderItems';
import classes from '../styles/administracao/ReadItems.module.css';

export function ReadItems({ paramsReaderItems }: { paramsReaderItems: ParamsReaderItems }) {
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
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = filteredData.slice(start, end);
    
    useEffect(() => {
      setPage(1);
    }, [search, statusFilter]);

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
          <Button
            variant="filled"
            className={classes.button}
            onClick={() => navigate(url)}
          >
            {paramsReaderItems.textButton}
          </Button>
        </div>
      </div>
      <Table.ScrollContainer minWidth={300} className={classes.tableContainer}>
        <Table>
            <Table.Thead>
            <Table.Tr>
                {paramsReaderItems.headers.map((header) => (
                <Table.Th className={`${classes.tableTh} ${classes.capitalize}`} key={header}>
                    {header}
                </Table.Th>
                ))}
                {paramsReaderItems.showAtendimento && (
                  <Table.Th className={`${classes.tableTh} ${classes.actionsHeader}`}>Atendimento</Table.Th>
                )}
                <Table.Th className={`${classes.tableTh} ${classes.actionsHeader}`}>Ações</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {paginatedData.map((row, rowIndex) => (
                    <Table.Tr key={rowIndex}>
                        {row.map((item, cellIndex) => (
                            <Table.Td key={cellIndex}>{item}</Table.Td>
                        ))}
                        {paramsReaderItems.showAtendimento && (
                          <Table.Td className={classes.actionsCell}>
                            <Group gap="sm" className={classes.actionsGroup}>
                              <Button
                                leftSection={<IconClipboardList size={16} />}
                                variant="light"
                                color="green"
                                size="xs"
                                onClick={() => paramsReaderItems.onAtendimentoClick?.(row)}
                              >
                                Atendimento
                              </Button>
                            </Group>
                          </Table.Td>
                        )}
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