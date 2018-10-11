import React, {Component} from 'react';
import Header from '../../components/Header/Header';
import FileDrop from '../FileDrop/FileDrop';
import { Button } from 'reactstrap';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doneUploading: false,
            files: []
        };
    }

    dataFromFileDrop = (fileData) => {
        this.setState({
            doneUploading: fileData.doneUploading,
            files: fileData.files
        });
    };

    render() {
        return (
            <div className="App">
                <Header/>
                <FileDrop dataFromFileDrop={this.dataFromFileDrop}/>
                { this.state.doneUploading ?
                    <Button color="success" size="lg">Process</Button> :
                    'Upload a video!'
                }
            </div>
        );
    }
}

export default App;
