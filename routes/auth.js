var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

var authData = {
    email: 'ryujunhyun',
    password: '1'
  }

  router.post('/login_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    
    if(email && password){ // id와 password가 입력되었는지 확인
        db.query('SELECT * FROM usertable WHERE email = ? AND password =?', [email, password], function(err, results, fields){
            if (results.length > 0) {
                request.session.is_logined = true;
                request.session.nickname = email;
                request.session.save(function () {
                    response.redirect(`/`);
            })
            }
            else {
                response.write("<script>alert('Login Fail');location.href='/';</script>");
              }
        })
    }
    else {
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/";</script>`);  
    }
  });
  
  router.get('/logout_process', function (request, response) {
    request.session.destroy(function(err){
        response.redirect('/');
    })
  });


  module.exports = router;