import * as React from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { AssetTestData, DashboardGraphData } from "../utils/DataTypes";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    //backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
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

export const RomboDisplay: React.FC<{
  rombo: string;
  dashboardData: AssetTestData[];
  graphData: DashboardGraphData[];
  lastCycle: number;
  cycleGoal: number;
  partNumbers: string[];
}> = (props) => {
  const classes = useStyles();

  const columns: GridColumns = [
    {
      type: "number",
      field: "shift",
      headerName: "Shift",
      headerAlign: "center",
      align: "center",
      width: 50,
    },
    {
      type: "string",
      field: "partNumber",
      headerName: "Part",
      headerAlign: "center",
      align: "center",
      width: 90,
    },
    {
      type: "number",
      field: "passes",
      headerName: "Pass",
      headerAlign: "center",
      align: "center",
      width: 90,
    },
    {
      type: "number",
      field: "fails",
      headerName: "Fail",
      headerAlign: "center",
      align: "center",
      width: 70,
    },
    {
      type: "number",
      field: "efficiency",
      headerName: "Efficiency",
      headerAlign: "center",
      align: "center",
      width: 90,
      valueFormatter: (params) => {
        const valueFormatted = (Math.round(params.value * 100) / 100).toFixed(
          2
        );
        return `${valueFormatted} %`;
      },
    },
  ];

  const [lastCycleColor, setLastCycleColor] = React.useState("#FFF");

  const [efficiencyColor, setEfficiencyColor] = React.useState("#FFF");

  React.useEffect(() => {
    if (props.lastCycle <= props.cycleGoal) {
      setLastCycleColor("#00FF00");
    }
    if (props.lastCycle > props.cycleGoal) {
      setLastCycleColor("#FF0000");
    }
  }, [props.lastCycle, props.cycleGoal]);

  React.useEffect(() => {
    if (props.graphData[props.graphData.length - 1]) {
      if (props.graphData[props.graphData.length - 1].efficiency >= 90) {
        setEfficiencyColor("#00FF00");
      }
      if (props.graphData[props.graphData.length - 1].efficiency < 90) {
        setEfficiencyColor("#FF0000");
      }
    }
  }, [props.graphData]);

  return (
    <div className={classes.root}>
      <div
        style={{
          height: "210px",
          width: "calc(100% - 60px)",
          marginLeft: "60px",
          display: "grid",
          gridTemplateColumns: "460px calc(100% - 460px)",
        }}
      >
        <div
          style={{
            height: "240px",
            width: "420px",
          }}
        >
          <DataGrid
            rows={props.dashboardData}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            disableSelectionOnClick={true}
            style={{ color: "#FFFFFF" }}
          />
        </div>
        <div style={{ width: "100%", display: "grid", rowGap: "0px" }}>
          <Typography
            style={{ fontSize: "24px", fontWeight: "bold", color: "#FFF" }}
          >
            {"Part #: " + props.partNumbers.join(", ")}
          </Typography>
          <Typography
            style={{ fontSize: "18px", fontWeight: "normal", color: "#FFF" }}
          >
            {"Cycle Goal: " +
              (Math.round(props.cycleGoal * 100) / 100).toFixed(2)}
          </Typography>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                color: "#FFF",
                marginRight: "8px",
              }}
            >
              {"Last Cycle:"}
            </Typography>
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                color: lastCycleColor,
              }}
            >
              {(Math.round(props.lastCycle * 100) / 100).toFixed(2)}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                color: "#FFF",
                marginRight: "8px",
              }}
            >
              {"Efficiency:"}
            </Typography>
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                marginRight: "8px",
                color: efficiencyColor,
              }}
            >
              {props.graphData[props.graphData.length - 1]
                ? (
                    Math.round(
                      props.graphData[props.graphData.length - 1].efficiency *
                        100
                    ) / 100
                  ).toFixed(2) + " %"
                : "- %"}
            </Typography>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "calc(100vh - 500px)",
          width: "100%",
          paddingTop: "48px",
        }}
      >
        <ResponsiveContainer width="80%">
          <LineChart data={props.graphData} margin={{ right: 100 }}>
            <CartesianGrid stroke="#FFFFFF" strokeDasharray="5 5" />
            <XAxis
              dataKey="timeString"
              //interval={"preserveStartEnd"}
              interval={3}
              stroke="#FFFFFF"
              style={{ fontSize: "1rem" }}
            >
              <Label value="Time" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis
              stroke="#FFFFFF"
              style={{ fontSize: "1rem" }}
              domain={[
                0,
                Math.round(
                  Math.max(...props.graphData.map((o) => o.efficiency))
                ) + 10,
              ]}
            >
              <Label
                value="Efficiency"
                offset={20}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            {/*<Legend
              verticalAlign="bottom"
              align="left"
              height={36}
              iconSize={12}
              wrapperStyle={{ fontSize: "1rem", marginLeft: "30px" }}
            />*/}
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
      </div>
    </div>
  );
};
