import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';

import { invokeApig, s3Upload } from '../../libs/awsLib';
import config from '../../awsconfig.js';
import LoaderButton from '../../components/common/LoaderButton';
import './ArtistCreate.css';

class ArtistCreate extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      alphaOrderName: '',
      bioCredit: '',
      biography: '',
      birthDate: '',
      country: '',
      deathDate: '',
      fullName: '',
      imageCredit: '',
    };
  }

  validateForm() {
    return this.state.alphaOrderName.length > 0
      && this.state.fullName.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = (this.file)
        ? (await s3Upload(this.file, this.props.userToken)).Location
        : null;

      await this.createArtist({
        alphaOrderName: this.state.alphaOrderName,
        bioCredit: this.state.bioCredit,
        biography: this.state.biography,
        birthDate: this.state.birthDate,
        country: this.state.country,
        deathDate: this.state.alphaOrderName,
        fullName: this.state.alphaOrderName,
        imageUrl: uploadedFilename,
        imageCredit: this.state.imageCredit,
      });
      this.props.history.push('/');
    }
    catch(e) {
      console.log('createArtist Error: ', e);
      alert(e);
      this.setState({ isLoading: false });
    }

  }

  createArtist(artist) {
    console.log('createArtist: ', artist);
    return invokeApig({
      path: '/artists',
      method: 'POST',
      body: artist,
    }, this.props.userToken);
  }
  render() {
    return (
      <div className="ArtistCreate">
        <Form horizontal onSubmit={this.handleSubmit}>

          <FormGroup controlId="fullName">
            <Col value={this.state.fullName}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Full Name*
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="Pablo Picasso"
                value={this.state.fullName} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="alphaOrderName">
            <Col value={this.state.alphaOrderName}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Alpha Order Name*
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="Picasso, Pablo"
                value={this.state.alphaOrderName} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="country">
            <Col value={this.state.country}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Country
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="Spain"
                value={this.state.country} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="birthDate">
            <Col value={this.state.birthDate}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Birth Date
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="25 October 1881"
                value={this.state.birthDate} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="deathDate">
            <Col value={this.state.deathDate}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Death Date
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="08 April 1973"
                value={this.state.deathDate} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="biography">
            <Col value={this.state.biography}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Biography
            </Col>
            <Col sm={8}>
              <FormControl componentClass="textarea" placeholder="Pablo Picasso was ..."
                value={this.state.biography} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="bioCredit">
            <Col value={this.state.bioCredit}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Bio Credit
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="compiled by Joe Smith"
                value={this.state.bioCredit} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="file">
            <Col value={this.state.fullName}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Author Image
            </Col>
            <Col sm={8}>
              <FormControl type="file" onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="imageCredit">
            <Col value={this.state.imageCredit}
              onChange={this.handleChange}
              componentClass={ControlLabel} sm={3}>
              Image Credit
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="David Duncan"
                value={this.state.imageCredit} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={3} sm={8}>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={ ! this.validateForm() }
                type="submit"
                isLoading={this.state.isLoading}
                text="Create"
                loadingText="Creating…" />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withRouter(ArtistCreate);
