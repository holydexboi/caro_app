const knex = require("../knexfile");
const bcrypt = require("bcrypt");
const configu = require("config");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

async function createTable() {
  try {
    await knex.schema.hasTable("users").then(function (exists) {
      if (!exists) {
        async function create() {
          await knex.schema
            .withSchema("caro_app")
            .createTable("users", function (table) {
              table.string("id").primary();
              table.string("firstname");
              table.string("lastname");
              table.enu("gender", ["male", "female"]);
              table.string("email");
              table.unique("email");
              table.string("number");
              table.string("password");
              table.string("address");
              table.string("state");
              table.string("lga");
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

async function add(user) {
  try {
    const id = await knex("users").insert(user);
  } catch (err) {
    throw new Error(err);
  }
}

async function signin(user) {
  const output = await knex("users")
    .where({ email: user.email })
    .select(
      "id",
      "email",
      "password",
      "firstname",
      "lastname",
      "address",
      "gender",
      "number"
    );

  if (!output[0]) throw new Error("Invalid email/password");

  const result = await bcrypt.compare(user.password, output[0].password);
  if (!result) throw new Error("Invalid email/password");

  const token = jwt.sign({ _id: output[0].id }, configu.get("jwtPrivateKey"));

  return { token, ...output[0] };
}

async function getUser(userId) {
  const output = await knex("users")
    .where({ id: userId })
    .select(
      "id",
      "email",
      "firstname",
      "lastname",
      "gender",
      "address",
      "number"
    );

  if (!output[0]) throw new Error("Invalid token");

  return output[0];
}

async function changeProfile(user, userId) {
  console.log(user);
  const output = await knex("users")
    .where({ id: userId })
    .select(
      "id",
      "email",
      "password",
      "firstname",
      "lastname",
      "address",
      "gender",
      "number"
    );

  if (!output[0]) throw new Error("User does not exist");
  const firstname = user.firstname === "" ? output.firstname : user.firstname;
  const lastname = user.lastname === "" ? output.lastname : user.lastname;
  const password = user.password === "" ? output.password : user.password;
  const address = user.address === "" ? output.address : user.address;
  const number = user.number === "" ? output.address : user.number;
  const response = await knex("users").where("id", "=", userId).update({
    firstname: firstname,
    lastname: lastname,
    password: password,
    address: address,
    number: number,
  });

  return {
    userId: output.id,
    firstname,
    lastname,
    password,
    address,
    email: output.email,
    gender: output.gender,
    number,
  };
}

module.exports = { createTable, add, signin, changeProfile, getUser };
