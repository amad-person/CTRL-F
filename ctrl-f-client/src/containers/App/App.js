import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import FileDrop from '../FileDrop/FileDrop';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { Button } from 'reactstrap';
import './App.css';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
} from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doneUploading: false,
            showingPlayer: false,
            files: [],
            source_url: ''
        };
    }

    dataFromFileDrop = (fileData) => {
        this.setState({
            doneUploading: fileData.doneUploading,
            showingPlayer: false,
            files: fileData.files,
            source_url: fileData.source_url
        });
    };

    processVideo = () => {
        this.setState({
            showingPlayer: true
        });
    };

    render() {
        return (
            <Router>
                <div className="App">
                    <Header/>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={(props) => <FileDrop {...props} dataFromFileDrop={this.dataFromFileDrop}/>}
                        />
                        <Route
                            path="/upload"
                            render={(props) => <FileDrop {...props} dataFromFileDrop={this.dataFromFileDrop}/>}
                        />
                        <Route
                            path="/process"
                            render={(props) => <VideoPlayer {...props} source_url={this.state.source_url}/>}
                        />
                        <Route
                            render={(props) => <FileDrop {...props} dataFromFileDrop={this.dataFromFileDrop}/>}
                        />
                    </Switch>


                    {
                        !this.state.showingPlayer ?
                            this.state.doneUploading ?
                                <div>
                                <Button tag={Link} to="/process" color="success" size="lg"
                                        onClick={this.processVideo}>
                                    Query
                                </Button>
                                </div>:
                                null :
                            null
                    }
                </div>
            </Router>
        );
    }
}

export default App;
