window.addEventListener("DOMContentLoaded", () => {

    const urlCategories = "http://localhost:3000/categories";

    const categoryId = new URLSearchParams(window.location.search).get("categoryId");
    console.log(categoryId);

    function generateRandomPassword(length) {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}?";

        let password = "";
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    const btnGeneratePassword = document.getElementById("generate-password");
    const passwordInput = document.getElementById("site-password");

    btnGeneratePassword.addEventListener("click", () => {
        passwordInput.value = generateRandomPassword(8);
        console.log("Contraseña generada:", passwordInput.value);
    });

    async function addSite() {
        const name = document.getElementById("site-name").value.trim();
        const url = document.getElementById("site-url").value.trim();
        const user = document.getElementById("site-user").value.trim();
        const password = document.getElementById("site-password").value.trim();
        const description = document.getElementById("site-description").value.trim();

        if (!name) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "En nombre del site no puede estar vacío.",
                confirmButtonText: "Go back"
            });
            return false;
        }

        if (!url) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "La url del site no puede estar vacía.",
                confirmButtonText: "Go back"
            });
            return false;
        }

        if (!user) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El usuario del site no puede estar vacío.",
                confirmButtonText: "Go back"
            });
            return false;
        }

        if (!password) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "La contraseña del site no puede estar vacía.",
                confirmButtonText: "Go back"
            });
            return false;
        }

        if (password.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "La contraseña no puede tener menos de 8 carácteres.",
                confirmButtonText: "Go back"
            });
            return false;
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

        return true;
    }

    const siteForm = document.getElementById("site-form");
    siteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            const registrado = await addSite();

            if (registrado) {
                // Resetea el formulario para que no se queden los datos introducidos en el input.
                siteForm.reset();
                window.location.href = `index.html`;
            }
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