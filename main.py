from flask import Flask, render_template, redirect, request, url_for, session, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from datetime import datetime
import requests
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Configuração do banco de dados MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Substitua pelo seu usuário do MySQL
app.config['MYSQL_PASSWORD'] = 'LucasPlay123'  # Substitua pela sua senha do MySQL
app.config['MYSQL_DB'] = 'meu_banco_tcc'  # Substitua pelo nome do seu banco de dados
app.secret_key = 'sua_chave_secreta_aqui'
app.permanent_session_lifetime = timedelta(days=7)

# Inicializando o MySQL
mysql = MySQL(app)


@app.route('/')
def home():
    print(session.get('cargo'))
    session.permanent = True
    username = session.get('username')

    if username:
        print(session['username'])
        cursor = mysql.connection.cursor()
        cursor.execute("""
        SELECT p.id, p.titulo, p.texto, p.cargo, p.materia, p.data_de_publicacao,
        COUNT(cp.id) AS curtidas, u.nome_de_usuario
        FROM perguntas p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN curtidas cp ON p.id = cp.comentario_id
        GROUP BY p.id
        ORDER BY p.data_de_publicacao DESC;
        """)
        perguntas = cursor.fetchall()

        cursor.execute("""
        SELECT nome_de_usuario, pontos
        FROM usuarios
        ORDER BY pontos DESC
        """)
        usuarios = cursor.fetchall()

        cursor.execute("""
        SELECT n.id, n.tipo, n.comentario_id, n.data_criacao, u.nome_de_usuario AS remetente
        FROM notificacoes n
        JOIN usuarios u ON n.remetente_id = u.id
        WHERE n.destinatario_id = %s
        ORDER BY n.data_criacao DESC
        """, (session.get('user_id'),))
        notificacoes = cursor.fetchall()
        cursor.close()
        return render_template('home.html', perguntas=perguntas, usuarios=usuarios, username=username, notificacoes=notificacoes)
    else:
        return redirect(url_for('login'))
    
