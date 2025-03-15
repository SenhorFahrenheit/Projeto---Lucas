from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

# Obtém a chave da API da OpenAI do ambiente
api_key = os.getenv('OPENAI_API_KEY')

# Inicializa o cliente da OpenAI
client = openai.OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()

    # Validação dos parâmetros
    user_question = data.get("userQuestion", "").strip()
    user_answer = data.get("userAnswer", "").strip()

    if not user_question or not user_answer:
        return jsonify({"error": "Faltando question ou answer"}), 400

    try:
        # Gera o prompt para a explicação com base na questão e resposta errada
        prompt = (
            f"A questão foi: '{user_question}'. "
            f"O usuário respondeu: '{user_answer}'. "
            "Explique por que essa resposta está errada de forma clara e objetiva."
        )

        # Envia a requisição para a OpenAI usando o modelo GPT
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150  # Limita a resposta sem comprometer a qualidade
        )

        return jsonify({"response": response.choices[0].message.content.strip()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
