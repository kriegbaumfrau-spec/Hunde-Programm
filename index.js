function openQrModal() {
  let modal = document.getElementById("qrModal");
  let qrBox = document.getElementById("indexQrCode");

  modal.style.display = "flex";
  qrBox.innerHTML = "";

  let finderLink = createFinderLink();

  new QRCode(qrBox, {
    text: finderLink,
    width: 200,
    height: 200
  });
}


function closeQrModal() {
  let modal = document.getElementById("qrModal");
  modal.style.display = "none";
}


function createFinderLink() {
  let dog = JSON.parse(localStorage.getItem("dog"));
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  let contact = contacts[0] || {};

  let params = new URLSearchParams();

  params.set("name", dog?.name || "Mailo");
  params.set("breed", dog?.breed || "Kleinpudel");
  params.set("note", dog?.note || "Allergie gegen Huhn");
  params.set("weight", dog?.weight || "8");
  params.set("gender", dog?.gender || "male");
  params.set("birthday", dog?.birthday || "2024-09-11");
  params.set("kastriert", dog?.kastriert || "ja");
  params.set("contactName", contact.name || "Nele");
  params.set("contactPhone", contact.phone || "0176 5555555");

  return "https://kriegbaumfrau-spec.github.io/Hunde-Programm/finder.html?" + params.toString();
}
