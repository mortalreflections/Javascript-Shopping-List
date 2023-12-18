import flask_login
from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_user,UserMixin
from werkzeug.security import generate_password_hash,check_password_hash
from flask_cors import CORS


app=Flask(__name__)
CORS(app)


login_manager=flask_login.LoginManager()
login_manager.init_app(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///todo.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS ']=False
app.config['SECRET_KEY']='secretissecret'
db=SQLAlchemy(app)


class Users(db.Model,UserMixin):
    __tablename__='users'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(20),unique=True)
    email=db.Column(db.String(30),unique=True)
    password=db.Column(db.String(20))
    todos=db.relationship('Todos',backref='users')

class Todos(db.Model,UserMixin):
    __tablename__='todos'
    id=db.Column(db.Integer,primary_key=True)
    todo=db.Column(db.String(100))
    completed=db.Column(db.Boolean,default=False)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'))

with app.app_context():
    if len(Users.query.all())==0:
        user=Users(name='Srini',email='srini@gmail.com',password=generate_password_hash(('12345')))
        db.session.add(user)
        db.session.commit()
    db.create_all()

@login_manager.user_loader
def load_user(id):
    return Users.query.get(id)


@app.route('/login',methods=['POST'])
def login():
    login_form=request.json
    email_id=login_form['email']
    password=login_form['password']
    user=Users.query.filter_by(email=email_id).first()

    if user and check_password_hash(user.password,password):
        login_user(user)
        return {'message':'login success'},200
    return {'message':'Unauthorized'},401

@app.route('/<user_id>/todos',methods=['GET'])
def todos(user_id):
    todos=db.session.query(Todos.todo).filter(Todos.user_id==user_id).all()
    print(todos)
    return 'success',200

@app.route('/<user_id>/add_todo',methods=['POST'])
def add_todos(user_id):
    todo_form=request.json
    todo=Todos(todo=todo_form['todo'],user_id=user_id)
    db.session.add(todo)
    db.session.commit()
    return 'Todo added successfully',200

@app.route('/<user_id>/update_todo',methods=['UPDATE'])
def update_todo(user_id):
    todo_form=request.json
    update_todo_id=todo_form['todo_id']
    todo=db.session.query(Todos.todo).filter(Todos.id==update_todo_id).first()
    print(todo)
    return 'todo updated successfully',200

@app.route('/<user_id>/delete_todo',methods=['DELETE'])
def delete_todo(user_id):
    return 'delete todo',200




if __name__=='__main__':
    app.run(debug=True)
