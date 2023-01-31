import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/styles";
import PropTypes from "prop-types";
import { MenuBar } from "../modules/MenuBar";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  appHeader: {
    backgroundColor: "#282c34",
    height: "144px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  paperStyle: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 192px)",
  },
  textField: {
    width: 200,
  },
  gridLayout: {
    display: "grid",
    rowGap: "20px",
    marginBottom: "30px",
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "primary",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  formControl: {
    minWidth: 120,
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

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const Main: React.FC<{
  parameter?: boolean;
}> = (props) => {
  document.title = "Dashboard App";

  const classes = useStyles();

  const navigate = useNavigate();

  const [textState, setTextState] = React.useState("");

  const [tabValue, setTabValue] = React.useState(0);

  const [selection, setSelection] = React.useState("");

  const handleSelectionChange = (event: any) => {
    setSelection(event.target.value);
  };

  return (
    <div className={classes.app}>
      <MenuBar />
      <header className={classes.appHeader}>
        <h1>Dashboard App</h1>
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
                label="Asset"
                className={classes.tabStyle}
                {...a11yProps(0)}
              />
              <Tab
                label="Rombo"
                className={classes.tabStyle}
                {...a11yProps(1)}
              />
            </Tabs>
          </Paper>
          <SwipeableViews
            axis={"x"}
            index={tabValue}
            onChangeIndex={(index) => {
              setTabValue(index);
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <div style={{ height: "50px" }} />
              <div className={classes.gridItem}>
                <TextField
                  id="asset-textfield"
                  label="Asset"
                  variant="outlined"
                  value={textState}
                  onChange={(event) => {
                    setTextState(event.target.value);
                  }}
                />
              </div>
              <div style={{ height: "70px" }} />
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  navigate("/Dashboard", {
                    state: {
                      asset: textState,
                    },
                  });
                }}
              >
                LAUNCH
              </Button>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div style={{ height: "50px" }} />
              <div className={classes.gridItem}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Rombo
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={selection}
                    onChange={handleSelectionChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Rombo2"}>Rombo 2</MenuItem>
                    <MenuItem value={"Rombo3"}>Rombo 3</MenuItem>
                    <MenuItem value={"Rombo5"}>Rombo 5</MenuItem>
                  </Select>
                  <FormHelperText>Select a Rombo to view</FormHelperText>
                </FormControl>
              </div>
              <div style={{ height: "70px" }} />
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  if (selection !== "") {
                    navigate("/Dashboard/" + selection, {
                      state: {
                        asset: textState,
                      },
                    });
                  }
                }}
                disabled={selection === "" ? true : false}
              >
                LAUNCH
              </Button>
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
