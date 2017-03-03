var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var User = require('../models/user');
var multer  = require('multer');
var LocalStrategy = require('passport-local').Strategy;

var fs = require("fs");
var path = require('path');
var userUploadsPath = path.resolve(__dirname, "work_uploads");


//file upload
var scsrc='';
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/work_uploads');
  },
  filename: function (req, file, callback) {
    //predefined attribute for files
   if(file.orioriginalname != null || file.originalname != '')
   {
  	var filename = file.originalname;
  	var arr = filename.split(".");
  	var filetype = arr[arr.length-1];
  	var newfilename = req.user.username + '-' + Date.now()+'.'+filetype;
    callback(null, newfilename);
		scsrc=newfilename;
	}
}});
var upload = multer({ storage : storage}).single('workPhoto');


router.post('/attachScreenShot',function(req,res,next){
	upload(req,res,function(err) {
			if(err) {

					return res.end("Error uploading file.\n"+err);
			}
			//console.log(req.body.title);

			res.render('creatework',{scsrc});
			console.log(scsrc);
			});

});

// router.get('/project',function(req,res)
// {
// 	res.render('attachScreenShot');
// });


router.get('/createPortfolio', function(req, res){
	res.render('createPortfolio');
});

// navigate to atach screen shot page
router.get('/attachScreenShot',function(req,res){
	res.render('attachScreenShot');
});

router.get('/home',function(req,res){

  Project.find(function(err,project)
{
  if(err)
    res.send(err.msg);
  else {
    console.log(project);
  res.render('home',{
    project}
  );
}
})
})

router.get('/showWork',function(req,res)
{

  Project.find({userid:req.user.username},function(err,project)
{
  if(err) throw err;
  else {
      res.render('show',{project});
  }
})
});

router.post('/project',function(req,res)
{
  var title=req.body.title;
  var link=req.body.URL;
  var desc=req.body.description;
	var sc=scsrc;
	console.log(scsrc);
	//console.log(req.btngan);

  req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('URL', 'URL is required').notEmpty();
  req.checkBody('description', 'description is required').notEmpty();


  var errors = req.validationErrors();

  if(errors){
		res.render('creatework',{
			errors:errors
		});
  }  else if(sc == null || sc == ''){
      var newProj= new Project({
        title:title,
        URL:link,
				userid:req.user.username,
        description:desc
      });

      var conditions={name:req.user.username},update={$inc:{numOfWorks:1}};
  		User.update(conditions,update,callback);
  		function callback(err,numAffected)
  		{
  			console.log(numAffected);
  		}

      Project.createProject(newProj,function(err,project)
    {
      if(err) throw err;
      console.log(project);
    });

   }
	 else {
		 var newProj= new Project({
			 title:title,
			 URL:link,
			 userid:req.user.username,
			 description:desc,
			 screenshot:sc
		 });

		 var conditions={name:req.user.username},update={$inc:{numOfWorks:1}};
		 User.update(conditions,update,callback);
		 function callback(err,numAffected)
		 {
			 console.log(numAffected);
		 }

		 Project.createProject(newProj,function(err,project)
	 {
		 if(err) throw err;
		 console.log(project);
	 });
	 }
	 res.redirect('/');

});
module.exports= router;
