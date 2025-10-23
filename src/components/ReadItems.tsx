import { useState } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import {
  Table,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom'

import { Button } from '@mantine/core';
import { data } from '../mock/ItenListData';
import type { ParamsReaderItems } from '../interface/IReaderItems';
import classes from '../styles/administracao/ReadItems.module.css';

export function ReadItems({ paramsReaderItems }: { paramsReaderItems: ParamsReaderItems }) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    // Exemplo simples de paginação
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);
    const url = paramsReaderItems.url
  return (
    <>
        <div className={classes.header}>
            <h1 className={classes.title}>{paramsReaderItems.titulo}</h1>
            <Button
            variant="filled"
            className={classes.button}
            onClick={() => navigate(url)}
            >
            {paramsReaderItems.textButton}
            </Button>
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
                {paramsReaderItems.body.map((row, index) => (
                    <Table.Tr key={index}>
                        {row.map((item, index) => (
                            <Table.Td key={index}>{item}</Table.Td>
                        ))}
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
    </>
      )
    }