document.getElementById("formulario").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        if (!data[key]) {
            data[key] = value;
        }
    });

    try {
        const response = await fetch("https://cybernovala.pythonanywhere.com/generar_pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Error al generar el PDF");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "curriculum.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        alert("Hubo un error al generar el PDF. Revisa la consola.");
        console.error("Error al generar el PDF:", error);
    }
});
