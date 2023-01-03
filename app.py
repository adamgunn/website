from flask import Flask, jsonify, render_template, request, redirect, url_for, session, abort, Response, json
import os
import psycopg2
import psycopg2.pool
import uuid
import hashlib
from dotenv import load_dotenv
import time
import random
from waitress import serve

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ["SECRET_KEY"]

write_connection_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=20,
    host=os.environ["DB_WRITE_HOSTNAME"],
    port=os.environ["DB_PORT"],
    dbname=os.environ["DB_NAME"],
    user=os.environ["DB_USERNAME"],
    password=os.environ["DB_PASSWORD"]
)

read_connection_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=20,
    host=os.environ["DB_READ_HOSTNAME"],
    port=os.environ["DB_PORT"],
    dbname=os.environ["DB_NAME"],
    user=os.environ["DB_USERNAME"],
    password=os.environ["DB_PASSWORD"]
)

def get_write_connection():
    return write_connection_pool.getconn()

def get_read_connection():
    return read_connection_pool.getconn()

def release_write_connection(conn):
    return write_connection_pool.putconn(conn)

def release_read_connection(conn):
    return read_connection_pool.putconn(conn)

def hash_password(password, salt=None):
    algorithm = 'sha512'
    if salt is None:
        salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    return "$".join([algorithm, salt, password_hash])

def image_location(index, letter=None, punc=False):
    if punc:
        return f'images/magazine/punctuation/{index}.png'
    return f'images/magazine/letters/{letter}{index}.png'

@app.route("/")
def index():
    NUM_PICS = {
        "A": 10,
        "D": 8,
        "M": 8,
        "G": 9,
        "U": 8,
        "N": 5,
        "PUNC": 26
    }
    letters = []
    letters.append(image_location(random.randrange(NUM_PICS["A"]), letter="A"))
    letters.append(image_location(random.randrange(NUM_PICS["D"]), letter="D"))
    letters.append(image_location(random.randrange(NUM_PICS["A"]), letter="A"))
    while letters[2] == letters[0]:
        letters[2] = image_location(random.randrange(NUM_PICS["A"]), letter="A")
    letters.append(image_location(random.randrange(NUM_PICS["M"]), letter="M"))
    letters.append(image_location(random.randrange(NUM_PICS["G"]), letter="G"))
    letters.append(image_location(random.randrange(NUM_PICS["U"]), letter="U"))
    letters.append(image_location(random.randrange(NUM_PICS["N"]), letter="N"))
    letters.append(image_location(random.randrange(NUM_PICS["N"]), letter="N"))
    while letters[7] == letters[6]:
        letters[7] = image_location(random.randrange(NUM_PICS["N"]), letter="N")
    punctuation = image_location(random.randrange(NUM_PICS["PUNC"]), punc=True)
    context = {
        "letters": letters,
        "punctuation": punctuation
    }
    return render_template('home.html', **context)

@app.route("/home/")
def redirect_home():
    return redirect(url_for('index'))

@app.route("/api/")
def api_index():
    return redirect(url_for('show_login'))

@app.route("/api/posts/")
def get_posts():
    conn = get_read_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM posts
        ORDER BY postid DESC;
        """
    )
    posts = cur.fetchall()
    posts = format_posts(posts)
    release_read_connection(conn)
    resp = Response(json.dumps(posts), mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/api/login/", methods=['POST'])
def handle_login():
    username = request.form['username']
    password = request.form['password']
    if not username or not password:
        return redirect(url_for('show_login'))
    conn = get_read_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM users
        WHERE username = %s
        """,
        (username,)
    )
    result = cur.fetchone()
    release_read_connection(conn)
    if result is None:
        return redirect(url_for('show_login'))
    db_password = result[1]
    db_password_components = db_password.split('$')
    hashed_password = hash_password(
        password, db_password_components[1])
    if hashed_password == db_password:
        session['username'] = username
        return redirect(url_for('show_new'))
    else:
        return redirect(url_for('show_login'))


@app.route("/api/login/", methods=['GET'])
def show_login():
    if 'username' in session and session['username'] == os.environ['ADMIN_USERNAME']:
        return redirect(url_for('show_new'))
    return render_template('login.html')

@app.route("/api/new/", methods=['GET'])
def show_new():
    if 'username' not in session or session['username'] != os.environ['ADMIN_USERNAME']:
        return redirect(url_for('show_login'))
    return render_template('new.html')

@app.route("/api/new/", methods=['POST'])
def handle_new():
    if 'username' not in session:
        return abort(401)
    if session['username'] != os.environ['ADMIN_USERNAME']:
        return abort(403)
    title = request.form['title']
    body = request.form['body']
    if not title or not body:
        return abort(400)
    conn = get_write_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO posts(title, body)
        VALUES(%s, %s)
        """,
        (title, body, )
    )
    cur.close()
    conn.commit()
    release_write_connection(conn)
    return jsonify({
        "msg": "success"
    }), 200

def format_posts(posts):
    new_posts = []
    for post in posts:
        post_id, title, body, created = post
        new_posts.append({
            "post_id": post_id,
            "title": title,
            "body": body,
            "created": time.mktime(created.timetuple())
        })
    return new_posts


@app.route("/api/delete/", methods=['GET'])
def show_delete():
    if 'username' not in session or session['username'] != os.environ['ADMIN_USERNAME']:
        return redirect(url_for('show_login'))
    conn = get_read_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM posts
        ORDER BY postid DESC;
        """
    )
    posts = cur.fetchall()
    posts = format_posts(posts)
    release_read_connection(conn)
    context = {
        "posts": posts
    }
    return render_template('delete.html', **context)

@app.route("/api/delete/", methods=['POST'])
def handle_delete():
    if 'username' not in session:
        return abort(401)
    if session['username'] != os.environ['ADMIN_USERNAME']:
        return abort(403)
    post_id = int(request.form['post_id'])
    if not post_id:
        return abort(400)
    conn = get_write_connection()
    cur = conn.cursor()
    cur.execute(
        """
        DELETE FROM posts
        WHERE postid = %s
        """,
        (post_id,)
    )
    cur.close()
    conn.commit()
    release_write_connection(conn)
    return redirect(url_for('show_delete'))

@app.route("/api/logout/", methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('show_login'))

@app.route("/<page>/")
def render_static_page(page):
    pages = [
        "about",
        "blog",
        "portfolio",
        "resume",
        "pong",
        "snowman"
    ]
    if page in pages:
        return render_template(page + ".html")
    else:
        return abort(404)


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8080)
