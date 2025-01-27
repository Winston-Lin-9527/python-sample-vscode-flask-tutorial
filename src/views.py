from datetime import datetime
from flask import Flask, render_template
from . import app

from flask import request, jsonify, make_response
import sys
import random
import string

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/about/")
def about():
    return render_template("about.html")

@app.route("/contact/")
def contact():
    return render_template("contact.html")

@app.route("/hello/")
@app.route("/hello/<name>")
def hello_there(name = None):
    return render_template(
        "hello_there.html",
        name=name,
        date=datetime.now()
    )

@app.route("/api/data")
def get_data():
    return app.send_static_file("data.json")


# for notes CRUD
notes = []

@app.post('/send_note')
def recv_note():
    json_data = request.json
    uuid = ''.join(random.choice(string.ascii_uppercase+string.digits) for _ in range(5))
    notes.append({'uuid':uuid, 'data':json_data})
    print(notes, file=sys.stdout)
    return jsonify(uuid=uuid)

@app.post('/search_note')
def search_note():
    noteUUID = request.json['note_uuid']
    x = list(filter(lambda n: n['uuid']==noteUUID, notes))
    res = {}
    if not x:
        print('note ' + noteUUID + ' not found')
        return jsonify(status='fail'), 404
    else:
        res['status']='ok'
        res['data'] = x[0]['data']
        print(res)
        return jsonify(res)


@app.route("/daily_note", methods=['GET'])
def hello_world():
    now = datetime.now()
    return "Current date and time : " + now.strftime("%Y-%m-%d %H:%M:%S")
