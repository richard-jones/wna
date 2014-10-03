from flask import Flask, request, abort, render_template, redirect, make_response, jsonify, send_file, \
    send_from_directory
from flask.views import View

from portality.core import app
from portality.lib.webapp import custom_static
from portality.runner import start_from_main
from service import models

from portality.modules.es.query import blueprint as query
app.register_blueprint(query, url_prefix='/query')

@app.route("/")
def root():
    return render_template("index.html")

@app.route("/stats")
def stats():
    return render_template("stats.html")

@app.route("/reactor/<reactor_id>")
def reactor(reactor_id):
    r = models.Reactor.pull(reactor_id)
    return render_template("reactor.html", reactor=r, map_key=app.config.get("GOOGLE_MAP_API_KEY"))

@app.route("/map")
def map():
    return render_template("map.html", map_key=app.config.get("GOOGLE_MAP_API_KEY"))

@app.route("/country/<country>")
def nation(country):
    return render_template("country.html", country=country, map_key=app.config.get("GOOGLE_MAP_API_KEY"))

@app.route("/operator/<op>")
def operator(op):
    return render_template("operator.html", operator=op, map_key=app.config.get("GOOGLE_MAP_API_KEY"))

@app.route("/list")
def list_page():
    return render_template("list.html")

# this allows us to override the standard static file handling with our own dynamic version
@app.route("/static/<path:filename>")
def static(filename):
    return custom_static(filename)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404


if __name__ == "__main__":
    #import pydevd
    #pydevd.settrace('localhost', port=51234, stdoutToServer=True, stderrToServer=True)
    #app.run(host=app.config.get("HOST", "0.0.0.0"), debug=False, port=app.config.get("PORT", 5000), threaded=False)
    start_from_main(app)

