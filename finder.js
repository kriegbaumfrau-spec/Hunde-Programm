window.onload = function () {

  let params = new URLSearchParams(window.location.search);

  let dog = {
    name: params.get("name") || "",
    breed: params.get("breed") || "",
    note: params.get("note") || "",
    weight: params.get("weight") || "",
    gender: params.get("gender") || "",
    birthday: params.get("birthday") || "",
    kastriert: params.get("kastriert") || ""
  };

  let contact = {
    name: params.get("contactName") || "",
    phone: params.get("contactPhone") || ""
  };

  document.getElementById("nameOutput").innerText = dog.name;
  document.getElementById("breedOutput").innerText = dog.breed;
  document.getElementById("noteOutput").innerText = dog.note;

  document.getElementById("weightOutput").innerText = dog.weight
    ? dog.weight + " kg"
    : "-";

  document.getElementById("genderOutput").innerText = formatGender(dog.gender);
  document.getElementById("ageOutput").innerText = calculateAge(dog.birthday);

  document.getElementById("kastriertCardOutput").innerText =
    formatKastriert(dog.kastriert);

  renderFinderContact(contact);
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


// Standort senden 
function getOwnerPhoneNumber() {
  let params = new URLSearchParams(window.location.search);
  let phone = params.get("contactPhone");

  if (!phone) {
    alert("Es wurde keine Telefonnummer gefunden.");
    return null;
  }

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
function renderFinderContact(contact) {
  let box = document.getElementById("ownerContactBox");

  if (!box) return;

  if (!contact.name || !contact.phone) {
    box.innerHTML = "";
    return;
  }

  let firstLetter = contact.name.charAt(0).toUpperCase();

  box.innerHTML = `
    <div class="owner-card">
      <div class="owner-avatar">${firstLetter}</div>

      <div class="owner-info">
        <strong>${contact.name}'s Telefon</strong>
        <span>${contact.phone}</span>
      </div>

      <a href="tel:${contact.phone}" class="owner-call-btn">✆</a>
    </div>
  `;
}
