import express from 'express';
const app = express();

app.use('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "content-type,Cache-Control");
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,PATCH,POST,GET,PUT,OPTIONS')
    next()
})

app.use(express.json())

let data = []


// 获取数据列表
app.get('/list', (req, res) => {
    res.json({
        code: 200,
        msg: '请求成功',
        data: data
    })
})

// 删除数据
app.delete('/del', (req, res) => {

    data.forEach((item, index) => {
        if (item.id == req.body.flag) {
            data.splice(index, 1)
        }
    })
    console.log('data1', data)
    res.json({
        code: 200,
        msg: '删除成功'
    })
})

// 新增数据
app.post('/add', (req, res) => {
    const generateId = () => Math.floor(Math.random() * 1000000)
    const newItem = { id: generateId(), ...req.body };
    data.push(newItem)
    res.json({
        code: 200,
        msg: '添加成功'
    })
})

// 查询数据
app.post('/search', (req, res) => {
    fs.readFile('server/data/data.json', {
        encoding: 'utf8',
        flag: 'r+'
    }, (err, data) => {
        let filteredArray = JSON.parse(data).filter(item => {
            return req.body.username ? item.username.includes(req.body.username) : true;
        })
        res.json({
            code: 200,
            msg: '查询成功'
        })
    })
})

app.listen(3000, () => {
    console.log('服务启动成功')
})