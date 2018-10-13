import React, { Component } from 'react';
import { Container, Row, Col, Button, CardDeck, Card } from 'reactstrap';
import QueryForm from "../QueryForm/QueryForm";

class VideoPlayer extends Component {
    seek(time) {
        this.refs.videoRef.currentTime = time;
    }

    render() {
        const paddingStyle = {
            padding: '20px'
        };

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
                        <QueryForm/>
                    </Col>
                </Row>

                <CardDeck>
                    <Card>
                        <Button color="primary" onClick={() => this.seek(30)}>00:30</Button>
                    </Card>
                    <Card>
                        <Button color="primary" onClick={() => this.seek(90)}>01:30</Button>
                    </Card>
                    <Card>
                        <Button color="primary" onClick={() => this.seek(150)}>02:30</Button>
                    </Card>
                </CardDeck>
            </Container>
        )
    }
}

export default VideoPlayer;