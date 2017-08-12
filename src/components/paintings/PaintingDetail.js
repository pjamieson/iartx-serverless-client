import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import { invokeApig, s3Delete, s3Upload } from '../../libs/awsLib';
import config from '../../awsconfig.js';
import LoaderButton from '../../components/common/LoaderButton';
import './PaintingDetail.css';

class PaintingDetail extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      painting: null,
      title: '',
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getPainting();
      this.setState({
        painting: results,
        title: results.title,
      });
    }
    catch(e) {
      alert(e);
    }
  }

  getPainting() {
    return invokeApig({ path: `/paintings/${this.props.match.params.id}` }, this.props.userToken);
  }

  validateForm() {
    return this.state.title.length > 0;
  }

  formatFilename(str) {
    return (str.length < 50)
      ? str
      : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  savePainting(painting) {
    return invokeApig({
      path: `/paintings/${this.props.match.params.id}`,
      method: 'PUT',
      body: painting,
    }, this.props.userToken);
  }

  handleSubmit = async (event) => {
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {

      if (this.file) {
        // Delete old primaryImage
        let fileKey = decodeURIComponent(new URL(this.state.painting.primaryImage).pathname.substring(1));

        await s3Delete(fileKey, this.props.userToken);

        // Upload the new primaryImage
        uploadedFilename = (await s3Upload(this.file, this.props.userToken)).Location;
      }

      await this.savePainting({
        ...this.state.painting,
        title: this.state.title,
        primaryImage: uploadedFilename || this.state.painting.primaryImage,
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deletePainting() {
    return invokeApig({
      path: `/paintings/${this.props.match.params.id}`,
      method: 'DELETE',
    }, this.props.userToken);
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this painting?');

    if ( ! confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    // Delete the primaryImage from S3
    try {
      let fileKey = decodeURIComponent(new URL(this.state.painting.primaryImage).pathname.substring(1));

      await s3Delete(fileKey, this.props.userToken);
    }
    catch(e) {
      // We'll ignore and move on with deleteing the painting
    }

    // Delete the painting from the database
    try {
      await this.deletePainting();
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="PaintingDetail">
        { this.state.painting &&
          ( <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="title">
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.title}
                  componentClass="textarea" />
              </FormGroup>
              { this.state.painting.primaryImage &&
              ( <FormGroup>
                <ControlLabel>Primary Image</ControlLabel>
                <FormControl.Static>
                  <a target="_blank" rel="noopener noreferrer" href={ this.state.painting.primaryImage }>
                    { this.formatFilename(this.state.painting.primaryImage) }
                  </a>
                </FormControl.Static>
              </FormGroup> )}
              <FormGroup controlId="file">
                { ! this.state.painting.primaryImage &&
                <ControlLabel>Primary Image</ControlLabel> }
                <FormControl
                  onChange={this.handleFileChange}
                  type="file" />
              </FormGroup>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={ ! this.validateForm() }
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…" />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                text="Delete"
                loadingText="Deleting…" />
            </form> )}
        </div>
      );
    }
  }

export default withRouter(PaintingDetail);
