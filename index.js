class ProductManager {
  static newId = 0;
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, stock) {
    ProductManager.newId++;
    let newCode = ProductManager.newId;
    let codeUnico = true;
    this.products.forEach((product) => {
      if (product.code === newCode) {
        codeUnico = false;
        console.log("el code ya existe");
      }
    });

    if (codeUnico) {
      const newProduct = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: ProductManager.newId,
        stock: stock,
      };

      this.products.push(newProduct);
    
    }
  }

  getProducts() {
    console.log(this.products);
  }

  getProductById(code) {
    const product = this.products.find(product => product.code === code)
    if(product){
        console.log(product);
        return product;
    }else{
        console.log("Not Found");
    }
  }
}
const adder = new ProductManager();
adder.getProducts();

adder.addProduct("title", "description", 20, "thumbnail", 20);
adder.addProduct("title2", "description2", 30, "thumbnail2", 30);
adder.addProduct("title3", "description3", 30, "thumbnail2", 30);
adder.getProductById(5);


