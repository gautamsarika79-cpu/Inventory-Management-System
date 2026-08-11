const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, unique: true },
  category: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT },
  quantity: { type: DataTypes.INTEGER },
  minimumStock: { type: DataTypes.INTEGER },
  image: { type: DataTypes.STRING },
  supplierId: { type: DataTypes.INTEGER },
});

module.exports = Product;
