from flask import Flask, request, render_template, url_for, redirect
import json

app = Flask(__name__)

@app.before_request
def before():
   print("Before request")

@app.after_request
def after(response):
   print("After request")
   return response

@app.route("/")
def hello_world():
   return "<p>Hello, World!</p>"

@app.route("/<int:counter>")
def count(counter):
   l = [str(i) for i in range(1, counter + 1)]
   s = ", ".join(l)
   return f"<p>Counter: {s}</p>"

@app.get("/login/<username>")
def login_get(username):
   datos = {
      "username": username,
      "title": "Login"
   }
   return render_template('login.html', datos=datos)

@app.post("/login")
def login_post():
   JSdata = json.loads(request.data)
   print(JSdata)
   return "aaa\n"

@app.get("/endpoint")
def endpoint():
   return {
      "k1": "v1",
      "k2": "v2"
   }

@app.get("/query_params") # Thi is a query param /query_params?a=1&b=2
def query_params():
   ls = [f"{item[0]}: {item[1]}" for item in request.args.items()]
   return  "<ul><li>" + "</li><li>".join(ls) + "</li></ul>"

def error_page(error):
   return f"<h1>Page Not Found</h1>", 404

@app.get("/logout")
def logout():
   return redirect(url_for('login_get', username="Jesus"))

app.register_error_handler(404, error_page)