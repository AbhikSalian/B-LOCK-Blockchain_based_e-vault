module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
      fileName: DataTypes.STRING,
      fileHash: DataTypes.STRING
    });
  
    File.associate = function(models) {
      File.belongsTo(models.User);
    };
  
    return File;
  };
  