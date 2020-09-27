import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./navbar";
import SideNav from "./sidenav";
import Templates from "../Templates";
import Process from "../Process"

function AppContainer(props) {
    return (
        <div className="main-app container-fluid">
            <NavBar />
            <div className="row content_container" style={{height:"90vh"}}>
                <div className="col-12 col-sm-12 text-left no_padding" style={{height:"100%"}}>
                    <div className="container" style={{height:"100%"}}>
                        <div className="row">
                            <div className="col-12 col-sm-12 content_box">
                                <SideNav />
                                    <Switch>
                                        <Route path="/app/templates" component={Templates} />
                                        <Route path="/app/processes" component={Process}/>
                                        <Redirect from="/app" to="/app/templates" />
                                    </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppContainer;