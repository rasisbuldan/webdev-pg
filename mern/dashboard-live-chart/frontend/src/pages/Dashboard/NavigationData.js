import React from 'react';
import { Container, Grid, Box, Typography } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import openSocket from 'socket.io-client';
import 'fontsource-roboto';

/* Icon */
import Battery90RoundedIcon from '@material-ui/icons/Battery90Rounded';

/* Socket Connect */
const socketHost = 'localhost';
const socketPort = 3002;
var socket = openSocket(`http://${socketHost}:${socketPort}`);

const NavDataTypography = withStyles({
  root: {
    color: '#1565c0',

  }
})(Typography);

class NavigationData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navdata: {
        batteryPercentage: '-',
        orientation: {
          roll: '-',
          pitch: '-',
          yaw: '-',
        },
        pwm: {
          mot1: '-',
          mot2: '-',
          mot3: '-',
          mot4: '-',
        },
        altitude: '-',
      }
    }
  }

  componentDidMount(){
    socket.on('navigationdata', (navdata) => {
      this.setState({ navdata: navdata });
    });
  }

  render() {
    return (
      <Container>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Battery90RoundedIcon />
          </Grid>
          <Grid item>
            <NavDataTypography variant='h5' gutterBottom>
              <Box fontWeight={300} fontSize={20}>
                Battery Percentage: {this.state.navdata.batteryPercentage}
              </Box>
            </NavDataTypography>
          </Grid>
        </Grid>
      </Container>
    )
  }
}

export default NavigationData;