document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    // 这里调用 show() 函数，但由于 show() 函数包含插入表格行的逻辑，我们需要确保它在正确的时间被调用
});
function show(){
    var number = document.getElementById('number').value;
    var name = document.getElementById('name').value;
    var major = document.getElementById('major').value;
    var union_code = document.getElementById('union_code').value;

    var table = document.getElementById('studentTable');
    var newRow = table.insertRow(-1)
    var cell1 = newRow.insertCell(0)
    var cell2 = newRow.insertCell(1)
    var cell3 = newRow.insertCell(2)
    var cell4 = newRow.insertCell(3)

    cell1.innerHTML = number;
    cell2.innerHTML = name;
    cell3.innerHTML = major;
    cell4.innerHTML = union_code;

    // 清空表单
    document.getElementById('studentForm').reset();
}
function add() {
    const number = document.getElementById('number').value
    const name = document.getElementById('name').value
    const major = document.getElementById('major').value
    const union_code = document.getElementById('union_code').value
    fetch('http://localhost:5000/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            name: name,
            major: major,
            union_code: union_code
        })
    })
    .then(response => response.json())
    .then(data =>{
        const status = data.code;
        console.log(status)
        switch (status) {
        case 1010:
            show()
            alert('添加成功');
            break;
        default:
            alert('未知错误');
            break;
        }
    })
    .catch(error => console.error('Error:', error));
}
function sub() {
    const number = document.getElementById('number').value
    fetch('http://localhost:5000/sub', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
        })
    })
    .then(response => response.json())
    .then(data =>{
        const status = data.code;
        console.log(status)
        switch (status) {
        case 1020:
            show()
            alert('删除成功');
            break;
        default:
            alert('未知错误');
            break;
        }
    })
    .catch(error => console.error('Error:', error));
}
function update() {
    const number = document.getElementById('number').value
    const name = document.getElementById('name').value
    const major = document.getElementById('major').value
    const union_code = document.getElementById('union_code').value
    fetch('http://localhost:5000/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            name: name,
            major: major,
            union_code: union_code
        })
    })
    .then(response => response.json())
    .then(data =>{
        const status = data.code;
        console.log(status)
        switch (status) {
        case 1030:
            show()
            alert('更改成功');
            break;
        default:
            alert('未知错误');
            break;
        }
    })
    .catch(error => console.error('Error:', error));
}
function query  () {
    const number = document.getElementById('number').value
    fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number
        })
    })
    .then(response => response.json())
    .then(data =>{
        const status = data.code;
        console.log(status)
        switch (status) {
        case 1040:
            show()
            alert('请求成功');
            break;
        default:
            alert('查询失败');
            break;
        }
    })
    .catch(error => console.error('Error:', error));
}
function clearList() {
    var table = document.getElementById('studentTable');
    // 获取表格中的所有行
    var rows = table.rows;
    // 从表格中移除除了第一行（表头）之外的所有行
    for (var i = rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}