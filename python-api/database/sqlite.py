import sqlite3
from .database import Database


class SQLite(Database):
    def __init__(self):
        super().__init__(username=None, password=None, host=None, database=None)

    def connect(self):
        connection = sqlite3.connect(":memory:", check_same_thread=False)
        connection.isolation_level = None
        return connection
