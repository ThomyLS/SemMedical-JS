let lista = [];

async function cargarProductos() {
    try {
        const respuesta = await fetch("./assets/productos.json");
        const data = await respuesta.json();

        lista = data;
        renderProductos();

    } catch (error) {
        console.log("Error cargando productos:", error);
    }
}

cargarProductos();

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderProductos() {
    const contProd = document.getElementById("contenedorProd")

    contProd.innerHTML = "";

    lista.forEach(producto => {
        contProd.innerHTML += `
        <div class="card-item">
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <h4 class="card-titulo">${producto.titulo}</h4>
            <p>$ ${producto.precio.toLocaleString("es-AR")}</p>
            <div class="botones">
                <button class="buttonItem ver" data-id="${producto.id}">Ver Producto</button>
                <button class="buttonItem agregar" data-id="${producto.id}">Agregar al carro</button>
            </div>
        </div>
        `;
    });

    agregarProductos();
    verProducto();
}

function agregarProductos() {
    const agregarProd = document.querySelectorAll(".agregar")

    agregarProd.forEach(boton => {
        boton.addEventListener("click", () => {

            let id = Number(boton.dataset.id);

            let buscoProdId = lista.find(producto => producto.id === id);

            let existeProd = carrito.find(producto => producto.id === buscoProdId.id)

            if (existeProd) {
                existeProd.cantidad++
            } else {
                carrito.push({ ...buscoProdId, cantidad: 1 });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();
            actualizarContador();

            Swal.fire({
                title: "Producto agregado",
                text: `${buscoProdId.titulo} fue agregado al carrito`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        });
    });
}

const carritoCont = document.querySelector(".productosCarrito")

function mostrarCarrito() {
    carritoCont.innerHTML = ""

    if (carrito.length === 0) {

        carritoCont.innerHTML = `
        <div class="carritoVacio">
            <img src="./img/carroVacio.png" class="viewCarritoImg" alt="">
            <h2>¡Tu carrito está vacío!</h2>
            <p>Selecciona un producto de nuestro catalogo</p>
        </div>
    `;

        return;
    }

    carrito.forEach(prodCarro => {
        carritoCont.innerHTML += `
        <div class="cardCarrito"> 
            <img src="${prodCarro.imagen}" class="viewCarritoImg" alt="${prodCarro.titulo}">
            
            <div class="cardCarritoCont">

                <h4>${prodCarro.titulo}</h4>

                <p>$ ${prodCarro.precio.toLocaleString("es-AR")}</p>

                <div class="cantidadBotones">
                    <button class="restar" data-id="${prodCarro.id}">-</button>

                    <p class="cantidad">${prodCarro.cantidad}</p>

                    <button class="sumar" data-id="${prodCarro.id}">+</button>
                </div>

            </div>
            <button class="eliminar" data-id="${prodCarro.id}">x</button>
         </div>
        `;
    })

    const eliminarProd = document.querySelectorAll(".eliminar")

    eliminarProd.forEach(boton => {
        boton.addEventListener("click", () => {

            let id = Number(boton.dataset.id);

            Swal.fire({
                title: "¿Eliminar producto?",
                text: "Este producto se eliminará del carrito",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then((resultado) => {

                if (resultado.isConfirmed) {

                    carrito = carrito.filter(producto => producto.id !== id);

                    localStorage.setItem("carrito", JSON.stringify(carrito));

                    mostrarCarrito();
                    actualizarContador();

                    Swal.fire({
                        title: "Eliminado",
                        text: "Producto eliminado del carrito",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });
    });

    const botonSumar = document.querySelectorAll(".sumar");

    botonSumar.forEach(boton => {

        boton.addEventListener("click", () => {

            let id = Number(boton.dataset.id);

            let producto = carrito.find(prod => prod.id === id);

            producto.cantidad++;

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();

            actualizarContador();

        });

    });

    const botonRestar = document.querySelectorAll(".restar");

    botonRestar.forEach(boton => {

        boton.addEventListener("click", () => {

            let id = Number(boton.dataset.id);

            let producto = carrito.find(prod => prod.id === id);

            if (producto.cantidad > 1) {

                producto.cantidad--;

            } else {

                carrito = carrito.filter(prod => prod.id !== id);

            }

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();

            actualizarContador();

        });

    });

    const total = carrito.reduce((acc, producto) => {
        return acc + (producto.precio * producto.cantidad);
    }, 0);

    const totalCarrito = document.querySelector(".total");

    totalCarrito.innerHTML = `
        <p class="totalView">$ ${total.toLocaleString("es-AR")}</p>
    `;

};

const totalIcon = document.querySelector(".contNoti")

function actualizarContador() {
    let cantidad = carrito.length;

    totalIcon.innerHTML = `<span class="noti">${cantidad}</span>`;
}

mostrarCarrito();
actualizarContador();

const carritoPanel = document.querySelector(".carrito");

const iconCarrito = document.querySelector(".carro");

const overlay = document.querySelector(".overlay");

iconCarrito.addEventListener("click", () => {

    carritoPanel.classList.toggle("carritoActivo");

    overlay.classList.toggle("overlayActivo");
});

const cerrarCarrito = document.querySelector(".cerrarCarrito");

cerrarCarrito.addEventListener("click", () => {

    carritoPanel.classList.remove("carritoActivo");

    overlay.classList.remove("overlayActivo");
});

overlay.addEventListener("click", () => {

    carritoPanel.classList.remove("carritoActivo");

    overlay.classList.remove("overlayActivo");
});

const btnVaciar = document.querySelector(".vaciarCarrito");

btnVaciar.addEventListener("click", () => {

    if (carrito.length === 0) return;

    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"

    }).then((result) => {

        if (result.isConfirmed) {

            carrito = [];

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();

            actualizarContador();

            Swal.fire({
                title: "Carrito vacío",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
});

const btnFinalizar = document.querySelector(".finalizarCompra");

btnFinalizar.addEventListener("click", () => {

    if (carrito.length === 0) {

        Swal.fire({
            title: "Tu carrito está vacío",
            icon: "error"
        });

        return;
    }

    Swal.fire({
        title: "¡Compra realizada!",
        text: "Gracias por tu compra",
        icon: "success"
    });

    carrito = [];

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();

    actualizarContador();
});

function verProducto() {

    const botonesVer = document.querySelectorAll(".ver");

    botonesVer.forEach(boton => {

        boton.addEventListener("click", () => {

            let id = Number(boton.dataset.id);

            let producto = lista.find(prod => prod.id === id);

            Swal.fire({

                title: producto.titulo,

                text: `$ ${producto.precio.toLocaleString("es-AR")}`,

                imageUrl: producto.imagen,

                imageWidth: 300,

                confirmButtonText: "Cerrar"

            });
        });
    });
}