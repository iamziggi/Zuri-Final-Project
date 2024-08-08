// Retrieve the inventory from localStorage and display it
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function displayInventory() {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';

    inventory.forEach(product => {
        if (!product.hidden) {
            const productItem = document.createElement('div');
            productItem.className = 'col-md-4 product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="btn btn-primary btn-details" onclick="viewProduct(${product.id})">View Details</button>
            `;
            productList.appendChild(productItem);
        }
    });
}

// Function to view product details
function viewProduct(productId) {
    const product = inventory.find(p => p.id == productId);
    if (product) {
        document.querySelector('#product-detail .product-detail-image').src = product.image;
        document.querySelector('#product-detail .product-name').textContent = product.name;
        document.querySelector('#product-detail .product-description').textContent = `Available Variations: ${product.variations.join(', ')}`;
        document.querySelector('#product-detail .product-price').textContent = `$${product.price}`;

        // Attach product data to the "Add to Cart" button
        document.querySelector('.btn-add-to-cart').setAttribute('data-id', product.id);

        // Scroll to the product detail section
        document.querySelector('#product-detail').scrollIntoView({ behavior: 'smooth' });
    }
}

// Cart operations
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = inventory.find(p => p.id == productId);
    if (product) {
        const existingProduct = cart.find(item => item.id == productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase quantity if already in cart
        } else {
            cart.push({ ...product, quantity: 1 }); // Add new product to cart
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} has been added to your cart.`);
        updateCart();
    }
}

document.querySelector('.btn-add-to-cart').addEventListener('click', function() {
    const productId = this.getAttribute('data-id');
    addToCart(productId);
});

function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'list-group-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="img-thumbnail" width="50">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity}<br>
                Price: $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                <button class="btn btn-danger btn-sm float-right" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
    } else {
        const modalBody = document.querySelector('#checkoutModal .modal-body');
        modalBody.innerHTML = '';

        let total = 0;
        cart.forEach(item => {
            const cartSummaryItem = document.createElement('div');
            cartSummaryItem.innerHTML = `
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity}<br>
                Total: $${(item.price * item.quantity).toFixed(2)}
            `;
            modalBody.appendChild(cartSummaryItem);
            total += item.price * item.quantity;
        });

        const totalAmount = document.createElement('p');
        totalAmount.innerHTML = `<strong>Total Amount: $${total.toFixed(2)}</strong>`;
        modalBody.appendChild(totalAmount);

        // Show the checkout modal
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    }
}

document.querySelector('.btn-checkout').addEventListener('click', checkout);

// Call displayInventory to show the available products when the page loads
displayInventory();
updateCart();
