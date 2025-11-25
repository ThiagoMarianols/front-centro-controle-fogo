import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Card, Loader, Text, Button, Group, Badge, Center } from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { occurrenceService } from '../services/occurrenceService';
import type { IOccurrenceMapInfo } from '../interfaces/IOccurrence';
import 'leaflet/dist/leaflet.css';
import classes from '../styles/MapaOcorrencia.module.css';
import AtendimentoPreHospitalar from '../assets/img/Icons/pins/AtenPreHosp.png';
import AtividadeComunitaria from '../assets/img/Icons/pins/AtivComun.png';
import Incendio from '../assets/img/Icons/pins/Incendio.png';
import Prevencao from '../assets/img/Icons/pins/Pevencao.png';
import ProdutoPerigoso from '../assets/img/Icons/pins/ProdPerig.png';
import Salvamento from '../assets/img/Icons/pins/Salvamento.png';
import pin from '../assets/img/Icons/pin2.png';


// Correção para os ícones padrão de marcadores no React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Ícone personalizado para os marcadores baseado na natureza
const getIconByNature = (natureName: string) => {
  const nature = natureName.toUpperCase();
  if (nature.includes('ATENDIMENTO') || nature.includes('PRÉ-HOSPITALAR')) {
    return L.icon({ iconUrl: AtendimentoPreHospitalar, iconSize: [64, 64] });
  }
  if (nature.includes('ATIVIDADE') || nature.includes('COMUNITARIA')) {
    return L.icon({ iconUrl: AtividadeComunitaria, iconSize: [64, 64] });
  }
  if (nature.includes('INCÊNDIO') || nature.includes('INCENDIO')) {
    return L.icon({ iconUrl: Incendio, iconSize: [64, 64] });
  }
  if (nature.includes('PREVENÇÃO') || nature.includes('PREVENCAO')) {
    return L.icon({ iconUrl: Prevencao, iconSize: [64, 64] });
  }
  if (nature.includes('PRODUTO') || nature.includes('PERIGOSO')) {
    return L.icon({ iconUrl: ProdutoPerigoso, iconSize: [64, 64] });
  }
  if (nature.includes('SALVAMENTO')) {
    return L.icon({ iconUrl: Salvamento, iconSize: [64, 64] });
  }
  return L.icon({ iconUrl: pin, iconSize: [50, 50] });
};

const hasValidCoordinates = (occurrence: IOccurrenceMapInfo) =>
  typeof occurrence.latitude === 'number' && !Number.isNaN(occurrence.latitude) &&
  typeof occurrence.longitude === 'number' && !Number.isNaN(occurrence.longitude);

const isAwaitingStatus = (statusName?: string) =>
  statusName?.toUpperCase().includes('AGUARDANDO') ?? false;

const filterOccurrencesForMap = (items: IOccurrenceMapInfo[]) =>
  items.filter((occurrence) => {
    if (hasValidCoordinates(occurrence)) {
      return true;
    }

    if (isAwaitingStatus(occurrence.statusName)) {
      console.warn('Ignorando ocorrência sem coordenadas por estar aguardando atendimento:', occurrence.id);
      return false;
    }

    if (occurrence.latitude === null || occurrence.longitude === null) {
      console.warn('Ocorrência sem coordenadas não será exibida no mapa:', occurrence.id);
    }

    return false;
  });


interface OccurrencesMapContentProps {
  occurrences: IOccurrenceMapInfo[];
  onOccurrenceClick: (id: number) => void;
}

const ResizeFix = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize(); // força o recalculo do mapa
    }, 300);
  }, [map]);

  return null;
};

const HeatLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;
    
    try {
      // Garante que todos os pontos tenham um valor de intensidade
      const formattedPoints = points.map(p => [p[0], p[1], p[2] || 0.7] as [number, number, number]);
      
      const heatLayer = (L as any).heatLayer(formattedPoints, { 
        radius: 30, 
        blur: 40,
        maxZoom: 15,
        minOpacity: 0.4,
        max: 1,
        gradient: {
          0.1: 'blue',
          0.2: 'cyan',
          0.3: 'lime',
          0.4: 'yellow',
          0.6: 'red'
        }
      });
      
      // Adiciona uma pequena pausa para garantir que o mapa esteja totalmente carregado
      const timer = setTimeout(() => {
        heatLayer.addTo(map);
      }, 300);
      
      return () => {
        clearTimeout(timer);
        if (map && map.hasLayer(heatLayer)) {
          map.removeLayer(heatLayer);
        }
      };
    } catch (error) {
      console.error('Erro ao inicializar o mapa de calor:', error);
    }
  }, [map, points]);

  return null;
};

