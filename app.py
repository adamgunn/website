from flask import Flask, jsonify, render_template, request, redirect, url_for, session, abort, Response
import os
import psycopg2
import psycopg2.pool
import uuid
import hashlib
from dotenv import load_dotenv
import time
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

@app.route("/")
def greet():
    return "<p>Welcome to the backend of my website!!!!!!!</p>"

@app.route("/posts")
def get_posts():
    conn = get_read_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM posts
        """
    )
    posts = cur.fetchall()
    posts = format_posts(posts)
    release_read_connection(conn)
    return jsonify({
        "posts": posts
    })

@app.route("/login", methods=['POST'])
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
        print("correct password")
        return redirect(url_for('show_new'))
    else:
        return redirect(url_for('show_login'))


@app.route("/login", methods=['GET'])
def show_login():
    return render_template('login.html')

@app.route("/new", methods=['GET'])
def show_new():
    if 'username' not in session or session['username'] != os.environ['ADMIN_USERNAME']:
        return redirect(url_for('show_login'))
    return render_template('new.html')

@app.route("/new", methods=['POST'])
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


@app.route("/delete", methods=['GET'])
def show_delete():
    if 'username' not in session or session['username'] != os.environ['ADMIN_USERNAME']:
        return redirect(url_for('show_login'))
    conn = get_read_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM posts
        """
    )
    posts = cur.fetchall()
    posts = format_posts(posts)
    release_read_connection(conn)
    context = {
        "posts": posts
    }
    return render_template('delete.html', **context)

@app.route("/delete", methods=['POST'])
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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080, extra_files=["static/style.css"])