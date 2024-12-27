from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost:3306/backend'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# 定义数据库模型
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    major = db.Column(db.String(120), nullable=False)
    union_code = db.Column(db.String(120), nullable=False)


def cors_response(response):
    response.headers['Access-Control-Allow-Origin'] = '*'  # 允许所有域
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'  # 允许 POST 和 OPTIONS 方法
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'  # 允许特定的头部
    return response


@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify(message='Preflight request')
        return cors_response(response)
    if request.method == 'POST':
        data = request.get_json()
        account = data.get('account')
        password = data.get('password')
        user = Users.query.filter_by(account=account).first()
        if user and user.password_hash == password:
            response = jsonify(code=1000, message='Login successful!')
            return cors_response(response)
        else:
            # 如果用户信息不存在或密码不正确，返回错误信息
            response = jsonify(message='Login failed: Invalid account or password')
            response.status_code = 401  # 设置HTTP状态码为401（未授权）
            return cors_response(response)


@app.route('/add', methods=['POST', 'OPTIONS'])
def add():
    if request.method == 'OPTIONS':
        # 处理预检请求
        response = jsonify(message='Preflight request')
        return cors_response(response)
    if request.method == 'POST':
        data = request.get_json()
        number = data.get('number')
        name = data.get('name')
        major = data.get('major')
        union_code = data.get('union_code')
        if not number or not name or not major or not union_code:
            response = jsonify(message='Missing data')
            response.status_code = 400
            return cors_response(response)
        student = Student(number=number, name=name, major=major, union_code=union_code)
        db.session.add(student)
        try:
            db.session.commit()
            response = jsonify(code=1010, message='Add successful')
            return cors_response(response)
        except Exception as e:
            db.session.rollback()
            response = jsonify(message=f'Add failed: {str(e)}')
            response.status_code = 500
            return cors_response(response)


@app.route('/sub', methods=['POST', 'OPTIONS'])
def sub():
    if request.method == 'OPTIONS':
        response = jsonify(message='Preflight request')
        return cors_response(response)

    if request.method == 'POST':
        data = request.get_json()
        number = data.get('number')
        student = Student.query.filter_by(number=number).first()
        if student:
            db.session.delete(student)
            db.session.commit()
            response = jsonify(code=1020, message='Sub successful')
            return cors_response(response)
        else:
            response = jsonify(code=1021, message='Student not found')
            response.status_code = 404
            return cors_response(response)


@app.route('/update', methods=['POST', 'OPTIONS'])
def update():
    if request.method == 'OPTIONS':
        response = jsonify(message='Preflight request')
        return cors_response(response)
    if request.method == 'POST':
        data = request.get_json()
        number = data.get('number')
        student = Student.query.filter_by(number=number).first()
        if student:
            student.name = data.get('name', student.name)
            student.major = data.get('major', student.major)
            student.union_code = data.get('union_code', student.union_code)
            db.session.commit()
            response = jsonify(code=1030, message='Updated successfully')
            return cors_response(response)
        else:
            response = jsonify(code=1031, message='Student not found')
            response.status_code = 404
            return cors_response(response)


@app.route('/query', methods=['POST', 'OPTIONS'])
def query():
    if request.method == 'OPTIONS':
        response = jsonify(message='Preflight request')
        return cors_response(response)
    if request.method == 'POST':
        data = request.get_json()
        number = data.get('number')
        student = Student.query.filter_by(number=number).first()
        if student:
            student_info = {
                'number': student.number,
                'name': student.name,
                'major': student.major,
                'union_code': student.union_code
            }
            response = jsonify(code=1040, message='Query successful', data=student_info)
            return cors_response(response)
        else:
            # 如果学生信息不存在，返回错误信息
            response = jsonify(code=1041, message='Student not found')
            response.status_code = 404
            return cors_response(response)


# with app.app_context():
#     db.create_all()


if __name__ == '__main__':
    app.run()
