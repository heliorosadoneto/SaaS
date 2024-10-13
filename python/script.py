import random
import string
import mysql.connector

def gerar_email(usuario_id):
    return f'usuario{usuario_id}@example.com'

def gerar_senha(tamanho=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=tamanho))

def inserir_usuarios(num_usuarios):
    # Conexão com o banco de dados
    conn = mysql.connector.connect(
        user='root',
        password='',
        host='localhost',
        database='mysaas'
    )
    cursor = conn.cursor()
    
    for i in range(1, num_usuarios + 1):
        email = gerar_email(i)
        senha = gerar_senha()
        empresa_id = 1  # ou outro valor conforme necessário
        funcao = f'funcao{i}'  # ou outro valor conforme necessário
        cursor.execute("INSERT INTO usuarios (email, senha, empresaId, funcao) VALUES (%s, %s, %s, %s)", 
                       (email, senha, empresa_id, funcao))
    
    conn.commit()  # Confirma as inserções
    cursor.close()
    conn.close()

# Insere 1 milhão de usuários
inserir_usuarios(1000000)

print("Usuários inseridos com sucesso!")
