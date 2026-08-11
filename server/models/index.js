const sequelize=require("../config/database");
const User=require("./User"), Supplier=require("./Supplier"), Product=require("./Product");
Supplier.hasMany(Product,{foreignKey:"supplierId",onDelete:"RESTRICT"});
Product.belongsTo(Supplier,{foreignKey:"supplierId"});
module.exports={sequelize,User,Supplier,Product};