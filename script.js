const form = document.getElementById("formulario");
const vistaBtn = document.getElementById("vista-previa");
const modificarBtn = document.getElementById("modificar");
const generarBtn = document.getElementById("btn-generar");
const acciones = document.getElementById("botones-acciones");
const vistaContainer = document.getElementById("vista-previa-container");
const vistaContenido = document.getElementById("vista-previa-contenido");
const mensajeDescarga = document.getElementById("mensaje-descarga");

generarBtn.addEventListener("click", async () => {
  await generarPDF();
});

async function generarPDF() {
  const datos = recolectarDatos();
  try {
    const res = await fetch("https://cybernovala.pythonanywhere.com/generar_pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (!res.ok) throw new Error("Error al generar el PDF.");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculum_cybernova.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    mensajeDescarga.style.display = "block";
    mensajeDescarga.innerText = "✅ El archivo se ha descargado. Revise la carpeta de descargas de su móvil. Puede compartirlo por correo o WhatsApp al Cyber para su impresión.";
    setTimeout(() => mensajeDescarga.style.display = "none", 10000);
  } catch (error) {
    console.error(error);
    alert("❌ Error al generar o descargar el PDF.");
  }
}

vistaBtn.addEventListener("click", () => {
  const datos = recolectarDatos();
  let html = "<h3>Datos Personales</h3>";
  for (const [k, v] of Object.entries(datos.personales)) {
    html += `<strong>${k.toUpperCase()}:</strong> ${v}<br>`;
  }

  html += "<h3>Formación Académica</h3>";
  datos.academicos.forEach((a, i) => {
    html += `(${i + 1}) ${a.fecha}, ${a.establecimiento}, ${a.grado}<br>`;
  });

  html += "<h3>Experiencia Laboral</h3>";
  datos.laborales.forEach((l, i) => {
    html += `(${i + 1}) ${l.fecha}, ${l.empresa}, ${l.cargo}<br>`;
  });

  vistaContenido.innerHTML = html;
  vistaContainer.style.display = "block";
  acciones.style.display = "flex";
  vistaBtn.style.display = "none";
});

modificarBtn.addEventListener("click", () => {
  vistaContainer.style.display = "none";
  acciones.style.display = "none";
  vistaBtn.style.display = "inline-block";
});

function recolectarDatos() {
  const formData = new FormData(form);
  const personales = {};
  [
    "nombre", "email", "telefono", "direccion", "fecha_nacimiento",
    "nacionalidad", "rut", "estado_civil", "sistema_salud",
    "afp", "licencia_conducir"
  ].forEach(key => personales[key] = formData.get(key)?.toUpperCase() || "");

  const academicos = [];
  document.querySelectorAll("#academico .grupo").forEach(grupo => {
    const campos = grupo.querySelectorAll("input");
    academicos.push({
      fecha: campos[0].value.toUpperCase(),
      establecimiento: campos[1].value.toUpperCase(),
      grado: campos[2].value.toUpperCase()
    });
  });

  const laborales = [];
  document.querySelectorAll("#laboral .grupo").forEach(grupo => {
    const campos = grupo.querySelectorAll("input");
    laborales.push({
      fecha: campos[0].value.toUpperCase(),
      empresa: campos[1].value.toUpperCase(),
      cargo: campos[2].value.toUpperCase()
    });
  });

  return { personales, academicos, laborales };
}

function agregarCampo(seccion) {
  const div = document.createElement("div");
  div.className = "grupo";

  if (seccion === "academico") {
    div.innerHTML = `
      <input type="text" name="fecha" placeholder="Fecha" required />
      <input type="text" name="establecimiento" placeholder="Establecimiento" required />
      <input type="text" name="grado" placeholder="Grado / Título" required />
    `;
  } else {
    div.innerHTML = `
      <input type="text" name="fecha" placeholder="Fecha" required />
      <input type="text" name="empresa" placeholder="Empresa" required />
      <input type="text" name="cargo" placeholder="Cargo" required />
    `;
  }

  document.getElementById(seccion).insertBefore(div, document.getElementById(seccion).lastElementChild);
}
