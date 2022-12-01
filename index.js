const fs = require("fs");
const express = require("express");

// Class Contenedor.
class Contenedor {
  constructor(file) {
    this.file = file;
    this.products = [];
  }

  // Add product.
  async save(product) {
    await this.getProducts();

    // Cualquiera de las 2 formas funcionan para que el primer producto sea con id 1.
    // const id = this.products ? this.products.length + 1 : 1;
    const id = this.products.length + 1;
    const productAdd = { ...product, id };

    fs.promises.writeFile(
      this.file,
      JSON.stringify([...this.products, productAdd], null, 2)
    );
  }

  // Get product by id.
  async getById(number) {
    await this.getProducts();

    return this.products.find((product) => product.id === number);
  }

  // Get all products.
  async getAll() {
    await this.getProducts();
    return this.products;
  }

  // Save products in attribute products.
  getProducts() {
    return fs.promises
      .readFile(this.file, "utf-8")
      .then((value) => JSON.parse(value))
      .then((products) => (this.products = products))
      .catch((e) => console.log(e));
  }

  // Delete product by id.
  async deleteById(number) {
    await this.getProducts();

    const productsFiltered = this.products.filter(
      (product) => product.id !== number
    );
    this.updateId(productsFiltered);

    fs.promises.writeFile(this.file, JSON.stringify(productsFiltered, null, 2));
  }

  // Update products id.
  updateId(products) {
    for (let i = 0; i < products.length; i++) {
      products[i].id = i + 1;
    }
  }

  // Delete all products.
  deleteAll() {
    fs.promises.writeFile(this.file, "[]").catch((e) => console.log(e));
  }

  // Generate random product id.
  async idRandom() {
    const products = await contenedor.getAll();
    const lastId = products[products.length - 1].id;
    const id = Math.round(Math.random() * lastId);

    if (id) {
      return id;
    }
    return 1;
  }
}

const app = express();
const PORT = 8080;

const contenedor = new Contenedor("./productos.json");

app.get("/productos", async (request, response) => {
  await contenedor
    .getAll()
    .then((value) => response.send(value))
    .catch((e) => console.log(e));
});

app.get("/productoRandom", async (request, response) => {
  const id = await contenedor.idRandom();
  await contenedor
    .getById(id)
    .then((value) => response.send(value))
    .catch((e) => console.log(e));
});

app.listen(PORT, () => console.log("Server alive"));
