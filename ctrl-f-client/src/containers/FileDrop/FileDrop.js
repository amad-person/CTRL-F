import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import axios from 'axios';
import './FileDrop.css'

class FileDrop extends Component {
    constructor(props) {
        super(props);
        this.state = { files: [] };
    }

    // accept file and send to server
    onDrop = (files) => {
        this.setState({
            files
        });

        // API endpoint http://54.255.249.117:3001/upload
        let data = {}
        data[files[0].name]= files[0];
        const url = 'http://54.255.249.117:3001/upload';
        // let req = axios({
        //     method:'POST',
        //     headers:{'Access-Control-Allow-Origin':'*',
        //             'Content-Type':'application/x-www-form-urlencoded'},
        //     data,
        //     url
        // }).then(response => {
        //     console.log("response",response);
        //    

        //     this.props.dataFromFileDrop(fileData);
        // });
        // build POST request to endpoint
        const req = request.post(url);

        // attach file to POST request
        req.attach(files[0].name, files[0]);

        // req.set('Access-Control-Allow-Origin','*');
        // req.set('Content-Type','application/x-www-form-urlencoded');
        req.end((err, res)=>{
             // send data to parent component
            const fileData = {
                files: this.state.files,
                source_url: this.state.files[0].preview,
                doneUploading: true
            };
            console.log("res",res);
            console.log("err",err);
            
            this.props.dataFromFileDrop(fileData);
        });


    };

    getFileSize = (size) => {
        let sizeExt = ['bytes', 'KB', 'MB', 'GB'], i = 0;

        while (size > 900) {
            size /= 1000;
            i++;
        }

        return '' + (Math.round(size * 100) / 100) + ' ' + sizeExt[i];
    };

    render() {
        return (
            <div className="FileDrop">
                <Dropzone
                    accept="video/mp4"
                    className="Dropzone"
                    activeClassName="DropzoneActive"
                    rejectClassName="DropzoneReject"
                    multiple={false}
                    onDrop={this.onDrop.bind(this)}
                >
                    {({ isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (acceptedFiles.length || rejectedFiles.length) {
                            return `After the upload finishes, click on query!`;
                        }
                        if (isDragAccept) {
                            return "You can upload this file!";
                        }
                        if (isDragReject) {
                            return "This file can't be uploaded.";
                        }
                        return "Drop a video file, or click to browse.";
                    }}
                </Dropzone>
                <div className="DroppedFileInfo">{this.state.files.map(f => <p key={f.name}>{f.name} ~ {this.getFileSize(f.size)}</p>)}</div>
            </div>
        );
    };
}

export default FileDrop;
