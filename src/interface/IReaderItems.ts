export interface ParamsReaderItems {
  headers: string[];
  body: (string | number)[][];
  titulo: string;
  textButton: string;
  url: string;
  showAtendimento?: boolean;
  onAtendimentoClick?: (item: any) => void;
}