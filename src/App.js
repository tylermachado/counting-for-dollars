import React, { Component } from 'react'
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
import BarChart from './components/BarChart'
import Post1Tree from './posts/Post1Tree'
import Post2Map from './posts/Post2Map'


class App extends Component {


  render() {

    return (
      <HashRouter basename="/">
        <main>
            <Switch>
              <Route exact path="/" component={Post1Tree}  />
              <Route path="/Post1Tree" component={Post1Tree}  />
              <Route path="/Post2Map" component={Post2Map}  />
            </Switch>
        </main>
      </HashRouter>
    )
  }
}

export default App
