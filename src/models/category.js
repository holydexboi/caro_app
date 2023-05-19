const knex = require("../knexfile");
const { v4 } = require("uuid");

async function createTable() {
  try {
    await knex.schema.hasTable("categorys").then(function (exists) {
      if (!exists) {
        async function create() {
          await knex.schema
            .withSchema("caro_app")
            .createTable("categorys", function (table) {
              table.string("id").primary();
              table.string("name");
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

async function createCategory(category) {
  try {
    const id = await knex("categorys").insert(category);

    return id
    
  } catch (err) {
    throw new Error(err);
  }
}

async function getAllCategory() {
  const category = await knex("categorys").select("id", "name");

  if (!category[0]) throw new Error("No record in the category table");

  return category;
}

async function getCategoryById(categoryId) {
  const category = await knex("categorys")
    .where({ id: categoryId })
    .select("id", "name");

  if (!category[0]) throw new Error("No category with the given Id");

  return category;
}

async function editCategory(categoryId, name){
    const category = await knex("categorys")
    .where({ id: categoryId })
    .select("id", "name");

  if (!category[0]) throw new Error("No category with the given Id");

    const response = await knex('categorys')
    .where('id', '=', categoryId)
    .update({
        name: name
    })

    return {id: categoryId, name}
}

module.exports = { createTable, createCategory, getCategoryById, getAllCategory, editCategory};
