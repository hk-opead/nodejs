const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const CryptoJs = require("crypto-js");

// Database connection
const sequelize = new Sequelize("nodejs_xb5k", "nodejs_xb5k_user", "PEXFM5WefmMzhdZvObqfd55INxfy24P9", {
  host: "dpg-d18j1n6mcj7s73de7h8g-a",
  dialect: "mysql",
  logging: false,
});
// const sequelize = new Sequelize("sqlite::memory:");
// User Model Definition
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
        notEmpty: true,
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",

    hooks: {
      afterCreate: async (user) => {
        await Profile.create({
          user_id: user.id,
          firstName: "",
          lastName: "",
          avatar: "default-avatar.jpg",
        });
      },
      // beforeCreate: (user) => {
      //   if (user.password) {
      //     user.password = CryptoJs.AES.encrypt(
      //       user.password,
      //       "secretkey"
      //     ).toString();
      //   }
      // },
      // beforeUpdate: (user) => {
      //   if (user.changed("password")) {
      //     user.password = CryptoJs.AES.encrypt(
      //       user.password,
      //       "secretkey"
      //     ).toString();
      //   }
      // },
    },
  }
);
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT, // TEXT might be better for longer descriptions
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    gallery: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    size: {
      type: DataTypes.STRING, // example enum
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    user_id: {
      // تم تغيير userId إلى user_id لتكون متسقة مع تسمية MySQL
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // اسم الجدول في قاعدة البيانات
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "products",
  }
);

const Profile = sequelize.define(
  "profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "default-avatar.jpg",
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "profiles",
  }
);
User.associate = (models) => {
  User.hasOne(models.Profile, {
    foreignKey: "user_id",
    as: "profile",
    onDelete: "CASCADE",
  });

  User.hasMany(models.Product, {
    foreignKey: "user_id",
    as: "products",
    onDelete: "CASCADE",
  });
};

// علاقة ينتمي إلى (Product belongs to User)
Product.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Database Initialization Function
const initializeDatabase = async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => {
        console.log("Connection to database established successfully.");
      })
      .catch((error) => {
        console.error("Unable to connect to the database:", error);
      });

    sequelize
      .sync({ force: false }) // أو { force: true } إذا أردت حذف الجدول وإعادة إنشائه
      .then(() => {
        console.log("Tables synced");
      })
      .catch((err) => {
        console.error("Error syncing tables:", err);
      });
    // Create initial admin user if doesn't exist

    // const [adminUser, created] = await User.findOrCreate({
    //   where: { email: "admin@example.com" },
    //   defaults: {
    //     username: "admin",
    //     password: "admin123", // Will be encrypted by the beforeCreate hook
    //     isAdmin: true,
    //   },
    // });

    // if (created) {
    //   console.log("Admin user created:", adminUser.toJSON());
    // } else {
    //   console.log("Admin user already exists");
    // }

    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};

module.exports = { sequelize, Product, User, initializeDatabase, Profile };