@app.route('/question/add')
def question_create_page():
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT n.id, n.tipo, n.comentario_id, n.data_criacao, u.nome_de_usuario AS remetente
        FROM notificacoes n
        JOIN usuarios u ON n.remetente_id = u.id
        WHERE n.destinatario_id = %s
        ORDER BY n.data_criacao DESC
        """, (session.get('user_id'),))
    notificacoes = cursor.fetchall()
    return render_template('question_create.html', notificacoes = notificacoes)

@app.route('/register', methods=['GET', 'POST'])
def register():

    if session.get('cargo') == "ADMINISTRADOR":

        if request.method == 'POST':
            name = request.form.get('name')
            username = request.form.get('username')
            position = request.form.get('position')
            password = request.form.get('password')
            hash_password = generate_password_hash(password)
            email = request.form.get('email')

            cursor = mysql.connection.cursor()
            
            cursor.execute("SELECT * FROM usuarios WHERE nome_de_usuario = %s", (username,))
            user = cursor.fetchone()
            
            if user:
                return "Usuário já existe. Escolha outro nome."
            elif email == '':
                email = None

                cursor.execute("INSERT INTO usuarios (nome, nome_de_usuario, cargo, senha, email) VALUES (%s, %s, %s, %s, %s)", (name, username, position, hash_password, email))
                mysql.connection.commit()
                cursor.close()
                return redirect(url_for('home'))  
            
        
        return render_template('register.html')
    else:
        return redirect(url_for('login'))

@app.route('/login', methods = ['GET', 'POST'])
def login():
    erro = False
    if request.method == 'POST':
        nome = request.form.get('nome')
        senha = request.form.get('senha')
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nome_de_usuario = %s", (nome,))
        user = cursor.fetchone()  
        cursor.close()  

        if user and check_password_hash(user[3], senha):  
            if user[5] == 'ADMINISTRADOR':
                session['cargo'] = 'ADMINISTRADOR'
            elif user[5] == 'PROFESSOR':
                session['cargo'] = 'PROFESSOR'
            elif user[5] == 'MONITOR':
                session['cargo'] = 'MONITOR'
            else:
                session['cargo'] = 'ALUNO'

            session['username'] = nome
            session['user_id'] = user[0]
            return redirect(url_for('home'))
            erro = False
        else:
            erro = True
    
    return render_template('login.html', erro=erro)

@app.route('/logout')
def logout():
    if session.get('username'):
        session.clear()

    return redirect(url_for('login'))


@app.route('/@<username>')
def profile(username):
    
    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM usuarios WHERE nome_de_usuario = %s", (username,))
    user = cursor.fetchone()

    cursor.execute("""
        SELECT n.id, n.tipo, n.comentario_id, n.data_criacao, u.nome_de_usuario AS remetente
        FROM notificacoes n
        JOIN usuarios u ON n.remetente_id = u.id
        WHERE n.destinatario_id = %s
        ORDER BY n.data_criacao DESC
        """, (session.get('user_id'),))
    notificacoes = cursor.fetchall()
    cursor.close()

    if user is None:
        return "Usuário não encontrado", 404
    
    if username == session.get('username'):
        return render_template('profile.html', user=user, notificacoes = notificacoes)
    else:
        return render_template('user_page.html', user=user, notificacoes=notificacoes)


@app.route("/settings/customization")
def customization_settings():

    return render_template("customization.html")

@app.route("/settings/interactions")
def interactions_settings():
    cursor = mysql.connection.cursor()
    id = session.get('user_id')

    cursor.execute("""
    SELECT 
    p.id, 
    p.titulo, 
    p.texto, 
    p.cargo, 
    p.materia, 
    p.data_de_publicacao,
    u.nome_de_usuario
    FROM perguntas p
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.usuario_id = %s
    ORDER BY p.data_de_publicacao DESC;
    """, (id,))

    perguntas = cursor.fetchall()
    cursor.execute("""
    SELECT 
    r.id, 
    r.texto, 
    r.cargo, 
    r.data_postagem,
    u.nome_de_usuario
    FROM respostas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.usuario_id = %s
    ORDER BY r.data_postagem DESC;
    """, (id,))
    respostas = cursor.fetchall()

    cursor.execute("""
    SELECT 
    c.id AS curtida_id,
    c.comentario_id,
    c.data_criacao,
    cm.texto AS comentario,
    dono.id AS dono_comentario_id,
    dono.nome_de_usuario AS dono_comentario
    FROM curtidas c
    JOIN perguntas cm ON c.comentario_id = cm.id
    JOIN usuarios dono ON cm.usuario_id = dono.id
    WHERE c.usuario_id = %s
    ORDER BY c.data_criacao DESC;
    """, (id,))
    curtidas = cursor.fetchall()
    cursor.close()

    return render_template("interactions.html", perguntas = perguntas, respostas = respostas, curtidas= curtidas)

@app.route('/update-infos/<int:id>', methods = ['GET', 'POST'])
def update(id):
    if request.method == 'POST':
        new_user = {
            'new_name': request.form.get('new_name'),
            'new_username': request.form.get('new_username'),
            'new_password': request.form.get('new_password'), 
            'new_email': request.form.get('new_email')
        }

        cursor = mysql.connection.cursor()
        session['username'] = new_user['new_username']

        cursor.execute("""
            UPDATE usuarios
            SET nome = %s, nome_de_usuario = %s, senha = %s, email = %s
            WHERE id = %s
            """, (new_user['new_name'], new_user['new_username'], new_user['new_password'], new_user['new_email'], id))
        
        mysql.connection.commit()
        cursor.close()
        
    return redirect(url_for('profile', username = session['username']))

@app.route('/create-question', methods = ['GET', 'POST'])
def create_question():
    if request.method == 'POST':
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nome_de_usuario = %s", (session.get('username'),))
        usuario = cursor.fetchone()
        usuario_id = usuario[0]

        pergunta = {
            "titulo": request.form.get("question-title"),
            "texto": request.form.get("question-text"),
            "cargo": session.get('cargo'),
            "materia": request.form.get("materia"),
            "usuario_id": usuario_id,
        }

        cursor.execute(
            "INSERT INTO perguntas (titulo, texto, cargo , materia, usuario_id) VALUES (%s, %s, %s, %s, %s)",
            (pergunta['titulo'], pergunta['texto'], pergunta['cargo'], pergunta['materia'], pergunta['usuario_id'])
        )
        mysql.connection.commit()
        cursor.close()

    else:
        pass

    return redirect(url_for('home'))

@app.route("/like/<int:comentario_id>", methods=["POST"])
def like_comment(comentario_id):
    user_id = session.get("user_id")
    if not user_id:
        return {"status": "error", "message": "Você precisa estar logado"}, 401

    cursor = mysql.connection.cursor()

    cursor.execute("""
    SELECT id FROM curtidas
    WHERE usuario_id = %s AND comentario_id = %s
    """, (user_id, comentario_id))
    curtida = cursor.fetchone()

    if curtida:
        cursor.execute("""
        DELETE FROM curtidas
        WHERE usuario_id = %s AND comentario_id = %s
        """, (user_id, comentario_id))
        cursor.execute("""
        SELECT usuario_id FROM perguntas
        WHERE id = %s
        """, (comentario_id,))
        usuario_id = cursor.fetchone()

        cursor.execute("""
        UPDATE usuarios
        SET pontos = pontos - 10
        WHERE id = %s
        """, (usuario_id[0],))
        action = "unliked"
        
    else:
        cursor.execute("""
        INSERT INTO curtidas (usuario_id, comentario_id)
        VALUES (%s, %s)
        """, (user_id, comentario_id))

        cursor.execute("""
        SELECT usuario_id FROM perguntas
        WHERE id = %s
        """, (comentario_id,))
        usuario_id = cursor.fetchone()

        cursor.execute("""
        UPDATE usuarios
        SET pontos = pontos + 10
        WHERE id = %s
        """, (usuario_id[0],))
        action = "liked"

    cursor.execute("SELECT usuario_id FROM perguntas WHERE id = %s", (comentario_id,))
    dono_comentario = cursor.fetchone()
    if dono_comentario and dono_comentario[0] != user_id:
        cursor.execute("""
        INSERT INTO notificacoes (remetente_id, tipo, destinatario_id, comentario_id)
        VALUES (%s, %s, %s, %s)
        """, (user_id, "curtida", dono_comentario[0], comentario_id,))

    mysql.connection.commit()
    cursor.close()

    return {"status": "success", "action": action}

@app.route('/comment/id=<int:pergunta_id>')
def show_responses(pergunta_id):
    
    print(pergunta_id)

    cursor = mysql.connection.cursor()

    cursor.execute("""
            SELECT p.id, p.titulo, p.texto, p.cargo, p.materia, p.data_de_publicacao, u.nome_de_usuario
            FROM perguntas p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = %s
            ORDER BY p.data_de_publicacao DESC
        """, (pergunta_id,))
    pergunta = cursor.fetchone()

    cursor.execute("""
    SELECT r.id, r.texto, r.cargo, r.data_postagem, r.usuario_id, u.nome_de_usuario
    FROM respostas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.pergunta_id = %s
    ORDER BY r.data_postagem DESC
    """, (pergunta_id,))

    respostas = cursor.fetchall()

    cursor.execute("""
        SELECT n.id, n.tipo, n.comentario_id, n.data_criacao, u.nome_de_usuario AS remetente
        FROM notificacoes n
        JOIN usuarios u ON n.remetente_id = u.id
        WHERE n.destinatario_id = %s
        ORDER BY n.data_criacao DESC
        """, (session.get('user_id'),))
    notificacoes = cursor.fetchall()

    cursor.close()


    return render_template('comment_response.html', pergunta = pergunta, respostas=respostas, notificacoes = notificacoes)

@app.route('/answer/comment/id=<int:pergunta_id>', methods = ['GET', 'POST'])
def post_answer(pergunta_id):
    print(f'id do comentario: {pergunta_id}')
    resposta = {
        "texto": request.form.get('comment-response'),
        "usuario_id": session.get('user_id'),
        "cargo": session.get('cargo')
    }
    

    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO respostas (texto, cargo, pergunta_id, usuario_id) VALUES (%s, %s, %s, %s)',
        (resposta['texto'], resposta['cargo'], pergunta_id, resposta['usuario_id'])
    )

    cursor.execute('SELECT usuario_id FROM perguntas WHERE id = %s', (pergunta_id,))
    destinatario = cursor.fetchone()
    if destinatario:
        cursor.execute('INSERT INTO notificacoes (remetente_id, tipo, destinatario_id, comentario_id) VALUES (%s, %s, %s, %s)',
            (session.get('user_id'), 'resposta', destinatario[0], pergunta_id, )
        )

    mysql.connection.commit()

    cursor.close()
    
    return redirect(url_for('show_responses', pergunta_id = pergunta_id))

@app.route('/delete/comment/id=<int:comentario_id>')
def delete_comment(comentario_id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM perguntas WHERE id = %s", (comentario_id,))
    mysql.connection.commit()
    cursor.close()

    return redirect(url_for("home"))

@app.route('/search', methods = ['GET', 'POST'])
def search():
    pesquisa = request.form.get("search-input")
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT p.id, p.titulo, p.texto, p.cargo, p.materia, p.data_de_publicacao, u.nome_de_usuario
        FROM perguntas p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.texto LIKE %s
        ORDER BY p.data_de_publicacao DESC
    """, (f"%{pesquisa}%",))
    perguntas = cursor.fetchall()


    cursor.execute("""
        SELECT nome_de_usuario, pontos
        FROM usuarios
        """)
    usuarios = cursor.fetchall()

    cursor.close()


    return render_template('home.html', perguntas=perguntas, pesquisa=pesquisa, usuarios=usuarios)

