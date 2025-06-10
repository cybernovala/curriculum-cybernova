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
      <input type="text" class="fecha-academico" placeholder="Fecha" required><br>
      <input type="text" class="establecimiento-academico" placeholder="Establecimiento" required><br>
      <input type="text" class="grado-academico" placeholder="Grado" required><br><br>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("agregar-laboral").addEventListener("click", () => {
    const contenedor = document.getElementById("contenedor-laboral");
    const div = document.createElement("div");
    div.classList.add("laboral");
    div.innerHTML = `
      <input type="text" class="fecha-laboral" placeholder="Fecha" required><br>
      <input type="text" class="empresa-laboral" placeholder="Empresa" required><br>
      <input type="text" class="cargo-laboral" placeholder="Cargo" required><br><br>
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

    fetch("https://cybernovala.pythonanywhere.com/generar_pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personales, academicos, laborales })
    })
    .then(response => {
      if (!response.ok) throw new Error("Error del servidor");
      return response.blob();
    })
    .then(blob => {
      const enlace = document.createElement("a");
      enlace.href = URL.createObjectURL(blob);
      enlace.download = "curriculum_protegido.pdf";
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    })
    .catch(error => alert("❌ Hubo un error generando el PDF: " + error));
  });
});
