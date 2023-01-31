import { getDateTime } from "./DateUtility";

export interface DashboardGraphData {
  partCycle: number;
  time: Date;
  timeString: string;
  workActual: number;
  workTheory: number;
  efficiency: number;
  Efficiency: string;
}

export interface AssetTestData {
  id: number;
  shift: number;
  partNumber: string;
  timeStart: Date;
  timeEnd: Date;
  passes: number;
  fails: number;
  partCycle: number;
  workActual: number;
  workTheory: number;
  efficiency: number;
}

export const TimePeriods = [
  getDateTime(new Date(), 2, 0, 0),
  getDateTime(new Date(), 2, 15, 0),
  getDateTime(new Date(), 2, 30, 0),
  getDateTime(new Date(), 2, 45, 0),
  getDateTime(new Date(), 3, 0, 0),
  getDateTime(new Date(), 3, 15, 0),
  getDateTime(new Date(), 3, 30, 0),
  getDateTime(new Date(), 3, 45, 0),
  getDateTime(new Date(), 4, 0, 0),
  getDateTime(new Date(), 4, 15, 0),
  getDateTime(new Date(), 4, 30, 0),
  getDateTime(new Date(), 4, 45, 0),
  getDateTime(new Date(), 5, 0, 0),
  getDateTime(new Date(), 5, 15, 0),
  getDateTime(new Date(), 5, 30, 0),
  getDateTime(new Date(), 5, 45, 0),
  getDateTime(new Date(), 6, 0, 0),
  getDateTime(new Date(), 6, 15, 0),
  getDateTime(new Date(), 6, 30, 0),
  getDateTime(new Date(), 6, 45, 0),
  getDateTime(new Date(), 7, 0, 0),
  getDateTime(new Date(), 7, 15, 0),
  getDateTime(new Date(), 7, 30, 0),
  getDateTime(new Date(), 7, 45, 0),
  getDateTime(new Date(), 8, 0, 0),
  getDateTime(new Date(), 8, 15, 0),
  getDateTime(new Date(), 8, 30, 0),
  getDateTime(new Date(), 8, 45, 0),
  getDateTime(new Date(), 9, 0, 0),
  getDateTime(new Date(), 9, 15, 0),
  getDateTime(new Date(), 9, 30, 0),
  getDateTime(new Date(), 9, 45, 0),
  getDateTime(new Date(), 10, 0, 0),
  getDateTime(new Date(), 10, 15, 0),
  getDateTime(new Date(), 10, 30, 0),
  getDateTime(new Date(), 10, 45, 0),
  getDateTime(new Date(), 11, 0, 0),
  getDateTime(new Date(), 11, 15, 0),
  getDateTime(new Date(), 11, 30, 0),
  getDateTime(new Date(), 11, 45, 0),
  getDateTime(new Date(), 12, 0, 0),
  getDateTime(new Date(), 12, 15, 0),
  getDateTime(new Date(), 12, 30, 0),
  getDateTime(new Date(), 12, 45, 0),
  getDateTime(new Date(), 13, 0, 0),
  getDateTime(new Date(), 13, 15, 0),
  getDateTime(new Date(), 13, 30, 0),
  getDateTime(new Date(), 13, 45, 0),
  getDateTime(new Date(), 14, 0, 0),
  getDateTime(new Date(), 14, 15, 0),
  getDateTime(new Date(), 14, 30, 0),
  getDateTime(new Date(), 14, 45, 0),
  getDateTime(new Date(), 15, 0, 0),
  getDateTime(new Date(), 15, 15, 0),
  getDateTime(new Date(), 15, 30, 0),
  getDateTime(new Date(), 15, 45, 0),
  getDateTime(new Date(), 16, 0, 0),
  getDateTime(new Date(), 16, 15, 0),
  getDateTime(new Date(), 16, 30, 0),
  getDateTime(new Date(), 16, 45, 0),
  getDateTime(new Date(), 17, 0, 0),
  getDateTime(new Date(), 17, 15, 0),
  getDateTime(new Date(), 17, 30, 0),
  getDateTime(new Date(), 17, 45, 0),
  getDateTime(new Date(), 18, 0, 0),
  getDateTime(new Date(), 18, 15, 0),
  getDateTime(new Date(), 18, 30, 0),
  getDateTime(new Date(), 18, 45, 0),
  getDateTime(new Date(), 19, 0, 0),
  getDateTime(new Date(), 19, 15, 0),
  getDateTime(new Date(), 19, 30, 0),
  getDateTime(new Date(), 19, 45, 0),
  getDateTime(new Date(), 20, 0, 0),
  getDateTime(new Date(), 20, 15, 0),
  getDateTime(new Date(), 20, 30, 0),
  getDateTime(new Date(), 20, 45, 0),
  getDateTime(new Date(), 21, 0, 0),
  getDateTime(new Date(), 21, 15, 0),
  getDateTime(new Date(), 21, 30, 0),
  getDateTime(new Date(), 21, 45, 0),
  getDateTime(new Date(), 22, 0, 0),
  getDateTime(new Date(), 22, 15, 0),
  getDateTime(new Date(), 22, 30, 0),
  getDateTime(new Date(), 22, 45, 0),
  getDateTime(new Date(), 23, 0, 0),
  getDateTime(new Date(), 23, 15, 0),
  getDateTime(new Date(), 23, 30, 0),
  getDateTime(new Date(), 23, 45, 0),
  getDateTime(new Date(), 24, 0, 0),
];
