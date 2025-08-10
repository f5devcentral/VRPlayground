import html
from flask import Blueprint, jsonify, request

xss = Blueprint('xss', __name__)

tag_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VR Playground</title>
</head>
<body>
<div id="app">
    <h3>%s</h3>
</div>
</body>
</html>
"""


@xss.route('/tag', methods=['POST'])
def tag():
    res = {}
    try:
        payload = request.json["template"]
        res["result"] = tag_template % payload
    except Exception as e:
        res["error"] = str(e)
        return jsonify(res), 500

    return jsonify(res), 200


link_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VR Playground</title>
</head>
<body>
<div id="app">
    <h3><a href="%s">Link</a></h3>
</div>
</body>
</html>
"""


@xss.route('/link', methods=['POST'])
def link():
    res = {}
    try:
        payload = request.json["url"]
        res["result"] = link_template % html.escape(payload)
    except Exception as e:
        res["error"] = str(e)
        return jsonify(res), 500

    return jsonify(res), 200


event_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VR Playground</title>
</head>
<body>
<div id="app">
    <img src="/img/F5-SRT.png" class="ml-4" style=%s />
</div>
</body>
</html>
"""


@xss.route('/event', methods=['POST'])
def event():
    res = {}
    try:
        payload = request.json["style"]
        res["result"] = event_template % html.escape(payload)
    except Exception as e:
        res["error"] = str(e)
        return jsonify(res), 500

    return jsonify(res), 200


code_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VR Playground</title>
</head>
<body>
<div id="app">
    <pre id="page"></pre>
    <script type="application/javascript">
        document.querySelector("#page").innerText = JSON.stringify(%s, null, 2);
    </script>
</div>
</body>
</html>
"""


@xss.route('/code', methods=['POST'])
def code():
    res = {}
    try:
        payload = request.json["json"]
        res["result"] = code_template % html.escape(payload, quote=False)
    except Exception as e:
        res["error"] = str(e)
        return jsonify(res), 500

    return jsonify(res), 200
