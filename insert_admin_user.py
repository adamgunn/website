import psycopg2
import os
import uuid
import hashlib
from dotenv import load_dotenv
load_dotenv()

cmd = \
    """
    INSERT INTO users(username, password)
    VALUES(%s, %s)
    """

def hash_password(password, salt=None):
    algorithm = 'sha512'
    if salt is None:
        salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    return "$".join([algorithm, salt, password_hash])

try: 
    conn = psycopg2.connect(
        host=os.environ["DB_WRITE_HOSTNAME"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USERNAME"],
        password=os.environ["DB_PASSWORD"]
    )

    cur = conn.cursor()
    
    cur.execute(cmd, (os.environ["ADMIN_USERNAME"], hash_password(os.environ["ADMIN_PASSWORD"]),))

    cur.close()
    conn.commit()
except (Exception, psycopg2.DatabaseError) as error:
    print("error:", error)
finally:
    if conn is not None:
        conn.close()