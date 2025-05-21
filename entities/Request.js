const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Request",
  tableName: "requests",
  columns: {
    id: { primary: true, type: "int", generated: true },
    accessType: { type: "varchar" }, // "Read" | "Write" | "Admin"
    reason: { type: "text" },
    status: { type: "varchar", default: "Pending" }, // "Pending" | "Approved" | "Rejected"
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
    software: {
      type: "many-to-one",
      target: "Software",
      joinColumn: true,
      eager: true,
    },
  },
});
