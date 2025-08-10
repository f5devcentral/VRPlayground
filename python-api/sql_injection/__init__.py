import os
from flask import Blueprint, jsonify, request

from database import MariaDB, SQLite, extract_error_message

sql_injection = Blueprint('sql-injection', __name__)

databases = {
    "sqlite": SQLite(),
    "mariadb": MariaDB(host=os.getenv("MARIADB_HOST", "localhost")),
}


def sqli(typ):
    res = {}
    database = request.args.get("database", "mariadb")
    query = request.args.get("query", "SELECT * FROM users WHERE id = {id}")
    try:
        db = databases[database]
        lines = db.execute(query.format(**request.json))
        res["result"] = lines
        match typ:
            case "blind":
                res["result"] = "blind"
            case "boolean":
                res["result"] = str(bool(len(lines)))
            case "error":
                res["result"] = "no error"
    except Exception as e:
        try:
            res["error"] = extract_error_message(database, e)
        except:
            res["error"] = str(e)
            return jsonify(res), 500

    return jsonify(res), 200

@sql_injection.route('/union', methods=['POST'])
def sqli_union():
   return sqli("union")

@sql_injection.route('/error', methods=['POST'])
def sqli_error():
   return sqli("error")

@sql_injection.route('/blind', methods=['POST'])
def sqli_blind():
   return sqli("blind")

@sql_injection.route('/boolean', methods=['POST'])
def sqli_boolean():
   return sqli("boolean")
