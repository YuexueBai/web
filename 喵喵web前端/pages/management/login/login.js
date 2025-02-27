function login() {
    // 获取输入框中的账号和密码
    const account = document.getElementById('account').value
    const password = document.getElementById('password').value
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            account: account,
            password: password
        })
    })
    .then(response => response.json())
    .then(data =>{
        const status = data.code
        console.log(status)
        switch (status) {
        case 1000:
            window.location.href = '../index/index.html'
            alert('登陆成功')
            break
        case 1001:
            alert('账号或密码错误')
            break
        default:
            alert('未知错误')
            break
        }
    })
    .catch(error => console.error('Error:', error));
}
function register(){
    window.location.href = '../register/register.html'
}