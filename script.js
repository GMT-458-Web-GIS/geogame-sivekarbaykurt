// Global değişkenler
const countries = [
    { name: 'Türkiye', coords: [39.9334, 32.8597] },
    { name: 'Rusya', coords: [61.5240, 105.3180] },
    { name: 'ABD', coords: [37.0902, -95.7129] },
    { name: 'Almanya', coords: [51.1657, 10.4515] },
    { name: 'Fransa', coords: [46.6034, 1.8883] },
    { name: 'İngiltere', coords: [55.3781, -3.4360] },
    { name: 'Kanada', coords: [56.1304, -106.3468] },
    { name: 'İtalya', coords: [41.8719, 12.5674] },
    { name: 'İspanya', coords: [40.4637, -3.7492] },
    { name: 'Brezilya', coords: [-14.2350, -51.9253] },
    { name: 'Avustralya', coords: [-25.2744, 133.7751] },
    { name: 'Japonya', coords: [36.2048, 138.2529] },
    { name: 'Çin', coords: [35.8617, 104.1954] },
    { name: 'Hindistan', coords: [20.5937, 78.9629] },
    { name: 'Meksika', coords: [23.6345, -102.5528] },
    { name: 'Güney Afrika', coords: [-30.5595, 22.9375] },
    { name: 'Arjantin', coords: [-38.4161, -63.6167] },
    { name: 'Endonezya', coords: [-0.7893, 113.9213] },
    { name: 'Pakistan', coords: [30.3753, 69.3451] },
    { name: 'Bangladeş', coords: [23.685, 90.3563] },
    { name: 'Filipinler', coords: [12.8797, 121.7740] },
];

let score = 0; // Doğru cevap sayısı
let wrongAnswers = 0; // Yanlış cevap sayısı
let currentCountry = '';
let currentCountryCoords = [];
let timeLeft = 60; // 1 dakika süre
let timer;

// HTML elementlerini seç
const countrySpan = document.getElementById('country');
const scoreSpan = document.getElementById('scoreValue');
const stork = document.getElementById('stork'); // Leylek için gerekli

function startGame() {
    chooseRandomCountry();
    timer = setInterval(updateTimer, 1000);
}

function chooseRandomCountry() {
    const randomIndex = Math.floor(Math.random() * countries.length);
    currentCountry = countries[randomIndex].name;
    currentCountryCoords = countries[randomIndex].coords;
    countrySpan.textContent = currentCountry;

    // Leyleği başlangıç noktasına yerleştir
    stork.style.transition = 'none';
    stork.style.left = '50%';
    stork.style.top = '50%';
}

function updateTimer() {
    timeLeft--;
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert('Oyun bitti! Skorunuz: ' + score);
        window.location.href = `skor.html?score=${score}&correct=${score}&wrong=${wrongAnswers}`;
    }
}

function moveStork(lat, lng) {
    // Harita koordinatlarını piksel koordinatlarına çevir
    const point = map.latLngToContainerPoint([lat, lng]);

    // Leyleği belirtilen konuma hareket ettir
    stork.style.transition = 'transform 1s ease';
    stork.style.transform = `translate(${point.x - (stork.offsetWidth / 2)}px, ${point.y - (stork.offsetHeight / 2)}px)`;

    // 1 saniye bekledikten sonra yeni ülke seçimi
    setTimeout(() => {
        chooseRandomCountry();
    }, 1000);
}

// Haritaya tıklama olayı
map.on('click', (e) => {
    const clickedLatLng = e.latlng;

    const isCorrect = countries.some(country => {
        const [lat, lng] = country.coords;
        return (Math.abs(lat - clickedLatLng.lat) < 1 && Math.abs(lng - clickedLatLng.lng) < 1);
    });

    if (isCorrect) {
        score++; // Doğru cevap sayısını artır
        scoreSpan.textContent = score;
        moveStork(currentCountryCoords[0], currentCountryCoords[1]);
    } else {
        wrongAnswers++; // Yanlış cevap sayısını artır
        alert("Yanlış! Tekrar deneyin.");
    }
});

// Başlangıçta doğru ve yanlış sayıları
let correctAnswers = 0;
let incorrectAnswers = 0;

// Skor güncellemeleri için DOM elemanları
const correctElement = document.getElementById('correctCount');
const incorrectElement = document.getElementById('incorrectCount');

// Harita tıklama olayında doğru-yanlış kontrolü
map.on('click', function(e) {
    const latlng = e.latlng;
    const clickedCountry = countries.find(country => {
        return latlng.lat > (country.coords[0] - 5) && latlng.lat < (country.coords[0] + 5) &&
               latlng.lng > (country.coords[1] - 5) && latlng.lng < (country.coords[1] + 5);
    });

    if (clickedCountry) {
        if (clickedCountry.name === selectedCountry.name) {
            correctAnswers++;  // Doğru tıklama
            correctElement.innerText = "Doğru: " + correctAnswers;
        } else {
            incorrectAnswers++;  // Yanlış tıklama
            incorrectElement.innerText = "Yanlış: " + incorrectAnswers;
            alert("Yanlış! Tekrar deneyin.");
        }
    }
});

// Oyun bittiğinde skorları 3. sayfaya göndermek
function endGame() {
    // Skorları URL üzerinden gönder
    window.location.href = `skor.html?correct=${correctAnswers}&incorrect=${incorrectAnswers}`;
}
