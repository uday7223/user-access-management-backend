const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Software",
  tableName: "software",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar" },
    description: { type: "text" },
    accessLevels: { type: "simple-array" }, // e.g., ["Read", "Write", "Admin"]
  },
});
