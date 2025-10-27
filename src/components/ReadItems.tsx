import React, { useState, useEffect } from 'react';
import {
  Table,
  Pagination,
  Group,
  Text,
  TextInput,
  ActionIcon
} from '@mantine/core';
import { IconSearch, IconEdit, IconTrash, IconClipboardList } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { ParamsReaderItems } from '../interface/IReaderItems';
import classes from '../styles/administracao/ReadItems.module.css';

export function ReadItems({ paramsReaderItems }: { paramsReaderItems: ParamsReaderItems }) {
    const handleEdit = (index: number) => {
        console.log('Edit item at index:', index);
    };

    const handleDelete = (index: number) => {
        if (window.confirm('Tem certeza que deseja excluir logicamente este item?')) {
            console.log('Delete item at index:', index);
        }
    };

    const navigate = useNavigate();
    const [activePage, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 10;
    const url = paramsReaderItems.url;
    
    const filteredData = paramsReaderItems.body.filter(row => 
      row.some(cell => 
        String(cell).toLowerCase().includes(search.toLowerCase())
      )
    );
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = filteredData.slice(start, end);
    
    useEffect(() => {
      setPage(1);
    }, [search]);
  return (
    <div className={classes.header}>
      <div className={classes.headerRow}>
        <h1 className={classes.title}>{paramsReaderItems.titulo}</h1>
        <div className={classes.searchAndButtonContainer}>
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
                                    onClick={() => handleEdit(rowIndex)}
                                >
                                    <IconEdit size={16} />
                                </ActionIcon>
                                <ActionIcon 
                                    variant="subtle" 
                                    color="red"
                                    onClick={() => handleDelete(rowIndex)}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
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