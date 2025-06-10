document.addEventListener("DOMContentLoaded", function () {
  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.toUpperCase() : "";
  }

  document.getElementById("agregar-academico").addEventListener("click", () => {
    const contenedor = document.getElementById("contenedor-academico");
    const div = document.createElement("div");
    div.classList.add("academico");
    div.innerHTML = `
      <input type="text" class="fecha-academico" placeholder="Fecha" required>
      <input type="text" class="establecimiento-academico" placeholder="Establecimiento" required>
      <input type="text" class="grado-academico" placeholder="Grado" required>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("agregar-laboral").addEventListener("click", () => {
    const contenedor = document.getElementById("contenedor-laboral");
    const div = document.createElement("div");
    div.classList.add("laboral");
    div.innerHTML = `
      <input type="text" class="fecha-laboral" placeholder="Fecha" required>
      <input type="text" class="empresa-laboral" placeholder="Empresa" required>
      <input type="text" class="cargo-laboral" placeholder="Cargo" required>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

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

    const academicos = [...document.querySelectorAll(".academico")].map(campo => ({
      "fecha": campo.querySelector(".fecha-academico")?.value.toUpperCase() || "",
      "establecimiento": campo.querySelector(".establecimiento-academico")?.value.toUpperCase() || "",
      "grado": campo.querySelector(".grado-academico")?.value.toUpperCase() || ""
    }));

    const laborales = [...document.querySelectorAll(".laboral")].map(campo => ({
      "fecha": campo.querySelector(".fecha-laboral")?.value.toUpperCase() || "",
      "empresa": campo.querySelector(".empresa-laboral")?.value.toUpperCase() || "",
      "cargo": campo.querySelector(".cargo-laboral")?.value.toUpperCase() || ""
    }));

    fetch("http://127.0.0.1:5000/generar_pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personales, academicos, laborales })
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al generar el PDF.");
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "curriculum_protegido.pdf";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(error => alert("Hubo un error generando el PDF: " + error));
  });
});
