"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Create_sports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static getSports() {
      return this.findAll({ order: [["id", "ASC"]] });
    }
    static async edit_sports(id, value) {
      return this.update(
        {
          sports_name: value,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
  }
  Create_sports.init(
    {
      sports_name: DataTypes.STRING,
      Edit_delete_display: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Create_sports",
    }
  );
  return Create_sports;
};
