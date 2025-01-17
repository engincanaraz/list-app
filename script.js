// DOM elementlerini seçiyoruz
const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const retroGridContainer = document.getElementById("retro-grid");

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener("DOMContentLoaded", function () {
  
  // Başlangıç öğelerini yükle
  loadItems();

  // Form gönderildiğinde yeni öğe ekleme işlemini başlat
  shoppingForm.addEventListener("submit", handleFormSubmit);

  // Filtreleme butonlarına tıklama olaylarını ekle
  for (let button of filterButtons) {
    button.addEventListener("click", handleFilterSelection);
  }
});

// Başlangıç öğelerini yükleyen fonksiyon
function loadItems() {
  // Örnek öğeler (gerçek uygulamada bu veriler bir API'den veya local storage'dan gelebilir)
  const items = [
    { id: 1, name: "Yemek yap", completed: false },
    { id: 2, name: "Belgeleri al", completed: true },
    { id: 3, name: "İlerleme raporu hazırla", completed: true },
    { id: 4, name: "Günlük ilaç", completed: false },
    { id: 5, name: "Haftasonu için alışveriş", completed: false },
  ];
  
  // Listeyi temizle ve öğeleri ekle
  shoppingList.innerHTML = "";
  for (let item of items) {
    const li = createListItem(item);
    shoppingList.appendChild(li);
  }
}

// Yeni öğe ekleyen fonksiyon
function addItem(input) {
  // Benzersiz bir ID oluştur
  const id = generateId();
  
  // Yeni öğeyi oluştur ve listenin başına ekle
  const newItem = createListItem({
    id: id,
    name: input.value,
    completed: false,
  });
  shoppingList.prepend(newItem);
  
  // Input alanını temizle ve filtreleri güncelle
  input.value = "";
  uptadeFilterItems();
}

// Benzersiz ID oluşturan yardımcı fonksiyon
function generateId() {
  return Date.now().toString();
}

// Form gönderimini işleyen fonksiyon
function handleFormSubmit(e) {
  e.preventDefault();
  
  const input = document.getElementById("item_name");
  
  // Boş girişleri kontrol et
  if (input.value.trim().length === 0) {
    alert("Lütfen bir görev adı giriniz");
    return;
  }
  
  // Yeni öğeyi ekle
  addItem(input);
}

// Öğenin tamamlanma durumunu değiştiren fonksiyon
function toggleCompleted(e) {
  const li = e.target.parentElement;
  li.toggleAttribute("item-completed", e.target.checked);
  uptadeFilterItems();
}

// Yeni liste öğesi oluşturan fonksiyon
function createListItem(item) {
  // Öğe adını içeren div elementi
  const div = document.createElement("div");
  div.textContent = item.name;
  div.className = "item-name";
  div.addEventListener("click", openEditMode);
  div.addEventListener("blur", closeEditMode);
  div.addEventListener("keydown", cancelEnter);

  // Checkbox elementi
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "form-check-input";
  input.checked = item.completed;
  input.addEventListener("change", toggleCompleted);

  // Silme ikonu
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fs-3 bi bi-trash text-danger delete-icon";
  deleteIcon.addEventListener("click", removeItem);

  // Ana liste öğesi
  const li = document.createElement("li");
  li.className = "border rounded p-2 mb-1";
  li.toggleAttribute("item-completed", item.completed);

  // Elementleri birleştir
  li.appendChild(input);
  li.appendChild(div);
  li.appendChild(deleteIcon);

  return li;
}

// Öğeyi listeden kaldıran fonksiyon
function removeItem(e) {
  const li = e.target.parentElement;
  // Animasyonlu silme efekti
  li.style.transform = "translateX(100%)";
  li.style.opacity = "0";
  setTimeout(() => {
    shoppingList.removeChild(li);
  }, 300);
}

// Düzenleme modunu açan fonksiyon
function openEditMode(e) {
  const div = e.target;
  div.contentEditable = true;
  div.focus();
}

// Düzenleme modunu kapatan fonksiyon
function closeEditMode(e) {
  const div = e.target;
  div.contentEditable = false;
}

// Enter tuşuna basıldığında düzenleme modundan çıkan fonksiyon
function cancelEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
}

// Filtre seçimini işleyen fonksiyon
function handleFilterSelection(e) {
  // Aktif filtre butonunu güncelle
  filterButtons.forEach(btn => btn.classList.remove("btn-primary"));
  filterButtons.forEach(btn => btn.classList.add("btn-secondary"));
  e.target.classList.remove("btn-secondary");
  e.target.classList.add("btn-primary");
  
  // Seçilen filtreye göre öğeleri filtrele
  const filterType = e.target.getAttribute("item-filter");
  filterItems(filterType);
}

// Öğeleri filtreleyen fonksiyon
function filterItems(filterType) {
  const items = shoppingList.querySelectorAll("li");
  
  items.forEach(item => {
    switch(filterType) {
      case "completed":
        item.style.display = item.hasAttribute("item-completed") ? "" : "none";
        break;
      case "uncompleted":
        item.style.display = !item.hasAttribute("item-completed") ? "" : "none";
        break;
      default: // "all"
        item.style.display = "";
    }
  });
}

// Aktif filtreyi güncelleyen fonksiyon
function uptadeFilterItems() {
  const activeFilter = document.querySelector(".filter-buttons .btn-primary");
  filterItems(activeFilter.getAttribute("item-filter"));
}

// RetroGrid'i başlat
function RetroGrid() {
  return '<div class="retro-grid">Retro Grid</div>';
}
