import * as React from "react";
import { Button, makeStyles, Paper, TextField } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  appLogo: {
    height: "40vmin",
    pointerEvents: "none",
    "@media (prefers-reduced-motion: no-preference)": {
      animation: "App-logo-spin infinite 20s linear",
    },
  },
  appHeader: {
    backgroundColor: "#282c34",
    minHeight: "20vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    marginBottom: "10vh",
  },
  appLink: {
    color: "#61dafb",
  },
  paperStyle: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "70vh",
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
}));

export const Main: React.FC<{
  parameter?: boolean;
}> = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const getCurrentDate = () => {
    var date = new Date();
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

  const [textState, setTextState] = React.useState("");

  const [startDate, setStartDate] = React.useState<string>(getCurrentDate());

  const [endDate, setEndDate] = React.useState<string>(getNextDate());

  return (
    <div className={classes.app}>
      <header className={classes.appHeader}>
        <h1>Dashboard App</h1>
      </header>
      <Paper className={classes.paperStyle}>
        <div className={classes.gridLayout}>
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
          <div className={classes.gridItem}>
            <TextField
              variant="outlined"
              id="date"
              label="Start Date"
              type="date"
              value={startDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
            />
          </div>
          <div className={classes.gridItem}>
            <TextField
              variant="outlined"
              id="date"
              label="End Date"
              type="date"
              value={endDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
            />
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => {
            navigate("/Dashboard", {
              state: {
                asset: textState,
                startDate: startDate,
                endDate: endDate,
              },
            });
          }}
        >
          LAUNCH
        </Button>
      </Paper>
    </div>
  );
};
