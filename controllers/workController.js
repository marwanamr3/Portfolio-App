let Work = require('../models/work');
let User = require('../models/user');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multer = require('multer');

let workController = {
    

    addWork : function(req, res){
       
      

        let work = new Work (req.body);
        console.log(req.session.loggedin);
        work.username = req.session.loggedin;


      work.save(function(err , work){

        if(err){
          console.log('err');

        }
        else{
         
          res.redirect('/users/created');
        }
      })
    },
    getAllWorks:function(req, res){
        
        Work.find(function(err, works){
            
            if(err)
                res.send(err.message);
            else
                res.render('profile', {works});
        })
    },

    getUserWorks: function(req,res){    

      Work.find({username: req.session.loggedin},function(err, works){
            
            if(err)
                res.send(err.message);
            else
                console.log(req.session.loggedin);
                res.render('profile', {works, session: req.session});
        })

    },
    getAllWorkVisitor:function(req, res){
        
     

        Work.find(function(err, works)
        {
             
            
            if(err){
                res.send(err.message);
            }
            else{
                
               User.find(function(err,users){
                if(err){
                    console.log(err);
                }
                else {
                    res.render('summary', {works,users});
                }
               });
               
            }
                
                
        })
     }

}
    


module.exports = workController;