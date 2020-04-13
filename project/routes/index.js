// routes/index.js

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mongoose = require('mongoose');
var db = mongoose.connect("mongoDB_URI", { useNewUrlParser: true });
var Schema = mongoose.Schema;

var Post = new Schema({
	res_name: String,
	address: String,
	running_time: String,
	main_dish: String,
	image: String,
	date: Date,
	like: Number,
	comments: Array,
	contact: String
});

var Book = new Schema({
	guest_name: String,
	guest_contact: String,
	guest_count: String,
	menu : String,
	res_id: String
});

var postModel = mongoose.model('Post', Post);
var bookModel = mongoose.model('Book', Book);

var check_user = function(req){
	var answer; 
	
	if(req.session.passport === undefined || req.session.passport.user === undefined){  // 비로그인유저일때
		console.log('로그인이 필요함');
		return false;
	}
	else{  // 로그인 되어 있을때
		return true;
	}
};

router.use(passport.initialize());
router.use(passport.session());


/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('index');
	}
);

router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/main', function(req, res, next) {
	res.render('main', {name:req.user.displayName});
});

router.get('/register', function(req, res, next) {
	res.render('resister_res', {name:req.user.displayName});
});

router.get('/complete', function(req, res, next) {
	res.render('complete', {name:req.user.displayName});
});

router.get('/load', function(req, res, next) {
  postModel.find({}, function(err,data){
	  res.json(data);
  });
});

router.get('/list', function(req, res, next) {
	res.render('list', {name:req.user.displayName});
});

router.get('/list_load', function(req, res, next) {
  bookModel.find({"res_id":req.query.item}, function(err,data){
	  res.json(data);
  });
});

router.get('/load_detail', function(req, res, next) {
	var item = req.query.item;
 	postModel.find({"_id" : item}, function(err,data){
		res.json(data);
	});
});

router.get('/detail', (req, res) => {
	res.render('detail', {name : req.user.displayName, item : req.query.item});
});

router.get('/book', function(req, res, next) {
	res.render('book', {name:req.user.displayName, item : req.query.item});
});

router.get('/load_sell', function(req, res, next) {
 	postModel.find({"author" : req.user.displayName}, function(err,data){
		res.json(data);
	});
});

router.get('/sell-list', (req, res) => {
	res.render('sell_list', {name : req.user.displayName});
});


router.post('/register', function(req, res, next) {
	var res_name = req.body.res_name;
	var address = req.body.address;
	var running_time = req.body.running_time;
	var main_dish = req.body.main_dish;
	var image = req.body.img_data;
	var date = Date.now();
	var contact = req.body.contact;
	
	var post = new postModel();
	
	post.res_name = res_name;
	post.address = address;
	post.running_time = running_time;
	post.main_dish = main_dish;
	post.image = image;
	post.date = date;
	post.like = 0;
	post.comments = [];
	post.contact = contact;
	
	post.save(function (err) {
		if (err) {
			throw err;
		}
		else {
			res.redirect('/complete');
		}
	});
});

router.post('/book', function(req, res, next) {
	var guest_name = req.body.guest_name;
	var guest_contact = req.body.guest_contact;
	var guest_count = req.body.guest_count;
	var menu = req.body.menu;
	var res_id = req.body.res_id;
	var email = req.body.guest_email;
	
	var post = new bookModel();
	
	
	post.guest_name = guest_name;
	post.guest_contact = guest_contact;
	post.guest_count = guest_count;
	post.menu = menu;
	post.res_id = res_id;
	
	var transporter = nodemailer.createTransport({
    service:'gmail',
	host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user : 'email@gmail.com',
        pass : 'password'
    }
});

var mailOption = {
    from : 'rlaaudtjd8@gmail.com',
    to : email,
    subject : 'RevelUp 정상예약 되었습니다.',
    text : "Guest : " + guest_name + "\nRestaurant_id : " + res_id + "\nGuest_contact : " + guest_contact + "\nGuest_count : " + guest_count + "\nMenu : " + menu
};

transporter.sendMail(mailOption, function(err, info) {
    if ( err ) {
        console.error('Send Mail error : ', err);
    }
    else {
        console.log('Message sent : ', info);
    }
});
	
	post.save(function (err) {
		if (err) {
			throw err;
		}
		else {
			res.redirect('/complete');
		}
	});
});


router.post('/del', function(req, res, next) {
	var _id = req.body._id;
	
	if(check_user(req)){
	   postModel.deleteOne({_id: _id}, function(err, result) {
			if(err){
				throw err;
			}
			else{
				res.json({status: "SUCCESS"});
			}
		});
	}
});

router.post('/modify', function(req, res, next) {
	var _id = req.body._id;
	var contents = req.body.contents;
	
	if(check_user(req)){
		postModel.findOne({_id: _id}, function(err, post) {
			if(err){
				throw err;
			}
			else{
				post.contents = contents;
				post.save(function(err) {
					if(err){
						throw err;
					}
					else{
						res.json({status: "SUCCESS"});
					}
				});
			} 
		});
	}
});

router.post('/comment', function(req, res, next) {
	var _id = req.body._id;
	var author = req.body.author;
	var comment = req.body.comment;
	var date = Date.now();
	
	postModel.findOne({_id: _id}, function(err, post) {
		if(err){
			throw err;
		}
		else{
			post.comments.push({author: author, comment: comment, date: date});
			post.save(function(err) {
				if(err){
					throw err;
				}
				else{
					res.json({status: "SUCCESS"});
				}
			});
		}
	});
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

var googleCredentials = require('../config/google.json');

passport.use(new GoogleStrategy({
		clientID: googleCredentials.web.client_id,
		clientSecret: googleCredentials.web.client_secret,
		callbackURL: "/auth/google/callback"
	}, 
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){	
			return done(null, profile);
		});
	}
));

router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), 
		  function(req, res) {
			res.redirect('/main');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
