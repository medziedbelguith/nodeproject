const User =require('../models/User')
const bycrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')

const register=(req,res,next)=>{
    bycrypt.hash(req.body.password,10,function(err,hashedPass){
        if(err)
        {
            res.json({
                error:err
            })
        }
        let user=new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:hashedPass
        })
        user.save()
        .then(user=>{
            res.json({
                message:'User Added Successfully'
            })

        })
        .catch(error=>{
            res.json({
                message:'An error has occured'
            })    
        })
    })

}
const login=(req,res,next)=>{
    var username=req.body.username
    var password=req.body.password
    User.findOne({$or: [{email:username},{phone:username}]})
    .then(user=>{
     if(user){
        bycrypt.compare(password,user.password,function(err,result){
          if(err)
          {
              res.json({
                  error:err
              })
            }
              if(result){
                  let token=jwt.sign({name:user.name},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
                  let refreshtoken=jwt.sign({name:user.name},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'48h'})
                 res.status(200).json({
                     message:'Login Successful!',
                     token,
                     refreshtoken
                 })
              }
              else
              {
                  res.json({
                      message:"Password does not matched!"
                  })
              }
          
        })
        }else{
         res.json({message:'No User found!'})
        }
    })
}
const refreshToken=(req,res,next)=>{
    const refreshToken=req.body.refreshToken
    jwt.verify(refreshToken, 'refreshtokensecret',function(err,decode){
        if(err){
         res.status(400).json({
             err
         })
        }
        else
        {
        let token=jwt.sign({name:decode.name},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'48h'})
        let refreshToken=req.body.refreshToken
        
        res.status(200).json({
            message:"Token refreshed successfully!",
            token,
            refreshToken
        })
       }
    })

}
module.exports={
    register,login,refreshToken
}