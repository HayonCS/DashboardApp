import { AssetTestData, DashboardGraphData, TimePeriods } from "./DataTypes";
import { getShift, getTimeString } from "./DateUtility";
import { ProcessDataExport, getPartCycleTime } from "./MES";

export const getAssetTestData = async (processData: ProcessDataExport[]) => {
  let dataAll: AssetTestData[] = [];
  for (let processDataItem of processData) {
    const partNum = processDataItem.KeyToValueDictionary.PARTNUMBER;
    const passed = processDataItem.KeyToValueDictionary.PASSFAIL;
    const date = new Date(processDataItem.KeyToValueDictionary.OPENDTIME);
    const shift = getShift(date);
    if (
      dataAll.filter((e) => e.partNumber === partNum && e.shift === shift)
        .length === 0
    ) {
      const partCycle = await getPartCycleTime(partNum);
      if (passed === "PASS") {
        dataAll.push({
          id: 0,
          shift: shift,
          partNumber: partNum,
          timeStart: date,
          timeEnd: date,
          passes: 1,
          fails: 0,
          partCycle: partCycle,
          workActual: 0,
          workTheory: 0,
          efficiency: 0,
        });
      } else {
        dataAll.push({
          id: 0,
          shift: shift,
          partNumber: partNum,
          timeStart: date,
          timeEnd: date,
          passes: 0,
          fails: 1,
          partCycle: partCycle,
          workActual: 0,
          workTheory: 0,
          efficiency: 0,
        });
      }
    } else {
      let newDataAll = dataAll.map((existingData) => {
        let newData = { ...existingData };
        if (newData.partNumber === partNum && newData.shift === shift) {
          if (passed === "PASS") {
            newData.passes += 1;
          } else {
            newData.fails += 1;
          }
          const timeDiff =
            (date.getTime() - newData.timeEnd.getTime()) / 1000.0;
          newData.workActual += timeDiff;
          newData.workTheory += newData.partCycle;
          newData.timeEnd = date;
          if (newData.workActual > 0) {
            newData.efficiency =
              (newData.workTheory / newData.workActual) * 100.0;
          }
        }
        return newData;
      });
      dataAll = newDataAll;
    }
  }
  let i = 1;
  let newDashData = dataAll.map((item) => {
    let newItem = { ...item };
    newItem.id = i;
    i += 1;
    return newItem;
  });
  dataAll = newDashData;
  return dataAll;
};

export const getAssetGraphData = async (processData: ProcessDataExport[]) => {
  let partCycles: { [key: string]: number } = {};
  let dataAll: DashboardGraphData[] = [];
  let lastCycle = 0;
  let cycleGoal = 0;
  let timePeriods = [...TimePeriods];
  let lastPeriod = timePeriods[0];
  let partNumber = "";
  timePeriods.shift();
  let lastTime = new Date();
  for (let timePeriod of timePeriods) {
    let dataArr = processData.filter(
      (e) => e.DateValue >= lastPeriod && e.DateValue < timePeriod
    );
    if (dataArr.length > 0) {
      let partCycle = 0;
      let workActual = 0;
      let workTheory = 0;
      let efficiency = 100;
      let efficiencyStr = "100";
      for (let i = 1; i < dataArr.length; ++i) {
        const dataItem = dataArr[i];
        const partNum = dataItem.KeyToValueDictionary.PARTNUMBER;
        const date = new Date(dataItem.KeyToValueDictionary.OPENDTIME);
        const prevDate = new Date(
          dataArr[i - 1].KeyToValueDictionary.OPENDTIME
        );
        if (partNum in partCycles) {
          partCycle = partCycles[partNum];
        } else {
          partCycle = await getPartCycleTime(partNum);
          partCycles[partNum] = partCycle;
        }
        const timeDiff = (date.getTime() - prevDate.getTime()) / 1000.0;
        lastCycle = timeDiff;
        workActual += timeDiff;
        workTheory += partCycle;
        if (workActual > 0) {
          efficiency = (workTheory / workActual) * 100.0;
          efficiencyStr = (Math.round(efficiency * 100) / 100).toFixed(2);
        }
        partNumber = partNum;
      }
      cycleGoal = partCycle;
      dataAll.push({
        partCycle: partCycle,
        time: timePeriod,
        timeString: getTimeString(timePeriod),
        workActual: workActual,
        workTheory: workTheory,
        efficiency: efficiency,
        Efficiency: efficiencyStr,
      });
      while (dataAll.length > 36) {
        dataAll.shift();
      }
    }
    lastPeriod = timePeriod;
  }
  return { dataAll, lastCycle, cycleGoal, partNumber };
};

