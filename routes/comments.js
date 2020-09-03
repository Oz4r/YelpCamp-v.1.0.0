const express    = require("express"),
 	  router     = express.Router({mergeParams: true}),
 	  Campground = require("../models/campground"),
 	  Comment    = require("../models/comment"),
	  middleware = require("../middleware")

router.get("/new",middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	})
});

router.post("/",middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment 
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id)
				}
			})
		}
	})
});

//COMMENTS EDIT & UPDATE 
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
			Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Something went wrong")
				res.redirect("back");
			}else{
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Something went wrong")
			res.redirect("back");
		}else{
			req.flash("success", "Successfully updated comment")
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})
//delete 
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}else{
			req.flash("success", "Successfully deleted comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

module.exports = router;