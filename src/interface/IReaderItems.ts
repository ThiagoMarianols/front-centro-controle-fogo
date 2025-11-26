export interface ParamsReaderItems {
  headers: string[];
  body: (string | number)[][];
  titulo: string;
  textButton: string;
  url: string;
  onDelete?: (row: (string | number)[], index: number) => Promise<void>;
  onActivate?: (row: (string | number)[], index: number) => Promise<void>;
  onEdit?: (row: (string | number)[], index: number) => void;
  statusColumnIndex?: number;
  hasStatusFilter?: boolean;
  searchPlaceholder?: string;
  /** Esconde botões de ação (editar, excluir, ativar) - útil para OBSERVADOR */
  hideActions?: boolean;
  /** Esconde botão de criar novo item - útil para OBSERVADOR */
  hideCreateButton?: boolean;
}