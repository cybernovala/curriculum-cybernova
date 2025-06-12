document.getElementById("formulario").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Estructura final esperada
    const data = {
        personales: {},
        academicos: [],
        laborales: []
    };

    // Agrupar los campos personales
    ["nombre", "correo", "telefono", "direccion"].forEach((campo) => {
        data.personales[campo.charAt(0).toUpperCase() + campo.slice(1)] = formData.get(campo) || "";
    });

    // Agrupar estudios académicos
    for (let i = 1; i <= 3; i++) {
        const acad = {
            fecha: formData.get(`acad_fecha${i}`),
            establecimiento: formData.get(`acad_establecimiento${i}`),
            grado: formData.get(`acad_grado${i}`)
        };
        if (acad.fecha || acad.establecimiento || acad.grado) {
            data.academicos.push(acad);
        }
    }

    // Agrupar experiencia laboral
    for (let i = 1; i <= 3; i++) {
        const lab = {
            fecha: formData.get(`lab_fecha${i}`),
            empresa: formData.get(`lab_empresa${i}`),
            cargo: formData.get(`lab_cargo${i}`)
        };
        if (lab.fecha || lab.empresa || lab.cargo) {
            data.laborales.push(lab);
        }
    }

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
        console.error("Error al generar el PDF:", error);
        alert("Hubo un error al generar el PDF. Revisa la consola.");
    }
});
