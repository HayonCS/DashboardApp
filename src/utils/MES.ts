export interface ProcessDataExport {
  MetaDataId: string;
  KeyToValueDictionary: {
    ASSET: string;
    IDENTIFIERCODE: string;
    IDENTIFIERCODE2: string;
    PARTNUMBER: string;
    OPENDTIME: string;
    PASSFAIL: string;
    OPERATIONID: string;
  };
  DateValue: Date;
}

export interface UnitTestByAsset {
  MetaDataID: string;
  DataSource: string;
  IdentifierCode: string;
  PartNumber: string;
  OperationEndTime: Date;
  PassFail: boolean;
}

export interface RunningNowItem {
  Asset: string;
  OperationId: string;
  PartNumber: string;
  IdentifierCode: string;
  TimeSinceLastRun: string;
  TimeSincePartChange: string;
  QtyRunSincePartChange: string;
  QtyFailed: string;
  PreviousPartNumber: string;
  LastRunTime: string;
  TimeOfPartChange: string;
  TimeSinceLastEtl: string;
}

export interface LineOperationPart {
  orgCode: string;
  line: string;
  partNumber: string;
  partNumberAsset: string;
  ebsOperation: string;
  averageCycleTime: number;
  minimumRepeatable: number;
  historicalReferenceUsageRate: string;
  autoUpdate: boolean;
  recordLastUpdated: string;
  updatedBy: string;
}

export const getProcessData = async (
  asset: string,
  startDate: string,
  endDate: string
) => {
  try {
    const url =
      "http://zvm-msgprod/MES/ProcessDataExportApi/api/v1/processdataexport/processDataExport?Assets=" +
      asset +
      "&StartDate=" +
      startDate +
      "&EndDate=" +
      endDate +
      "&TopNRows=0";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: ProcessDataExport[] = await response.json();
    const processData = result.map((item) => {
      var newItem = { ...item };
      newItem.DateValue = new Date(item.KeyToValueDictionary.OPENDTIME);
      return newItem;
    });
    return processData;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getLastTestAsset = async (asset: string, sn: string) => {
  try {
    const url =
      "https://api.gentex.com/gtm/dctools/v1/GetMostRecentUnitTestByAsset.php?assets[]=" +
      asset +
      "&sn=" +
      sn;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/xml",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.text();
    if (result !== null && result.length > 10) {
      const dataLines = result.split("\n");
      if (dataLines.length > 5) {
        var item: UnitTestByAsset = {
          MetaDataID: dataLines[0].substring(11),
          DataSource: dataLines[1].substring(11),
          IdentifierCode: dataLines[2].substring(15),
          PartNumber: dataLines[3].substring(11),
          OperationEndTime: new Date(dataLines[4].substring(17)),
          PassFail: JSON.parse(dataLines[5].substring(9).toLowerCase()),
        };
        return item;
      }
    }
    return undefined;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getLastItemAsset = async (asset: string) => {
  try {
    const url =
      "http://zvm-msgprod/MES/ProcessDataExportApi/api/v1/runningnow/getItemsRunningNow?AssetFirstLetter=" +
      asset;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: RunningNowItem[] = await response.json();
    if (result && result.length > 0) {
      return result[result.length - 1];
    }
    return undefined;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getPartCycleTime = async (partNumber: string) => {
  try {
    const url =
      "https://zvm-msgprod.gentex.com/MES/Client/manufacturingweb/api/v1/bi/cycletimes/lineoperationpart?orgCode=14&partNumber=" +
      partNumber;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: LineOperationPart[] = await response.json();
    if (result && result.length > 0) {
      return result[0].averageCycleTime;
    }
    return 0;
  } catch (error) {
    console.log("ERROR: " + error);
    return 0;
  }
};

export const getItemRunningNow = async (asset: string) => {
  try {
    const url =
      "https://zvm-msgprod/MES/ProcessDataExportApi/api/v1/runningnow/getItemsRunningNow?AssetFirstLetter=" +
      asset +
      "&showOnlyLast24Hours=true";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: RunningNowItem[] = await response.json();
    if (result && result.length > 0) {
      return result[result.length - 1];
    }
    return undefined;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};
