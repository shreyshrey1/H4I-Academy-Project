import React, {Component} from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText  } from 'reactstrap';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			navam: 'uncle',
			all_tweets: [],
      // Contents from the form
      username: "",
      content: "",
      likes: "",
      retweets: ""
		}
	}

  componentDidMount() {
    this.fetchTweets()
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  fetchTweets = async () => {
    const response = await fetch("http://127.0.0.1:5000/posts")
    const json = await response.json()
    this.setState({all_tweets: json["result"]["tweets"]})
  }

  handleSubmit = () => {
    let request = new FormData()
    request.append('username', this.state.username)
    request.append('content', this.state.content)
    request.append('likes', this.state.likes)
    request.append('retweets', this.state.retweets)
    console.log(this.state)

    fetch("http://127.0.0.1:5000/posts",
      {
        body: request,
        method: "post"
      }
    )
    alert("Tweet Submitted")
    this.fetchTweets()
  }

	render () {
		  return (
		    <Container>
				<Row>
					<Col xs='1'>Tweet:</Col>
					<Col xs='3'>Username:</Col>
					<Col xs='3'>Content:</Col>
					<Col xs='1'>Likes:</Col>
					<Col xs='1'>retweets</Col>
				</Row>
				{this.state.all_tweets.map((value) => {
					return (
						<Tweet username={value.username} content={value.content} likes={value.likes} retweets={value.retweets}/>
					);
				})}
				<Row>
					<Form>
						<FormGroup>
							<Label for="exampleText">Username</Label>
							<Input type="textarea" name="username" id="username" onChange={this.handleChange} />
						</FormGroup>
						<FormGroup>
							<Label for="exampleText">Content</Label>
              <Input type="textarea" name="content" id="content" onChange={this.handleChange}/>
						</FormGroup>
						<FormGroup>
							<Label for="exampleText">Likes</Label>
							<Input type="textarea" name="likes" id="likes" onChange={this.handleChange}/>
						</FormGroup>
						<FormGroup>
							<Label for="exampleText">Retweets</Label>
							<Input type="textarea" name="retweets" id="retweets" onChange={this.handleChange}/>
						</FormGroup>
					</Form>
				</Row>
        <Button onClick={this.handleSubmit}>Submit</Button>
		    </Container>
		  );
	}
}

class Tweet extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	render() {
		return (
			<Row>
				<Col xs='1'>
				</Col>
				<Col xs='3'>
					{this.props.username}
				</Col>
				<Col xs='3'>
					{this.props.content}
				</Col>
				<Col xs='1'>
					{this.props.likes}
				</Col>
				<Col xs='1'>
					{this.props.retweets} 
				</Col>
			</Row>
		)

	}
}

export default App;


