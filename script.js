
let contacts = [];

// ✅ ALLES BEIM LADEN INITIALISIEREN
window.onload = function () {

  let imageInput = document.getElementById("imageInput");
  let dogImage = document.getElementById("dogImage");
  let cameraIcon = document.querySelector(".camera-icon");

  // ✅ Hundedaten laden
  let savedDog = JSON.parse(localStorage.getItem("dog"));

  if (savedDog) {
    document.getElementById("name").value = savedDog.name || "";
    document.getElementById("species").value = savedDog.species || "";
    document.getElementById("breed").value = savedDog.breed || "";
    document.getElementById("gender").value = savedDog.gender || "";
    document.getElementById("birthday").value = savedDog.birthday || "";
    document.getElementById("kastriert").value = savedDog.kastriert || "";
    document.getElementById("weight").value = savedDog.weight || "";
    document.getElementById("chipNumber").value = savedDog.chipNumber || "";
    document.getElementById("note").value = savedDog.note || "";

    
// ✅ Bild laden
  let savedImage = localStorage.getItem("dogImage");
  if (savedImage && dogImage) {
    dogImage.src = savedImage;
  }

    
// ✅ Kontakte laden
let savedContacts = JSON.parse(localStorage.getItem("contacts"));

if (savedContacts) {
  contacts = savedContacts;
  renderContacts();
}

  }

  // ✅ Klick auf Bild öffnet Datei
  if (dogImage && imageInput) {
    dogImage.onclick = () => imageInput.click();
  }

  if (cameraIcon && imageInput) {
    cameraIcon.onclick = () => imageInput.click();
  }

  // ✅ Bild speichern
  if (imageInput) {
    imageInput.onchange = function () {
      let file = imageInput.files[0];
      if (!file) return;

      let reader = new FileReader();

      reader.onload = function () {
        let imageData = reader.result;
        dogImage.src = imageData;
        localStorage.setItem("dogImage", imageData);
      };

      reader.readAsDataURL(file);
    };
  }

};


// ✅ Speichern Button (nur localStorage)
function saveDog() {
  console.log("Speichern gedrückt");

  let dog = {
    name: document.getElementById("name").value,
    species: document.getElementById("species").value,
    breed: document.getElementById("breed").value,
    gender: document.getElementById("gender").value,
    birthday: document.getElementById("birthday").value,
    kastriert: document.getElementById("kastriert").value,
    weight: document.getElementById("weight").value,
    chipNumber: document.getElementById("chipNumber").value,
    note: document.getElementById("note").value
  };

  localStorage.setItem("dog", JSON.stringify(dog));
}


// ✅ Speichern + zur View-Seite wechseln
function saveAndGo() {

  saveDog();

  window.location.href = "view.html";
}


// ✅ Kontakt hinzufügen (Form zeigen)
function addContact() {
  document.getElementById("addForm").style.display = "block";
}


// ✅ Kontakt speichern
function saveContact() {
  let name = document.getElementById("newName").value;
  let phone = document.getElementById("newPhone").value;

  if (!name || !phone) return;

  let contact = { name, phone };

  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));

  renderContacts();

  // reset
  document.getElementById("newName").value = "";
  document.getElementById("newPhone").value = "";
  document.getElementById("addForm").style.display = "none";
}


// ✅ Kontakte anzeigen
function renderContacts() {
  let list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.forEach((c, index) => {
    list.innerHTML += `
      <div class="contact-card">
        <div class="contact-info">
          <span>${c.name}</span>
          <span>${c.phone}</span>
        </div>

        <div class="actions">
          <a href="tel:${c.phone}" class="call-btn">📞</a>
          <button onclick="deleteContact(${index})" class="delete-btn">🗑️</button>
        </div>
      </div>
    `;
  });
}


// ✅ Kontakt löschen
function deleteContact(index) {
  contacts.splice(index, 1);

  localStorage.setItem("contacts", JSON.stringify(contacts));

  renderContacts();
}
