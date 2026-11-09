window.addEventListener("DOMContentLoaded", () => {
    const urlCategories = "http://localhost:3000/categories";
    const urlSites = "http://localhost:3000/sites";
    let categoryId = null;

    // Devuelve el array de categories.
    async function getCategories(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status} al pedir ${url}.`);
        }

        const categories = await response.json();
        console.log(categories)
        return categories;
    }

    // Devuelve todo el array de sites.
    async function getSites(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status} al pedir ${url}.`);
        }

        const sites = await response.json();
        // console.log(categories)
        return sites;
    }

    if (document.getElementById("index-body")) {

        // Hace de funcion intermedia en la que recibe los datos del GET y los filtra por el id del boton pulsado.
        async function getSitesCategory(id_category, url) {
            // const id_category = event.target.id;
            // console.log(id_category)
            const sites = await getSites(url);
            // console.log(sites)
            const sitesCategory = sites.filter(s => s.categoryId == id_category);
            // console.log(sitesCategory)
            return sitesCategory;
        }

        // Pinta los sites de un category que se ha pulsado su button.
        async function drawSites(id_category) {

            // const id_category = event.target.id;
            const sites = await getSitesCategory(id_category, urlSites);
            //console.log(sites)
            let parent = document.getElementById("sites-body");

            // Reiniciar el contenido del padre para que no se escriban todos los sites de las diferentes categorias uno debajo de otro.
            parent.innerHTML = "";
            sites.forEach(site => {
                let child = document.createElement('tr');
                child.innerHTML = `<td class="sites-table__body">${site.name}</td>
                                <td class="sites-table__body">${site.user}</td>
                                <td class="sites-table__body">${site.createdAt}</td>
                                <td class="sites-table__body">
                                    <div>
                                        <a href="${site.url}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i></a>
                                        <i class="fa-regular fa-trash-can"></i>
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </div>
                                </td>`;
                parent.appendChild(child);
            })
        }

        // Pinta la informacion recibida por la funcion GET
        async function drawCategories() {
            const categories = await getCategories(urlCategories);
            // console.log(categories);
            let parent = document.getElementById("category-body");
            parent.innerHTML = "";

            categories.forEach(category => {
                let child = document.createElement('tr');
                child.innerHTML = `<td class="categories-table__body"><button id=${category.id} class="category-list__button">${category.name}<button class="category-list__button--delete"><i class="fa-solid fa-circle-minus"></i></button></button></td>`;
                // Darle una funcionalidad al boton para que cuando se pulse se dibujen los sites asociados a esa category
                child.addEventListener('click', (event) => {
                    // Almacenar el id para usarlo al añadir sites.
                    categoryId = event.target.id;

                    drawSites(categoryId);
                });
                parent.appendChild(child);
            });
        }

        async function addCategory() {
            const name = document.getElementById("category-name").value.trim();

            if (!name) {
                throw new Error("El nombre de la categoría no puede estar vacío.");
            }

            const datos = { name: name };
            console.log(datos);

            const response = await fetch(urlCategories, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}.`);
            }
        }

        drawCategories();

        const dialog = document.getElementById("category-dialog");
        const categoryForm = document.getElementById("category-form");

        const addCategoryButton = document.getElementById("add-category");
        addCategoryButton.addEventListener("click", () => {
            dialog.showModal();
        });

        // Registrar categoría y cerrar el dialogo al pulsar el boton de submit del formulario.
        categoryForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            try {
                await addCategory();
                // Cierra el dialogo y resetea el formulario para que no se queden los datos introducidos en el input.
                dialog.close();
                categoryForm.reset();

                const parent = document.getElementById("category-body");
                parent.innerHTML = "";

                await drawCategories();
            } catch (error) {
                console.error("Error al agregar la categoría:", error);
                alert("No se ha podido guardar la categoría.");
            }
        });

        // Cancelar el registro y cerrar el dialogo.
        const btnCerrar = document.getElementById("category-form__buttons--cancel");
        btnCerrar.addEventListener("click", () => {
            dialog.close();
        });

        const addSiteButton = document.getElementById("add-site");
        addSiteButton.addEventListener("click", () => {
            if (!categoryId) {
                // Mensaje emergente en la web para informar al usuario.
                alert("Por favor, selecciona una categoría antes de añadir un sitio.");
                return;
            }
            window.location.href = `addSite.html?categoryId=${categoryId}`;
        })
    }

    if (document.getElementById("add-site-body")) {
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
                alert("No se ha podido guardar el sitio.");
            }
        });

        const btnCancelar = document.getElementById("cancel-site");
        btnCancelar.addEventListener("click", () => {
            window.location.href = `index.html`;
        });
    }
})

