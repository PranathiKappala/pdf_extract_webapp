import React from "react";

function ImageView(props){
    const handleClick = (e) =>{
        let canvas = document.getElementById("zoom");
        let wid = canvas.getBoundingClientRect().width;
        if(e.target.name === "zoomin"){
            canvas.style.width = wid*1.5 + "px";
        } else if(e.target.name === "zoomout"){
            canvas.style.width = wid/1.5 + "px";
        } else {
            canvas.style.width = "100%";
        }
    }
    
    let { image } = props;
    return (
        <div className="file-preview bg-white">
            <div className="fl-title-block">
                <div className="fl-title d-flex justify-content-between">
                    <div><h2>File preview</h2></div>
                    <div>
                    <button name="zoomin" className="btn" onClick={handleClick}>+</button>
                    <button style={{marginLeft:20}} name="zoomout" className="btn" onClick={handleClick}>-</button>
                    </div>
                </div>
            </div>
            <div className="fl-preview-img fl-30">
                <div className="fl-scrollable canvasContainer">
                    <div className="dashed-line" id="zoom" style={{minWidth:"100%"}}>
                        {image  ? <img style={{width:"100%"}} src={image} alt="img-uploaded" /> : "fetching Image.."}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ImageView;