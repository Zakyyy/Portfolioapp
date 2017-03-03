var express = require('express');
var router = express.Router();
var Project = require('../models/project');


// Get Homepage
router.get('/attachProFPhoto',function(req,res)
{
	res.render('attachProFPhoto');
});
router.get('/', ensureAuthenticated, function(req, res){
	Project.findOne({userid:req.user.username},function(err,project){
		if(!project)
		{
			res.render('attachProFPhoto');

		}
		else {

			res.render('index',
			{
				username:req.user.username,
				photoname:req.user.profilePic
			});
			console.log(req.user.profilePic);

		}
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('users/login');
	}
}

module.exports = router;
