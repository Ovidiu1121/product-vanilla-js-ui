export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
    	<h1>Products</h1>

    <button class="button">Add product</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Name</th>
				<th>Price</th>
				<th>Stock</th>
				<th>Producer</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `

    api("https://localhost:7040/api/v1/Product/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachProducts(data.productList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddProductPage();
    });

}

export function CreateAddProductPage() {

    let container = document.querySelector(".container");

    container.innerHTML = `
    
      <h1>New Product</h1>
    <form>
        <p class="name-container">
            <label for="name">Name</label>
            <input name="name" type="text" id="name">
            <a class="nameErr">Name required!</a>
        </p>
        <p class="price-container">
            <label for="price">Price</label>
            <input name="price" type="text" id="price">
            <a class="priceErr">Price required!</a>
        </p>
        <p class="stock-container">
            <label for="stock">Stock</label>
            <input name="stock" type="text" id="stock">
            <a class="stockErr">Stock required!</a>
        </p>
         <p class="producer-container">
            <label for="producer">Producer</label>
            <input name="producer" type="text" id="producer">
            <a class="producerErr">Producer required!</a>
        </p>
        <div class="createProduct">
         <a href="#">Create New Product</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createProduct");

    button.addEventListener("click", (eve) => {
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createProduct();
    })

}

function createRow(product) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${product.id}</td>
				<td>${product.name}</td>
				<td>${product.price}</td>
				<td>${product.stock}</td>
				<td>${product.producer}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachProducts(products) {

    let lista = document.querySelector("thead");

    products.forEach(pr => {

        let tr = createRow(pr);
        lista.appendChild(tr);

    });

    return lista;

}

function createProduct() {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let stock = document.getElementById("stock").value;
    let producer = document.getElementById("producer").value;

    let nameError = document.querySelector(".nameErr");
    let priceError = document.querySelector(".priceErr");
    let stockError = document.querySelector(".stockErr");
    let producerError = document.querySelector(".producerErr");

    let errors = [];

    if (name == '') {

        errors.push("Name");

    } else if (nameError.classList.contains("beDisplayed") && name !== '') {

        errors.pop("Name");
        nameError.classList.remove("beDisplayed");
    }

    if (price == '') {

        errors.push("Price");

    } else if (priceError.classList.contains("beDisplayed") && price !== '') {

        errors.pop("Price");
        priceError.classList.remove("beDisplayed");
    }

    if (stock == '') {

        errors.push("Stock");

    } else if (stockError.classList.contains("beDisplayed") && stock !== '') {

        errors.pop("Stock");
        stockError.classList.remove("beDisplayed");

    }

    if (producer == '') {

        errors.push("Producer");

    } else if (producerError.classList.contains("beDisplayed") && producer !== '') {

        errors.pop("Producer");
        producerError.classList.remove("beDisplayed");

    }

    if (!isNumber(price) && price != '') {

        errors.push("Price2");
    }
    else if (isNumber(price)) {

        errors.pop("Price2");

    } else if (priceError.classList.contains("beDisplayed") && price !== '') {

        errors.pop("Price2");
        priceError.classList.remove("beDisplayed");
    }

    if (!isNumber(stock) && stock != '') {

        errors.push("Stock2");
    }
    else if (isNumber(stock)) {

        errors.pop("Stock2");

    } else if (stockError.classList.contains("beDisplayed") && stock !== '') {

        errors.pop("Stock2");
        stockError.classList.remove("beDisplayed");
    }

    if (errors.length == 0) {

        let product = {
            name: name,
            price: price,
            stock: stock,
            producer: producer
        }

        api("https://localhost:7040/api/v1/Product/create", "POST", product)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {

        errors.forEach(err => {

            if (err.includes("Name")) {

                nameError.classList.add("beDisplayed");
            }

            if (err.includes("Price")) {

                priceError.classList.add("beDisplayed");
            }

            if (err.includes("Stock")) {

                stockError.classList.add("beDisplayed");
            }

            if (err.includes("Producer")) {

                producerError.classList.add("beDisplayed");
            }

            if (err.includes("Stock2")) {
                stockError.classList.add("beDisplayed")
                stockError.textContent = "Only numbers";
            }

            if (err.includes("Price2")) {
                priceError.classList.add("beDisplayed")
                priceError.textContent = "Only numbers";
            }

        })

    }

}