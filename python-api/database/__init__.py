from .sqlite import SQLite
from .mariadb import MariaDB


def extract_error_message(database, error):
    message = error.args[-1]
    if database in ["mariadb", "mssql"]:
        message = error.args[1]

    if database == "mssql":
        message = message.decode()

    if database == "oracledb":
        message = str(message)

    return message
