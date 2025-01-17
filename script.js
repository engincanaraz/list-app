// DOM elementlerini seçiyoruz
const todoList = document.querySelector(".todo-list");
const todoForm = document.querySelector(".todo-form");
const filterButtons = document.querySelectorAll("[item-filter]");
const clearButton = document.querySelector(".clear");

// Motivasyon mesajları
const motivationMessages = {
  empty: [
    "Bugün tamamlayacak harika şeyler seni bekliyor!",
    "Yeni bir güne başlamak için mükemmel bir zaman!",
    "Hedeflerini belirle ve başla!",
    "Her büyük başarı küçük adımlarla başlar!"
  ],
  completed: [
    "Harika iş çıkardın! Daha fazlasını başarabilirsin!",
    "Her tamamlanan görev, başarıya giden yolda bir adım!",
    "Muhteşem! Kendini aşmaya devam et!",
    "Bu tempoda devam et, hedeflerine çok yakınsın!"
  ],
  progress: [
    "Güzel ilerliyorsun, devam et!",
    "Her adım seni hedefe yaklaştırıyor!",
    "İnanıyorum, bugün harika işler başaracaksın!",
    "Motivasyonun yüksek, hedeflerine doğru ilerliyorsun!"
  ]
};

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener("DOMContentLoaded", function () {
  // Başlangıç öğelerini yükle
  loadItems();
  uptadeState();

  // Event listener'ları ekle
  todoForm.addEventListener("submit", handleFormSubmit);
  clearButton.addEventListener("click", clearItems);

  for (let button of filterButtons) {
    button.addEventListener("click", handleFilterSelection);
  }
});

// Rastgele motivasyon mesajı seç
function getRandomMessage(type) {
  const messages = motivationMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Motivasyon mesajını göster
function showMotivationMessage(type) {
  const motivationElement = document.querySelector(".motivation-message");
  const messageElement = motivationElement.querySelector(".message");
  
  messageElement.textContent = getRandomMessage(type);
  motivationElement.classList.remove("d-none");
  
  // 5 saniye sonra mesajı gizle
  setTimeout(() => {
    motivationElement.classList.add("d-none");
  }, 10000);
}

// Uygulama durumunu güncelleme
function uptadeState() {
  const isEmpty = todoList.querySelectorAll("li").length == 0;
  const alert = document.querySelector(".alert");
  const filterBtns = document.querySelector(".filter-buttons");

  if (isEmpty) {
    alert.classList.remove("d-none");
    alert.textContent = getRandomMessage("empty");
    clearButton.classList.add("d-none");
    filterBtns.classList.add("d-none");
  } else {
    alert.classList.add("d-none");
    clearButton.classList.remove("d-none");
    filterBtns.classList.remove("d-none");
  }
}

// LocalStorage'a kaydetme
function saveToLocalStorage() {
  const listItem = todoList.querySelectorAll("li");
  const list = [];

  for (let li of listItem) {
    const id = li.getAttribute("item-id");
    const name = li.querySelector(".item-name").textContent;
    const completed = li.hasAttribute("item-completed");
    list.push({ id, name, completed });
  }

  localStorage.setItem("todoItems", JSON.stringify(list));
}

// Görevleri yükleme
function loadItems() {
  const items = JSON.parse(localStorage.getItem("todoItems")) || [];

  todoList.innerHTML = "";
  for (let item of items) {
    const li = createListItem(item);
    todoList.appendChild(li);
  }
  uptadeState();
}

// Yeni görev ekleme
function addItem(input) {
  const id = generateId();

  const newItem = createListItem({
    id: id,
    name: input.value,
    completed: false
  });

  todoList.prepend(newItem);
  input.value = "";
  uptadeFilterItems();
  uptadeState();
  saveToLocalStorage();
  showMotivationMessage("progress");
}

// Benzersiz ID oluşturma
function generateId() {
  return Date.now().toString();
}

// Form gönderimini işleme
function handleFormSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("item_name");

  if (input.value.trim().length === 0) {
    alert("Lütfen bir görev adı giriniz");
    return;
  }

  addItem(input);
}

// Görev tamamlama durumunu değiştirme
function toggleComplete(e) {
  const item = e.target.closest("li");
  const wasCompleted = item.hasAttribute("item-completed");
  
  if (wasCompleted) {
    item.removeAttribute("item-completed");
  } else {
    item.setAttribute("item-completed", "");
    showMotivationMessage("completed");
  }
  
  saveToLocalStorage();
  uptadeFilterItems();
}

// Görev silme
function removeItem(e) {
  const item = e.target.closest("li");
  
  // Silme animasyonu
  item.style.transform = "translateX(100%)";
  item.style.opacity = "0";
  
  setTimeout(() => {
    item.remove();
    uptadeState();
    saveToLocalStorage();
    uptadeFilterItems();
  }, 300);
}

// Tüm görevleri silme
function clearItems() {
  if (confirm("Tüm görevleri silmek istediğinize emin misiniz?")) {
    todoList.innerHTML = "";
    uptadeState();
    saveToLocalStorage();
    uptadeFilterItems();
  }
}

// Liste öğesi oluşturma
function createListItem(item) {
  const li = document.createElement("li");
  li.setAttribute("item-id", item.id);
  if (item.completed) li.setAttribute("item-completed", "");

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "form-check-input";
  checkbox.checked = item.completed;
  checkbox.addEventListener("change", toggleComplete);

  // Görev adı
  const itemName = document.createElement("span");
  itemName.className = "item-name";
  itemName.textContent = item.name;

  // Silme ikonu
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fs-3 bi bi-trash color-primary delete-icon";
  deleteIcon.addEventListener("click", removeItem);

  // Ana liste öğesi
  li.appendChild(checkbox);
  li.appendChild(itemName);
  li.appendChild(deleteIcon);

  return li;
}

// Filtre seçimini işleme
function handleFilterSelection(e) {
  filterButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-secondary");
  });

  e.target.classList.remove("btn-secondary");
  e.target.classList.add("btn-primary");

  uptadeFilterItems(e.target.getAttribute("item-filter"));
}

// Görevleri filtreleme
function uptadeFilterItems(filterType = "all") {
  const items = todoList.querySelectorAll("li");

  items.forEach((item) => {
    switch (filterType) {
      case "completed":
        item.style.display = item.hasAttribute("item-completed") ? "" : "none";
        break;
      case "uncompleted":
        item.style.display = !item.hasAttribute("item-completed") ? "" : "none";
        break;
      default:
        item.style.display = "";
    }
  });
}
