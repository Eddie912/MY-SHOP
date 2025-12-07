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
function placeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (!name || !phone) {
        alert('请填写姓名和电话');
        return;
    }

    // 计算总价
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 构建邮件内容
    let emailContent = `新订单:\n\n`;
    emailContent += `客户信息:\n姓名: ${name}\n电话: ${phone}\n\n`;
    emailContent += `订单详情:\n`;

    cart.forEach(item => {
        emailContent += `${item.name} - ¥${item.price} × ${item.quantity} = ¥${item.price * item.quantity}\n`;
    });

    emailContent += `\n总计: ¥${total}`;

    // 使用mailto发送邮件
    const subject = encodeURIComponent(`新订单 - ${name}`);
    const body = encodeURIComponent(emailContent);
    window.location.href = `mailto:你的邮箱@example.com?subject=${subject}&body=${body}`;

    // 清空购物车
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('订单已提交！我们会尽快与您联系。');
    window.location.href = 'index.html';
}

// 页面加载时渲染购物车
document.addEventListener('DOMContentLoaded', renderCart);