export default (sequelize, DataTypes) => {
    const Team = sequelize.define('team', {
        name:{
            type: DataTypes.STRING,
            unique: true,
        },
        
      
    },{
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      });
  
    Team.associate =  (models)=> {
        Team.belongsToMany(models.User,{
            through:models.Member,
            foreignKey: {
                name: 'teamId',
                field: 'team_id'
            },
        });
     
    };
  
    return Team;
  };