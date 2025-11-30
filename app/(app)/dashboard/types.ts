export interface Reading {
  _id: string;
  deviceId: string;
  humidity: number[];
  temperature: number[];
  createdAt: string;
}
