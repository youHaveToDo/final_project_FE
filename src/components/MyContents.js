import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Rank from "./Rank";
import MyStudy from "./MyStudy";

function TabPanel(props) {
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <MyContentWrap>
      <AppBarCustom position="static" color="default">
        <TabsCustom
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="내 공부시간" {...a11yProps(0)} />
          <Tab label="주간 랭킹" {...a11yProps(1)} />
        </TabsCustom>
      </AppBarCustom>
      <SwipeableViewsCustom
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <MyStudy />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Rank />
        </TabPanel>
      </SwipeableViewsCustom>
    </MyContentWrap>
  );
}

const MyContentWrap = styled.div`
  border-radius: 1.3vw;
  overflow: hidden;
  height: 31vh;
`;

const AppBarCustom = styled(AppBar)`
  &.MuiPaper-elevation4 {
    box-shadow: none;
  }
  &.MuiAppBar-root {
    flex-direction: initial;
  }
  &.MuiAppBar-colorDefault {
    background-color: #eff6f8;
    color: #282828;
    padding: 0.5vw 0 0 1.5vw;
  }
`;

const TabsCustom = styled(Tabs)`
  .MuiTabs-flexContainer {
    *background-color: red;
    font-size: 1vw;
  }
  .MuiTabs-flexContainer .MuiTab-textColorPrimary.Mui-selected {
    *background-color: #889cf2;
    *background-color: #fff;
    color: #282828;
    font-size: 1vw;
  }
  .MuiTab-fullWidth {
    font-size: 1vw;
    color: #7a7d81;
    font-family: "Pretendard";
    font-weight: 500;
    letter-spacing: -0.0347vw;
  }

  .PrivateTabIndicator-colorPrimary-3 {
    background-color: #889cf2;
  }
  .PrivateTabIndicator-root-2 {
    height: 0.15vw;
  }
  .MuiTab-root {
    padding: 0;
    min-width: 5vw;
    margin-right: 0.6944vw;
  }
`;

const SwipeableViewsCustom = styled(SwipeableViews)`
  .MuiBox-root {
    *padding: 0.6944vw 2vw;
    padding: 1.5vw;
    box-sizing: border-box;
  }
`;
