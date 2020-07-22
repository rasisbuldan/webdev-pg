import React from 'react'
import SideDrawer from './components/SideDrawer'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/* Pages */
import Home from './pages/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App(){
  /* return (
    <Sidebar items={items}/>
  ) */
  return (
    <Router history={history}>
      <div>
        <SideDrawer />
        <div>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
        
      </div>
    </Router>
  )
}

export default App;