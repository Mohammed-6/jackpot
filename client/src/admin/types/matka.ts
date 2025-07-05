export interface Matka {
    _id?: string;
    betName: string;
    dealType: number;
    minAmt: number;
    rangeFrom: number;
    rangeTo: number;
    createdAt?: string;
    updatedAt?: string;
    timeTable?: Date|null
  }
  