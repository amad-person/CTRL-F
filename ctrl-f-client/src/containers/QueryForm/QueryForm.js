import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import request from 'superagent';

class QueryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        console.log('A query was submitted: ' + this.state.value);

        // call API deployed at http://54.255.249.117:3001/query
        // const url = 'http://localhost:3001/query';
	
	const url = 'http://54.255.249.117:3001/query';
        const responseParsed = {
            audioResponse: [],
            videoResponse: []
        };

        request.get(url)
            .set('API_KEY', 'sampleKey1')
            .set('queryString', this.state.value)
            .then((res) => {
                console.log('query form audio seek times', res.body.audioResponse);
                console.log('query form video seek times', res.body.videoResponse);
                responseParsed.audioResponse = res.body.audioResponse;
                responseParsed.videoResponse = res.body.videoResponse;

                this.props.dataFromQuery(responseParsed);
            });

 
        event.preventDefault();
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col md="11">
                            <FormGroup>
                                <Input type="text" name="query" id="query"
                                       placeholder="Enter some text to find and seek!"
                                       value={this.state.value}
                                       onChange={this.handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="1">
                            <Button color="primary" type="submit">Find!</Button>
                        </Col>
                    </Row>
                </Container>
            </Form>
        );
    }
}

export default QueryForm;
