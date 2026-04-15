export type Zone = {
  id: number;
  name: string;
  counts: {
    available: number;
    occupied: number;
    total: number;
    vacant: number;
    out_of_service: number;
    reserved: number;
    timestamp: string;
  };
};