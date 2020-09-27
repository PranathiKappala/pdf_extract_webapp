import React from 'react';
import axios from 'axios';

class DropDownComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templates: []
        }
    }

    componentDidMount() {
        this.getTemplateDetails();
    }

    getTemplateDetails = async () => {
        try {
            let { data } = await axios.get('http://34.93.101.108:8004/api/v1/Template/');
            this.setState({ templates: data });
        }
        catch (e) {
            console.log("e", e);
        }
    }
    render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="function">Template Name</label>
                    <select className="form-control" value={this.props.name} onChange={this.props.handleChange}>
                        <option>Select Template</option>
                        {this.state.templates.map((item, i) => {
                            return (
                                <option key={i}>{item.Name}</option>
                            )
                        }
                        )}
                    </select>
                </div>
            </div>
        )
    }
}

export default DropDownComponent