import React, { useState, useEffect } from 'react';
import {
  Table,
  Pagination,
  Group,
  Text,
  TextInput
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom'

import { Button } from '@mantine/core';
import { data } from '../mock/ItenListData';
import type { ParamsReaderItems } from '../interface/IReaderItems';
import classes from '../styles/administracao/ReadItems.module.css';

export function ReadItems({ paramsReaderItems }: { paramsReaderItems: ParamsReaderItems }) {
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
    <>
    
    
        <div className={classes.header}>
            <h1 className={classes.title}>{paramsReaderItems.titulo}</h1>
            <div className={classes.headerActions}>
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
                <Table.Th className={classes.tableTh} key={header} style={{ textTransform: 'capitalize' }}>
                    {header}
                </Table.Th>
                ))}
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {paginatedData.map((row, index) => (
                    <Table.Tr key={index}>
                        {row.map((item, index) => (
                            <Table.Td key={index}>{item}</Table.Td>
                        ))}
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
    </>
      )
    }