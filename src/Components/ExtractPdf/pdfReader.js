import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
 
class PdfReader extends Component {
    constructor(props){
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
            filepath : `http://34.93.101.108:8004/api/v1/getpdf/?path=${this.props.filepath}.pdf`
        }
    }
  
 
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }
  onPageLoad =() =>{
  let canvas =  document.getElementsByTagName("canvas")[0]
  canvas.style.width = '600px';
  canvas.style.height = "auto" 
  }
  handleClick = (e) =>{
    let canvas = document.getElementsByTagName("canvas")[0];
    let wid = canvas.getBoundingClientRect().width;
    if(e.target.name === "zoomin"){
        canvas.style.width = wid*1.5 + "px";
    } else if(e.target.name === "zoomout"){
        canvas.style.width = wid/1.5 + "px";
    } else {
        canvas.style.width = "100%";
    }
  }
  render() {
    const { pageNumber, numPages } = this.state;
 
    return (
      <div style={{height:"100%"}}>
        <div className="header">
            <h5>File Preview</h5>
            <div>
                <button name="zoomin" className="btn" onClick={this.handleClick}>+</button>
                <button style={{marginLeft:20}} name="zoomout" className="btn" onClick={this.handleClick}>-</button>
            </div>
        </div>
        <div className="canvas-container">
        <Document
          file={this.state.filepath}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} onLoadSuccess={this.onPageLoad}/>
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        </div>
      </div>
    );
  }
}

export default PdfReader;