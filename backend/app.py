from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# --- 1. App Configuration --- --- --- ---
app = Flask(__name__)
# Configure a local SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database and CORS
db = SQLAlchemy(app)
CORS(app) # Enables CORS for all routes


# --- 2. Database Model ---
# This is a Python class that represents a table in your database.
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    feather_type = db.Column(db.String(50), nullable=False, default='Text')

    def __repr__(self):
        return f"Post('{self.title}', '{self.feather_type}')"
    
    # Method to easily convert the object to a dictionary (JSON format)
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'feather_type': self.feather_type
        }

# This function creates the database tables if they don't exist
with app.app_context():
    db.create_all()

# --- 3. API Endpoints (Routes) ---

@app.route('/api/posts', methods=['POST'])
def create_post():
    # Get JSON data from the request body
    data = request.get_json()
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'error': 'Missing title or content'}), 400

    # Create a new Post object with the received data
    new_post = Post(
        title=data['title'],
        content=data['content'],
        feather_type=data.get('feather_type', 'Text') # Default to 'Text' if not provided
    )
    
    # Add the new post to the database session and commit
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify(new_post.to_dict()), 201 # Return the created post with a 201 status code

@app.route('/api/posts', methods=['GET'])
def get_posts():
    # Query all posts from the database
    posts = Post.query.all()
    
    # Convert the list of Post objects into a list of dictionaries
    posts_list = [post.to_dict() for post in posts]
    
    return jsonify(posts_list) # Return the list as a JSON array

# --- 4. Run the Application ---
if __name__ == '__main__':
    app.run(debug=True)