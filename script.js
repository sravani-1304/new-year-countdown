/**
 * New Year Countdown Script
 * Calculates and displays real-time countdown to New Year
 * Updates every second with days, hours, minutes, and seconds remaining
 */

// Global variables
let countdownInterval;
let targetDate;

/**
 * Initialize the countdown when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
    startCountdown();
});

/**
 * Set up the target date (January 1st of next year)
 */
function initializeCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Determine target year (next year)
    let targetYear = currentYear + 1;
    
    // If it's already past New Year, target next year
    const newYearThisYear = new Date(currentYear, 0, 1, 0, 0, 0);
    if (now >= newYearThisYear) {
        targetYear = currentYear + 1;
    }
    
    // Set target date to January 1st at midnight
    targetDate = new Date(targetYear, 0, 1, 0, 0, 0);
    
    // Update the display with target year
    document.getElementById('target-year').textContent = targetYear;
    document.getElementById('current-year').textContent = targetYear;
    
    console.log(`Countdown initialized. Target: ${targetDate.toLocaleString()}`);
}

/**
 * Start the countdown timer
 */
function startCountdown() {
    // Update immediately
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Calculate and update the countdown display
 */
function updateCountdown() {
    const now = new Date();
    const timeDifference = targetDate - now;
    
    // Check if countdown has reached zero
    if (timeDifference <= 0) {
        showCelebration();
        return;
    }
    
    // Calculate time units
    const timeUnits = calculateTimeUnits(timeDifference);
    
    // Update display elements
    updateDisplay(timeUnits);
    
    // Add animation effect to numbers when they change
    addNumberChangeEffect();
}

/**
 * Calculate days, hours, minutes, and seconds from milliseconds
 * @param {number} milliseconds - Time difference in milliseconds
 * @returns {Object} Object containing days, hours, minutes, seconds
 */
function calculateTimeUnits(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
    };
}

/**
 * Update the countdown display with new values
 * @param {Object} timeUnits - Object containing time unit values
 */
function updateDisplay(timeUnits) {
    // Format numbers with leading zeros
    const formatNumber = (num) => num.toString().padStart(2, '0');
    
    // Update each display element
    document.getElementById('days').textContent = formatNumber(timeUnits.days);
    document.getElementById('hours').textContent = formatNumber(timeUnits.hours);
    document.getElementById('minutes').textContent = formatNumber(timeUnits.minutes);
    document.getElementById('seconds').textContent = formatNumber(timeUnits.seconds);
}

/**
 * Add visual effect when numbers change
 */
function addNumberChangeEffect() {
    const numbers = document.querySelectorAll('.countdown-number');
    
    numbers.forEach(number => {
        // Add pulse effect
        number.style.transform = 'scale(1.1)';
        setTimeout(() => {
            number.style.transform = 'scale(1)';
        }, 100);
    });
}

/**
 * Show celebration message when countdown reaches zero
 */
function showCelebration() {
    // Stop the countdown
    clearInterval(countdownInterval);
    
    // Hide countdown display
    document.querySelector('.countdown-container').style.display = 'none';
    document.querySelector('.target-date').style.display = 'none';
    
    // Show celebration message
    const celebrationElement = document.getElementById('celebration');
    celebrationElement.classList.add('show');
    
    // Add extra fireworks for celebration
    addCelebrationFireworks();
    
    // Play celebration animation
    celebrationElement.style.animation = 'celebrationBounce 1s ease-out';
    
    console.log('🎉 Happy New Year! 🎉');
}

/**
 * Add extra fireworks for celebration
 */
function addCelebrationFireworks() {
    const fireworksContainer = document.querySelector('.fireworks-container');
    
    // Create additional fireworks
    for (let i = 0; i < 10; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.top = Math.random() * 100 + '%';
        firework.style.left = Math.random() * 100 + '%';
        firework.style.background = getRandomColor();
        firework.style.animationDelay = Math.random() * 2 + 's';
        
        fireworksContainer.appendChild(firework);
        
        // Remove firework after animation
        setTimeout(() => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        }, 3000);
    }
}

/**
 * Get random color for celebration fireworks
 * @returns {string} Random color in hex format
 */
function getRandomColor() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Handle window resize events for responsive behavior
 */
window.addEventListener('resize', function() {
    // Adjust layout if needed for different screen sizes
    const container = document.querySelector('.countdown-container');
    const isMobile = window.innerWidth <= 480;
    
    if (isMobile) {
        container.style.flexDirection = 'column';
    } else {
        container.style.flexDirection = 'row';
    }
});

/**
 * Handle visibility change to pause/resume countdown when tab is hidden/visible
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, optionally pause countdown
        console.log('Page hidden - countdown continues in background');
    } else {
        // Page is visible, ensure countdown is accurate
        console.log('Page visible - refreshing countdown');
        updateCountdown();
    }
});

/**
 * Add keyboard accessibility
 */
document.addEventListener('keydown', function(event) {
    // Press 'R' to reset/refresh countdown
    if (event.key.toLowerCase() === 'r') {
        location.reload();
    }
    
    // Press 'Space' to toggle celebration mode (for testing)
    if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        showCelebration();
    }
});

/**
 * Error handling for any potential issues
 */
window.addEventListener('error', function(event) {
    console.error('Countdown error:', event.error);
    
    // Try to restart countdown if there's an error
    setTimeout(() => {
        try {
            initializeCountdown();
            startCountdown();
        } catch (e) {
            console.error('Failed to restart countdown:', e);
        }
    }, 1000);
});

/**
 * Performance monitoring
 */
function logPerformance() {
    if (performance && performance.now) {
        const loadTime = performance.now();
        console.log(`Countdown script loaded in ${loadTime.toFixed(2)}ms`);
    }
}

// Log performance when script loads
logPerformance();

/**
 * Export functions for testing (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateTimeUnits,
        initializeCountdown,
        updateCountdown
    };
}
