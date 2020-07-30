export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        text:{
            type: DataTypes.STRING,
        },
        url:{type: DataTypes.STRING},
        filetype:{type: DataTypes.STRING}, 
      
    },{
        indexes: [
            {
                fields: ['created_at']
            }
        ],
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      });
  
    Message.associate =  (models)=> {
        Message.belongsTo(models.Channel,{
            
            foreignKey: {
                name:'channelId',
                field: 'channel_id'},
        });
        Message.belongsTo(models.User,{
            foreignKey: {
                name: 'userId',
                field:'user_id'}
        });
     
    };
  
    return Message;
  };