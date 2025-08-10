import mariadb
from .database import Database


class MariaDB(Database):
    def __init__(self, username="root", password="Oradoc_db1", host="localhost", database="tempdb"):
        super().__init__(username=username, password=password, host=host, database=database)

    def execute(self, query):
        try:
            return super().execute(query)
        except mariadb.OperationalError:
            self.connection = self.connect()
        return super().execute(query)

    def connect(self):
        connection = mariadb.connect(
            host=self.host,
            user=self.username,
            password=self.password,
            database=self.database,
        )
        connection.autocommit = True
        return connection
