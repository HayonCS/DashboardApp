import * as React from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  debounce,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { getProcessData } from "../utils/MES";
import SwipeableViews from "react-swipeable-views";
import { AssetDash } from "../modules/AssetDash";
import {
  getDateStringCurrent,
  getDateStringNext,
  getTimeStringConnection,
} from "../utils/DateUtility";
import { AssetTestData, DashboardGraphData } from "../utils/DataTypes";
import {
  getAssetGraphData,
  getAssetTestData,
  getRomboDashboardData,
  getRomboGraphData,
} from "../utils/DataUtility";
import { MenuBar } from "../modules/MenuBar";
import { RomboDisplay } from "../modules/RomboDisplay";

const useStyles = makeStyles(() => ({
  app: {
    //textAlign: "center",
  },
  appHeader: {
    backgroundColor: "#1d222b",
    width: "100%",
    height: "96px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    paddingTop: "0px",
  },
  paperStyle: {
    //display: "inline",
    backgroundColor: "#282c34",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 144px)",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  gridLayout: {
    display: "flex",
    flexDirection: "column",
    //rowGap: "20px",
    //marginBottom: "30px",
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  swipeableView: {
    height: "calc(100vh - 192px)",
    width: "100%",
  },
  tabPanel: {
    width: "100%",
    height: "100%",
  },
}));

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function uniq(a: string[]) {
  return a.sort().filter(function (item: any, pos: number, ary: any[]) {
    return !pos || item != ary[pos - 1];
  });
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const RomboDashboard: React.FC<{
  name: string;
  asset1: string;
  asset2: string;
  asset3: string;
}> = (props) => {
  document.title = props.name + " - Dashboard";

  const classes = useStyles();

  const [loading, setLoading] = React.useState(true);

  const [tabValue, setTabValue] = React.useState(0);

  const [selection, setSelection] = React.useState("");

  const handleSelectionChange = (event: any) => {
    setSelection(event.target.value);
  };

  const [dashboardStats, setDashboardStats] = React.useState({
    lastUpdate: new Date(),
    lastUpdateString: "--:--:--",
    lastCycle: 0,
  });

  const [assetStats_1, setAssetStats_1] = React.useState({
    lastCycle: 0,
    cycleGoal: 0,
    partNumber: "",
  });

  const [assetStats_2, setAssetStats_2] = React.useState({
    lastCycle: 0,
    cycleGoal: 0,
    partNumber: "",
  });

  const [assetStats_3, setAssetStats_3] = React.useState({
    lastCycle: 0,
    cycleGoal: 0,
    partNumber: "",
  });

  const [romboStats, setRomboStats] = React.useState({
    lastCycle: 0,
    cycleGoal: 0,
    partNumbers: [""],
  });

  const getRomboData = async (
    asset1: string,
    asset2: string,
    asset3: string
  ) => {
    const currentDate = getDateStringCurrent() + " 02:15:00";
    const nextDate = getDateStringNext();
    var processDataResult_1 = await getProcessData(
      asset1,
      currentDate,
      nextDate
    );
    var processDataResult_2 = await getProcessData(
      asset2,
      currentDate,
      nextDate
    );
    var processDataResult_3 = await getProcessData(
      asset3,
      currentDate,
      nextDate
    );
    var dataAll: AssetTestData[] = [];
    var graphAll: DashboardGraphData[] = [];
    if (processDataResult_1 && processDataResult_2 && processDataResult_3) {
      const assetDashData_1 = await getAssetTestData(processDataResult_1);
      const assetDashData_2 = await getAssetTestData(processDataResult_2);
      const assetDashData_3 = await getAssetTestData(processDataResult_3);
      const assetGraphData_1 = await getAssetGraphData(processDataResult_1);
      const assetGraphData_2 = await getAssetGraphData(processDataResult_2);
      const assetGraphData_3 = await getAssetGraphData(processDataResult_3);
      dataAll = getRomboDashboardData([
        assetDashData_1,
        assetDashData_2,
        assetDashData_3,
      ]);
      const romboGraphData = getRomboGraphData(
        assetGraphData_1.dataAll,
        assetGraphData_2.dataAll,
        assetGraphData_3.dataAll
      );
      setAssetStats_1({
        ...assetStats_1,
        lastCycle: assetGraphData_1.lastCycle,
        cycleGoal: assetGraphData_1.cycleGoal,
        partNumber: assetGraphData_1.partNumber,
      });
      setAssetStats_2({
        ...assetStats_2,
        lastCycle: assetGraphData_2.lastCycle,
        cycleGoal: assetGraphData_2.cycleGoal,
        partNumber: assetGraphData_2.partNumber,
      });
      setAssetStats_3({
        ...assetStats_3,
        lastCycle: assetGraphData_3.lastCycle,
        cycleGoal: assetGraphData_3.cycleGoal,
        partNumber: assetGraphData_3.partNumber,
      });
      let parts = uniq([
        assetStats_1.partNumber,
        assetStats_2.partNumber,
        assetStats_3.partNumber,
      ]);
      const avgCycle =
        (assetStats_1.lastCycle +
          assetStats_2.lastCycle +
          assetStats_3.lastCycle) /
        3;
      const cycleGoal =
        (assetStats_1.cycleGoal +
          assetStats_2.cycleGoal +
          assetStats_3.cycleGoal) /
        3;
      setRomboStats({
        ...romboStats,
        lastCycle: avgCycle,
        cycleGoal: cycleGoal,
        partNumbers: parts,
      });
      setDashboardData({
        rombo: dataAll,
        asset1: assetDashData_1,
        asset2: assetDashData_2,
        asset3: assetDashData_3,
      });
      setGraphData({
        rombo: romboGraphData,
        asset1: assetGraphData_1.dataAll,
        asset2: assetGraphData_2.dataAll,
        asset3: assetGraphData_3.dataAll,
      });
    }
  };

  const emptyData: AssetTestData[] = [];
  const emptyGraph: DashboardGraphData[] = [];

  const [dashboardData, setDashboardData] = React.useState({
    rombo: emptyData,
    asset1: emptyData,
    asset2: emptyData,
    asset3: emptyData,
  });

  const [graphData, setGraphData] = React.useState({
    rombo: emptyGraph,
    asset1: emptyGraph,
    asset2: emptyGraph,
    asset3: emptyGraph,
  });

  const loadDebounce = debounce(async () => {
    await getRomboData(props.asset1, props.asset2, props.asset3);
    const date = new Date();
    const stamp = getTimeStringConnection(date);
    setDashboardStats({
      ...dashboardStats,
      lastUpdate: date,
      lastUpdateString: stamp,
    });
    setLoading(false);
  }, 5000);

  React.useEffect(() => {
    console.log("Loading Data...");
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
      <MenuBar />
      <Backdrop
        open={loading}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          zIndex: 1,
          flexDirection: "column",
          marginTop: "48px",
        }}
      >
        <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
        <Typography>Loading...</Typography>
      </Backdrop>
      <header className={classes.appHeader}>
        <Typography
          style={{
            paddingLeft: "40px",
            fontSize: "36px",
            fontWeight: "bold",
            width: "calc(50vw - 150px)",
          }}
        >
          {props.name}
        </Typography>
        <Typography style={{ fontSize: "18px", fontWeight: "normal" }}>
          {"Last Refresh: " + dashboardStats.lastUpdateString}
        </Typography>
      </header>
      <Paper className={classes.paperStyle}>
        <div className={classes.gridLayout}>
          <Paper className={classes.tabBar}>
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label="Rombo"
                className={classes.tabStyle}
                {...a11yProps(0)}
              />
              <Tab
                label={props.asset1}
                className={classes.tabStyle}
                {...a11yProps(1)}
              />
              <Tab
                label={props.asset2}
                className={classes.tabStyle}
                {...a11yProps(2)}
              />
              <Tab
                label={props.asset3}
                className={classes.tabStyle}
                {...a11yProps(3)}
              />
            </Tabs>
          </Paper>
          <SwipeableViews
            className={classes.swipeableView}
            axis={"x"}
            index={tabValue}
            onChangeIndex={(index) => {
              setTabValue(index);
            }}
            containerStyle={{ width: "100%", height: "100%" }}
            slideStyle={{ width: "100%", height: "100%" }}
          >
            <TabPanel value={tabValue} index={0}>
              <RomboDisplay
                rombo={props.name}
                dashboardData={dashboardData.rombo}
                graphData={graphData.rombo}
                lastCycle={romboStats.lastCycle}
                cycleGoal={romboStats.cycleGoal}
                partNumbers={romboStats.partNumbers}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <AssetDash
                asset={props.asset1}
                dashboardData={dashboardData.asset1}
                graphData={graphData.asset1}
                lastCycle={assetStats_1.lastCycle}
                cycleGoal={assetStats_1.cycleGoal}
                partNumber={assetStats_1.partNumber}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <AssetDash
                asset={props.asset2}
                dashboardData={dashboardData.asset2}
                graphData={graphData.asset2}
                lastCycle={assetStats_2.lastCycle}
                cycleGoal={assetStats_2.cycleGoal}
                partNumber={assetStats_2.partNumber}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <AssetDash
                asset={props.asset3}
                dashboardData={dashboardData.asset3}
                graphData={graphData.asset3}
                lastCycle={assetStats_3.lastCycle}
                cycleGoal={assetStats_2.cycleGoal}
                partNumber={assetStats_3.partNumber}
              />
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
