from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# --- 1. App Configuration ---
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database and CORS
db = SQLAlchemy(app)
CORS(app)

# --- NEW: 2a. Association Table for Post-Tags Relationship ---
# This table is used to link posts and tags together.
post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

# --- NEW: 2b. Tag Database Model ---
class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"Tag('{self.name}')"
        
# --- UPDATED: 2c. Post Database Model ---
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    feather_type = db.Column(db.String(50), nullable=False, default='Text')

    # NEW: Define the many-to-many relationship with the Tag model
    tags = db.relationship('Tag', secondary=post_tags, lazy='subquery', backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f"Post('{self.title}', '{self.feather_type}')"
    
    # UPDATED: to_dict method now includes tags
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'feather_type': self.feather_type,
            'tags': [tag.name for tag in self.tags] # New field for tags
        }

# This function creates the database tables if they don't exist
with app.app_context():
    db.create_all()

# --- UPDATED: 3a. Create Post Endpoint ---
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'error': 'Missing title or content'}), 400

    new_post = Post(
        title=data['title'],
        content=data['content'],
        feather_type=data.get('feather_type', 'Text')
    )
    
    # NEW: Handle tags in the post creation request
    if 'tags' in data and isinstance(data['tags'], list):
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name.lower()).first()
            if not tag:
                tag = Tag(name=tag_name.lower())
                db.session.add(tag)
            new_post.tags.append(tag)
    
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify(new_post.to_dict()), 201

# --- UPDATED: 3b. Get All Posts Endpoint ---
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    posts_list = [post.to_dict() for post in posts]
    return jsonify(posts_list)

# --- NEW: 3c. Get Posts by Tag Endpoint ---
@app.route('/api/tags/<tag_name>/posts', methods=['GET'])
def get_posts_by_tag(tag_name):
    tag = Tag.query.filter_by(name=tag_name.lower()).first()
    if not tag:
        return jsonify({'message': 'Tag not found'}), 404
        
    posts = tag.posts
    posts_list = [post.to_dict() for post in posts]
    
    return jsonify(posts_list)

# --- NEW: 3d. Get All Tags Endpoint ---
@app.route('/api/tags', methods=['GET'])
def get_all_tags():
    tags = Tag.query.all()
    tags_list = [tag.name for tag in tags]
    return jsonify(tags_list)


# --- 4. Run the Application ---
if __name__ == '__main__':
    app.run(debug=True)