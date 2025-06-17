// const { Sequelize, Op, Model, DataTypes } = require("sequelize");
// const CryptoJs = require("crypto-js");

// // Database connection
// // const sequelize = new Sequelize("blogapp", "root", "", {
// //   host: "localhost",
// //   dialect: "mysql",
// //   logging: false,
// // });

// const Product = sequelize.define(
//   "Product",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING(),
//       allowNull: false,
//       unique: true,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     img: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     file: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     category: {
//       type: DataTypes.ARRAY(DataTypes.STRING),
//     },
//     gallery: {
//       type: DataTypes.ARRAY(DataTypes.STRING),
//     },
//     size: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     color: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: true,
//     tableName: "products",
//     hooks: {
//       // beforeCreate: (user) => {
//       //   if (user.password) {
//       //     user.password = CryptoJs.AES.encrypt(
//       //       user.password,
//       //       "secretkey"
//       //     ).toString();
//       //   }
//       // },
//       // beforeUpdate: (user) => {
//       //   if (user.changed("password")) {
//       //     user.password = CryptoJs.AES.encrypt(
//       //       user.password,
//       //       "secretkey"
//       //     ).toString();
//       //   }
//       // },
//     },
//   }
// );
// sequelize
//   .sync({ force: false }) // أو { force: true } إذا أردت حذف الجدول وإعادة إنشائه
//   .then(() => {
//     console.log("Tables synced");
//   })
//   .catch((err) => {
//     console.error("Error syncing tables:", err);
//   });

// module.exports = Product;
