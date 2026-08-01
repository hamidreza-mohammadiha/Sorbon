/**
 * Game Logic Initialization & Interactions
 */

const TOTAL_BOXES = 8;
let boxValues = [];
let currentBoxIndex = -1;
let acceptedOffer = null;

// DOM Elements
const shelfElement = document.getElementById('shelf');
const chancesCountElement = document.getElementById('chances-count');
const currentOfferElement = document.getElementById('current-offer-count');
const btnAccept = document.getElementById('btn-accept');
const btnReject = document.getElementById('btn-reject');
const couponModal = document.getElementById('coupon-modal');
const finalCandiesCount = document.getElementById('final-candies-count');
const couponIdElement = document.getElementById('coupon-id');
const userNameInput = document.getElementById('user-name-input');
const btnDownload = document.getElementById('btn-download');
const btnTelegram = document.getElementById('btn-telegram');

// Initialize Game
function initGame() {
    boxValues = [];
    currentBoxIndex = -1;
    acceptedOffer = null;
    shelfElement.innerHTML = '';

    // Generate random values 1-100 for 8 boxes
    for (let i = 0; i < TOTAL_BOXES; i++) {
        boxValues.push(Math.floor(Math.random() * 100) + 1);
    }

    // Render 3D boxes on shelf
    for (let i = 0; i < TOTAL_BOXES; i++) {
        const boxWrapper = document.createElement('div');
        boxWrapper.className = 'box-wrapper';
        boxWrapper.id = `box-wrapper-${i}`;

        boxWrapper.innerHTML = `
            <div class="box-3d" id="box-${i}">
                <div class="box-face box-front">
                    <span class="box-number">${i + 1}</span>
                    <img src="SorbonLogo.png" alt="Sorbon" class="box-logo">
                </div>
                <div class="box-face box-back">
                    <div class="candy-count">${boxValues[i]}</div>
                    <div class="candy-label">Chocolates</div>
                </div>
            </div>
        `;
        shelfElement.appendChild(boxWrapper);
    }

    updateUI();
}

// Next / Open Box Logic
function openNextBox() {
    if (currentBoxIndex < TOTAL_BOXES - 1) {
        currentBoxIndex++;
        const currentBoxElem = document.getElementById(`box-${currentBoxIndex}`);
        
        animateBoxFlip(currentBoxElem, () => {
            currentOfferElement.textContent = boxValues[currentBoxIndex];
            btnAccept.disabled = false;
            
            // Check if last box reached
            if (currentBoxIndex === TOTAL_BOXES - 1) {
                btnReject.disabled = true;
                btnReject.textContent = "No More Choices";
            }
        });

        // Disable previous box visually
        if (currentBoxIndex > 0) {
            const prevBox = document.getElementById(`box-${currentBoxIndex - 1}`);
            prevBox.classList.add('disabled');
        }

        updateUI();
    }
}

// Accept Offer & Present Coupon
function acceptOffer() {
    acceptedOffer = boxValues[currentBoxIndex];
    showCoupon(acceptedOffer);
}

function updateUI() {
    const remainingChances = TOTAL_BOXES - (currentBoxIndex + 1);
    chancesCountElement.textContent = remainingChances;
}

// Trigger Final Coupon Modal
function showCoupon(amount) {
    finalCandiesCount.textContent = amount;
    const randomCode = 'SRB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    couponIdElement.textContent = `CODE: ${randomCode}`;
    couponModal.classList.remove('hidden');

    // Configure Telegram Link
    const message = encodeURIComponent(`Hi! I won ${amount} Sorbon Chocolates in the Mystery Box game! (Code: ${randomCode})`);
    btnTelegram.href = `https://t.me/share/url?url=https://sorbon.com&text=${message}`;
}

// Download Coupon Action using html2canvas
btnDownload.addEventListener('click', () => {
    const name = userNameInput.value.trim() || 'Valued Customer';
    const couponCard = document.getElementById('coupon-card');

    html2canvas(couponCard).then(canvas => {
        const link = document.createElement('a');
        link.download = `${name}-Sorbon-Coupon.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Event Listeners
btnReject.addEventListener('click', openNextBox);
btnAccept.addEventListener('click', acceptOffer);

// Start on Load
window.addEventListener('DOMContentLoaded', initGame);