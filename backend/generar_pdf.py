from fpdf import FPDF
from PyPDF2 import PdfReader, PdfWriter
import os

def generar_pdf(datos):
    if not datos or "personales" not in datos or "academicos" not in datos or "laborales" not in datos:
        raise ValueError("Datos inválidos recibidos para generar PDF")

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.set_font("Arial", "I", 28)
    pdf.cell(0, 15, "CURRÍCULUM VITAE", ln=True, align="R")
    y = pdf.get_y() + 2
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.5)
    pdf.line(10, y, 200, y)
    pdf.ln(10)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "DATOS PERSONALES", ln=True)
    pdf.set_font("Arial", "", 12)
    for clave, valor in datos["personales"].items():
        pdf.cell(60, 8, f"{clave.upper()}:", ln=False)
        pdf.cell(120, 8, valor, ln=True)
    pdf.ln(5)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "DATOS ACADÉMICOS", ln=True)
    pdf.set_font("Arial", "", 12)
    for dato in datos["academicos"]:
        pdf.cell(60, 8, "Fecha:", ln=False)
        pdf.cell(120, 8, dato.get("fecha", ""), ln=True)
        pdf.cell(60, 8, "Establecimiento:", ln=False)
        pdf.cell(120, 8, dato.get("establecimiento", ""), ln=True)
        pdf.cell(60, 8, "Grado:", ln=False)
        pdf.cell(120, 8, dato.get("grado", ""), ln=True)
        pdf.ln(5)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "DATOS LABORALES", ln=True)
    pdf.set_font("Arial", "", 12)
    for dato in datos["laborales"]:
        pdf.cell(60, 8, "Fecha:", ln=False)
        pdf.cell(120, 8, dato.get("fecha", ""), ln=True)
        pdf.cell(60, 8, "Empresa:", ln=False)
        pdf.cell(120, 8, dato.get("empresa", ""), ln=True)
        pdf.cell(60, 8, "Cargo:", ln=False)
        pdf.cell(120, 8, dato.get("cargo", ""), ln=True)
        pdf.ln(5)

    temp_output = "curriculum.pdf"
    pdf.output(temp_output)

    reader = PdfReader(temp_output)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt("1234")

    final_output = "curriculum_protegido.pdf"
    with open(final_output, "wb") as f:
        writer.write(f)

    os.remove(temp_output)
    return final_output
