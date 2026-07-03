document.addEventListener("DOMContentLoaded", function () {
  loadFinderProfile();
});


function loadFinderProfile() {
  let params = new URLSearchParams(window.location.search);

  let name = params.get("name") || "Mailo";
  let breed = params.get("breed") || "Kleinpudel";
  let note = params.get("note") || "Allergie gegen Huhn";
  let weight = params.get("weight") || "8";
  let gender = params.get("gender") || "male";
  let birthday = params.get("birthday") || "2024-09-11";
  let kastriert = params.get("kastriert") || "ja";
  let contactName = params.get("contactName") || "Nele";
  let contactPhone = params.get("contactPhone") || "0176 5555555";

  document.getElementById("dogName").textContent = name;
  document.getElementById("dogBreed").textContent = "Hund · " + breed;
  document.getElementById("dogNote").textContent = note;

  document.getElementById("weightValue").textContent = weight + " kg";
  document.getElementById("genderValue").textContent = getGenderText(gender);
  document.getElementById("ageValue").textContent = calculateAge(birthday);
  document.getElementById("statusValue").textContent = getKastriertText(kastriert);

  renderContact(contactName, contactPhone);
}


function renderContact(name, phone) {
  let contactList = document.getElementById("contactList");

  if (!contactList) {
    return;
  }

  let firstLetter = name.charAt(0).toUpperCase();

  contactList.innerHTML = `
    <div class="contact-card">
      <div class="contact-left">
        <div class="contact-avatar">${firstLetter}</div>

        <div class="contact-text">
          <strong>${name}</strong>
          <span>${phone}</span>
        </div>
      </div>

      <a href="tel:${phone}" class="call-btn">☎</a>
    </div>
  `;
}


function toggleLocationOptions() {
  let options = document.getElementById("locationOptions");

  if (options) {
    options.classList.toggle("show");
  }
}


function getLocationAndSend(type) {
  let params = new URLSearchParams(window.location.search);
  let phone = params.get("contactPhone") || "0176 5555555";

  if (!navigator.geolocation) {
    alert("Standort wird von diesem Gerät nicht unterstützt.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      let mapsLink = "https://www.google.com/maps?q=" + latitude + "," + longitude;

      let message =
        "Hallo, ich habe dein Haustier gefunden. Hier ist mein Standort: " +
        mapsLink;

      let cleanedPhone = cleanPhoneNumber(phone);

      if (type === "whatsapp") {
        window.location.href =
          "https://wa.me/" + cleanedPhone + "?text=" + encodeURIComponent(message);
      }

      if (type === "sms") {
        window.location.href =
          "sms:+" + cleanedPhone + "?body=" + encodeURIComponent(message);
      }
    },
    function () {
      alert("Standort konnte nicht abgerufen werden.");
    }
  );
}


function cleanPhoneNumber(phone) {
  let cleaned = phone.replace(/\s+/g, "");
  cleaned = cleaned.replace("+", "");
  cleaned = cleaned.replace("/", "");
  cleaned = cleaned.replace("-", "");

  if (cleaned.startsWith("0")) {
    cleaned = "49" + cleaned.substring(1);
  }

  return cleaned;
}


function calculateAge(birthday) {
  if (!birthday) {
    return "1 Jahr";
  }

  let birthDate = new Date(birthday);
  let today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age === 1) {
    return "1 Jahr";
  }

  return age + " Jahre";
}


function getGenderText(gender) {
  if (gender === "female") {
    return "Weiblich";
  }

  return "Männlich";
}


function getKastriertText(kastriert) {
  if (kastriert === "nein") {
    return "Nicht kastriert";
  }

  return "Kastriert";
}
