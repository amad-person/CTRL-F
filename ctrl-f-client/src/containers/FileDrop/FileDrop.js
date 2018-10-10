import React, { Component } from 'react';
import ReactDropzone from 'react-dropzone';
import request from 'superagent';
import './FileDrop.css'

class FileDrop extends Component {
    constructor(props) {
        super(props);
        this.state = { files: [] }
    }

    onDrop = (files) => {
        this.setState({
            files
        });

        // API endpoint
        const url = 'http://localhost:3001/upload';

        // build POST request to endpoint
        const req = request.post(url);

        // attach file to POST request
        req.attach(files[0].name, files[0]);

        req.end();
    };

    render() {
        return (
            <div className="FileDrop">
                <ReactDropzone
                    accept="video/mp4"
                    className="Dropzone"
                    activeClassName="DropzoneActive"
                    rejectClassName="DropzoneReject"
                    multiple={false}
                    onDrop={this.onDrop.bind(this)}
                >
                    {({ isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (acceptedFiles.length || rejectedFiles.length) {
                            return `Accepted file, please wait for CTRL-F!`;
                        }
                        if (isDragAccept) {
                            return "You can upload this file!";
                        }
                        if (isDragReject) {
                            return "This file can't be uploaded.";
                        }
                        return "Drop a video file, or click to browse.";
                    }}
                </ReactDropzone>
                <div className="DroppedFileInfo">{this.state.files.map(f => <p key={f.name}>{f.name} - {f.size} bytes</p>)}</div>
            </div>
        );
    };
}

export default FileDrop;