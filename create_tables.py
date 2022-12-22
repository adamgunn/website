import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()
cmds = \
    """
    CREATE TABLE posts (
        postid SERIAL PRIMARY KEY,
        title VARCHAR(256) NOT NULL,
        body VARCHAR(1024) NOT NULL,
        created TIMESTAMP DEFAULT NOW()
    )
    """, \
    """
    CREATE TABLE users (
        username VARCHAR(20) NOT NULL PRIMARY KEY,
        password VARCHAR(256) NOT NULL
    )
    """
conn = None
try: 
    conn = psycopg2.connect(
        host=os.environ["DB_WRITE_HOSTNAME"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USERNAME"],
        password=os.environ["DB_PASSWORD"]
    )

    cur = conn.cursor()


    for cmd in cmds:
        cur.execute(cmd)

    cur.close()
    conn.commit()
except (Exception, psycopg2.DatabaseError) as error:
    print("error:", error)
finally:
    if conn is not None:
        conn.close()