// 从本地存储获取购物车数据
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 渲染购物车商品
function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>购物车是空的</p >';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>¥${item.price} × ${item.quantity}</p >
            </div>
            <div>
                <p>¥${item.price * item.quantity}</p >
                <button onclick="removeFromCart(${item.id})">删除</button>
            </div>
        `;
        cartContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    // 添加总计
    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `<h3>总计: ¥${total}</h3>`;
    cartContainer.appendChild(totalElement);
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// 提交订单
async function placeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (!name || !phone) {
        alert('请填写姓名和电话');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let content = '';
    content += `订单总价：¥${total.toFixed(2)}<br><br>\r\n\r\n`; // 替换\n为\r\n
    content += `商品明细：<br>\r\n`;
    cart.forEach(item => {
        content += `• ${item.name} - 单价¥ ${item.price} × 数量 ${item.quantity} = 小计¥ ${item.price * item.quantity}<br>\r\n`;
    });

    try {
        // 1. 拼接URL参数（官方样例方式）
        const baseUrl = 'https://www.aoksend.com/index/api/send_email';
        const urlParams = new URLSearchParams({
            app_key: '773ac45630557143b0496fff35931363',
            template_id: 'E_136255352119',
            to: 'anxinshun@126.com',
            alias: '订单通知' // 可选参数也拼到URL里
        });
        const fullUrl = `${baseUrl}?${urlParams.toString()}`;

        // 2. 构造请求体（传递data参数，需转成URL编码格式）
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify({
            username: name,
            content: content,
            time: new Date().toLocaleString()
        }));

        // 3. 按官方样例的fetch格式请求
        const response = await fetch(fullUrl, {
            method: 'POST',
            redirect: 'follow', // 官方样例的redirect配置
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 适配form-data格式
            },
            body: formData.toString() // 请求体传data参数
        });

        // 4. 解析响应（按官方样例先转文本）
        const resultText = await response.text();
        let result;
        try {
            result = JSON.parse(resultText); // 尝试转JSON
        } catch (e) {
            result = { code: -1, msg: resultText }; // 非JSON则直接存文本
        }

        // 5. 原有结果处理逻辑（不变）
        if (result.code === 200) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('订单已提交！我们会尽快与您联系。');
            window.location.href = 'index.html';
        } else {
            alert('订单提交失败：' + (result.msg || '未知错误'));
        }
    } catch (error) {
        console.error('调用AokSend失败：', error);
        alert('网络异常，请稍后重试！');
    }
}


// 页面加载时渲染购物车
document.addEventListener('DOMContentLoaded', renderCart);