@app.route('/filter/subject')
def filter_subject():
    materia = request.args.get('materia')
    cursor = mysql.connection.cursor()

    cursor.execute("""
        SELECT nome_de_usuario
        FROM usuarios
        """)
    usuarios = cursor.fetchall()

    cursor = mysql.connection.cursor()

    if materia and materia != 'todas':
        cursor.execute("""
            SELECT p.id, p.titulo, p.texto, p.cargo, p.materia, p.data_de_publicacao, u.nome_de_usuario
            FROM perguntas p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.materia = %s
            ORDER BY p.data_de_publicacao DESC
        """, (materia,))
    else:
        cursor.execute("""
            SELECT p.id, p.titulo, p.texto, p.cargo, p.materia, p.data_de_publicacao, u.nome_de_usuario
            FROM perguntas p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.data_de_publicacao DESC
        """)

    perguntas = cursor.fetchall()
    cursor.close()
    
    return render_template('home.html', perguntas=perguntas, usuarios=usuarios)


@app.route('/control/panel')
def control_panel():
    if session.get('cargo') == 'ADMINISTRADOR':
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM usuarios")
        usuarios = cursor.fetchall()
        cursor.execute("""
        SELECT n.id, n.tipo, n.comentario_id, n.data_criacao, u.nome_de_usuario AS remetente
        FROM notificacoes n
        JOIN usuarios u ON n.remetente_id = u.id
        WHERE n.destinatario_id = %s
        ORDER BY n.data_criacao DESC
        """, (session.get('user_id'),))
        notificacoes = cursor.fetchall()
        cursor.close()
        return render_template('control_panel.html', usuarios=usuarios, notificacoes = notificacoes)

    else:
        return redirect(url_for('home'))


