const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});
//操作数据库
app.get('/query',async function(req,res,next){
    if(Object.keys(req.query).length !== 0){
        const ret =await mysql.query(req.query.sql)
        mysql.savelog()
        res.send(ret)
        return
    }else{
        console.log(`no param`)
        res.send({err:'no param input'})
        return
    }
})
app.post('/query',async function(req,res,next){
    if(Object.keys(req.query).length !== 0){
        const ret =await mysql.query(req.query.sql)
        mysql.savelog()
        res.send(ret)
        return
    }else{
        console.log(`no param`)
        res.send({err:'no param input'})
        return
    }
})


const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
