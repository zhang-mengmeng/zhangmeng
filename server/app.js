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
    const { username, sex, age } = req.query;
    const filteredData = data.filter(item => {
        let match = true;

        // 模糊匹配 username，如果传递了 username 参数
        if (username && !item.username.includes(username)) match = false;

        // 精确匹配 sex，如果传递了 sex 参数
        if (sex && item.sex !== sex) match = false;

        // 精确匹配 age，如果传递了 age 参数
        if (age && item.age !== age) match = false;

        return match;
    });
    res.json({
        code: 200,
        msg: '请求成功',
        data: filteredData
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

// 获取用户详细信息
app.get('/getlist/:id',(req,res) =>{
    console.log(req.params)
    let add 
    data.forEach((item,index) =>{
        if(item.id == req.params.id) {
            add = item
        }
    })
    res.json({
        code:200,
        msg:'查询成功',
        data:add
    })
})

// 修改数据
app.put('/list',(req,res) =>{
    console.log(req.body)
    let indexx
    data.forEach((item,index)=>{
        if(item.id == req.body.id) {
            indexx = index
        }
    })

    data[indexx] = req.body
    res.json({
        code:200,
        msg:'修改成功'
    })
})

app.listen(3000, () => {
    console.log('服务启动成功')
})