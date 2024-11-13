document
  .getElementById("iniciar-compra")
  .addEventListener("click", function () {
    const nombre = document.getElementById("nombre").value;
    const presupuesto = document.getElementById("presupuesto").value;
    const cantidad = document.getElementById("cantidad").value;
    const direccion = document.getElementById("direccion").value;
    const entrega = document.querySelector('input[name="entrega"]:checked');

    if (!nombre || !presupuesto || !cantidad || !direccion || !entrega) {
      alert("Todos los campos deben ser llenados.");
      return;
    }

    const nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(nombre)) {
      alert("El nombre solo debe contener letras y espacios.");
      return;
    }

    if (nombre.length > 20) {
      alert("El nombre no debe superar los 20 caracteres.");
      return;
    }

    if (Number(cantidad) < 1 || Number(cantidad) > 20) {
      alert("La cantidad debe ser un número positivo no superior a 20.");
      return;
    }

    window.location.href = "products.html";
  });
