"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Create_session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static get_allsession(get_sports_name) {
      return this.findAll({
        where: {
          sports_title: {
            [Op.eq]: get_sports_name,
          },
        },
      });
    }
    static get_today_late_session(get_sports_name) {
      return this.findAll({
        where: {
          [Op.and]: [
            {
              sports_title: {
                [Op.eq]: get_sports_name,
              },
            },
            {
              session_date: {
                [Op.gte]: new Date().toLocaleDateString("en-CA"),
              },
            },
          ],
        },
      });
    }
    static get_today(get_sports_name) {
      return this.findAll({
        where: {
          [Op.and]: [
            {
              sports_title: {
                [Op.eq]: get_sports_name,
              },
            },
            {
              session_date: {
                [Op.eq]: new Date().toLocaleDateString("en-CA"),
              },
            },
          ],
        },
      });
    }
    static get_dulate(get_sports_name) {
      return this.findAll({
        where: {
          [Op.and]: [
            {
              sports_title: {
                [Op.eq]: get_sports_name,
              },
            },
            {
              session_date: {
                [Op.gt]: new Date().toLocaleDateString("en-CA"),
              },
            },
          ],
        },
      });
    }
    static get_post_session(get_sports_name) {
      return this.findAll({
        where: {
          [Op.and]: [
            {
              sports_title: {
                [Op.eq]: get_sports_name,
              },
            },
            {
              session_date: {
                [Op.lt]: new Date().toLocaleDateString("en-CA"),
              },
            },
          ],
        },
      });
    }
    static get_one_session(get_sports_name, id) {
      return this.findOne({
        where: {
          [Op.and]: [
            {
              sports_title: {
                [Op.eq]: get_sports_name,
              },
            },
            {
              id: {
                [Op.eq]: id,
              },
            },
          ],
        },
      });
    }
    static async remove_session(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    static async remove_all_session(name) {
      return this.destroy({
        where: {
          sports_title: {
            [Op.eq]: name,
          },
        },
      });
    }
    static async findids(spname) {
      return this.findAll({
        where: {
          sports_title: {
            [Op.eq]: spname,
          },
        },
      });
    }
    static async update_player_count(id, sports_name, value) {
      return this.update(
        {
          add_player: value,
        },
        {
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.eq]: id,
                },
              },
              {
                sports_title: {
                  [Op.eq]: sports_name,
                },
              },
            ],
          },
        }
      );
    }
    static update_sports_name(oldname, name) {
      return this.update(
        {
          sports_title: name,
        },
        {
          where: {
            sports_title: {
              [Op.eq]: oldname,
            },
          },
        }
      );
    }
    static update_sessionwith_id(id, des, date, time, players) {
      return this.update(
        {
          session_des: des,
          session_date: date,
          time: time,
          total_players: players,
        },
        {
          where: {
            id: {
              [Op.eq]: id,
            },
          },
        }
      );
    }
  }
  Create_session.init(
    {
      session_des: DataTypes.STRING,
      session_date: DataTypes.DATEONLY,
      uploader_id: DataTypes.STRING,
      sports_title: DataTypes.STRING,
      total_players: DataTypes.INTEGER,
      time: DataTypes.STRING,
      add_player: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Create_session",
    }
  );
  return Create_session;
};