@app.route('/update/user/id=<int:id>', methods = ['GET', 'POST'])
def update_user(id):
    cursor = mysql.connection.cursor()
    new_user = {
        'new_name': request.form.get('name'),
        'new_username': request.form.get('username'),
        'new_password': request.form.get('password'), 
        'new_email': request.form.get('email'),
        'new_position': request.form.get('position')
    }

    if new_user['new_password'] == "":
        cursor.execute("""
        UPDATE usuarios
        SET nome = %s, nome_de_usuario = %s, email = %s, cargo = %s
        WHERE id = %s
        """, (new_user['new_name'], new_user['new_username'], new_user['new_email'], new_user['new_position'], id))
        
    else:
        hash_password = generate_password_hash(new_user['new_password'])
        cursor.execute("""
        UPDATE usuarios
        SET nome = %s, nome_de_usuario = %s, senha = %s, email = %s, cargo = %s
        WHERE id = %s
        """, (new_user['new_name'], new_user['new_username'], hash_password, new_user['new_email'], new_user['new_position'], id))
        
    mysql.connection.commit()
    cursor.close()

    return redirect(url_for('control_panel'))

@app.route('/delete/user/id=<int:id>')
def delete_user(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = %s ", (id,))
    mysql.connection.commit()
    cursor.close()

    return redirect(url_for('control_panel'))

@app.route('/ia')
def ia_page():
    user = session.get("ursername")
    return render_template('type_ia.html')

API_KEY = "AIzaSyDEvmkzQAj6Us0uy5auYjtm1laJDCLYPg8"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

@app.route("/perguntar", methods=["POST"])
def perguntar():
    try:
        data = request.get_json(force=True)  # força a leitura como JSON
        if not data or "pergunta" not in data:
            return jsonify({"erro": "Campo 'pergunta' é obrigatório."}), 400

        pergunta = data["pergunta"]

        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {"parts": [{"text": pergunta}]}
            ]
        }

        resposta = requests.post(GEMINI_URL, headers=headers, data=json.dumps(payload))

        if resposta.status_code == 200:
            conteudo = resposta.json()["candidates"][0]["content"]["parts"][0]["text"]
            return jsonify({"resposta": conteudo})
        else:
            return jsonify({"erro": "Falha na API Gemini", "detalhe": resposta.text}), resposta.status_code
    except Exception as e:
        return jsonify({"erro": "Erro no servidor...", "detalhe": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)