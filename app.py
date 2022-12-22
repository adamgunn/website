from flask import Flask
import flask
import os
import psycopg2
import psycopg2.pool

app = Flask(__name__)

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
    release_read_connection(conn)
    return flask.jsonify({
        "posts": posts
    })

@app.route("/login", methods=['POST'])
def handle_login():
    ...