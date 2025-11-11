// Tipos para os grupos e subgrupos
export interface SubgrupoOcorrencia {
  id: number;
  nome: string;
  grupoId: number;
  naturezaId: number;
  codigo: string;
  descricao?: string;
}

export interface GrupoOcorrencia {
  id: number;
  nome: string;
  naturezaId: number;
  codigo: string;
  descricao?: string;
  subgrupos: SubgrupoOcorrencia[];
}

export interface NaturezaOcorrencia {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  grupos: GrupoOcorrencia[];
}

// Dados mockados com 10 naturezas, cada uma com grupos e subgrupos
export const mockNaturezasOcorrencia: NaturezaOcorrencia[] = [
  {
    id: 1,
    codigo: '1',
    nome: 'ATENDIMENTO PRÉ-HOSPITALAR',
    grupos: [
      {
        id: 1,
        codigo: '1',
        naturezaId: 1,
        nome: 'Acidente de Trânsito - Atropelamento',
        subgrupos: [
          { id: 1, codigo: '1.1', nome: 'Auto passeio', grupoId: 1, naturezaId: 1 },
          { id: 2, codigo: '1.2', nome: 'Bicicleta', grupoId: 1, naturezaId: 1 },
          { id: 3, codigo: '1.3', nome: 'Caminhão', grupoId: 1, naturezaId: 1 },
          { id: 4, codigo: '1.4', nome: 'Moto', grupoId: 1, naturezaId: 1 },
          { id: 5, codigo: '1.5', nome: 'Outros', grupoId: 1, naturezaId: 1 }
        ]
      },
      {
        id: 2,
        codigo: '2',
        naturezaId: 1,
        nome: 'Queda de Altura',
        subgrupos: [
          { id: 6, codigo: '2.1', nome: 'Prédio', grupoId: 2, naturezaId: 1 },
          { id: 7, codigo: '2.2', nome: 'Escada', grupoId: 2, naturezaId: 1 },
          { id: 8, codigo: '2.3', nome: 'Árvore', grupoId: 2, naturezaId: 1 },
          { id: 9, codigo: '2.4', nome: 'Outros', grupoId: 2, naturezaId: 1 }
        ]
      }
    ]
  },
  {
    id: 2,
    codigo: '2',
    nome: 'ATENDIMENTO MÉDICO',
    grupos: [
      {
        id: 3,
        codigo: '1',
        naturezaId: 2,
        nome: 'Emergências Clínicas',
        subgrupos: [
          { id: 10, codigo: '1.1', nome: 'Dor no Peito', grupoId: 3, naturezaId: 2 },
          { id: 11, codigo: '1.2', nome: 'Falta de Ar', grupoId: 3, naturezaId: 2 },
          { id: 12, codigo: '1.3', nome: 'Convulsão', grupoId: 3, naturezaId: 2 },
          { id: 13, codigo: '1.4', nome: 'Desmaio', grupoId: 3, naturezaId: 2 },
          { id: 14, codigo: '1.5', nome: 'Outros', grupoId: 3, naturezaId: 2 }
        ]
      }
    ]
  },
  {
    id: 3,
    codigo: '3',
    nome: 'OCORRÊNCIA COM INCÊNDIO',
    grupos: [
      {
        id: 4,
        codigo: '1',
        naturezaId: 3,
        nome: 'Incêndio em Residência',
        subgrupos: [
          { id: 15, codigo: '1.1', nome: 'Cozinha', grupoId: 4, naturezaId: 3 },
          { id: 16, codigo: '1.2', nome: 'Sala', grupoId: 4, naturezaId: 3 },
          { id: 17, codigo: '1.3', nome: 'Quarto', grupoId: 4, naturezaId: 3 },
          { id: 18, codigo: '1.4', nome: 'Outros', grupoId: 4, naturezaId: 3 }
        ]
      }
    ]
  },
  {
    id: 4,
    codigo: '4',
    nome: 'OCORRÊNCIA COM PRODUTOS PERIGOSOS',
    grupos: [
      {
        id: 5,
        codigo: '1',
        naturezaId: 4,
        nome: 'Vazamento de Gás',
        subgrupos: [
          { id: 19, codigo: '1.1', nome: 'Gás de Cozinha', grupoId: 5, naturezaId: 4 },
          { id: 20, codigo: '1.2', nome: 'Gás Natural', grupoId: 5, naturezaId: 4 },
          { id: 21, codigo: '1.3', nome: 'Outros', grupoId: 5, naturezaId: 4 }
        ]
      }
    ]
  },
  {
    id: 5,
    codigo: '5',
    nome: 'OCORRÊNCIA COM ANIMAIS PEÇONHENTOS',
    grupos: [
      {
        id: 6,
        codigo: '1',
        naturezaId: 5,
        nome: 'Acidentes com Serpentes',
        subgrupos: [
          { id: 22, codigo: '1.1', nome: 'Jararaca', grupoId: 6, naturezaId: 5 },
          { id: 23, codigo: '1.2', nome: 'Cascavel', grupoId: 6, naturezaId: 5 },
          { id: 24, codigo: '1.3', nome: 'Outras', grupoId: 6, naturezaId: 5 }
        ]
      }
    ]
  },
  {
    id: 6,
    codigo: '6',
    nome: 'OCORRÊNCIA COM ANIMAIS SILVESTRES',
    grupos: [
      {
        id: 7,
        codigo: '1',
        naturezaId: 6,
        nome: 'Resgate de Animais Silvestres',
        subgrupos: [
          { id: 25, codigo: '1.1', nome: 'Ave', grupoId: 7, naturezaId: 6 },
          { id: 26, codigo: '1.2', nome: 'Mamífero', grupoId: 7, naturezaId: 6 },
          { id: 27, codigo: '1.3', nome: 'Réptil', grupoId: 7, naturezaId: 6 },
          { id: 28, codigo: '1.4', nome: 'Outros', grupoId: 7, naturezaId: 6 }
        ]
      }
    ]
  },
  {
    id: 7,
    codigo: '7',
    nome: 'OCORRÊNCIA COM DESASTRES',
    grupos: [
      {
        id: 8,
        codigo: '1',
        naturezaId: 7,
        nome: 'Desastres Naturais',
        subgrupos: [
          { id: 29, codigo: '1.1', nome: 'Enchente', grupoId: 8, naturezaId: 7 },
          { id: 30, codigo: '1.2', nome: 'Deslizamento', grupoId: 8, naturezaId: 7 },
          { id: 31, codigo: '1.3', nome: 'Outros', grupoId: 8, naturezaId: 7 }
        ]
      }
    ]
  },
  {
    id: 8,
    codigo: '8',
    nome: 'OCORRÊNCIA COM EXPLOSÃO',
    grupos: [
      {
        id: 9,
        codigo: '1',
        naturezaId: 8,
        nome: 'Tipos de Explosão',
        subgrupos: [
          { id: 32, codigo: '1.1', nome: 'Gás', grupoId: 9, naturezaId: 8 },
          { id: 33, codigo: '1.2', nome: 'Produto Químico', grupoId: 9, naturezaId: 8 },
          { id: 34, codigo: '1.3', nome: 'Outros', grupoId: 9, naturezaId: 8 }
        ]
      }
    ]
  },
  {
    id: 9,
    codigo: '9',
    nome: 'OCORRÊNCIA COM MEIO DE TRANSPORTE',
    grupos: [
      {
        id: 10,
        codigo: '1',
        naturezaId: 9,
        nome: 'Tipos de Veículos',
        subgrupos: [
          { id: 35, codigo: '1.1', nome: 'Automóvel', grupoId: 10, naturezaId: 9 },
          { id: 36, codigo: '1.2', nome: 'Caminhão', grupoId: 10, naturezaId: 9 },
          { id: 37, codigo: '1.3', nome: 'Outros', grupoId: 10, naturezaId: 9 }
        ]
      }
    ]
  },
  {
    id: 10,
    codigo: '10',
    nome: 'OCORRÊNCIA COM PESSOAS',
    grupos: [
      {
        id: 11,
        codigo: '1',
        naturezaId: 10,
        nome: 'Situações de Risco',
        subgrupos: [
          { id: 38, codigo: '1.1', nome: 'Tentativa de Suicídio', grupoId: 11, naturezaId: 10 },
          { id: 39, codigo: '1.2', nome: 'Desmaio', grupoId: 11, naturezaId: 10 },
          { id: 40, codigo: '1.3', nome: 'Outros', grupoId: 11, naturezaId: 10 }
        ]
      },
      {
        id: 12,
        codigo: '2',
        naturezaId: 10,
        nome: 'Violência',
        subgrupos: [
          { id: 41, codigo: '2.1', nome: 'Física', grupoId: 12, naturezaId: 10 },
          { id: 42, codigo: '2.2', nome: 'Psicológica', grupoId: 12, naturezaId: 10 },
          { id: 43, codigo: '2.3', nome: 'Outros', grupoId: 12, naturezaId: 10 }
        ]
      }
    ]
  }
];

