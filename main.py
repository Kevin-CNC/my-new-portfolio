import flask
from flask import *

app = flask.Flask(__name__)

app.static_folder = 'static'
app.template_folder = 'pages'


@app.route('/')
def home():
    return render_template('main.html')

# FLASK Error handlers
@app.errorhandler(404)
def page_not_found(_):
    return render_template('404.html')

app.run(debug=True)