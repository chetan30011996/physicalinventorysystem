const  express  =  require('express')
const  app  =  express()
const  port  =  3000
const bodyParser = require("body-parser");
const  multipart  =  require('connect-multiparty');
const multer  =   require('multer');

//var type=multer({storage:'./uploads'}).single('file');



//app.use('/', express.static(path.join(__dirname, '/input')));
const fs = require('fs');
const { getCombinedNodeFlags } = require('typescript');
const { execFile } = require('child_process');
console.log(__dirname);
const dir = __dirname+'/input/';
const dir1=__dirname+'/uploads';
const storage=multer.diskStorage({destination:function(req,file,cb){
    cb(null,dir1);
},
filename:function(req,file,cb){
    cb(null,file.originalName);
}
})
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const upload=multer({storage:storage});
const  multipartMiddleware  =  multipart({ uploadDir:  './uploads' , 
                                            filename: function(req,file,cb){
                                                cb(null,new Date.toString()+file.originalFilename);
                                            }
});
var tempfilnam;
  fs.readdir(dir,function(err, files) {
        if (err) { throw err; }
        tempfilnam=getNewestFile(files,dir);
    });    
function getNewestFile(files, path) {
    var out = [];
	files.filter( file => file.match(new RegExp(`.*\.(.xlsx)`, 'ig')));
    files.forEach(function(file) {
        var stats = fs.statSync(path + "/" +file);
        if(stats.isFile()) {
            out.push({"file":file, "mtime": stats.mtime.getTime()});
        }
    });
    out.sort(function(a,b) {
        return b.mtime - a.mtime;
    })
    return (out.length>0) ? out[0].file : "";
}

app.get('/api/getallfiles',(req,res)=>
{
    
    fs.readFile(dir+tempfilnam, (e, data) => {
        if (e) throw e;
       res.json({
        'message': data,
        'filename': tempfilnam
            });
    });

      console.log(tempfilnam);
      
});
app.post('/api/upload/post', multipartMiddleware, (req, res) => {
    
    res.json({
        'message': 'File uploaded successfully'
    });
    console.log(req.body, req.files);
  
});

app.use(express.static(process.cwd()+"/dist/excelprojectwebsite/"));

app.get('/', (req,res) => {
    console.log("app redirected");
    res.sendFile(process.cwd()+"/dist/excelprojectwebsite/index.html")
  });


app.listen(port, () => console.log(`Example app listening on port ${port}!`))