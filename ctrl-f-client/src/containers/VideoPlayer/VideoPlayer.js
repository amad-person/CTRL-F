import React, { Component } from 'react';
import { Container, Row, Col, Button, CardDeck, Card, Alert } from 'reactstrap';
import QueryForm from "../QueryForm/QueryForm";
import moment from 'moment';

class VideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audioSeekTimes: [],
            videoSeekTimes: []
        };
    }

    dataFromQuery = (dataResults) => {
        this.setState({
            audioSeekTimes: dataResults.audioResponse,
            videoSeekTimes: dataResults.videoResponse
        });

        console.log('State for audio seek times', this.state.audioSeekTimes);
        console.log('State for video seek times', this.state.videoSeekTimes);
    };

    seek(time) {
        this.refs.videoRef.currentTime = time;
    }

    render() {
        const paddingStyle = {
            padding: '20px'
        };

        let audioSeekButtons = (
            <Alert color="danger">No results found!</Alert>
        );
        if (this.state.audioSeekTimes.length !== 0) {
            audioSeekButtons = (
                <CardDeck>
                    { this.state.audioSeekTimes.map((time) => {
                        return (
                            <Card>
                                <Button color="primary" onClick={() => this.seek(Math.floor(time))}>
                                    {moment().startOf('day').seconds(time).format('HH:mm:ss')}
                                </Button>
                            </Card>
                        )})
                    }
                </CardDeck>
            );
        }

        let videoSeekButtons = (
            <Alert color="danger">No results found!</Alert>
        );
        if (this.state.videoSeekTimes.length !== 0) {
            videoSeekButtons = (
                <CardDeck>
                    { this.state.videoSeekTimes.map((time) => {
                        return (
                            <Card>
                                <Button color="primary" onClick={() => this.seek(Math.floor(time))}>
                                    {moment().startOf('day').seconds(time).format('HH:mm:ss')}
                                </Button>
                            </Card>
                        )})
                    }
                </CardDeck>
            );
        }

        return (
            <Container className="VideoPlayer">
                <Row style={paddingStyle}>
                    <Col>
                        <video ref="videoRef" className="Player" width="80%" maxheight="100%" controls>
                            <source src={this.props.source_url} type={"video/mp4"}/>
                        </video>
                    </Col>
                </Row>

                <Row style={paddingStyle}>
                    <Col>
                        <QueryForm dataFromQuery={this.dataFromQuery}/>
                    </Col>
                </Row>

                <p style={paddingStyle}>Audio Search Results</p>
                {audioSeekButtons}

                <p style={paddingStyle}>Video Search Results</p>
                {videoSeekButtons}
            </Container>
        )
    }
}

export default VideoPlayer;