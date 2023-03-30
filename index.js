class ProductManager {
  static newCode = 0;
  static newId = 0;
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, stock) {
    ProductManager.newCode++;
    ProductManager.newId++;
    let newCode = ProductManager.newCode;
    let codeUnico = true;
    this.products.forEach((product) => {
      if (product.code === newCode) {
        codeUnico = false;
        console.log("el code ya existe");
      }
    });

    if (title && description && price && thumbnail && stock) {
      if (codeUnico){
        const newProduct = {
          id: ProductManager.newId,
          title: title,
          description: description,
          price: price,
          thumbnail: thumbnail,
          code: `CODE${ProductManager.newCode}`,
          stock: stock,
        };

        this.products.push(newProduct);
      }
    } else {
      console.log("Debes completar todos los campos");
    }
  }

  getProducts() {
    console.log(this.products);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      console.log(product);
      return product;
    } else {
      console.log("Not Found");
    }
  }
}
const adder = new ProductManager();
adder.getProducts();

adder.addProduct("title", "description", 20, "thumbnail", 20);
adder.addProduct("title2","description", 30, "thumbnail2", 30);
adder.addProduct("title3", 30, "thumbnail2", 30); // ejemplo campo faltante
adder.getProductById(5);
