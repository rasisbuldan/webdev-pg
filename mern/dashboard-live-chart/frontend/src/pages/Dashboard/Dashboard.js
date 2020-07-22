import React from 'react';
import { Box, Grid, Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import LineChart from './LineChart'
import 'fontsource-roboto';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
  },
  paperBig: {
    padding: 10,
    height: 300,
    textAlign: 'center',
    borderRadius: 10,
  },
}));

function Dashboard() {
  const classes = useStyles();
  
  return(
    <Container className={classes.root}>
      <Box mt={0} p={2}>
        <Typography variant='h2' gutterBottom align={'left'}>
          <Box fontWeight={200} fontSize={48}>
            Dashboard Chart
          </Box>
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Paper className={classes.paperBig} elevation={3} >
              <Typography variant='h5' gutterBottom>
                <Box fontWeight={300} fontSize={26}>
                  Chart 1
                </Box>
              </Typography>
              <LineChart />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paperBig} elevation={3} >
              <Typography variant='h5' gutterBottom>
                <Box fontWeight={300} fontSize={26}>
                  Chart 2
                </Box>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Dashboard;