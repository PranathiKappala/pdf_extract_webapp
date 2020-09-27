import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import UploadFlow from "./uploadFile";
import ExtractFields from "./extractFields";
import ViewInvoice from "./viewInvoice";

import "./index.css";

function ExtractPdf(props){
    return(
        <div className="extract-container">
            <Switch>
                <Route path="/extract/upload" component={UploadFlow} />
                <Route path="/extract/fields/:templatename" component={ExtractFields} />
                <Route path="/extract/viewInvoice" component={ViewInvoice} />
                <Redirect from="/extract" to="/extract/upload" />
            </Switch>
        </div>
    )
}

export default ExtractPdf;