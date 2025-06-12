document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const vistaBtn = document.getElementById("vista-previa");
  const generarBtn = document.getElementById("btn-generar");
  const vistaContainer = document.getElementById("vista-previa-container");
  const vistaContenido = document.getElementById("vista-previa-contenido");

  function recolectarDatos() {
    const personales = {};
    formulario.querySelectorAll("input[name]").forEach(input => {
      personales[input.name] = input.value || "";
    });

    const academicos = [];
    document.querySelectorAll(".academico").forEach(div => {
      academicos.push({
        fecha: div.querySelector(".fecha")?.value || "",
        establecimiento: div.querySelector(".establecimiento")?.value || "",
        grado: div.querySelector(".grado")?.value || ""
      });
    });

    const laborales = [];
    document.querySelectorAll(".laboral").forEach(div => {
      laborales.push({
        fecha: div.querySelector(".fecha")?.value || "",
        empresa: div.querySelector(".empresa")?.value || "",
        cargo: div.querySelector(".cargo")?.value || ""
      });
    });

    return { personales, academicos, laborales };
  }

  vistaBtn.addEventListener("click", () => {
    const datos = recolectarDatos();
    let html = "<h3>Datos Personales</h3>";
    for (const [k, v] of Object.entries(datos.personales)) {
      html += `<strong>${k}:</strong> ${v}<br>`;
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
    generarBtn.style.display = "inline-block";
    vistaBtn.style.display = "none";
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = recolectarDatos();

    try {
      const response = await fetch("https://cybernovala.pythonanywhere.com/generar_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Error al generar el PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "curriculum.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      alert("✅ Su archivo se ha descargado correctamente.\nRevise su carpeta de descargas en su móvil.");
    } catch (error) {
      alert("❌ Hubo un error al generar el PDF. Revisa la consola.");
      console.error("Error al generar el PDF:", error);
    }
  });

  // Botón para agregar campos académicos
  document.getElementById("agregar-academico").addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "academico";
    div.innerHTML = `
      <input type="text" class="fecha" placeholder="Fecha" required>
      <input type="text" class="establecimiento" placeholder="Establecimiento" required>
      <input type="text" class="grado" placeholder="Grado" required><br><br>
    `;
    document.getElementById("contenedor-academico").appendChild(div);
  });

  // Botón para agregar campos laborales
  document.getElementById("agregar-laboral").addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "laboral";
    div.innerHTML = `
      <input type="text" class="fecha" placeholder="Fecha" required>
      <input type="text" class="empresa" placeholder="Empresa" required>
      <input type="text" class="cargo" placeholder="Cargo" required><br><br>
    `;
    document.getElementById("contenedor-laboral").appendChild(div);
  });
});
