'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate({ User, Like }) {
      this.belongsTo(User, { foreignKey: 'created_id' });
      this.belongsToMany(User, {
        through: Like,
        foreignKey: 'post_id',
        otherKey: 'user_id',
        as: 'likes',
      });
    }
  }
  Post.init(
    {
      created_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
