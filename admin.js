document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let productName = document.getElementById('productName').value;
    let productPrice = document.getElementById('productPrice').value;
    let productStock = document.getElementById('productStock').value;
    let productVariations = document.getElementById('productVariations').value.split(',');
    let productImage = document.getElementById('productImage').files[0];

    let reader = new FileReader();
    reader.readAsDataURL(productImage);
    reader.onload = function() {
        let product = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            stock: productStock,
            variations: productVariations,
            image: reader.result,
            hidden: false
        };

        addProductToInventory(product);
        displayProducts();
    };

    this.reset();
});

let inventory = JSON.parse(localStorage.getItem('inventory')) || []; // Load inventory from local storage

function addProductToInventory(product) {
    inventory.push(product);
    localStorage.setItem('inventory', JSON.stringify(inventory)); // Save to local storage
}

function displayProducts() {
    let productList = document.getElementById('productList');
    productList.innerHTML = '';

    inventory.forEach((product, index) => {
        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="img-fluid mb-2">
            <strong>${product.name}</strong><br>
            Price: $${product.price}<br>
            Stock: ${product.stock}<br>
            Variations: ${product.variations.join(', ')}<br>
            <button class="btn btn-primary btn-sm edit-button" data-id="${product.id}" data-toggle="modal" data-target="#editProductModal">Edit</button>
            <button class="btn btn-danger btn-sm delete-button" data-id="${product.id}">Delete</button>
            <button class="btn btn-warning btn-sm hide-button" data-id="${product.id}">${product.hidden ? 'Show' : 'Hide'}</button>
        `;
        productList.appendChild(li);
    });

    // Add event listeners for edit, delete, and hide buttons
    document.querySelectorAll('.edit-button').forEach(button => button.addEventListener('click', handleEdit));
    document.querySelectorAll('.delete-button').forEach(button => button.addEventListener('click', handleDelete));
    document.querySelectorAll('.hide-button').forEach(button => button.addEventListener('click', handleHide));
}

// Call displayProducts to show existing products when the page loads
displayProducts();

function handleEdit(event) {
    const productId = event.target.getAttribute('data-id');
    const product = inventory.find(p => p.id == productId);

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductVariations').value = product.variations.join(', ');

    document.getElementById('editProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProductChanges();
    });
}

function saveProductChanges() {
    const productId = document.getElementById('editProductId').value;
    const productName = document.getElementById('editProductName').value;
    const productPrice = document.getElementById('editProductPrice').value;
    const productStock = document.getElementById('editProductStock').value;
    const productVariations = document.getElementById('editProductVariations').value.split(',');
    const productImageFile = document.getElementById('editProductImage').files[0];

    let product = inventory.find(p => p.id == productId);

    if (productImageFile) {
        let reader = new FileReader();
        reader.readAsDataURL(productImageFile);
        reader.onload = function() {
            product.image = reader.result;
            updateProductDetails(product, productName, productPrice, productStock, productVariations);
        };
    } else {
        updateProductDetails(product, productName, productPrice, productStock, productVariations);
    }
}

function updateProductDetails(product, name, price, stock, variations) {
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.variations = variations;

    localStorage.setItem('inventory', JSON.stringify(inventory)); // Update local storage
    displayProducts();
    $('#editProductModal').modal('hide');
}

function handleDelete(event) {
    const productId = event.target.getAttribute('data-id');
    inventory = inventory.filter(p => p.id != productId);
    localStorage.setItem('inventory', JSON.stringify(inventory)); // Update local storage
    displayProducts();
}

function handleHide(event) {
    const productId = event.target.getAttribute('data-id');
    const product = inventory.find(p => p.id == productId);
    product.hidden = !product.hidden;
    localStorage.setItem('inventory', JSON.stringify(inventory)); // Update local storage
    displayProducts();
}
