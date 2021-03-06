var fs = require('fs');
var express = require('express'),
    app = express();
var sqlite3 = require('sqlite3').verbose();
var db;
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});

app.get('/',function(req,res){
  var index = fs.readFileSync('resources/index.html');
  res.write(index);
  res.end();
})
//xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
app.get('/html5uploader.js',function(req,res){
  var js = fs.readFileSync('resources/html5uploader.js');
  res.write(js);
  res.end();
})
app.post("/upload", function(req, res) {
   var content = '';
   req.on('data', function (data) {
      content += data;
   });

   req.on('end', function () {
      fs.writeFileSync("out.txt",content,"binary"); 
   });
   res.end();
});

app.get("/tablenames", function (req, res) {
     db = new sqlite3.Database("out.txt");
     db.serialize(function () {
     var a =[];
      db.each("SELECT * FROM sqlite_master WHERE type='table';", function(err, rows) {
         a.push(rows.name);
      },function() {
         res.end(JSON.stringify(a));
         });
      });
     db.close();
})

app.get("/code", function (req, res) {
     db = new sqlite3.Database("out.txt");
     db.serialize(function () {
     var a =[];
      db.each(req.query.code, function(err, rows) {
         if (err) {}
         else{
            a.push(rows);
         }
      },function() {
         res.end(JSON.stringify(a));
         });
      });
     db.close();
})
var port = process.env.PORT || 5000;
console.log("listening on port:"+port);
app.listen(port);
