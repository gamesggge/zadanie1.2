import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: any) => {
  return sequelize.define('Action', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'Actions'
  });
};
