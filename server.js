var http = require('http');
var fs = require('fs');
var num = 1;
var server = http.createServer(function (req, res) {
    console.log(req.url)
    if (req.url == '/post') {
        if (req.method.toLocaleUpperCase() == 'POST') {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            res.setHeader("Content-Type", "application/json;charset=utf-8");

            var chunks = [];
            var size = 0;
            req.on('data', function (chunk) {
                chunks.push(chunk);
                size += chunk.length;
            });

            req.on("end", function () {
                var buffer = Buffer.concat(chunks, size);
                if (!size) {
                    res.writeHead(404);
                    res.end('');
                    return;
                }

                var rems = [];

                //根据\r\n分离数据和报头
                for (var i = 0; i < buffer.length; i++) {
                    var v = buffer[i];
                    var v2 = buffer[i + 1];
                    if (v == 13 && v2 == 10) {
                        rems.push(i);
                    }
                }

                //图片信息
                var picmsg_1 = buffer.slice(rems[0] + 2, rems[1]).toString();
                var filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];

                //图片数据
                var nbuf = buffer.slice(rems[3] + 2, rems[rems.length - 2]);

                var path = './databox/' + filename + num + '.png';

                fs.writeFileSync(path, nbuf);
                console.log("保存" + filename + "成功");

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.end(JSON.stringify({msg:'ok',img:'192.168.170.39:27010/databox/'+filename + num +'.png'}));
                num +=1;
            });

        }
    }
    if (req.url == '/') {
        res.write('get...')
    }
})

server.listen(27010);