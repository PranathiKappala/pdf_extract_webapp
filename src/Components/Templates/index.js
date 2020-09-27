import React, { useState, useEffect } from 'react';
import axios from "axios";
import icon_plus_white from "../../Images/icon_plus_white.png";
import icon_dots from "../../Images/icon_dots.png";
// import Empty_Screen from "../../Images/Empty_Screen.png";

function Templates(props) {

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [templatesearch, setSearch] = useState("");
    const [dupTemplates, setDuplicateTemp] = useState([]);
    useEffect(() => {
        document.title = "Models | Techforce Ocr";
        const fetchData = async () => {
            setLoading(true);
            try {
                let { data } = await axios.get('http://34.93.101.108:8004/api/v1/Template/');
                setLoading(false);
                if (data.length > 0) {
                    setTemplates(data);
                    setDuplicateTemp(data);
                }
            } catch (e) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClick = (template, ind) => {

        let data = template;
        data.FIELDS.forEach((obj, index) => {
            if (!obj["tableData"]) {
                data.FIELDS[index]["tableData"] = []
            }
            else if (!obj["extraword"]) {
                data.FIELDS[index]["extraword"] = ""
            }
            if (!obj["occurrence"]) {
                data.FIELDS[index]["occurrence"] = 1
            }
            if (!obj["sorting"]) {
                data.FIELDS[index]["sorting"] = "1"
            }
            if (!obj["extracolumn"] || obj["extracolumn"] === null) {
                data.FIELDS[index]["extracolumn"] = null
            }
        });
        let templatePath = template.Name;
        props.history.push({
            pathname: `/extract/fields/${templatePath}`,
            state: data
        });
    }
    const handleSearch = (e) => {
        setSearch(e.target.value);
        let filteredTemplates = templates.filter(template => {
            let reg = RegExp(e.target.value.toUpperCase())
            if (reg.test(template.Name.toUpperCase())) return true;
            else return false;
        })
        setDuplicateTemp(filteredTemplates);
    }
    return (
        <div className="content_section">
            <div className="content_header">
                <div className="left_box">
                    <h3 className="title">Models</h3>
                </div>
                <div className="right_box">
                    <input type="text" name="search" placeholder="Search" className="search_input" value={templatesearch} onChange={handleSearch} />
                    <button type="button" className="btn create_btn" onClick={() => props.history.push("/extract")}>
                        <img src={icon_plus_white} alt="Icon" />
                        <span>CREATE</span>
                    </button>
                </div>
            </div>
            {loading ? <div style={{ margin: "15% 40%" }}>
                <i className='fas fa-circle-notch fa-spin'></i>
            </div> :
                <div className="content_body">
                    <div className="card_container">
                        {dupTemplates.length > 0 ? dupTemplates.sort((a, b) => a.id - b.id).map((template, ind) => {
                            return (<div className="card_box card letter_f" key={ind}>
                                <div className="dots_icon">
                                    <img src={icon_dots} alt="Icon" />
                                </div>
                                <div className="card_title">
                                    <p>{template.Name}</p>
                                </div>
                                <div className="card_button">
                                    <button onClick={() => handleClick(template, ind)} type="button" className="btn">VIEW</button>
                                </div>
                            </div>
                            )
                        }) : <div className="text-center" style={{ margin: "15% 40%" }}>
                                <p>No Models Found</p>
                            </div>}
                    </div>
                </div>}
        </div>
    )
}
export default Templates;