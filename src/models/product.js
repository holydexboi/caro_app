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
    const product = await knex("products").insert(product);

    return product;
  } catch (err) {
    throw new Error(err);
  }
}

async function getAllProducts() {
  const products = await knex("products")
    .innerJoin("users", "products.seller", "=", "users.id")
    .innerJoin("categorys", "products.category", "=", "categorys.id")
    .select(
      "products.id",
      "products.name",
      "products.description",
      "products.price",
      "products.review",
      "products.image",
      "users.firstname",
      "users.lastname",
      "users.address",
      "categorys.name"
    );

  return products;
}

async function getMyProducts(userId) {
  const products = await knex("products")
    .where({ seller: userId })
    .innerJoin("users", "products.seller", "=", "users.id")
    .innerJoin("categorys", "products.category", "=", "categorys.id")
    .select(
      "products.id",
      "products.name",
      "products.description",
      "products.price",
      "products.review",
      "products.image",
      "users.firstname",
      "users.lastname",
      "users.address",
      "categorys.name"
    );

  return products;
}

async function getSingleProduct(productId){

  const products = await knex("products")
  .where({id: productId})
  .innerJoin(
    'users', 
    'products.seller', 
    '=', 
    'users.id'
  )
  .innerJoin(
    'categorys', 
    'products.category', 
    '=', 
    'categorys.id'
  )
    .select('products.id', 'products.name', 'products.description', 'products.price', 'products.review', 'products.image', 'users.firstname', 'users.lastname', 'users.address', 'categorys.name')
  
    return products
}

module.exports = { createProduct };
