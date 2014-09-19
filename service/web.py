from flask import Flask, request, abort, render_template, redirect, make_response, jsonify, send_file, \
    send_from_directory
from flask.views import View

from portality.core import app
from portality.lib.webapp import custom_static
from portality.runner import start_from_main

from portality.modules.es.query import blueprint as query
app.register_blueprint(query, url_prefix='/query')

@app.route("/")
def root():
    return render_template("index.html")

@app.route("/stats")
def stats():
    return render_template("stats.html")

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

