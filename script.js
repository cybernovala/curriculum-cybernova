document.addEventListener("DOMContentLoaded", function () {
    const getValue = id => (document.getElementById(id)?.value.toUpperCase() || "");

    document.getElementById("agregar-academico").addEventListener("click", () => {
        const contenedor = document.getElementById("contenedor-academico");
        contenedor.innerHTML += `
            <input type="text" class="fecha-academico" placeholder="Fecha" required><br>
            <input type="text" class="establecimiento-academico" placeholder="Establecimiento" required><br>
            <input type="text" class="grado-academico" placeholder="Grado" required><br><br>
        `;
    });

    document.getElementById("agregar-laboral").addEventListener("click", () => {
        const contenedor = document.getElementById("contenedor-laboral");
        contenedor.innerHTML += `
            <input type="text" class="fecha-laboral" placeholder="Fecha" required><br>
            <input type="text" class="empresa-laboral" placeholder="Empresa" required><br>
            <input type="text" class="cargo-laboral" placeholder="Cargo" required><br><br>
        `;
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

        const academicos = [...document.querySelectorAll(".fecha-academico")].map((_, i) => ({
            fecha: document.querySelectorAll(".fecha-academico")[i].value.toUpperCase(),
            establecimiento: document.querySelectorAll(".establecimiento-academico")[i].value.toUpperCase(),
            grado: document.querySelectorAll(".grado-academico")[i].value.toUpperCase()
        }));

        const laborales = [...document.querySelectorAll(".fecha-laboral")].map((_, i) => ({
            fecha: document.querySelectorAll(".fecha-laboral")[i].value.toUpperCase(),
            empresa: document.querySelectorAll(".empresa-laboral")[i].value.toUpperCase(),
            cargo: document.querySelectorAll(".cargo-laboral")[i].value.toUpperCase()
        }));

        fetch("https://cybernovala.pythonanywhere.com/generar_pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ personales, academicos, laborales })
        })
        .then(response => response.blob())
        .then(blob => {
            const enlace = document.createElement("a");
            enlace.href = URL.createObjectURL(blob);
            enlace.download = "curriculum_protegido.pdf";
            enlace.click();
        })
        .catch(err => {
            alert("❌ Hubo un error generando el PDF: " + err);
        });
    });
});