// Tipos para os retornos das funções
type NaturezaResumida = {
  id: number;
  nome: string;
  codigo: string;
};

type GrupoResumido = {
  id: number;
  nome: string;
  codigo: string;
  naturezaId: number;
};

// Funções de API mockadas
export const fetchNaturezasOcorrencia = async (): Promise<NaturezaResumida[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockNaturezasOcorrencia.map(({ id, nome, codigo }) => ({ id, nome, codigo }));
};

export const fetchGruposOcorrencia = async (naturezaId?: number): Promise<GrupoResumido[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (naturezaId) {
    const natureza = mockNaturezasOcorrencia.find(n => n.id === naturezaId);
    return natureza ? natureza.grupos.map(({ id, nome, codigo, naturezaId }) => ({ 
      id, 
      nome, 
      codigo, 
      naturezaId 
    })) : [];
  }
  
  return mockNaturezasOcorrencia.flatMap(natureza => 
    natureza.grupos.map(({ id, nome, codigo, naturezaId }) => ({
      id,
      nome,
      codigo,
      naturezaId
    }))
  );
};

export const fetchSubgruposPorGrupo = async (grupoId: number): Promise<SubgrupoOcorrencia[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  for (const natureza of mockNaturezasOcorrencia) {
    for (const grupo of natureza.grupos) {
      if (grupo.id === grupoId) {
        return grupo.subgrupos;
      }
    }
  }
  
  return [];
};

