const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }


  async readFile() {
    try {
      const content = await fs.promises.readFile(this.path, 'utf-8');
      const jparseContent = JSON.parse(content);
      return jparseContent;
    } catch (error) {
      console.log("No se puede leer el archivo\n",error);
    }
  }


  async checkProductCode(code) {
    const fileContent = await this.readFile();
    return fileContent.find((object) => object.code === code);
  }


  async getProducts() {
    const fileContent = await this.readFile();
    try {
      console.log(fileContent);
    } catch (error) {
      console.log("Producto o productos no encontrados\n",error);
    }
  }


  async addProduct(obj) {
    const fileContent = await this.readFile();
    if (await this.checkProductCode(obj.code)) return console.log(`El producto con el codigo ${obj.code} ya existe.`)
    try {
      if (fileContent.length !== 0) await fs.promises.writeFile(this.path, JSON.stringify([...fileContent, { ...obj, id: fileContent[fileContent.length -1].id +1 },], null, 3));
      else await fs.promises.writeFile(this.path, JSON.stringify([{ ...obj, id: 1 }]));
    } catch (error) {
      console.log("Falla al agregar el producto\n",error);
    }
  }


  async getProductById(id) {
    try {
      const fileContent = await this.readFile();
      if (fileContent.find((objeto) => objeto.id === id)) {console.log(fileContent.find((objeto) => objeto.id === id));}
      else throw new Error(`No se encontro el producto con el id ${id}.`);
    } catch (error) {
      console.log(`No se encontro el producto con el id ${id}.`);
    }
  }


  async updateProduct(id, obj) {
    try {
      const fileContent = await this.readFile();
      const updated = fileContent.map((product) => product.id === id ? { ...product, ...obj } : product);
      if (!fileContent.find((objeto) => objeto.id === id)) throw new Error(`No se encontro el producto con el id ${id}.`);
      else await fs.promises.writeFile(this.path, JSON.stringify(updated, null, 3));
    } catch (error) {
      console.log(`No se puede actualizar el producto con el id ${id}.`);
    }
  }


  async deleteProductById(id) {
    try {
      const fileContent = await this.readFile();
      const update = fileContent.filter((product) => product.id !== id);
      if (!fileContent.find((obj) => obj.id === id)) throw new Error(`No se encontro el producto con el id ${id}.`);
      else await fs.promises.writeFile(this.path, JSON.stringify(update, null, 3));
    } catch (error) {
      console.log(`No se puede borrar el producto con el id ${id}.`);
    }
  }
}



//Creacion de archivo .json con array vacio solo si este no existe.
const newProdManager = '[]';
fs.readFile('./items.json', 'utf8', (error) => {
    if (error) {
        fs.writeFile('./items.json', newProdManager, error => {
            if (error) {
              console.error("No se pudo escribir el archivo\n",error);
            }
          });
      return;
    }
    console.log("Ya existe archivo .json");
  });

  

//Productos a agragar
const guitarra1 = {
    title: "Gibson",
    description: "Les Paul Standard",
    price: 2700,
    thumbnail: "https://media.sweetwater.com/api/i/q-82__f-webp__ha-1359f5921d463511__hmac-fac5c0ec53ac524ebe618da127a278a7c293f1e3/images/guitars/LPS6B8NH/222020209/222020209-body-large.jpg.auto.webp",
    code: 10,
    stock:5
  }
  
  const guitarra2 = {
    title: "Gibson",
    description: "Les Paul Classic",
    price: 2200,
    thumbnail: "https://media.sweetwater.com/api/i/q-85__f-webp__ha-2787f70697e5b13b__hmac-d30e71130334ec1dbb452dc257c346d981f8e4f1/images/guitars/LPCLSWSMB/223020105/223020105-body-xlarge.jpg.auto.webp",
    code: 11,
    stock:4
  }



// Instancia de ProductManager.
const products = new ProductManager("./items.json");

// getProducts devuelve array vacio.
//products.getProducts();

// Add product
//products.addProduct(guitarra1);

// getProducts devuelve la guirarra1
//products.getProducts();

// getProductById devuelve el producto a buscar
//products.getProductById(1);

// Actualizar el Stock de un producto
//products.updateProduct(1, { stock: 60 });

// Borrar producto por ID
//products.deleteProductById(1);