"use strict";
const { Model, Op, where } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Players_names extends Model {
    static associate(models) {
      // define association here
    }
    static get_player_name_for_session(sports_name, session_id) {
      return this.findAll({
        where: {
          [Op.and]: [
            {
              sports_name: {
                [Op.eq]: sports_name,
              },
            },
            {
              session_id: {
                [Op.eq]: session_id,
              },
            },
          ],
        },
      });
    }
    static async remove_player(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    static async remove_session_player(id) {
      return this.destroy({
        where: {
          session_id: {
            [Op.eq]: id,
          },
        },
      });
    }
    static update_sports_name_players_count(oldname, new_sports_name) {
      return this.update(
        {
          sports_name: new_sports_name,
        },
        {
          where: {
            sports_name: {
              [Op.eq]: oldname,
            },
          },
        }
      );
    }
    static update_player_count(id, update_player_count) {
      return this.update(
        {
          total_player: update_player_count,
        },
        {
          where: {
            session_id: {
              [Op.eq]: id,
            },
          },
        }
      );
    }
  }
  Players_names.init(
    {
      players_name: DataTypes.STRING,
      sports_name: DataTypes.STRING,
      session_id: DataTypes.INTEGER,
      total_player: DataTypes.INTEGER,
      uploader_id: DataTypes.STRING,
      my_name: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Players_names",
    }
  );
  return Players_names;
};
