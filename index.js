function openQrModal() {
  let modal = document.getElementById("qrModal");
  let qrBox = document.getElementById("indexQrCode");

  if (!modal || !qrBox) {
    alert("QR-Popup wurde nicht gefunden.");
    return;
  }

  modal.classList.add("show");
  qrBox.innerHTML = "";

  let finderLink = createFinderLink();

  let qrImage = document.createElement("img");
  qrImage.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
    encodeURIComponent(finderLink);

  qrImage.alt = "Finder QR-Code";
  qrImage.className = "qr-image";

  qrBox.appendChild(qrImage);
}


function closeQrModal() {
  let modal = document.getElementById("qrModal");

  if (modal) {
    modal.classList.remove("show");
  }
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

function printQrCode() {
  let finderLink = createFinderLink();

  let qrImageUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(finderLink);

  let printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Das Druckfenster konnte nicht geöffnet werden.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>PetConnect QR-Code</title>

      <style>
        body {
          margin: 0;
          padding: 40px;
          font-family: Arial, sans-serif;
          text-align: center;
          color: #111827;
        }

        h1 {
          margin-bottom: 8px;
          font-size: 28px;
        }

        p {
          margin-bottom: 28px;
          color: #4b5563;
          font-size: 15px;
        }

        img {
          width: 300px;
          height: 300px;
        }

        .hint {
          margin-top: 24px;
          font-size: 13px;
          color: #6b7280;
        }
      </style>
    </head>

    <body>
      <h1>PetConnect QR-Code</h1>
      <p>Scanne diesen QR-Code, um die Finder-Seite zu öffnen.</p>

      <img src="${qrImageUrl}" alt="Finder QR-Code">

      <div class="hint">
        Haustierprofil: Mailo
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `);

  printWindow.document.close();
}
