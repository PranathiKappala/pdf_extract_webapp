import React from 'react';
import { Router, Route, Redirect } from "react-router-dom";
import AppContainer from "./Components/AppContainer";
import ExtractPdf from "./Components/ExtractPdf";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App" style={{ height: "100vh" }}>
      {/* <Provider store={store}> */}
      <Router history={history}>
        <Route path="/app" component={AppContainer} />
        <Route path="/extract" component={ExtractPdf} />
        <Redirect from="/" to="/app" />
        {/* <Route path="/login" /> */}
      </Router>
      {/* </Provider> */}
    </div>
  );
}

export default App;
