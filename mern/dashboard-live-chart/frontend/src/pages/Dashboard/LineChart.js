import React from 'react';
import { Line } from 'react-chartjs-2'
import 'fontsource-roboto';

/* Global variable */
const nLineData = 300;

const lineData = {
  labels: [...Array(nLineData).keys()],
  datasets: [
    {
      label: 'Dummy Data',
      fill: false,
      lineTension: 0.2,
      backgroundColor: '#1565c0',
      borderWidth: 1,
      borderColor: '#1565c0',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 1.0,
      borderJoinStyle: 'miter',
      pointBorderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 10,
      data: [],
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

class LineChart extends React.Component {
  componentWillMount(){
		this.setState(lineData);
    }
    
	componentDidMount(){
		var _this = this;

		setInterval(function(){
      var oldDataSet = _this.state.datasets[0];
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

			_this.setState(newState);
		}, 20);
  }

  render() {
    return(
      <Line data={this.state} options={lineOptions} />
    )
  }
}

export default LineChart;