const knex = require("../knexfile");
const { v4 } = require("uuid");

async function createTable() {
  try {
    await knex.schema.hasTable("comments").then(function (exists) {
      if (!exists) {
        async function create() {
          await knex.schema
            .withSchema("caro_app")
            .createTable("comments", function (table) {
              table.string("id").primary();
              table.string("message");
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

async function createComment(comment) {
  try {
    const output = await knex("comments").insert(comment);

    return output;
  } catch (err) {
    throw new Error(err);
  }
}

async function getProductComment(productId) {
  try {
    const output = await knex("comments")
      .where({ product: productId })
      .select("id", "message", "product", "user");

    return output;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  createComment,
  createTable,
  getProductComment,
};
