import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Orders from './containers/Orders/Orders'
import Checkout from "./containers/Checkout/Checkout";
import Auth from './containers/Auth/Auth'
import { Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          {/* <BurgerBuilder /> */}
          {/* <Checkout /> */}
        </Layout>
        <Switch>
          <Route path='/checkout' component={Checkout} />
          <Route path='/orders' component={Orders} />
          <Route path='/auth' exact component={Auth} />
          <Route path='/' exact component={BurgerBuilder} />
        </Switch>
      </div>
    );
  }
}

export default App;
