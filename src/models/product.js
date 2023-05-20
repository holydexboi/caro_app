const knex = require("../knexfile");
const { v4 } = require("uuid");

async function createTable() {
  try {
    await knex.schema.hasTable("products").then(function (exists) {
      if (!exists) {
        async function create() {
          await knex.schema
            .withSchema("caro_app")
            .createTable("products", function (table) {
              table.string("id").primary();
              table.string("name");
              table.string("description");
              table.float("price");
              table.float("review");
              table.integer("numberOfReview");
              table.string("image");
              table.string("seller");
              table.foreign("seller").references("id").inTable("users");
              table.string("category");
              table.foreign("category").references("id").inTable("categorys");
              table
                .timestamp("created_at", { precision: 6 })
                .defaultTo(knex.fn.now(6));
            });
        }
        create();
      }
    });
  } catch (e) {
    console.error(e);
  }
}

async function createProduct(product) {
  try {
    const output = await knex("products").insert(product);

    return output;
  } catch (err) {
    throw new Error(err);
  }
}

async function getAllProducts() {
  try {
    const products = await knex("products")
      .innerJoin("users", "products.seller", "=", "users.id")
      .innerJoin("categorys", "products.category", "=", "categorys.id")
      .select({
        id: "products.id",
        name: "products.name",
        description: "products.description",
        price: "products.price",
        reviews: "products.review",
        numberOfReview: "products.numberOfReview",
        image: "products.image",
        number: "users.number",
        firstname: "users.firstname",
        lastname: "users.lastname",
        address: "users.address",
        categoryName: "categorys.name",
      });

    return products;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getMyProducts(userId) {
  try {
    const products = await knex("products")
      .where("seller", userId)
      .innerJoin("users", "products.seller", "=", "users.id")
      .innerJoin("categorys", "products.category", "=", "categorys.id")
      .select({
        id: "products.id",
        name: "products.name",
        description: "products.description",
        price: "products.price",
        reviews: "products.review",
        numberOfReview: "products.numberOfReview",
        image: "products.image",
        number: "users.number",
        firstname: "users.firstname",
        lastname: "users.lastname",
        address: "users.address",
        categoryName: "categorys.name",
      });
    console.log(products);
    return products;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getSingleProduct(productId) {
  try {
    const products = await knex("products")
      .where("products.id", "=", productId)
      .innerJoin("users", "products.seller", "=", "users.id")
      .innerJoin("categorys", "products.category", "=", "categorys.id")
      .select({
        id: "products.id",
        name: "products.name",
        description: "products.description",
        price: "products.price",
        reviews: "products.review",
        numberOfReview: "products.numberOfReview",
        image: "products.image",
        number: "users.number",
        firstname: "users.firstname",
        lastname: "users.lastname",
        address: "users.address",
        categoryName: "categorys.name",
      });

    return products;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function editProduct(productId, product) {
  const output = await knex("products")
    .where({ id: productId })
    .select("id", "name", "description", "price", "review", "image");

  if (!output[0]) throw new Error("No product with the given Id");
  const name = product.name === "" ? output.name : product.name;
  const description =
    product.description === "" ? output.description : product.description;
  const price = product.price === "" ? output.price : product.price;
  const image = product.image === "" ? output.image : product.image;

  try {
    const response = await knex("products").where("id", "=", productId).update({
      name: name,
      description,
      price,
      image,
    });

    return {
      id: productId,
      name,
      description,
      price,
      image,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function editReview(productId, reviewPoint) {
  const output = await knex("products")
    .where({ id: productId })
    .select(
      "id",
      "name",
      "description",
      "price",
      "review",
      "products.numberOfReview",
      "image"
    );

  if (!output[0]) throw new Error("No product with the given Id");

  try {
    const response = await knex("products")
      .where("id", "=", productId)
      .increment({
        review: reviewPoint,
        numberOfReview: 1,
      });
console.log(response)
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteProduct(productId) {
  try {
    const output = await knex("products").where({ id: productId }).del();

    return output;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  createTable,
  createProduct,
  getAllProducts,
  getMyProducts,
  getSingleProduct,
  editProduct,
  editReview,
  deleteProduct,
};
