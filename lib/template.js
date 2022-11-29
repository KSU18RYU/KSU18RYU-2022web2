module.exports = {
    HTML: function (title, list, body, control) {
        return `
      <!doctype html>
<html>

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

  <meta charset="utf-8">
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <!-- Optional JavaScript; choose one of the two! -->

  <!-- Option 1: Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    crossorigin="anonymous"></script>

  <!-- Option 2: Separate Popper and Bootstrap JS -->
  <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
    -->
  <h1>
    <div id="login"><button type="button" class="btn btn-light">Login</button></div>
    <a href="/"><img src="Ryu's Code-logo-black.png" width="200"></a>
  </h1>
  <div id="grid">
    <ul>
      <div id="menu">
        <p>
          MENU<br>
        </p>
        <p>
          <a href="/">introduce</a>
        </p>
      </div>
      <div class="accordion accordion-flush" id="accordionFlushExample">
        ${list}
      </div>
    </ul>
    <div id="main">
      <h2>${title}</h2>
      <p>${body}
      </p>
    </div>
  </div>
</body>

</html>
      `;
    }
    // , list: function (filelist) {
    //     var list = '<ul>';
    //     var i = 0;
    //     while (i < filelist.length) {
    //         list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    //         i = i + 1;
    //     }
    //     list = list + '</ul>';
    //     return list;
    // }
}