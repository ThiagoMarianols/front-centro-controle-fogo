import { useState, useEffect } from 'react';
import { 
  Card, 
  Title, 
  Button, 
  Group, 
  Select, 
  TextInput, 
  Table, 
  Loader, 
  Center,
  Text,
  Badge,
  Stack,
  Grid,
  Paper,
  ActionIcon,
  Tooltip,
  Pagination
} from '@mantine/core';
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates';
import { 
  IconDownload, 
  IconFileTypePdf, 
  IconFileTypeCsv, 
  IconSearch,
  IconFilter,
  IconEye,
  IconRefresh
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { occurrenceService } from '../services/occurrenceService';
import type { 
  IOccurrenceMapInfo, 
  IOccurrenceType, 
  IOccurrenceSubtype, 
  IOccurrenceStatus, 
  IOccurrenceNature 
} from '../interfaces/IOccurrence';
import classes from '../styles/Relatorios.module.css';
import MapOccurrences from '../components/MapaOcorrencia';
import logoCCF from '../assets/img/LogoCCF3.png';

const Relatorios = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [occurrences, setOccurrences] = useState<IOccurrenceMapInfo[]>([]);
  const [filteredOccurrences, setFilteredOccurrences] = useState<IOccurrenceMapInfo[]>([]);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter options
  const [types, setTypes] = useState<IOccurrenceType[]>([]);
  const [subtypes, setSubtypes] = useState<IOccurrenceSubtype[]>([]);
  const [statuses, setStatuses] = useState<IOccurrenceStatus[]>([]);
  const [natures, setNatures] = useState<IOccurrenceNature[]>([]);
  
  // Filter values
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedNature, setSelectedNature] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<DatesRangeValue<Date>>([null, null]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(logoCCF);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setLogoDataUrl(reader.result as string);
        reader.onerror = () => setLogoDataUrl(null);
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Erro ao carregar a logo para o PDF:', error);
        setLogoDataUrl(null);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    applyFilters();
    setActivePage(1); // Reset pagination when filters change
  }, [occurrences, selectedType, selectedSubtype, selectedStatus, selectedNature, searchText, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [occurrencesData, typesData, subtypesData, statusesData, naturesData] = await Promise.all([
        occurrenceService.getMapInfo(),
        occurrenceService.getTypes(),
        occurrenceService.getSubtypes(),
        occurrenceService.getStatus(),
        occurrenceService.getNatures(),
      ]);
      
      setOccurrences(occurrencesData);
      setTypes(typesData);
      setSubtypes(subtypesData);
      setStatuses(statusesData);
      setNatures(naturesData);
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: error instanceof Error ? error.message : 'Erro ao carregar dados',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...occurrences];

    if (selectedType) {
      filtered = filtered.filter(o => o.typeId === Number(selectedType));
    }

    if (selectedSubtype) {
      filtered = filtered.filter(o => o.subtypeId === Number(selectedSubtype));
    }

    if (selectedStatus) {
      filtered = filtered.filter(o => o.statusId === Number(selectedStatus));
    }

    if (selectedNature) {
      filtered = filtered.filter(o => o.natureId === Number(selectedNature));
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(o => 
        o.typeName.toLowerCase().includes(search) ||
        o.subtypeName.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search)
      );
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(o => {
        const occDate = new Date(o.date);
        return occDate >= dateRange[0]! && occDate <= dateRange[1]!;
      });
    }

    setFilteredOccurrences(filtered);
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedStatus(null);
    setSelectedNature(null);
    setSearchText('');
    setDateRange([null, null]);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const headerX = 14;
      const headerY = 20;

      if (logoDataUrl) {
        const logoWidth = 35;
        const logoHeight = 20;
        doc.addImage(logoDataUrl, 'PNG', headerX, 10, logoWidth, logoHeight);
        doc.setFontSize(18);
        doc.text('Relatório de Ocorrências', headerX + logoWidth + 5, headerY);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, headerX + logoWidth + 5, headerY + 8);
        doc.text(`Total de registros: ${filteredOccurrences.length}`, headerX + logoWidth + 5, headerY + 14);
      } else {
        doc.setFontSize(18);
        doc.text('Relatório de Ocorrências', headerX, headerY);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, headerX, headerY + 8);
        doc.text(`Total de registros: ${filteredOccurrences.length}`, headerX, headerY + 14);
      }

      // Tabela
      autoTable(doc, {
        startY: logoDataUrl ? 55 : 40,
        head: [['ID', 'Natureza', 'Tipo', 'Subtipo', 'Status', 'Data']],
        body: filteredOccurrences.map(o => [
          o.id.toString(),
          o.natureName,
          o.typeName,
          o.subtypeName,
          o.statusName,
          new Date(o.date).toLocaleString('pt-BR')
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [177, 52, 51] },
      });
      
      doc.save(`relatorio-ocorrencias-${new Date().getTime()}.pdf`);
      
      notifications.show({
        title: 'Sucesso',
        message: 'PDF exportado com sucesso',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao exportar PDF',
        color: 'red',
      });
    }
  };

  const exportToCSV = () => {
    try {
      const csvData = filteredOccurrences.map(o => ({
        Id: o.id,
        Natureza: o.natureName,
        Tipo: o.typeName,
        Subtipo: o.subtypeName,
        Status: o.statusName,
        Descrição: o.description,
        Latitude: o.latitude,
        Longitude: o.longitude,
        Data: new Date(o.date).toLocaleString('pt-BR')
      }));
      
      const csv = Papa.unparse(csvData, { delimiter: ';' });
      const csvWithBom = `\ufeff${csv}`;
      const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-ocorrencias-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      notifications.show({
        title: 'Sucesso',
        message: 'CSV exportado com sucesso',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao exportar CSV',
        color: 'red',
      });
    }
  };

  const getStatusColor = (statusName: string) => {
    if (statusName.includes('AGUARDANDO')) return 'yellow';
    if (statusName.includes('ATENDIMENTO')) return 'blue';
    if (statusName.includes('CONCLUÍDA') || statusName.includes('FINALIZADA')) return 'green';
    return 'gray';
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredOccurrences.length / itemsPerPage);
  const start = (activePage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedOccurrences = filteredOccurrences.slice(start, end);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <div className={classes.centerWrap}>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2} style={{ color: '#B13433', fontWeight: 700 }}>
            Relatórios de Ocorrências
          </Title>
          <Group>
            <Button
              leftSection={<IconRefresh size={18} />}
              variant="light"
              onClick={loadData}
            >
              Atualizar
            </Button>
          </Group>
        </Group>

        {/* Filters */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Group>
              <IconFilter size={20} style={{ color: '#B13433' }} />
              <Text fw={600}>Filtros</Text>
            </Group>
            <Button
              variant="subtle"
              size="xs"
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          </Group>
          
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Natureza"
                placeholder="Selecione a natureza"
                data={natures.map(n => ({ value: n.id.toString(), label: n.name }))}
                value={selectedNature}
                onChange={setSelectedNature}
                clearable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Tipo"
                placeholder="Selecione o tipo"
                data={types.map(t => ({ value: t.id.toString(), label: t.name }))}
                value={selectedType}
                onChange={setSelectedType}
                clearable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Subtipo"
                placeholder="Selecione o subtipo"
                data={subtypes.map(s => ({ value: s.id.toString(), label: s.name }))}
                value={selectedSubtype}
                onChange={setSelectedSubtype}
                clearable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                data={statuses.map(s => ({ value: s.id.toString(), label: s.name }))}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Buscar"
                placeholder="Buscar por tipo, subtipo ou descrição"
                leftSection={<IconSearch size={16} />}
                value={searchText}
                onChange={(e) => setSearchText(e.currentTarget.value)}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DatePickerInput
                type="range"
                label="Período"
                placeholder="Selecione o período"
                value={dateRange}
                onChange={(value) => setDateRange(value as DatesRangeValue<Date>)}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Stats */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #B13433 0%, #8B0000 100%)', color: 'white' }}>
              <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Total de Ocorrências</Text>
              <Text size="xl" fw={700} mt={5}>{filteredOccurrences.length}</Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)', color: 'white' }}>
              <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Em Atendimento</Text>
              <Text size="xl" fw={700} mt={5}>
                {filteredOccurrences.filter(o => o.statusName.includes('ATENDIMENTO')).length}
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#2c3e50' }}>
              <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Aguardando</Text>
              <Text size="xl" fw={700} mt={5}>
                {filteredOccurrences.filter(o => o.statusName.includes('AGUARDANDO')).length}
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', color: 'white' }}>
              <Text size="xs" fw={600} style={{ opacity: 0.9 }}>Concluídas</Text>
              <Text size="xl" fw={700} mt={5}>
                {filteredOccurrences.filter(o => o.statusName.includes('CONCLUÍDA') || o.statusName.includes('FINALIZADA')).length}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Export Buttons */}
        <Group>
          <Button
            leftSection={<IconFileTypePdf size={18} />}
            style={{ backgroundColor: '#B13433' }}
            onClick={exportToPDF}
          >
            Exportar PDF
          </Button>
          <Button
            leftSection={<IconFileTypeCsv size={18} />}
            variant="light"
            color="green"
            onClick={exportToCSV}
          >
            Exportar CSV
          </Button>
        </Group>

        {/* Table */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600} mb="md">Listagem de Ocorrências</Text>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Natureza</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Subtipo</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredOccurrences.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Center p="xl">
                      <Text c="dimmed">Nenhuma ocorrência encontrada</Text>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginatedOccurrences.map((occurrence) => (
                  <Table.Tr key={occurrence.id}>
                    <Table.Td>{occurrence.id}</Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {occurrence.natureName}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{occurrence.typeName}</Table.Td>
                    <Table.Td>{occurrence.subtypeName}</Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(occurrence.statusName)} variant="filled">
                        {occurrence.statusName}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {new Date(occurrence.date).toLocaleString('pt-BR')}
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Ver detalhes">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => navigate(`/detalhesocorrencia/${occurrence.id}`)}
                        >
                          <IconEye size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
          {/* Pagination */}
          {filteredOccurrences.length > 0 && (
            <Group justify="space-between" mt="md">
              <Text size="sm">
                Mostrando {filteredOccurrences.length === 0 ? 0 : start + 1}-{Math.min(end, filteredOccurrences.length)} de {filteredOccurrences.length} itens
              </Text>
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setActivePage}
                withEdges
              />
            </Group>
          )}
        </Card>

        {/* Map */}
        <MapOccurrences filteredOccurrences={filteredOccurrences} />
      </Stack>
    </div>
  );
};

export default Relatorios;