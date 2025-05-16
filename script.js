let array = JSON.parse(localStorage.getItem("products")) || [
    { id: "1", name: "កូកាកូឡា", price: "1.50", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhRVgHGJuwd9DAeSzyr8cmspq9euLY_hsKMA&s" },
    { id: "2", name: "បាកាស", price: "1.50", image: "https://domnor.com/admin/images/product/2024-05-03-10-17-31_1026_1.jpg?v=1" }
  ];
  
  let currentPage = 1;
  const rowsPerPage = 5;
  
  function showtable(data) {
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedArray = data.slice(start, start + rowsPerPage);
  
    let table = `
      <tr class="bg-primary text-white fw-bold text-center">
        <td>លេខរៀង</td>
        <td>ឈ្មោះទំនិញ</td>
        <td>តម្លៃ</td>
        <td>រូបភាព</td>
        <td>Actions</td>
      </tr>
    `;
  
    if (paginatedArray.length === 0) {
      document.getElementById("error").innerHTML = `<span class="text-danger">មិនមានទិន្នន័យ</span>`;
    } else {
      document.getElementById("error").innerHTML = "";
      paginatedArray.forEach((item, index) => {
        table += `
          <tr class="text-center">
                <td style="text-align: center; vertical-align: middle;">${item.id}</td>
                <td style="text-align: center; vertical-align: middle;">${item.name}</td>
                <td style="text-align: center; vertical-align: middle;">${item.price}</td>
                <td><img src="${item.image}" alt="product" style="width: 80px; height: 80px; object-fit: cover;"></td>
                <td style="text-align: center; vertical-align: middle;">
                <button class="btn btn-warning btn-sm" onclick="editProduct('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${item.id}')">Delete</button>
                </td>
            </tr>`;
      });
    }
  
    document.getElementById("mytable").innerHTML = table;
    setupPagination(data);
  }
  
  function setupPagination(data) {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    let pagination = "";
    for (let i = 1; i <= totalPages; i++) {
      pagination += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <button class="page-link" onclick="changePage(${i})">${i}</button>
        </li>`;
    }
    document.getElementById("pagination").innerHTML = pagination;
  }
  
  function changePage(page) {
    currentPage = page;
    showtable(array);
  }
  
  function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      array = array.filter(item => item.id !== id);
      saveToLocalStorage();
      showtable(array);
    }
  }
  
  function editProduct(id) {
    const product = array.find(item => item.id === id);
    if (!product) return;
  
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productImage").value = product.image;
    document.getElementById("editProductId").value = product.id;
  
    const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
    modal.show();
  }
  
  document.getElementById("addProductForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const idField = document.getElementById("editProductId").value;
    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const image = document.getElementById("productImage").value.trim();
  
    if (idField) {
      const index = array.findIndex(item => item.id === idField);
      if (index !== -1) {
        array[index] = { id: idField, name, price, image };
      }
    } else {
      const newId = (array.length ? Math.max(...array.map(p => parseInt(p.id))) + 1 : 1).toString();
      array.push({ id: newId, name, price, image });
    }
  
    e.target.reset();
    document.getElementById("editProductId").value = "";
    bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
    saveToLocalStorage();
    showtable(array);
  });
  
  document.getElementById("search").addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const filtered = array.filter(item => item.name.toLowerCase().includes(keyword));
    currentPage = 1;
    showtable(filtered);
  });
  
  function saveToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(array));
  }
  
  document.getElementById("exportBtn").addEventListener("click", function () {
    if (array.length === 0) return alert("No data to export!");
  
    let csv = "ID,Name,Price,Image URL\n";
    array.forEach(product => {
      csv += `"${product.id}","${product.name}","${product.price}","${product.image}"\n`;
    });
  
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "products.csv");
    a.click();
    window.URL.revokeObjectURL(url);
  });
  
  // Init
  showtable(array);
  