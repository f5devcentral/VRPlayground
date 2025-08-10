class Database(object):
    def __init__(self, username, password, host, database):
        self.host = host
        self.username = username
        self.password = password
        self.database = database
        self.connection = None

    def init(self):
        # Remove table `users` if exist, ignore if fails
        try:
            self.execute("DROP TABLE users")
        except Exception:
            pass

        # Create `users` table
        self.execute("""
            CREATE TABLE users (
                id INT PRIMARY KEY,
                username VARCHAR(30) NOT NULL,
                password VARCHAR(30) NOT NULL
            )
        """)

        # Insert users
        self.execute("INSERT INTO users (id, username, password) VALUES (1, 'admin', 'admin')")
        self.execute("INSERT INTO users (id, username, password) VALUES (2, 'user', 'user')")
        self.execute("INSERT INTO users (id, username, password) VALUES (3, 'guest', 'guest')")

    def reset(self):
        return self.init()

    def connect(self):
        pass

    def disconnect(self):
        self.connection.close()

    def execute(self, query):
        if not self.connection:
            self.connection = self.connect()
            self.init()

        cursor = self.connection.cursor()
        error = None
        res = []

        try:
            cursor.execute(query)
            try:
                res = cursor.fetchall()
            except Exception:
                pass
        except Exception as ex:
            error = ex
        finally:
            cursor.close()

        if error:
            raise error

        return res
