var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var template = require('./lib/template.js');
const { request } = require('http');
var cookie = require('cookie');
//var compression = require('compression')

app.use(express.static('public'));
app.use('/page', express.static('public'));
app.use('/create/page', express.static('public'));
app.use('/update/page', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(compression());

var i = 0;
var cnt = 0;
var dir;
var dlist = '';
var datapath = './data';
var p = fs.readdirSync(datapath, { withFileTypes: true });

while (i < p.length) {
  if (p[i].isDirectory()) {  // 디렉토리인지 체크
    var test = `./${datapath}/${p[i].name}`; // 디렉토리이면 디렉토리의 파일 검색
    let filelist = fs.readdirSync(test); // 동기식 = 순서대로
    var j = 0;
    dlist = dlist + `
              <div class="accordion-item">
                  <h2 class="accordion-header" id="flush-heading${cnt}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                          data-bs-target="#flush-collapse${cnt}" aria-expanded="false" aria-controls="flush-collapse${cnt}">
                          ${p[cnt].name}
                      </button>
                  </h2>
                  <div id="flush-collapse${cnt}" class="accordion-collapse collapse" aria-labelledby="flush-heading${cnt}"
                      data-bs-parent="#accordionFlushExample">`
    while (j < filelist.length) {
      dlist = dlist + `<li><a href="/page/${filelist[j]}">${filelist[j]}</a></li>`;
      j = j + 1;
    }
    dlist = dlist + `<li><a href="/create/page/${p[cnt].name}">글쓰기</a></li>`;
    dlist = dlist + `</div >
                  </div > `;
    cnt = cnt + 1;
  }
  i = i + 1;
}

function authIsOwner(request, response) {
  var isOwner = false;
  var cookies = {}
  if (request.headers.cookie) {
    cookies = cookie.parse(request.headers.cookie);
  }
  if (cookies.email === 'ryujunhyun' && cookies.password === '123456') {
    isOwner = true;
  }
  return isOwner;
}

function authStatusUI(request, response) {
  var authStatusUI = '<div id ="login"><button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#exampleModal">Login </button></div>';
  if (authIsOwner(request, response)) {
    authStatusUI = '<div id ="login"><button type="button" class="btn btn-light"><a href="/logout_process">Logout</a></button></button></div>';
  }
  return authStatusUI;
}

app.get('/', function (request, response) { // 홈페이지
  var title = 'introduce';
  var description = `<p>
    안녕하세요. 군산대학교 컴퓨터정보통신공학부 컴퓨터정보공학전공 학사 과정을 진행중인 류준현이라고 합니다.<br>
    제가 학사 과정을 진행하며 만든 소스 코드 등을 공유하려고 이 사이트를 만들게 되었습니다.<br>
    최대한 자주 업데이트를 해보려고 합니다. 많은 관심 부탁드리고 피드백은 언제든지 환영합니다!<br>
    <br><span>2022.06.26 시작. </span>
    </p>
    <a href="/"><img src="Ryu's Code-logo-black.png" width="200"></a>`;
  var list = dlist;
  var html = template.HTML(title, list,
    `${description}`,
    authStatusUI(request, response)
  );
  response.send(html);
});

app.get('/page/:pageId', function (request, response) { // 설명 페이지
  var i = 0;
  var test, filelist;
  while (i < p.length) {
    var j = 0;
    var cnt = 0;
    test = `./${datapath}/${p[i].name}`;
    filelist = fs.readdirSync(test);
    while (j < filelist.length) {
      if (filelist[j] === request.params.pageId) {
        cnt++;
        dir = `${p[i].name}`;
        break;
      }
      j = j + 1;
    }
    if (cnt != 0) {
      break;
    }
    i = i + 1;
  }
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`${test}/${filteredId}`, 'utf8', function (err, description) {
    var title = request.params.pageId;
    var list = dlist;
    var html = template.HTML(title, list,
      `${description}
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button type="button" class="btn btn-outline-dark"><a href="/update/page/${filteredId}">수정</a></button>
        <form action="delete_process" method="post" onsubmit="return test()">
          <input type="hidden" name="id" value="${title}">
          <button type="submit" class="btn btn-outline-dark">삭제</a></button>
        </form>
        </div>
        `, authStatusUI(request, response)
    );
    response.send(html);
  });
});

