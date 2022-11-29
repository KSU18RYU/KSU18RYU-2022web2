var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template.js');
//var compression = require('compression')

app.use(express.static('public'));
app.use('/page',express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(compression());

var i = 0;
var cnt = 0;
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
          dlist = dlist + `</div >
                  </div > `;
          cnt = cnt + 1;
  }
  i = i + 1;
}
app.get('/', function(request, response) { // 홈페이지
    var title = 'introduce';
    var description = `<p>
    안녕하세요. 군산대학교 컴퓨터정보통신공학부 컴퓨터정보공학전공 학사 과정을 진행중인 류준현이라고 합니다.<br>
    제가 학사 과정을 진행하며 만든 소스 코드 등을 공유하려고 이 사이트를 만들게 되었습니다.<br>
    최대한 자주 업데이트를 해보려고 합니다. 많은 관심 부탁드리고 피드백은 언제든지 환영합니다!<br>
    <br><span>2022.06.26 시작. </span>
    </p>`;
    var list = dlist;
    var html = template.HTML(title, list,
      `${description}`,
      `<a href="/create">create</a>`
    ); 
    response.send(html);
});
// else {
//   fs.readdir('./data', function(error, filelist){
//     fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
//       var title = queryData.id;
//       var list = template.list(filelist);
//       var html = template.HTML(title, list,
//         `<h2>${title}</h2>${description}`,
//         ` <a href="/create">create</a>
//           <a href="/update?id=${title}">update</a>
//           <form action="delete_process" method="post">
//             <input type="hidden" name="id" value="${title}">
//             <input type="submit" value="delete">
//           </form>`
//       );
//       response.writeHead(200);
//       response.end(html);
//     });
//   });
// }

app.get('/page/:pageId', function(request, response) { // 설명 페이지
    var i = 0;
    var test, filelist;
    while(i<p.length){
      var j = 0;
      var cnt = 0;
      test = `./${datapath}/${p[i].name}`;
      filelist = fs.readdirSync(test);
      while(j<filelist.length){
        if(filelist[j]===request.params.pageId){
          cnt++;
          break;
        }
        j=j+1;
      }
      if(cnt!=0){
        break;
      }
      i = i+1;
    }
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`${test}/${filteredId}`, 'utf8', function(err, description){
      console.log(`${test}/${filteredId}`);
      var title = request.params.pageId;
      var list = dlist;
      var html = template.HTML(title, list,
        `${description}`,``
      );
      response.send(html);
    });
});
 
// app.get('/create', function(request, response){
//   fs.readdir('./data', function(error, filelist){
//     var title = 'WEB - create';
//     var list = template.list(filelist);
//     var html = template.HTML(title, list, `
//       <form action="/create_process" method="post">
//         <p><input type="text" name="title" placeholder="title"></p>
//         <p>
//           <textarea name="description" placeholder="description"></textarea>
//         </p>
//         <p>
//           <input type="submit">
//         </p>
//       </form>
//     `, '');
//     response.send(html);
//   });
// });
 
// app.post('/create_process', function(request, response){
//   var post = request.body;
//   var title = post.title;
//   var description = post.description;
//   fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//     response.writeHead(302, {Location: `/?id=${title}`});
//     response.end();
//   });
// });
 
// app.get('/update/:pageId', function(request, response){
//   fs.readdir('./data', function(error, filelist){
//     var filteredId = path.parse(request.params.pageId).base;
//     fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//       var title = request.params.pageId;
//       var list = template.list(filelist);
//       var html = template.HTML(title, list,
//         `
//         <form action="/update_process" method="post">
//           <input type="hidden" name="id" value="${title}">
//           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//           <p>
//             <textarea name="description" placeholder="description">${description}</textarea>
//           </p>
//           <p>
//             <input type="submit">
//           </p>
//         </form>
//         `,
//         `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
//       );
//       response.send(html);
//     });
//   });
// });
 
// app.post('/update_process', function(request, response){
//   var post = request.body;
//   var id = post.id;
//   var title = post.title;
//   var description = post.description;
//   fs.rename(`data/${id}`, `data/${title}`, function(error){
//     fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//       response.redirect(`/?id=${title}`);
//     })
//   });
// });
 
// app.post('/delete_process', function(request, response){
//   var post = request.body;
//   var id = post.id;
//   var filteredId = path.parse(id).base;
//   fs.unlink(`data/${filteredId}`, function(error){
//     response.redirect('/');
//   });
// });
 
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});