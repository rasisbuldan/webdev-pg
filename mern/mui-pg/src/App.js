import logo from './logo.svg';
import './App.css'; 

// Material UI
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  Typography
} from '@material-ui/core';
import poppins from 'typeface-poppins';

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Poppins", "Helvetica", sans-serif'
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Typography style={{fontFamily: 'sans-serif'}}>Hello world!</Typography>
      <Typography style={{fontFamily: 'sans-serif', fontWeight: '700'}}>Hello world!</Typography>
      <Typography style={{fontFamily: 'poppins', fontWeight: '500'}}>Hello world!</Typography>
      <Typography style={{fontFamily: 'poppins', fontWeight: '700'}}>Hello world!</Typography>
    </ThemeProvider>
  );
}

export default App;