app.get('/create/page/:pageId', function (request, response) {
  if(authIsOwner(request, response) === false){ // 로그인 안했을시 접근 불가
    response.write("<script>alert('Login required!');location.href='/';</script>");
    return false;
  }
  var title = request.params.pageId;
  var description = `
    <form action="/create_process/page/${request.params.pageId}" method="post">
      <p>
        <div class="form-floating">
        <textarea class="form-control" textarea name="title" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
        <label for="floatingTextarea">title</label>
        </div>
      </p>
      <p>
        <div class="form-floating">
        <textarea class="form-control" textarea name="description" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
        <label for="floatingTextarea">description</label>
        </div>
      </p>
      <p>
        <button type="submit" class="btn btn-primary">submit</button>
      </p>
    </form>
  `;
  var list = dlist;
  var html = template.HTML(title, list,
    `${description}`,
    authStatusUI(request, response)
  );
  response.send(html);
});

app.post('/create_process/page/:pageId', function (request, response) {
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${request.params.pageId}/${title}`, description, 'utf8', function (err) {
    response.redirect(`/page/${title}`);
      // response.write(`<script>setTimeout(function(){
      //   location.href='/page/${title}';
      // }, 1000)</script>`);
  });
});

app.get('/update/page/:pageId', function(request, response){
  if(authIsOwner(request, response) === false){ // 로그인 안했을시 접근 불가
    response.write("<script>alert('Login required!');location.href='/';</script>");
    return false;
  }
  var i = 0;
  var test, filelist;
  while (i < p.length) {
    var j = 0;
    var cnt = 0;
    test = `./${datapath}/${p[i].name}`;
    filelist = fs.readdirSync(test);
    while (j < filelist.length) {
      if (filelist[j] === request.params.pageId) {
        cnt++;
        break;
      }
      j = j + 1;
    }
    if (cnt != 0) {
      break;
    }
    i = i + 1;
  }
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`${test}/${filteredId}`, 'utf8', function (err, description) {
    var title = request.params.pageId;
    var list = dlist;
    var html = template.HTML('', list,
      `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p>
            <div class="form-floating">
            <textarea class="form-control" textarea name="title" value="${title}" placeholder="Leave a comment here" id="floatingTextarea">${title}</textarea>
            <label for="floatingTextarea">title</label>
            </div>    
          <p>
            <div class="form-floating">
            <textarea class="form-control" textarea name="description" placeholder="Leave a comment here" id="floatingTextarea">${description}</textarea>
            <label for="floatingTextarea">description</label>
            </div>
          </p>
          <p>
            <button type="submit" class="btn btn-primary">submit</button>
          </p>
        </form>
        `, authStatusUI(request, response)
    );
    response.send(html);
  });
});

app.post('/update_process', function(request, response){
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${dir}/${id}`, `data/${dir}/${title}`, function(error){
    fs.writeFile(`data/${dir}/${title}`, description, 'utf8', function(err){
      response.redirect(`/page/${title}`);
      // response.write(`<script>setTimeout(function(){
      //   location.href='/page/${title}';
      // }, 1000)</script>`);
    })
  });
});

app.post('/page/delete_process', function(request, response){
  if(authIsOwner(request, response) === false){ // 로그인 안했을시 접근 불가
    response.write("<script>alert('Login required!');location.href='/';</script>");
    return false;
  }

  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${dir}/${filteredId}`, function(error){
    response.write("<script>alert('delete complete');location.href='/';</script>")
  });
});

app.post('/login_process', function (request, response) {
  var post = request.body;

  if (post.email === 'ryujunhyun' && post.password === '123456') {
    response.writeHead(302, {
      'Set-Cookie': [
        `email=${post.email}`,
        `password=${post.password}`
      ],
      Location: `/`
    });
    response.end();
  }
  else {
    response.write("<script>alert('Login Fail');location.href='/';</script>");
  }
});

app.get('/logout_process', function (request, response) {
  response.writeHead(302, {
      'Set-Cookie': [
        `email=; Max-Age=0`,
        `password=; Max-Age=0`
      ],
      Location: `/`
    });
    response.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
