import postgres from "postgres";

// Connect Database
const connection = () => {
  if (process.env.DB !== undefined) {
    const db = postgres(process.env.DB);
    return db;
  } else {
    console.log("Error");
  }
};

module.exports = connection;
