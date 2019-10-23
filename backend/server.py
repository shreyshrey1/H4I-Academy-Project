from flask import Flask, make_response
from flask import render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Tweet:
    def __init__(self, likes, content, retweets, username):
        self.likes = likes
        self.content = content
        self.retweets = retweets
        self.username = username

    def to_dict(self):
        return {
                "likes": self.likes,
                "content": self.content,
                "retweets": self.retweets,
                "username": self.username
                }

tweets = {} # maps id -> Tweet()
curr_id = 0

def create_response(data, status, message):
    """Wraps response in a consistent format throughout the API.

    Format inspired by https://medium.com/@shazow/how-i-design-json-api-responses-71900f00f2db
    Modifications included:
    - make success a boolean since there's only 2 values
    - make message a single string since we will only use one message per response
    IMPORTANT: data must be a dictionary where:
    - the key is the name of the type of data
    - the value is the data itself
    :param data <str> optional data
    :param status <int> optional status code, defaults to 200
    :param message <str> optional message
    :returns tuple of Flask Response and int, which is what flask expects for a response
    """
    if type(data) is not dict and data is not None:
        raise TypeError("Data should be a dictionary")

    response = {
        "code": status,
        "success": 200 <= status < 300,
        "message": message,
        "result": data,
    }
    return jsonify(response), status

@app.route('/')
def home():
    return "Twitter"

@app.route('/posts', methods=['POST'])
def add_tweet():
    global curr_id
    global tweets
    data = request.form
    print(data)
    likes = data.get("likes")
    content = data.get("content")
    retweets = data.get("retweets")
    username = data.get("username")

    tweet = Tweet(likes, content, retweets, username)

    tweets[curr_id] = tweet
    curr_id += 1

    return create_response(tweet.to_dict(), 200, "Tweet Created")

@app.route('/posts', methods=['GET'])
def get_tweets():
    global tweets
    tweet_list = [tweet.to_dict() for tweet in tweets.values()]
    response = {
            "tweets": tweet_list
            }
    return create_response(response, 200, "OK")

@app.route('/posts/<id>', methods=['GET'])
def get_tweet(id):
    global tweets
    if int(id) in tweets:
        return create_response(tweets[int(id)].to_dict(), 200, "OK")
    return create_response({}, 404, "Not Found")

if __name__ == '__main__':
    app.run(debug = True)
