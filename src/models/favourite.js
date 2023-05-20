const knex = require("../knexfile");
const { v4 } = require("uuid");

async function createTable() {
  try {
    await knex.schema.hasTable("favourites").then(function (exists) {
      if (!exists) {
        async function create() {
          await knex.schema
            .withSchema("caro_app")
            .createTable("favourites", function (table) {
              table.string("id").primary();
              table.string("product");
              table.foreign("product").references("id").inTable("products");
              table.string("user");
              table.foreign("user").references("id").inTable("users");
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

async function createFavourite(favourite) {
  try {
    const output = await knex("favourites").insert(favourite);

    return output;
  } catch (err) {
    throw new Error(err);
  }
}

async function getUserWish(userId) {
  try {
    const output = await knex("favourites")
      .where("favourites.user", "=", userId)
      .innerJoin("users", "favourites.user", "=", "users.id")
      .innerJoin("products", "favourites.product", "=", "products.id")
      .select({
        id: "favourites.id",
        userId: "favourites.user",
        Productid: "products.id",
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
      });

    return output;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  createFavourite,
  createTable,
  getUserWish,
};
