let contacts = [];


// Beim Laden der Seite alles vorbereiten
window.onload = function () {
  let imageInput = document.getElementById("imageInput");
  let dogImage = document.getElementById("dogImage");
  let cameraIcon = document.querySelector(".camera-icon");

  loadDogData();
  loadDogImage(dogImage);
  loadContacts();

  // Klick auf Bild öffnet Datei-Auswahl
  if (dogImage && imageInput) {
    dogImage.onclick = function () {
      imageInput.click();
    };
  }

  // Klick auf Kamera-Icon öffnet Datei-Auswahl
  if (cameraIcon && imageInput) {
    cameraIcon.onclick = function () {
      imageInput.click();
    };
  }

  // Bild speichern
  if (imageInput) {
    imageInput.onchange = function () {
      let file = imageInput.files[0];

      if (!file) {
        return;
      }

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


// Hundedaten aus localStorage laden
function loadDogData() {
  let savedDog = JSON.parse(localStorage.getItem("dog"));

  if (!savedDog) {
    return;
  }

  document.getElementById("name").value = savedDog.name || "";
  document.getElementById("species").value = savedDog.species || "";
  document.getElementById("breed").value = savedDog.breed || "";
  document.getElementById("gender").value = savedDog.gender || "";
  document.getElementById("birthday").value = savedDog.birthday || "";
  document.getElementById("kastriert").value = savedDog.kastriert || "";
  document.getElementById("weight").value = savedDog.weight || "";
  document.getElementById("chipNumber").value = savedDog.chipNumber || "";
  document.getElementById("note").value = savedDog.note || "";
}


// Profilbild aus localStorage laden
function loadDogImage(dogImage) {
  let savedImage = localStorage.getItem("dogImage");

  if (savedImage && dogImage) {
    dogImage.src = savedImage;
  }
}


// Kontakte aus localStorage laden
function loadContacts() {
  let savedContacts = JSON.parse(localStorage.getItem("contacts"));

  if (savedContacts) {
    contacts = savedContacts;
  }

  renderContacts();
}


// Hund speichern
function saveDog() {
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


// Speichern und zur Profilseite wechseln
function saveAndGo() {
  saveDog();

  window.location.href = "view.html";
}


// Zurück zur Startseite
function goBack() {
  window.location.href = "index.html";
}


// Kontaktformular anzeigen
function addContact() {
  let form = document.getElementById("addForm");

  if (form) {
    form.style.display = "block";
  }
}


// Kontakt speichern
function saveContact() {
  let name = document.getElementById("newName").value.trim();
  let phone = document.getElementById("newPhone").value.trim();

  if (!name || !phone) {
    alert("Bitte Name und Telefonnummer eingeben.");
    return;
  }

  let contact = {
    name: name,
    phone: phone
  };

  contacts.push(contact);

  localStorage.setItem("contacts", JSON.stringify(contacts));

  document.getElementById("newName").value = "";
  document.getElementById("newPhone").value = "";
  document.getElementById("addForm").style.display = "none";

  renderContacts();
}


// Kontakte anzeigen
function renderContacts() {
  let list = document.getElementById("contactList");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  contacts.forEach(function (contact, index) {
    let firstLetter = contact.name.charAt(0).toUpperCase();

    list.innerHTML += `
      <div class="contact-card">

        <div class="contact-info">
          <div class="contact-avatar">${firstLetter}</div>

          <div class="contact-text">
            <strong>${contact.name}</strong>
            <span>${contact.phone}</span>
          </div>
        </div>

        <div class="actions">
          <a href="tel:${contact.phone}" class="call-btn">☎</a>
          <button onclick="deleteContact(${index})" class="delete-btn">🗑</button>
        </div>

      </div>
    `;
  });
}


// Kontakt löschen
function deleteContact(index) {
  contacts.splice(index, 1);

  localStorage.setItem("contacts", JSON.stringify(contacts));

  renderContacts();
}
