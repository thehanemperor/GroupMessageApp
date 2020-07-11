export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
        name:{
            type: DataTypes.STRING,
            public: {
                type:DataTypes.BOOLEAN,
                defaultValue: true,
            },
            
        },
    },{
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      });
  
    Channel.associate =  (models)=> {
        Channel.belongsTo(models.Team,{
            
            foreignKey: {name:'teamId',field:'team_id'}
        });
        Channel.belongsToMany(models.User,{
            through:'channel_member',
            foreignKey: {
                name:'channelId',
                field:'channel_id'},
        });
        
     
    };
  
    return Channel;
  };