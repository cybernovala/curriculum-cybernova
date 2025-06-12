document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  // Mostrar mensaje de éxito
  const mostrarMensajeExito = () => {
    const mensaje = document.getElementById("mensaje-exito");
    mensaje.innerText = "✅ Su archivo se ha descargado en la carpeta 'Descargas' de su dispositivo móvil.";
    mensaje.classList.remove("oculto");
    mensaje.classList.add("visible");
    setTimeout(() => {
      mensaje.classList.remove("visible");
      mensaje.classList.add("oculto");
    }, 6000);
  };

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
      const fecha = div.querySelector(".fecha")?.value || "";
      const establecimiento = div.querySelector(".establecimiento")?.value || "";
      const grado = div.querySelector(".grado")?.value || "";
      data.academicos.push({ fecha, establecimiento, grado });
    });

    document.querySelectorAll(".laboral").forEach((div) => {
      const fecha = div.querySelector(".fecha")?.value || "";
      const empresa = div.querySelector(".empresa")?.value || "";
      const cargo = div.querySelector(".cargo")?.value || "";
      data.laborales.push({ fecha, empresa, cargo });
    });

    try {
      const response = await fetch("https://cybernovala.pythonanywhere.com/generar_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Error al generar el PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = "curriculum.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      mostrarMensajeExito();
    } catch (error) {
      alert("Hubo un error al generar el PDF. Revisa la consola.");
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
