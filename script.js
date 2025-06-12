document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      personales: {
        nombre: document.getElementById("nombre")?.value || "",
        email: document.getElementById("email")?.value || "",
        telefono: document.getElementById("telefono")?.value || "",
        direccion: document.getElementById("direccion")?.value || "",
        fecha_nacimiento: document.getElementById("fecha_nacimiento")?.value || "",
        nacionalidad: document.getElementById("nacionalidad")?.value || "",
        rut: document.getElementById("rut")?.value || "",
        estado_civil: document.getElementById("estado_civil")?.value || "",
        sistema_salud: document.getElementById("sistema_salud")?.value || "",
        afp: document.getElementById("afp")?.value || "",
        licencia_conducir: document.getElementById("licencia_conducir")?.value || ""
      },
      academicos: [],
      laborales: []
    };

    document.querySelectorAll(".academico").forEach((div) => {
      data.academicos.push({
        fecha: div.querySelector(".fecha")?.value || "",
        establecimiento: div.querySelector(".establecimiento")?.value || "",
        grado: div.querySelector(".grado")?.value || ""
      });
    });

    document.querySelectorAll(".laboral").forEach((div) => {
      data.laborales.push({
        fecha: div.querySelector(".fecha")?.value || "",
        empresa: div.querySelector(".empresa")?.value || "",
        cargo: div.querySelector(".cargo")?.value || ""
      });
    });

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
    } catch (error) {
      alert("Hubo un error al generar el PDF. Revisa la consola.");
      console.error("Error al generar el PDF:", error);
    }
  });

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
