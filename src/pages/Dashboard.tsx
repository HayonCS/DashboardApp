import * as React from "react";
import { debounce, makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { getPartCycleTime, getProcessData } from "../utils/MES";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataGrid } from "@mui/x-data-grid";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  appHeader: {
    backgroundColor: "#282c34",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
}));

interface GraphItem {
  partCycle: number;
  time: Date;
  timeString: string;
  workActual: number;
  workTheory: number;
  efficiency: number;
  Efficiency: string;
}

interface DashboardData {
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

export const Dashboard: React.FC<{}> = () => {
  document.title = "Asset Dashboard";

  const classes = useStyles();

  const props = useLocation().state;

  const [dashboardData, setDashboardData] = React.useState<DashboardData[]>([]);

  const [graphData, setGraphData] = React.useState<GraphItem[]>([]);

  const getShift = (date: Date) => {
    var shiftFirst = new Date(date.getTime());
    var shiftSecond = new Date(date.getTime());
    shiftFirst.setHours(2);
    shiftFirst.setMinutes(15);
    shiftFirst.setSeconds(0);
    shiftSecond.setHours(14);
    shiftSecond.setMinutes(15);
    shiftSecond.setSeconds(0);
    if (date < shiftFirst) {
      return 2;
    }
    if (date < shiftSecond) {
      return 1;
    }
    if (date >= shiftSecond) {
      return 2;
    }
    return 0;
  };

  const getCurrentDate = () => {
    var date = new Date();
    var shiftFirst = new Date(date.getTime());
    shiftFirst.setHours(2);
    shiftFirst.setMinutes(15);
    shiftFirst.setSeconds(0);
    if (date < shiftFirst) {
      return getPreviousDate();
    }
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
    return dateString;
  };

  const getPreviousDate = () => {
    var date = new Date(new Date().setDate(new Date().getDate() - 1));
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
    return dateString;
  };

  const getNextDate = () => {
    var date = new Date(new Date().setDate(new Date().getDate() + 1));
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
    return dateString;
  };

  const getTimeString = (date: Date) => {
    var hour = ("0" + date.getHours()).slice(-2);
    var min = ("0" + date.getMinutes()).slice(-2);
    var sec = ("0" + date.getSeconds()).slice(-2);
    var dateString = hour + ":" + min + ":" + sec;
    return dateString;
  };

  const loadDashboardData = async () => {
    var processDataResult = await getProcessData(
      props.asset,
      getCurrentDate() + " 02:15:00",
      getNextDate()
    );
    var dataAll: DashboardData[] = [];
    var graphAll: GraphItem[] = [];
    if (processDataResult) {
      for (var processDataItem of processDataResult) {
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
          graphAll.push({
            partCycle: partCycle,
            time: date,
            timeString: getTimeString(date),
            workActual: 0,
            workTheory: 0,
            efficiency: 100,
            Efficiency: "100.00",
          });
        } else {
          var newDataAll = dataAll.map((existingData) => {
            var newData = { ...existingData };
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
        if (
          graphAll.length > 0 &&
          (date.getTime() - graphAll[graphAll.length - 1].time.getTime()) /
            1000 <
            300
        ) {
          var lastItem = { ...graphAll[graphAll.length - 1] };
          graphAll.pop();
          const timeDiff = (date.getTime() - lastItem.time.getTime()) / 1000.0;
          lastItem.workActual = timeDiff;
          lastItem.workTheory += lastItem.partCycle;
          if (lastItem.workActual > 0) {
            lastItem.efficiency =
              (lastItem.workTheory / lastItem.workActual) * 100.0;
            lastItem.Efficiency = (
              Math.round(lastItem.efficiency * 100) / 100
            ).toFixed(2);
          }
          graphAll.push(lastItem);
        } else {
          const partCycle = await getPartCycleTime(partNum);
          graphAll.push({
            partCycle: partCycle,
            time: date,
            timeString: getTimeString(date),
            workActual: 0,
            workTheory: 0,
            efficiency: 100,
            Efficiency: "100.00",
          });
        }
        while (graphAll.length > 36) {
          graphAll.shift();
        }
      }
      console.log("INITIALS");
      for (var item of dataAll) {
        console.log(
          "Shift: " +
            item.shift +
            "\tPart: " +
            item.partNumber +
            "\tPass: " +
            item.passes +
            "\tFail: " +
            item.fails +
            "\tWorkActual: " +
            item.workActual +
            "\tWorkTheory: " +
            item.workTheory +
            "\tEfficiency: " +
            item.efficiency
        );
      }
      var i = 1;
      var newDashData = dataAll.map((item) => {
        var newItem = { ...item };
        newItem.id = i;
        i += 1;
        return newItem;
      });
      dataAll = newDashData;
    }
    setDashboardData(dataAll);
    setGraphData(graphAll);
  };

  const loadDebounce = debounce(() => {
    loadDashboardData();
  }, 3000);

  React.useEffect(() => {
    console.log("DASHBOARD DATA");
    loadDebounce();
  }, [dashboardData, graphData]);

  const columns = [
    { field: "shift", headerName: "Shift", width: 90 },
    { field: "partNumber", headerName: "Part", width: 90 },
    { field: "passes", headerName: "Pass", width: 90 },
    { field: "fails", headerName: "Fail", width: 90 },
    { field: "efficiency", headerName: "Efficiency", width: 90 },
  ];

  return (
    <div className={classes.app}>
      <header className={classes.appHeader}>
        <p>{props.asset}</p>
        <div style={{ height: 300, width: 700 }}>
          <DataGrid
            rows={dashboardData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            style={{ color: "#FFFFFF" }}
          />
        </div>
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart data={graphData} margin={{ right: 100 }}>
            <CartesianGrid stroke="#FFFFFF" strokeDasharray="5 5" />
            <XAxis
              dataKey="timeString"
              interval={"preserveStartEnd"}
              stroke="#FFFFFF"
              style={{ fontSize: "1rem" }}
            />
            <YAxis
              stroke="#FFFFFF"
              style={{ fontSize: "1rem" }}
              domain={[0, 140]}
            />
            <Legend
              verticalAlign="bottom"
              align="left"
              height={36}
              iconSize={12}
              wrapperStyle={{ fontSize: "1rem", marginLeft: "30px" }}
            />
            <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} />
            <Line
              dataKey="Efficiency"
              stroke="green"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <ReferenceLine
              y={100}
              label={{
                value: "100%",
                fontSize: "1rem",
                position: "right",
              }}
              stroke="red"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
        <button
          onClick={async (event) => {
            console.log("ASSET: " + props.asset);
          }}
        >
          GO
        </button>
      </header>
    </div>
  );
};
