from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "I", 28)
        self.cell(0, 10, "Currículum Vitae", ln=True, align="R")
        self.ln(3)
        self.set_draw_color(200, 200, 200)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(8)

    def campo(self, label, valor):
        self.set_font("Arial", "B", 11)
        self.cell(40, 8, f"{label}:", ln=0)
        self.set_font("Arial", "", 11)
        self.multi_cell(0, 8, valor, ln=1)
        self.ln(1)

def crear_pdf(datos, ruta_salida):
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Datos Personales", ln=True)
    pdf.ln(2)
    for campo in ["nombre", "direccion", "telefono", "correo"]:
        valor = datos.get(campo, "")
        if valor:
            pdf.campo(campo.capitalize(), valor)

    pdf.ln(5)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Formación Académica", ln=True)
    pdf.ln(2)
    for aca in datos.get("academicos", []):
        linea = f"{aca.get('estudio', '')} - {aca.get('institucion', '')} ({aca.get('fecha', '')})"
        pdf.set_font("Arial", "", 11)
        pdf.multi_cell(0, 8, linea)
        pdf.ln(1)

    pdf.ln(3)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Experiencia Laboral", ln=True)
    pdf.ln(2)
    for lab in datos.get("laborales", []):
        linea = f"{lab.get('puesto', '')} - {lab.get('empresa', '')} ({lab.get('fecha', '')})"
        pdf.set_font("Arial", "", 11)
        pdf.multi_cell(0, 8, linea)
        pdf.ln(1)

    pdf.output(ruta_salida)
