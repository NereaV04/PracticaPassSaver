window.addEventListener("DOMContentLoaded", () => {

    const urlCategories = "http://localhost:3000/categories";

    categoryId = new URLSearchParams(window.location.search).get("categoryId");
    console.log(categoryId);

    async function addSite() {
        const name = document.getElementById("site-name").value.trim();
        const url = document.getElementById("site-url").value.trim();
        const user = document.getElementById("site-user").value.trim();
        const password = document.getElementById("site-password").value.trim();
        const description = document.getElementById("site-description").value.trim();

        if (!name || !url || !user || !password) {
            throw new Error("La URL, usuario y contraseña del sitio no pueden estar vacíos.");
        }

        const datos = {
            name: name,
            url: url,
            user: user,
            password: password,
            description: description
        };
        console.log(datos);

        const response = await fetch(`${urlCategories}/${categoryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}.`);
        }
    }

    const siteForm = document.getElementById("site-form");
    siteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await addSite();
            // Resetea el formulario para que no se queden los datos introducidos en el input.
            siteForm.reset();
            window.location.href = `index.html`;
        } catch (error) {
            console.error("Error al agregar el sitio:", error);
            Swal.fire({
                title: "Error",
                text: "No se ha podido registrar el sitio web.",
                icon: "error"
            });
        }
    });

    const btnCancelar = document.getElementById("cancel-site");
    btnCancelar.addEventListener("click", () => {
        window.location.href = `index.html`;
    });
});