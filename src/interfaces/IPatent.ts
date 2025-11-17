export interface PatentDTO {
  id: number;
  active: boolean;
  name: string;
}

export interface PatentResponseAllDTO {
  patentResponseDTOList: PatentDTO[];
}
