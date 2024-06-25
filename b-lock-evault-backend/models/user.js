module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      address: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      }
    });
  
    User.associate = function(models) {
      User.hasMany(models.File);
    };
  
    return User;
  };
  