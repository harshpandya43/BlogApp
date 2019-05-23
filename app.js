var express = require('express');
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

var app = express();

mongoose.connect("mongodb://localhost/blog",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// Mongoose MOdel Schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:
        {
            type:Date, default:Date.now
        }
});

var Blog = mongoose.model("Blog",blogSchema);
// Creating a new Blog

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque varius commodo augue. Sed blandit, tellus non imperdiet cursus, lacus nunc accumsan nisl, rhoncus suscipit nisl massa sed urna. Aliquam rutrum nec est ac lobortis. Nullam sollicitudin fringilla luctus. "
// });



// RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

// INDEX 
app.get("/blogs",function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log("Error chhe");
        }else{
            res.render("index",{blogs:blogs});
        }
    });    
});
// CREATE ROUTE
app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
})

// NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

// SHOW ROUTE
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log("Error chhe");
            res.redirect("/blogs");
        }else{
            // console.log(foundBlog);
            res.render("show", {blog: foundBlog } );
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            console.log(foundBlog);
            res.render("edit",{blog:foundBlog});
        }
    });    
});

// UPDATE ROUTE
app.put("/blogs/:id",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// DELETE ROUTES
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});


app.listen(3000,function(){
    console.log("Server started");
})