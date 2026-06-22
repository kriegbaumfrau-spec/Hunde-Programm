window.onload = function () {

  // Bild laden 
  let img = localStorage.getItem("dogImage");

  if (img) {
    document.getElementById("imageOutput").src = img;
  }

  // Daten laden
  let dog = JSON.parse(localStorage.getItem("dog"));

  if (dog) {
    document.getElementById("nameOutput").innerText = dog.name || "";
    document.getElementById("breedOutput").innerText = dog.breed || "";
    document.getElementById("noteOutput").innerText = dog.note || "";

    document.getElementById("weightOutput").innerText = dog.weight
      ? dog.weight + " kg"
      : "-";

    document.getElementById("genderOutput").innerText = formatGender(dog.gender);
    document.getElementById("ageOutput").innerText = calculateAge(dog.birthday);

    document.getElementById("kastriertCardOutput").innerText =
      formatKastriert(dog.kastriert);
  }

  renderOwnerContact();
  createFinderQRCode();
};


// Geschlecht anzeigen
function formatGender(gender) {
  if (gender === "male") {
    return "Männlich";
  }

  if (gender === "female") {
    return "Weiblich";
  }

  return "-";
}


// Kastriert anzeigen
function formatKastriert(value) {
  if (value === "ja") {
    return "Kastriert";
  }

  if (value === "nein") {
    return "Nicht";
  }

  return "-";
}


// Alter berechnen
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
    let months =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      today.getMonth() -
      birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
      months--;
    }

    return months + " Monate";
  }

  if (age === 1) {
    return "1 Jahr";
  }

  return age + " Jahre";
}


// Button bearbeiten 
function goToEdit() {
  window.location.href = "hundeeingabe.html";
}


// Standort senden 
function getOwnerPhoneNumber() {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  if (contacts.length === 0) {
    alert("Es wurde noch keine Kontaktperson gespeichert.");
    return null;
  }

  let phone = contacts[0].phone;

  phone = phone.replace(/\s/g, "");
  phone = phone.replace("+", "");
  phone = phone.replace(/\//g, "");
  phone = phone.replace(/-/g, "");

  if (phone.startsWith("0")) {
    phone = "49" + phone.substring(1);
  }

  return phone;
}


function getLocationAndSend(type) {
  let ownerPhoneNumber = getOwnerPhoneNumber();

  if (!ownerPhoneNumber) {
    return;
  }

  if (!navigator.geolocation) {
    alert("Dein Browser unterstützt keine Standortfreigabe.");
    return;
  }

  alert("Standort wird abgefragt...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      let mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      let message =
        `Hallo, ich habe deinen Hund gefunden. Hier ist mein aktueller Standort: ${mapsLink}`;

      if (type === "whatsapp") {
        window.location.href =
          `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`;
      }

      if (type === "sms") {
        window.location.href =
          `sms:+${ownerPhoneNumber}?body=${encodeURIComponent(message)}`;
      }
    },
    function(error) {
      alert("Standort konnte nicht abgerufen werden. Bitte erlaube den Standortzugriff.");
      console.log(error);
    }
  );
}


function sendLocationWhatsApp() {
  getLocationAndSend("whatsapp");
}


function sendLocationSMS() {
  getLocationAndSend("sms");
}


function toggleSendOptions() {
  let options = document.getElementById("sendOptions");
  options.classList.toggle("show");
}


// Kontakt anzeigen
function renderOwnerContact() {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  let box = document.getElementById("ownerContactBox");

  if (!box) return;

  if (contacts.length === 0) {
    box.innerHTML = "";
    return;
  }

  let contact = contacts[0];
  let firstLetter = contact.name.charAt(0).toUpperCase();

  box.innerHTML = `
    <div class="owner-card">
      <div class="owner-avatar">${firstLetter}</div>

      <div class="owner-info">
        <strong>${contact.name}´s Telefon</strong>
        <span>${contact.phone}</span>
      </div>

      <a href="tel:${contact.phone}" class="owner-call-btn">✆</a>
    </div>
  `;
}

function createFinderQRCode() {
  let dog = JSON.parse(localStorage.getItem("dog"));
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  if (!dog) {
    return;
  }

  let contact = contacts[0] || {};

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

  let finderLink =
  "https://kriegbaumfrau-spec.github.io/Hunde-Programm/finder.html?" +
  params.toString();
  
  let qrBox = document.getElementById("qrcode");

  if (!qrBox) {
    return;
  }

  qrBox.innerHTML = "";

  new QRCode(qrBox, {
    text: finderLink,
    width: 180,
    height: 180
  });
}
