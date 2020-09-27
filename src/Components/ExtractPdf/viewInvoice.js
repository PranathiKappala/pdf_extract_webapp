import React from 'react';
import ImageView from "../Process/ImageView";
import ExtractedData from "../Process/ExtractedData";
import axios from "axios";
import _ from 'lodash';


class viewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processName: "",
            Id: "",
            image: null,
            fileCount: "",
            templateID: 1,
            index: 0,
            extractedData: [],
            initObj: [],
            updateButtonDisbale: true
        }
    }


    componentDidMount() {
        if (this.props.location.state) {
            let { ID, processName, fileCount } = this.props.location.state;
            this.setState({ Id: ID, processName, fileCount }, () => {
                this.fetchData();
            });
        }
        else {
            this.props.history.push("/app/processes")
        }
    }

    fetchData = async () => {
        this.getExtractedData();
        this.getImage();
    };

    compareObjects = () => {
        let { initObj, extractedData } = this.state;
        let val = _.isEqual(JSON.parse(initObj), extractedData);
        let updateButtonDisbale = true;
        if (!val) {
            updateButtonDisbale = false;
        };
        this.setState({ updateButtonDisbale });
    }

    updateDataApi = () => {
        let { extractedData, fileCount, templateID } = this.state;
        try {
            let options = {
                method: "POST",
                baseURL: process.env.REACT_APP_PYTHON_URL,
                data: extractedData
            }
            axios('/api/v1/update/', options);
            this.setState({ updateButtonDisbale: true });
            if (fileCount === templateID) {
                this.pageChange()
            } else if (fileCount > templateID) {
                this.handlePreview("next")
            }
        } catch (error) {
            console.log(error);
        }
    }

    pageChange = () => {
        this.props.history.push("/app/processes");
    }

    getImage = async () => {
        console.log("get image", this.state);

        try {
            let { Id, templateID, processName } = this.state;
            let options = {
                method: "GET",
                baseURL: process.env.REACT_APP_PYTHON_URL,
                responseType: "arraybuffer",
                params: {
                    Id,
                    templateID,
                    ProcessName: processName
                }
            }
            let { data } = await axios("/api/v1/getpdfAndImage/", options);

            let b64encoded = btoa([].reduce.call(new Uint8Array(data), function (p, c) { return p + String.fromCharCode(c) }, ''));
            let base64Image = "data:" + data.mimetype + ";base64," + b64encoded;

            this.setState({ image: base64Image });
        } catch (error) {
            console.log(error);
        }
    }

    getExtractedData = async () => {
        let { Id, templateID, processName } = this.state;
        try {
            let options = {
                method: "GET",
                baseURL: process.env.REACT_APP_PYTHON_URL,
                params: {
                    Id,
                    templateID,
                    ProcessName: processName
                }
            }
            let { data } = await axios("/api/v1/ExtractDetails/", options);
            this.setState({ extractedData: data, initObj: JSON.stringify(data) });
        } catch (error) {
            console.log(error);
        }
    }

    handleUpdateNormalData = (newObj, e) => {
        let { extractedData: { data } } = this.state;
        newObj['fieldValue'] = e.target.value;
        data.some(obj => {
            if (obj.fieldName === newObj.fieldName) {
                obj = newObj
                return true;
            } else return false;
        });
        let updatedObj = {
            ...this.state.extractedData,
            data
        }
        this.setState({
            extractedData: updatedObj
        }, () => {
            this.compareObjects();
        })
    }

    handleUpdateTableData = (index, e) => {
        let { name, value } = e.target;
        let { extractedData: { tableData } } = this.state;

        tableData.some(table => {
            if (table.fieldName === name) {
                table['fieldValue'][index] = value;
                return true;
            } else return false;
        });
        let updatedObj = {
            ...this.state.extractedData,
            tableData: tableData
        }
        this.setState({
            extractedData: updatedObj
        }, () => {
            this.compareObjects();
        });
    }

    handlePreview = (type) => {
        let { index, templateID } = this.state;

        if (type === "prev") {
            index = index - 1;
            templateID = templateID - 1;

        } else {
            index = index + 1;
            templateID = templateID + 1;
        }
        this.setState({
            index: index,
            templateID: templateID,
            updateButtonDisbale: true
        }, () => {
            this.fetchData();
        })
    }

    render() {
        let { extractedData: { fileName }, extractedData, image, updateButtonDisbale } = this.state;
        console.log(extractedData)
        return (
            <div className="main-content">
                <div className="top">
                    <input type="text" id="inputId" name="templateName" placeholder="Enter Template Name" value={fileName} />
                </div>
                <div className="content-wrapper">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="d-flex justify-content-end" style={{ width: "100%" }}>
                                <button className="btn btn-preview" style={{ background: "rgb(26, 63, 106)", color: "rgb(255, 255, 255)", width: "80px", margin: "15px 5px 0 0" }}
                                    disabled={this.state.index === 0 ? true : false} onClick={() => this.handlePreview("prev")}>
                                    Previous
                            </button>
                                <button className="btn btn-preview" style={{ background: "rgb(26, 63, 106)", color: "rgb(255, 255, 255)", width: "80px", margin: "15px 25px 0 0" }} disabled={this.state.fileCount - 1 === this.state.index ? true : false} onClick={() => this.handlePreview("next")}>Next</button>
                            </div>
                            <div className="row" style={{ height: "90%", margin: "10px 0px" }}>
                                <div className="col-6 file-block">
                                    <ImageView image={image} />
                                </div>
                                <div className="col-6 file-block">
                                    <ExtractedData extractedData={extractedData}
                                        handleUpdateNormalData={(data, e) => this.handleUpdateNormalData(data, e)}
                                        handleUpdateTableData={(index, e) => this.handleUpdateTableData(index, e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="footer" style={{ height: "9%", padding: "10px 50px" }}>
                        <button className="btn btn-preview" style={{ marginRight: "10px", background: "rgb(26, 63, 106)", color: "#ffffff" }} onClick={this.pageChange}>
                            Cancel
                    </button>
                        <button className="btn btn-preview" style={{ background: "rgb(26, 63, 106)", color: "#ffffff" }}
                            disabled={updateButtonDisbale}
                            onClick={this.updateDataApi} >
                            Update
                    </button>
                    </footer>
                </div>
            </div>
        )
    }
}
export default viewInvoice;