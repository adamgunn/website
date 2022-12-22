import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()

cmd = \
    """
    INSERT INTO posts(title, body)
    VALUES(%s, %s)
    """

try: 
    conn = psycopg2.connect(
        host=os.environ["DB_WRITE_HOSTNAME"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USERNAME"],
        password=os.environ["DB_PASSWORD"]
    )

    cur = conn.cursor()

    cur.execute(cmd, ("Hello World!", "This is my first blog post.",))
    cur.execute(cmd, ("Is this working", "This is my second blog post.",))

    cur.close()
    conn.commit()
except (Exception, psycopg2.DatabaseError) as error:
    print("error:", error)
finally:
    if conn is not None:
        conn.close()