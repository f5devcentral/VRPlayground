import html
from flask import Blueprint, jsonify, request, make_response

csti = Blueprint('csti', __name__)

vue_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VR Playground</title>
</head>
<body>
<div id="app">
    <h3>%s</h3>
</div>
<script src="//unpkg.com/vue@3.2.20"></script>
<script>
    const app = Vue.createApp({})
    app.mount('#app')
</script>
</body>
</html>
"""


@csti.route('/vue', methods=['POST'])
def vue():
    res = {}
    try:
        payload = request.json["template"]
        response = make_response(vue_template % html.escape(payload))
        response.headers["Content-Type"] = "text/html"
        return response
    except Exception as e:
        res["error"] = str(e)
        return jsonify(res), 500


angular_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VR Playground</title>
</head>
<body>
<div ng-app>
    <h3>%s</h3>
</div>
<script src="//code.angularjs.org/1.5.5/angular.min.js"></script>
</body>
</html>
"""


@csti.route('/angularjs', methods=['GET'])
def angularjs():
    res = {}
    try:
        payload = request.args["template"]
        response = make_response(angular_template % html.escape(payload))
        response.headers["Content-Type"] = "text/html"
        return response
    except Exception as e:
        res["error"] = str(e)
        return jsonify(res), 500
