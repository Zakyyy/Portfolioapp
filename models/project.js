var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    URL:String,
    userid:String,
    screenshot:String,
    description:String
})

var Project = mongoose.model("project", projectSchema);

module.exports = Project;
module.exports.createProject=function(newProject,callback)
{
  newProject.save(callback);
}
