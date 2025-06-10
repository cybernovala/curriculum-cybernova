from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from generar_pdf import generar_pdf
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/generar_pdf', methods=['POST'])
def generar_pdf_endpoint():
    try:
        datos = request.get_json()

        if not datos or "personales" not in datos or "academicos" not in datos or "laborales" not in datos:
            return jsonify({"error": "Faltan campos requeridos"}), 400

        archivo_pdf = generar_pdf(datos)

        return send_file(
            archivo_pdf,
            as_attachment=True,
            download_name="curriculum_protegido.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
