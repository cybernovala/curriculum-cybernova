document.addEventListener("DOMContentLoaded", () => {
  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.toUpperCase() : "";
  }

  document.getElementById("agregar-academico").addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("academico");
    div.innerHTML = `
      <input type="text" class="fecha-academico" placeholder="Fecha" required>
      <input type="text" class="establecimiento-academico" placeholder="Establecimiento" required>
      <input type="text" class="grado-academico" placeholder="Grado" required>
    `;
    document.getElementById("contenedor-academico").appendChild(div);
  });

  document.getElementById("agregar-laboral").addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("laboral");
    div.innerHTML = `
      <input type="text" class="fecha-laboral" placeholder="Fecha" required>
      <input type="text" class="empresa-laboral" placeholder="Empresa" required>
      <input type="text" class="cargo-laboral" placeholder="Cargo" required>
    `;
    document.getElementById("contenedor-laboral").appendChild(div);
  });

  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const personales = {
      "Nombre completo": getValue("nombre"),
      "Correo electrónico": getValue("email"),
      "Teléfono": getValue("telefono"),
      "Dirección": getValue("direccion"),
      "Fecha de nacimiento": getValue("fecha_nacimiento"),
      "Nacionalidad": getValue("nacionalidad"),
      "RUT": getValue("rut"),
      "Estado Civil": getValue("estado_civil"),
      "Sistema de Salud": getValue("sistema_salud"),
      "AFP": getValue("afp"),
      "Licencia de Conducir": getValue("licencia_conducir")
    };

    const academicos = [...document.querySelectorAll(".academico")].map(div => ({
      fecha: div.querySelector(".fecha-academico")?.value.toUpperCase() || "",
      establecimiento: div.querySelector(".establecimiento-academico")?.value.toUpperCase() || "",
      grado: div.querySelector(".grado-academico")?.value.toUpperCase() || ""
    }));

    const laborales = [...document.querySelectorAll(".laboral")].map(div => ({
      fecha: div.querySelector(".fecha-laboral")?.value.toUpperCase() || "",
      empresa: div.querySelector(".empresa-laboral")?.value.toUpperCase() || "",
      cargo: div.querySelector(".cargo-laboral")?.value.toUpperCase() || ""
    }));

    const datos = { personales, academicos, laborales };

    try {
      const response = await fetch("http://127.0.0.1:5000/generar_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (!response.ok) throw new Error("Error al generar PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "curriculum_protegido.pdf";
      link.click();
    } catch (error) {
      alert("Error al generar el PDF: " + error.message);
    }
  });
});
