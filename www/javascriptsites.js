window.addEventListener("DOMContentLoaded", () => {
    const categoryId = new URLSearchParams(window.location.search).get("categoryId");
    console.log(categoryId);

    const urlCategories = `http://localhost:3000/categories/${categoryId}`;

    function isPasswordFormatValid(password) {
        const mayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const minus = "abcdefghijklmnopqrstuvwxyz";
        const nums = "0123456789";
        const simbols = "!@#$%^&*()-_=+[]{}?";

        let tieneMayus = false;
        let tieneMinus = false;
        let tieneNums = false;
        let tieneSimbols = false;

        for (let caracter of password) {
            if (mayus.includes(caracter)) {
                tieneMayus = true;
            }

            if (minus.includes(caracter)) {
                tieneMinus = true;
            }

            if (nums.includes(caracter)) {
                tieneNums = true;
            }

            if (simbols.includes(caracter)) {
                tieneSimbols = true;
            }
        }

        return tieneMayus && tieneMinus && tieneNums && tieneSimbols;

    }

    function generateRandomPassword(length) {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}?";
        let password;

        do {
            password = "";

            for (let i = 0; i < length; i++) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }

        } while (!isPasswordFormatValid(password))

        return password;
    }

    async function getCategoryName(urlCategories) {
        const response = await fetch(urlCategories);
        const category = await response.json();

        const categoryName = category.name;
        console.log("Nombre categoría: " + categoryName);

        return categoryName;
    }

    const headerWeb = document.getElementById("add-site-header2");
    getCategoryName(urlCategories).then((result) => headerWeb.innerHTML = 'Add Site - ' + result.charAt(0).toUpperCase() + result.slice(1));

    const btnGeneratePassword = document.getElementById("generate-password");
    const passwordInput = document.getElementById("site-password");
    btnGeneratePassword.addEventListener("click", () => {
        passwordInput.value = generateRandomPassword(8);

        passwordInput.classList.remove("add-site-form__passwordInput--Wrong");
        passwordInput.classList.remove("add-site-form__field--password");
        passwordInput.classList.add("add-site-form__passwordInput--Ok");

        console.log("Contraseña generada:", passwordInput.value);
    });

    passwordInput.addEventListener("blur", () => {
        if (!isPasswordLengthValid()) {
            passwordInput.classList.add("add-site-form__passwordInput--Wrong");
            passwordInput.classList.remove("add-site-form__passwordInput--Ok");
            passwordInput.classList.remove("add-site-form__field--password");

        } else {
            passwordInput.classList.add("add-site-form__passwordInput--Ok");
            passwordInput.classList.remove("add-site-form__passwordInput--Wrong");
            passwordInput.classList.remove("add-site-form__field--password");
        }
    });

    function isPasswordLengthValid() {
        return passwordInput.value.trim().length >= 8;
    }

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

        if (!isPasswordLengthValid()) {
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
        console.log(datos.password);

        const response = await fetch(`${urlCategories}`, {
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