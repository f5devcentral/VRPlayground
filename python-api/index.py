import pickle
import base64
from jinja2 import Template
from flask import Flask, request, jsonify
from sql_injection import sql_injection
from csti import csti
from xss import xss

app = Flask(__name__)
app.register_blueprint(csti, url_prefix='/csti')
app.register_blueprint(xss, url_prefix='/xss')
app.register_blueprint(sql_injection, url_prefix='/sql-injection')


@app.route('/deserialization/pickle', methods=['POST'])
def deserialization():
    res = {}
    try:
        payload = request.json["object"]
        buffer = base64.b64decode(payload)
        res["result"] = repr(pickle.loads(buffer))
    except Exception as e:
        res["error"] = str(e), 500

    return jsonify(res), 200


@app.route('/ssti/jinja', methods=['POST'])
def ssti():
    res = {}
    try:
        payload = request.json["template"]
        res["result"] = Template(payload).render()
    except Exception as e:
        res["error"] = str(e), 500

    return jsonify(res), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