export const fetchSubgruposPorNatureza = async (naturezaId: number): Promise<SubgrupoOcorrencia[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const natureza = mockNaturezasOcorrencia.find(n => n.id === naturezaId);
  if (!natureza) return [];
  
  return natureza.grupos.flatMap(grupo => grupo.subgrupos);
};

export const fetchNaturezaPorId = async (id: number): Promise<NaturezaResumida | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const natureza = mockNaturezasOcorrencia.find(n => n.id === id);
  return natureza ? { id: natureza.id, nome: natureza.nome, codigo: natureza.codigo } : null;
};

export const fetchGrupoPorId = async (id: number): Promise<GrupoResumido | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  for (const natureza of mockNaturezasOcorrencia) {
    const grupo = natureza.grupos.find(g => g.id === id);
    if (grupo) {
      return {
        id: grupo.id,
        nome: grupo.nome,
        codigo: grupo.codigo,
        naturezaId: grupo.naturezaId
      };
    }
  }
  
  return null;
};

export const fetchSubgrupoPorId = async (id: number): Promise<SubgrupoOcorrencia | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  for (const natureza of mockNaturezasOcorrencia) {
    for (const grupo of natureza.grupos) {
      const subgrupo = grupo.subgrupos.find(s => s.id === id);
      if (subgrupo) {
        return subgrupo;
      }
    }
  }
  
  return null;
};
