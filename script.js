const contentInput = document.getElementById("contentInput");
const foregroundColor = document.getElementById(
  "foregroundColor"
);
const backgroundColor = document.getElementById(
  "backgroundColor"
);
const sizeInput = document.getElementById("sizeInput");

const foregroundValue = document.getElementById(
  "foregroundValue"
);
const backgroundValue = document.getElementById(
  "backgroundValue"
);
const sizeValue = document.getElementById("sizeValue");

const qrcodeElement = document.getElementById("qrcode");
const emptyPreview = document.getElementById("emptyPreview");

const generateButton = document.getElementById(
  "generateButton"
);
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById(
  "downloadButton"
);
const copyButton = document.getElementById("copyButton");
const themeButton = document.getElementById("themeButton");
const toast = document.getElementById("toast");

let generated = false;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function updateColorLabels() {
  foregroundValue.textContent =
    foregroundColor.value.toUpperCase();

  backgroundValue.textContent =
    backgroundColor.value.toUpperCase();

  sizeValue.textContent = `${sizeInput.value}px`;
}

function generateQRCode() {
  const content = contentInput.value.trim();

  if (!content) {
    showToast("Please enter text or a URL first");
    contentInput.focus();
    return;
  }

  qrcodeElement.innerHTML = "";

  const size = Number(sizeInput.value);

  new QRCode(qrcodeElement, {
    text: content,
    width: size,
    height: size,
    colorDark: foregroundColor.value,
    colorLight: backgroundColor.value,
    correctLevel: QRCode.CorrectLevel.H
  });

  emptyPreview.style.display = "none";
  generated = true;
  downloadButton.disabled = false;
  copyButton.disabled = false;
  showToast("QR code generated!");
}

function clearQRCode() {
  contentInput.value = "";
  qrcodeElement.innerHTML = "";
  emptyPreview.style.display = "block";
  generated = false;
  downloadButton.disabled = true;
  copyButton.disabled = true;
  showToast("QR code cleared");
}

function downloadQRCode() {
  if (!generated) {
    showToast("Generate a QR code first");
    return;
  }

  const canvas = qrcodeElement.querySelector("canvas");
  const image = qrcodeElement.querySelector("img");

  let downloadUrl = "";

  if (canvas) {
    downloadUrl = canvas.toDataURL("image/png");
  } else if (image) {
    downloadUrl = image.src;
  }

  if (!downloadUrl) {
    showToast("Unable to download QR code");
    return;
  }

  const link = document.createElement("a");
  link.download = "my-qr-code.png";
  link.href = downloadUrl;
  link.click();

  showToast("QR code downloaded!");
}

async function copyContent() {
  const content = contentInput.value.trim();

  if (!content) {
    showToast("There is no content to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    showToast("Content copied!");
  } catch {
    showToast("Copy failed");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("qrStudioTheme");

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeButton.textContent = "☀️";
  }
}

contentInput.addEventListener("input", () => {
  if (contentInput.value.trim()) {
    generateQRCode();
  } else {
    clearQRCode();
  }
});

foregroundColor.addEventListener("input", () => {
  updateColorLabels();

  if (contentInput.value.trim()) {
    generateQRCode();
  }
});

backgroundColor.addEventListener("input", () => {
  updateColorLabels();

  if (contentInput.value.trim()) {
    generateQRCode();
  }
});

sizeInput.addEventListener("input", () => {
  updateColorLabels();

  if (contentInput.value.trim()) {
    generateQRCode();
  }
});

document.querySelectorAll(".quick-button").forEach((button) => {
  button.addEventListener("click", () => {
    const prefix = button.dataset.value;

    contentInput.value = prefix;
    contentInput.focus();
    generateQRCode();
  });
});

generateButton.addEventListener("click", generateQRCode);
clearButton.addEventListener("click", clearQRCode);
downloadButton.addEventListener("click", downloadQRCode);
copyButton.addEventListener("click", copyContent);

themeButton.addEventListener("click", () => {
  const isDark =
    document.body.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.body.removeAttribute("data-theme");
    themeButton.textContent = "🌙";
    localStorage.setItem("qrStudioTheme", "light");
  } else {
    document.body.setAttribute("data-theme", "dark");
    themeButton.textContent = "☀️";
    localStorage.setItem("qrStudioTheme", "dark");
  }
});

updateColorLabels();
loadTheme();