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
    // 订单基础信息
    content += `联系电话：${phone}\n`;
    content += `订单总价：¥${total.toFixed(2)}\n\n`;
    // 商品列表（每行一个商品，换行显示）
    content += `商品明细：\n`;
    cart.forEach(item => {
        content += `• ${item.name} - 单价¥${item.price} × 数量${item.quantity} = 小计¥${item.price * item.quantity}\n`;
    });

    const aokSendConfig = {
        app_key: '773ac45630557143b0496fff35931363', // 替换为实际密钥
        template_id: 'E_136255352119', // 替换为实际模板ID
        to: 'rycedison@gmail.com', // 你要接收订单的邮箱
        alias: '订单通知', // 发件人名称
        data: {
            username: name, // 用户名
            contactemail: phone,
            content: content, // 订单内容（带换行）
            time: new Date().toLocaleString() // 提交时间
        }
    };

    try {
        const response = await fetch('https://www.aoksend.com/index/api/send_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            data:{
                app_key: aokSendConfig.app_key,
                template_id: aokSendConfig.template_id,
                to: aokSendConfig.to,
                alias: aokSendConfig.alias,
                data: aokSendConfig.data
            }
        });

        const result = await response.json();
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