// 🔹 Componente separado — mantém o mapa fixo, só atualiza camadas
function OccurrencesMapContent({ occurrences, onOccurrenceClick }: OccurrencesMapContentProps) {
  const heatPoints = useMemo<[number, number, number][]>(
    () => occurrences.map(o => [o.latitude, o.longitude, 1] as [number, number, number]),
    [occurrences]
  );

  useEffect(() => {
    console.log('OccurrencesMapContent - Total de ocorrências:', occurrences.length);
    if (occurrences.length > 0) {
      console.log('Primeira ocorrência:', occurrences[0]);
    }
  }, [occurrences]);

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {occurrences.map(o => (
        <Marker key={o.id} position={[o.latitude, o.longitude]} icon={getIconByNature(o.natureName)}>
          <Popup>
            <Text fw={600}>{o.typeName}</Text>
            <Text size="sm" fw={500}>{o.subtypeName}</Text>
            <Text size="xs" mt={5}>{o.description}</Text>
            <Text size="xs" c="dimmed" mt={5}>
              {new Date(o.date).toLocaleString('pt-BR')}
            </Text>
            <Button
              leftSection={<IconClipboardList size={16} />}
              variant="light"
              color="green"
              size="xs"
              mt={10}
              fullWidth
              onClick={() => onOccurrenceClick(o.id)}
            >
              Ver detalhes
            </Button>
          </Popup>
        </Marker>
      ))}

      <HeatLayer points={heatPoints} />
    </>
  );
}

interface MapOccurrencesProps {
  filteredOccurrences?: IOccurrenceMapInfo[];
}

export default function MapOccurrences({ filteredOccurrences }: MapOccurrencesProps = {}) {
  const navigate = useNavigate();
  const [occurrences, setOccurrences] = useState<IOccurrenceMapInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se receber ocorrências filtradas, usa elas
    if (filteredOccurrences !== undefined) {
      setOccurrences(filterOccurrencesForMap(filteredOccurrences));
      setLoading(false);
      return;
    }

    // Caso contrário, busca da API
    const fetchOccurrences = async () => {
      try {
        setLoading(true);
        const data = await occurrenceService.getMapInfo();
        console.log('Dados recebidos do mapa:', data);
        console.log('Total de ocorrências:', data?.length || 0);
        setOccurrences(filterOccurrencesForMap(data));
      } catch (error) {
        console.error('Erro ao carregar ocorrências do mapa:', error);
        notifications.show({
          title: 'Erro',
          message: error instanceof Error ? error.message : 'Erro ao carregar ocorrências do mapa',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOccurrences();
  }, [filteredOccurrences]);

  const handleOccurrenceClick = (id: number) => {
    navigate(`/detalhesocorrencia/${id}`);
  };

  if (loading) {
    return (
      <div className={classes.loaderContainer}>
        <Loader color="blue" />
      </div>
    );
  }

  return (
    <Card shadow="sm" radius="md" p="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Text fw={600}>
          Mapa de Ocorrências
        </Text>
        <Badge color="blue" variant="light">
          {occurrences.length} ocorrência(s)
        </Badge>
      </Group>

      {occurrences.length === 0 ? (
        <Center p="xl" style={{ minHeight: 400, background: '#f8f9fa', borderRadius: 8 }}>
          <Text c="dimmed">Nenhuma ocorrência encontrada para exibir no mapa</Text>
        </Center>
      ) : (
        <div className={classes.mapContainer}>
          <MapContainer
            key="occurrences-map"
            center={[-8.05, -34.88]} // Centralizado em Recife
            zoom={12}
            className={classes.map}
            zoomControl={true}
            attributionControl={true}
            minZoom={3}
            maxZoom={18}
          >
            <ResizeFix />
            <OccurrencesMapContent 
              occurrences={occurrences}
              onOccurrenceClick={handleOccurrenceClick}
            />
          </MapContainer>
        </div>
      )}
    </Card>
  );
}
