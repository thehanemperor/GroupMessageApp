
import models from ".";
import  bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username:{
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: {
                    args: true,
                    msg: 'The username can only be letters or numbers'
                },
                len:{
                    args:  [5,25],
                    msg: 'The username needs to between 5 and 25 characters long'
                },
            }
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email'
                },
            },
        },
        password:{
            type: DataTypes.STRING,
            validate :{
                len:{
                    args:  [5,100],
                    msg: 'The password needs to between 5 and 100 characters long'
                    },

                }
            },
        },
        {
            hooks: {
                afterValidate: async (user)=>{
                    console.log('create password in models/user.js',user.password)
                   const hashedpassword =await bcrypt.hash(user.password, 12);
                   user.password = hashedpassword
               }
            }
        }
        
        ,{
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
          });
  
    User.associate =  (models)=> {
        User.belongsToMany(models.Team,{
            through:models.Member,
            foreignKey: {
                name:'userId',
                field: 'user_id'
            }
        });
        User.belongsToMany(models.Channel,{
            through:'channel_member',
            foreignKey: {
                name:'userId',
                field: 'user_id'
            },
        });
        User.belongsToMany(models.Channel,{
            through: models.PCMember,
            foreignKey: {
                name:'userId',
                field: 'user_id'
            },
        });

        
     
    };

    
  
    return User;
  };