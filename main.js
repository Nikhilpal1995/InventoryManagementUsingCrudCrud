const itemForm = document.getElementById("item-form");
const itemNameInput = document.getElementById("item-name");
const itemDescInput = document.getElementById("item-desc");
const itemPriceInput = document.getElementById("item-price");
const itemQuantityInput = document.getElementById("item-quantity");
const itemList = document.getElementById("item-list");

itemForm.addEventListener("submit", addItem);

function addItem(e) {
  e.preventDefault();

  const itemName = itemNameInput.value;
  const itemDesc = itemDescInput.value;
  const itemPrice = itemPriceInput.value;
  const itemQuantity = itemQuantityInput.value;

  const item = {
    name: itemName,
    description: itemDesc,
    price: itemPrice,
    quantity: itemQuantity
  };

  // Perform a POST request to add the item to the cloud storage
  axios.post("https://crudcrud.com/api/e57d7d035eff47cda7e9d2ae838f0a33/inventory", item)
    .then(response => {
      console.log(response.data);
      displayItem(response.data);
      clearForm();
    })
    .catch(error => {
      console.error(error);
    });
}

function displayItem(item) {
    const li = document.createElement("li");
    li.setAttribute("data-item-id", item._id);
    li.innerHTML = `
      <strong>${item.name}</strong> - ${item.description} - ${item.price} - ${item.quantity}
      <button class="btn buy-btn" data-quantity="1">BUY 1</button>
      <button class="btn buy-btn" data-quantity="2">BUY 2</button>
      <button class="btn buy-btn" data-quantity="3">BUY 3</button>
    `;
  
    const buyButtons = li.querySelectorAll(".buy-btn");
  
    buyButtons.forEach(button => {
        button.addEventListener("click", () => {
          const itemId = li.getAttribute("data-item-id");
          buyItem(itemId, parseInt(button.getAttribute("data-quantity")), li);
        });
    });
  
    itemList.appendChild(li);
  }
  
  function buyItem(itemId, quantityToBuy, liElement) {
    axios.get(`https://crudcrud.com/api/e57d7d035eff47cda7e9d2ae838f0a33/inventory/${itemId}`)
      .then(response => {
        const item = response.data;
  
        if (quantityToBuy > 0 && quantityToBuy <= item.quantity) {
          item.quantity -= quantityToBuy;
  
          // Perform a PUT request to update the item's quantity in the cloud storage
          axios.put(`https://crudcrud.com/api/e57d7d035eff47cda7e9d2ae838f0a33/inventory/${itemId}`, item)
            .then(response => {
              console.log(response.data);
              updateQuantity(item, liElement);
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          alert("Invalid quantity.");
        }
      })
      .catch(error => {
        console.error(error);
    });
  }
  
  
  function updateQuantity(item, liElement) {
    const quantitySpan = liElement.querySelector("span.quantity");
    if (quantitySpan) {
      quantitySpan.textContent = item.quantity;
    }
  }


function clearForm() {
  itemNameInput.value = "";
  itemDescInput.value = "";
  itemPriceInput.value = "";
  itemQuantityInput.value = "";
}

// Fetch and display existing items when the page loads
axios.get("https://crudcrud.com/api/e57d7d035eff47cda7e9d2ae838f0a33/inventory")
  .then(response => {
    const items = response.data;
    items.forEach(item => {
      displayItem(item);
    });
  })
  .catch(error => {
    console.error(error);
  });
