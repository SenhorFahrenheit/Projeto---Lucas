from flask import Flask, request, jsonify  # Importa Flask para criar a API
from flask_cors import CORS  # Importa CORS para permitir requisições de diferentes domínios
import openai  # Biblioteca para interagir com a API da OpenAI
import os  # Biblioteca para acessar variáveis de ambiente

# Obtém a chave da API da OpenAI do ambiente
api_key = os.getenv('OPENAI_API_KEY')

# Inicializa o cliente da OpenAI com a chave da API
client = openai.OpenAI(api_key=api_key)

# Inicializa o aplicativo Flask
app = Flask(__name__)

# Habilita CORS para permitir que outras aplicações façam requisições à API
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint para analisar a resposta do usuário e explicar onde está o erro."""

    # Obtém os dados enviados na requisição JSON
    data = request.get_json()

    # Valida e sanitiza os parâmetros recebidos
    user_question = data.get("userQuestion", "").strip()  # Pergunta original
    user_answer = data.get("userAnswer", "").strip()  # Resposta fornecida pelo usuário

    # Retorna erro caso algum dos campos esteja vazio
    if not user_question or not user_answer:
        return jsonify({"error": "Faltando question ou answer"}), 400

    try:
        # Cria um prompt para o modelo da OpenAI explicar o erro da resposta do usuário
        prompt = (
            f"A questão foi: '{user_question}'. "
            f"O usuário respondeu: '{user_answer}'. "
            "Explique por que essa resposta está errada de forma clara e objetiva."
        )

        # Envia a requisição para a OpenAI usando o modelo GPT-4
        response = client.chat.completions.create(
            model="gpt-4",  # Modelo usado para gerar a explicação
            messages=[{"role": "user", "content": prompt}],  # Mensagem enviada ao modelo
            max_tokens=150  # Limita a quantidade de tokens na resposta
        )

        # Retorna a explicação gerada pelo modelo no formato JSON
        return jsonify({"response": response.choices[0].message.content.strip()})

    except Exception as e:
        # Retorna erro caso ocorra alguma falha no processamento
        return jsonify({"error": str(e)}), 500

# Executa o servidor Flask no modo de desenvolvimento
if __name__ == '__main__':
    app.run(debug=True)
