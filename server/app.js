import express from 'express';
import fs from 'node:fs';
const app = express();

app.use('*',(req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"content-type");
    res.setHeader('Access-Control-Allow-Methods','DELETE,PATCH,POST,GET,PUT,OPTIONS')
    next()
})

app.use(express.json())

let data = []


// 获取数据列表
app.get('/list',(req,res)=>{
    fs.readFile('server/data/data.json', {
        encoding: 'utf8',
        flag: 'r'
    },(err, data)=>{
        if(JSON.parse(data).length == 0) {
            res.json({
                code: 200,
                msg: '暂无数据',
                data: []
            })
        }else {
            res.json({
                code: 200,
                msg: '获取成功',
                data: JSON.parse(data)
            })
        }
    })
})

// 删除数据
app.delete('/del',(req,res) =>{
    fs.readFile('server/data/data.json', {
        encoding: 'utf8',
        flag:'r+'
    },(err,data) =>{
        let dataa = JSON.parse(data)
        dataa.forEach((item,index) =>{
            if(item.username == req.body.username) {
                dataa.splice(index,1)
            }
        })
        fs.writeFileSync('server/data/data.json',JSON.stringify(dataa),(err) =>{
            if(!err) {
                res.json({
                    code:200,
                    msg:'删除成功'
                })
            }else {
                res.json({
                    code:500,
                    msg:'删除失败'
                })
            }
        })
    })
})

// 新增数据
app.post('/add',(req,res) =>{
    const generateId = () => Math.floor(Math.random() * 10000)
    res.send(generateId)
    // const newItem = {id:data.length + 1,...req.body}
})

// 查询数据
app.post('/search',(req,res) =>{
    fs.readFile('server/data/data.json',{
        encoding: 'utf8',
        flag:'r+'
    },(err, data) =>{
        let filteredArray = JSON.parse(data).filter(item => {
            return req.body.username ? item.username.includes(req.body.username) : true;
        })
        res.json({
            code:200,
            msg:'查询成功'
        })
    })
})

app.listen(3000,()=>{
    console.log('服务启动成功')
})