export const getRomboGraphData = (
  asset1: DashboardGraphData[],
  asset2: DashboardGraphData[],
  asset3: DashboardGraphData[]
) => {
  let dataAll: DashboardGraphData[] = [];
  const assets = [asset1, asset2, asset3];
  for (let i = 1; i < TimePeriods.length; ++i) {
    const timePeriod = TimePeriods[i];
    let dataItem: DashboardGraphData = {
      partCycle: 0,
      time: new Date(),
      timeString: getTimeString(new Date()),
      workActual: 0,
      workTheory: 0,
      efficiency: 100,
      Efficiency: "100.00",
    };
    let usedAssets = 0;
    for (let asset of assets) {
      let assetData = asset.find((e) => e.time === timePeriod);
      if (assetData) {
        dataItem.partCycle = assetData.partCycle;
        dataItem.time = assetData.time;
        dataItem.timeString = assetData.timeString;
        dataItem.workActual += assetData.workActual;
        dataItem.workTheory += assetData.workTheory;
        usedAssets += 1;
      }
    }
    if (usedAssets > 0) {
      if (dataItem.workActual > 0) {
        dataItem.efficiency =
          (dataItem.workTheory / dataItem.workActual) * 100.0;
        dataItem.Efficiency = (
          Math.round(dataItem.efficiency * 100) / 100
        ).toFixed(2);
        dataAll.push(dataItem);
      }
    }
  }

  return dataAll;
};

export const getRomboGraphData1 = (
  asset1: DashboardGraphData[],
  asset2: DashboardGraphData[],
  asset3: DashboardGraphData[]
) => {
  let dataAll: DashboardGraphData[] = [];
  let i = 0;
  for (i = 0; i < asset1.length; i++) {
    let dataItem = { ...asset1[i] };
    if (asset1[i].workActual) dataItem = { ...asset1[i] };
    if (asset2[i].workActual) dataItem = { ...asset2[i] };
    if (asset3[i].workActual) dataItem = { ...asset3[i] };
    dataItem.workActual += asset2[i].workActual + asset3[i].workActual;
    dataItem.workTheory += asset2[i].workTheory + asset3[i].workTheory;
    if (dataItem.workActual > 0) {
      dataItem.efficiency = (dataItem.workTheory / dataItem.workActual) * 100.0;
      dataItem.Efficiency = (
        Math.round(dataItem.efficiency * 100) / 100
      ).toFixed(2);
    }
    dataAll.push(dataItem);
  }
  return dataAll;
};

export const getRomboDashboardData = (assets: AssetTestData[][]) => {
  let dataAll: AssetTestData[] = [];
  for (const asset of assets) {
    for (const item of asset) {
      if (
        dataAll.filter(
          (e) => e.partNumber === item.partNumber && e.shift === item.shift
        ).length === 0
      ) {
        dataAll.push({
          id: 0,
          shift: item.shift,
          partNumber: item.partNumber,
          timeStart: item.timeStart,
          timeEnd: item.timeEnd,
          passes: item.passes,
          fails: item.fails,
          partCycle: item.partCycle,
          workActual: item.workActual,
          workTheory: item.workTheory,
          efficiency: item.efficiency,
        });
      } else {
        let newDataAll = dataAll.map((existingData) => {
          let newData = { ...existingData };
          if (
            newData.partNumber === item.partNumber &&
            newData.shift === item.shift
          ) {
            newData.passes += item.passes;
            newData.fails += item.fails;
            newData.workActual += item.workActual;
            newData.workTheory += item.workTheory;
            newData.timeEnd = item.timeEnd;
            if (newData.workActual > 0) {
              newData.efficiency =
                (newData.workTheory / newData.workActual) * 100.0;
            }
          }
          return newData;
        });
        dataAll = newDataAll;
      }
    }
  }
  let i = 1;
  let newDashData = dataAll.map((item) => {
    let newItem = { ...item };
    newItem.id = i;
    i += 1;
    return newItem;
  });
  dataAll = newDashData;
  dataAll.sort((a, b) => a.shift - b.shift);
  return dataAll;
};
