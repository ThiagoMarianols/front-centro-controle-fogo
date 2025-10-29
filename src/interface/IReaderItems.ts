export interface ParamsReaderItems {
  headers: string[];
  body: (string | number)[][];
  titulo: string;
  textButton: string;
  url: string;
  showAtendimento?: boolean;
  onAtendimentoClick?: (item: any) => void;
  onDelete?: (row: (string | number)[], index: number) => Promise<void>;
  onActivate?: (row: (string | number)[], index: number) => Promise<void>;
  onEdit?: (row: (string | number)[]) => void;
  statusColumnIndex?: number;
  hasStatusFilter?: boolean;
}