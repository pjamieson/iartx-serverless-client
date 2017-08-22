import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';

//import { invokeApig } from '../libs/awsLib';
import './Home.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      paintings: [],
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const results = await this.paintings();
      this.setState({ paintings: results });
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  paintings() {
//    return invokeApig({ path: '/paintings' }, this.props.userToken);
  }

  renderPaintingsList(paintings) {
    return [{}].concat(paintings).map((painting, i) => (
      i !== 0
        ? ( <ListGroupItem
              key={painting.paintingId}
              href={`/paintings/${painting.paintingId}`}
              onClick={this.handlePaintingClick}
              header={painting.title.trim().split('\n')[0]}>
                { "Created: " + (new Date(painting.createdAt)).toLocaleString() }
            </ListGroupItem> )
        : ( <ListGroupItem
              key="new"
              href="/paintings/new"
              onClick={this.handlePaintingClick}>
                <h4><b>{'\uFF0B'}</b> Add a painting</h4>
            </ListGroupItem> )
    ));
  }

  handlePaintingClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>iArtX</h1>
        <p>The Internet Art Exchange</p>
      </div>
    );
  }

  renderPaintings() {
    return (
      <div className="paintings">
        <PageHeader>My Art</PageHeader>
        <ListGroup>
          { ! this.state.isLoading
            && this.renderPaintingsList(this.state.paintings) }
        </ListGroup>
      </div>
    );
  }

  render() {
    //console.log('Home props: ', this.props);
    return (
      <div className="Home">
        { !this.props.userToken
          ? this.renderLander()
          : this.renderPaintings() }
      </div>
    );
  }
}

export default withRouter(Home);
