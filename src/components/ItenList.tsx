import { useState } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Badge,
  Group,
  Table,
  Text,
  Pagination,
} from '@mantine/core';

const data = [
  {
    name: 'Robert Jonhson',
    cargo: 'Engineer',
    email: 'robert.johnson@centrocontrolefogo.com.br',
    matricula: '8628965',
  },
  {
    name: 'Fernando Silva',
    cargo: 'Engineer',
    email: 'fernando.silva@centrocontrolefogo.com.br',
    matricula: '8628954',
  },
  {
    name: 'Carlos Costa',
    cargo: 'Designer',
    email: 'carlos.costa@centrocontrolefogo.com.br',
    matricula: '8628474',
  },
  {
    name: 'Carlos Marques',
    cargo: 'Designer',
    email: 'carlos.marques@centrocontrolefogo.com.br',
    matricula: '8628474',
  },
  {
    name: 'Jaciel Marques',
    cargo: 'Manager',
    email: 'jaciel.marques@centrocontrolefogo.com.br',
    matricula: '8628441',
  },
  
];

const cargoColors: Record<string, string> = {
  engineer: 'blue',
  manager: 'cyan',
  designer: 'pink',
};

export function ItenList() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  // Exemplo simples de paginação
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  const rows = paginatedData.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={cargoColors[item.cargo.toLowerCase()]} variant="light">
          {item.cargo}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {item.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.matricula}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome de Usuário</Table.Th>
              <Table.Th>Cargo</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Matrícula</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Paginação abaixo da tabela */}
      <Group justify="center" mt="md">
        <Pagination
          total={Math.ceil(data.length / rowsPerPage)}
          value={page}
          onChange={setPage}
          color="#B13433"
        />
      </Group>
    </>
  );
}
