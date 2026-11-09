window.addEventListener("DOMContentLoaded", async () => {
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
            child.innerHTML = `<td class="categories-table__body">
                <div class="categories-table__container">
                    <button id=${category.id} class="category-list__button">${category.name}</button>
                    <button id=${category.id} class="category-list__button--delete">
                        <i class="fa-solid fa-circle-minus"></i>
                    </button>
                </div>
                </td>`;
            // Darle una funcionalidad al boton para que cuando se pulse se dibujen los sites asociados a esa category
            const categoryButton = child.querySelector(".category-list__button");

            categoryButton.addEventListener('click', () => {
                categoryId = category.id;
                drawSites(categoryId);
            });
            parent.appendChild(child);
        });
    }

    async function addCategory(name) {

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

    drawCategories().catch(error => {
        Swal.fire({
            title: "Error",
            text: "No se han podido cargar las categorías.",
            icon: "error"
        });
    });

    const addCategoryButton = document.getElementById("add-category");
    addCategoryButton.addEventListener("click", async () => {
        console.log("Botón pulsado");
        try {
            const { value: name } = await Swal.fire({
                title: "Nueva categoría",
                input: "text",
                inputLabel: "Nombre:",
                showCancelButton: true,
                confirmButtonText: "Ok",
                cancelButtonText: "Cancelar",
                customClass: {
                    confirmButton: "category-add__buttons--ok",
                    cancelButton: "category-add__buttons--cancel"
                },
                inputValidator: (value) => {
                    if (!value.trim()) return "El nombre de la categoría no puede estar vacío.";
                }
            });

            if (name) {
                await addCategory(name);
                await drawCategories();
            }
        } catch (error) {
            console.log(error);
            console.error("Error al agregar la categoría:", error);
            Swal.fire({
                title: "Error",
                text: "No se ha podido registrar la categoría.",
                icon: "error"
            });
        }

    });

    const addSiteButton = document.getElementById("add-site");
    addSiteButton.addEventListener("click", () => {
        if (!categoryId) {
            // Mensaje emergente en la web para informar al usuario.
            Swal.fire({
                title: "Error",
                text: "Selecciona una categoría antes de añadir un sitio.",
                icon: "error"
            });
            return;
        }
        window.location.href = `addSite.html?categoryId=${categoryId}`;
    });

    async function deleteCategory(id) {

        const response = await fetch(`${urlCategories}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}.`);
        }
    }

    const bodyCategories = document.getElementById("category-body");
    bodyCategories.addEventListener("click", async (event) => {
        const btnDeleteCategory = event.target.closest(".category-list__button--delete");

        if (btnDeleteCategory) {
            try {
                const result = await Swal.fire({
                    title: "¿Seguro que quiere eliminar la categoría?",
                    text: "Este paso es irrevertible.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Eliminar",
                    cancelButtonText: "Cancelar"
                })

                if (result.isConfirmed) {
                    await deleteCategory(btnDeleteCategory.id);
                    await drawCategories();

                    if (Number(categoryId) === Number(btnDeleteCategory.id)) {
                        categoryId = null;
                        document.getElementById("sites-body").innerHTML = "";
                    }

                    Swal.fire({
                        title: "¡Eliminada!",
                        text: "La categoría se ha eliminado correctamente.",
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error("No se pudo eliminar la categoría:", error);

                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar la categoría.",
                    icon: "error"
                });
            }
        }
    })
})

