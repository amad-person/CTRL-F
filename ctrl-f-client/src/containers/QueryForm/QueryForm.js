import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

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

        // call API

        // return response to parent

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
                                       placeholder="Enter some text to find and seek."
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