window.onload = function () {
  renderPets();
};


// Haustierkarten anzeigen
function renderPets() {
  let petCards = document.getElementById("petCards");

  let savedDog = JSON.parse(localStorage.getItem("dog"));
  let savedImage = localStorage.getItem("dogImage");

  let pets = [
    {
      name: savedDog?.name || "Mailo",
      species: savedDog?.species || "dog",
      breed: savedDog?.breed || "Kleinpudel",
      gender: savedDog?.gender || "male",
      birthday: savedDog?.birthday || "2024-09-11",
      image: savedImage || "Mailo.jpg",
      real: true
    },

    {
      name: "Luna",
      species: "cat",
      breed: "Europäisch Kurzhaar",
      gender: "female",
      birthday: "2022-05-12",
      image: "tier-icon.png",
      real: false
    },

    {
      name: "Balu",
      species: "dog",
      breed: "Labrador",
      gender: "male",
      birthday: "2021-03-20",
      image: "tier-icon.png",
      real: false
    }
  ];

  petCards.innerHTML = "";

  pets.forEach(function(pet) {
    let genderClass = "";

    if (pet.gender === "female") {
      genderClass = "female";
    }

    if (!pet.real) {
      genderClass += " dummy";
    }

    petCards.innerHTML += `
      <div class="pet-card">

        <div class="pet-top">
          <img src="${pet.image}" alt="${pet.name}" class="pet-img">

          <div class="pet-info">
            <h3>${pet.name}</h3>
            <p>${formatSpecies(pet.species)} · ${pet.breed}</p>
            <p>${calculateAge(pet.birthday)}</p>
            <span class="badge ${genderClass}">
              ${formatGender(pet.gender)}
            </span>
          </div>
        </div>

        <div class="pet-actions">
          <button onclick="openProfile(${pet.real})">
            Profil ansehen
          </button>

          <button onclick="editPet(${pet.real})">
            Bearbeiten
          </button>

          <button onclick="openQRCode(${pet.real})">
            QR-Code
          </button>

          <button onclick="openFinder(${pet.real})">
            Finder-Seite
          </button>
        </div>

      </div>
    `;
  });
}


// Mailo-Daten vorbereiten, falls noch nichts im Browser gespeichert ist
function ensureMailoData() {
  let dog = JSON.parse(localStorage.getItem("dog"));
  let contacts = JSON.parse(localStorage.getItem("contacts"));

  if (!dog) {
    dog = {
      name: "Mailo",
      species: "dog",
      breed: "Kleinpudel",
      gender: "male",
      birthday: "2024-09-11",
      kastriert: "ja",
      weight: "8",
      chipNumber: "689497643",
      note: "allergie gegen Huhn"
    };

    localStorage.setItem("dog", JSON.stringify(dog));
  }

  if (!contacts || contacts.length === 0) {
    contacts = [
      {
        name: "Nele",
        phone: "26546"
      }
    ];

    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
}


// Buttons für Mailo / Dummy-Profile
function openProfile(isReal) {
  if (isReal) {
    ensureMailoData();
    window.location.href = "view.html";
  } else {
    alert("Dieses Profil ist nur ein Dummy-Beispiel.");
  }
}


function editPet(isReal) {
  if (isReal) {
    ensureMailoData();
    window.location.href = "hundeeingabe.html";
  } else {
    alert("Dummy-Profile können nicht bearbeitet werden.");
  }
}


function openQRCode(isReal) {
  if (isReal) {
    ensureMailoData();
    window.location.href = "view.html#qrcode";
  } else {
    alert("Für Dummy-Profile gibt es keinen echten QR-Code.");
  }
}


function openFinder(isReal) {
  if (isReal) {
    window.location.href = createFinderLink();
  } else {
    alert("Die Finder-Seite ist nur für Mailo aktiv.");
  }
}


// Finder-Link für Mailo erstellen
function createFinderLink() {
  let dog = JSON.parse(localStorage.getItem("dog"));
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  let contact = contacts[0] || {};

  if (!dog) {
    dog = {
      name: "Mailo",
      species: "dog",
      breed: "Kleinpudel",
      gender: "male",
      birthday: "2024-09-11",
      kastriert: "ja",
      weight: "8",
      chipNumber: "689497643",
      note: "allergie gegen Huhn"
    };
  }

  if (!contact.name) {
    contact.name = "Nele";
  }

  if (!contact.phone) {
    contact.phone = "26546";
  }

  let params = new URLSearchParams();

  params.set("name", dog.name || "");
  params.set("breed", dog.breed || "");
  params.set("note", dog.note || "");
  params.set("weight", dog.weight || "");
  params.set("gender", dog.gender || "");
  params.set("birthday", dog.birthday || "");
  params.set("kastriert", dog.kastriert || "");
  params.set("contactName", contact.name || "");
  params.set("contactPhone", contact.phone || "");

  return getBasePath() + "finder.html?" + params.toString();
}


// Automatisch richtigen Pfad bilden
function getBasePath() {
  let path = window.location.pathname;
  let folder = path.substring(0, path.lastIndexOf("/") + 1);

  return window.location.origin + folder;
}


// Formatierungen
function formatSpecies(species) {
  if (species === "dog") {
    return "Hund";
  }

  if (species === "cat") {
    return "Katze";
  }

  return "Sonstige";
}


function formatGender(gender) {
  if (gender === "male") {
    return "Männlich";
  }

  if (gender === "female") {
    return "Weiblich";
  }

  return "-";
}


function calculateAge(birthday) {
  if (!birthday) {
    return "-";
  }

  let birthDate = new Date(birthday);
  let today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 1) {
    return "unter 1 Jahr";
  }

  if (age === 1) {
    return "1 Jahr";
  }

  return age + " Jahre";
}
