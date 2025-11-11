import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Card, Loader, Text, Button, Group } from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import { mockOccurrences } from '../mock/occurrences';
import 'leaflet/dist/leaflet.css';
import classes from '../styles/MapaOcorrencia.module.css';
import pin from '../assets/img/Icons/pin2.png';
import type { ParamsReaderItems } from '../interface/IReaderItems';



// Correção para os ícones padrão de marcadores no React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Ícone personalizado para os marcadores
const getIconByType = (title: string) => {
  if (title.includes('Incêndio')) return L.icon({ iconUrl: pin, iconSize: [32, 32] });
  if (title.includes('Acidente')) return L.icon({ iconUrl: pin, iconSize: [32, 32] });
  return L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', iconSize: [32, 32] });
};


interface Occurrence {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
}

interface OccurrencesMapContentProps {
  occurrences: Occurrence[];
  paramsReaderItems?: {
    onAtendimentoClick?: (row: any) => void;
  };
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
        radius: 25, 
        blur: 15,
        maxZoom: 17,
        minOpacity: 0.2,
        max: 1,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
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
function OccurrencesMapContent({ occurrences, paramsReaderItems = {} }: OccurrencesMapContentProps) {
  const heatPoints = useMemo<[number, number, number][]>(
    () => occurrences.map(o => [o.latitude, o.longitude, 1] as [number, number, number]),
    [occurrences]
  );

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {occurrences.map(o => (
        <Marker key={o.id} position={[o.latitude, o.longitude]} icon={getIconByType(o.title)}>
          <Popup>
            <Text fw={600}>{o.title}</Text>
            <Text size="sm">{o.description}</Text>
            <Text size="xs" c="dimmed">
              {new Date(o.date).toLocaleString('pt-BR')}
              </Text>
              <Button
                leftSection={<IconClipboardList size={16} />}
              variant="light"
              color="green"
              size="xs"
              onClick={() => paramsReaderItems.onAtendimentoClick?.(o)}
            >
              Ver mais
            </Button>
          </Popup>
        </Marker>
      ))}

      <HeatLayer points={heatPoints} />
    </>
  );
}

export default function MapOccurrences() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de chamada à API
    const timeout = setTimeout(() => {
      setOccurrences(mockOccurrences);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className={classes.loaderContainer}>
        <Loader color="blue" />
      </div>
    );
  }

  return (
    <Card shadow="sm" radius="md" p="md" withBorder>
      <Text fw={600} mb="sm">
        Mapa de Ocorrências
      </Text>

      {/* 🔹 O MapContainer é fixo — nunca é renderizado novamente */}
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
          paramsReaderItems={{
            onAtendimentoClick: (row) => {
              // Aqui você pode adicionar a lógica de redirecionamento
              // ou abrir o modal de atendimento
              console.log('Ocorrência selecionada:', row);
            }
          }}
        />
        </MapContainer>
      </div>
    </Card>
  );
}
