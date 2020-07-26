import React from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'
import 'fontsource-roboto';

/* API Connect */
const apiHost = 'localhost';
const apiPort = 3001;

/* Global variable */
const nLineData = 20;

const lineData = {
  labels: [...Array(nLineData).keys()],
  datasets: [
    {
      label: 'RMS Data',
      fill: false,
      lineTension: 0.2,
      backgroundColor: '#e67e22',
      borderWidth: 1,
      borderColor: '#e67e22',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 1.0,
      borderJoinStyle: 'miter',
      pointBorderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 10,
      data: [0],
    }
  ],
};

const lineOptions = {
  animation: {
    duration: 0,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0,
          max: 100,
          stepSize: 20
        }
      },
    ],
  }
};

class LineChartRMS extends React.Component {
  componentWillMount(){
		this.setState(lineData);
  }
    
	componentDidMount(){
		var _this = this;

		setInterval(function(){
      /* axios.get(`http://${apiHost}:${apiPort}/chartdataaccel`)
        .then(res => {
          //console.log(res.data);
          var oldDataSet = _this.state.datasets[0];
          var newDataSet = [
            {
              ...oldDataSet,
            },
            {
              ...oldDataSet,
            },
            {
              ...oldDataSet,
            }
          ];
          
          newDataSet[0].label = 'x';
          newDataSet[1].label = 'y';
          newDataSet[2].label = 'z';
          newDataSet[0].data = res.data.x;
          newDataSet[1].data = res.data.y;
          newDataSet[2].data = res.data.z;

          var newState = [
            {
              ...lineData,
              datasets: newDataSet
            }
          ];
          _this.setState(newState);
        })
        .catch((err) => {
          console.log(err);
        }); */
        
      axios.get(`http://${apiHost}:${apiPort}/chartdatarms`)
        .then(res => {
          //console.log(res.data);
          var oldDataSet = _this.state.datasets[0];
          var newDataSet = {
            ...oldDataSet
          };

          newDataSet.data = res.data.slice(-20);

          var newState = {
            ...lineData,
            datasets: [newDataSet]
          };

          _this.setState(newState);
        })
        .catch((err) => {
          console.log(err);
        });

      /* var oldDataSet = _this.state.datasets[0];
      var oldData = oldDataSet.data;
      var nSlice = Math.floor(0.9 * _this.state.labels.length)
			var newData = oldData.slice(-nSlice, -1)

      var nLoop = _this.state.labels.length - nSlice
      
      for(var x=0; x < nLoop; x++){
				newData.push(10 + Math.floor(Math.random() * 80));
      }

			var newDataSet = {
				...oldDataSet
			};

			newDataSet.data = newData;

			var newState = {
				...lineData,
				datasets: [newDataSet]
			};

			_this.setState(newState); */
		}, 20);
  }

  render() {
    return(
      <Line data={this.state} options={lineOptions} />
    )
  }
}

export default LineChartRMS;