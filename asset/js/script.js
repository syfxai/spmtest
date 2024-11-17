// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Import html2canvas dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);

    // Navigation Toggle setup
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Countdown Timer Setup
    const setupCountdown = () => {
        // First countdown (Suluk)
        const sulukStartDate = new Date('2024-12-12T00:00:00');
        const sulukEndDate = new Date('2025-01-01T00:00:00');
    
        // Second countdown (Perjumpaan Bulanan)
        const monthlyMeetingDate = new Date('2024-11-23T00:00:00');
    
        // Get counter elements
        const counterBoxes = document.querySelectorAll('.counter-box');
    
        if (counterBoxes.length >= 2) {
            // Setup first countdown (Suluk)
            const sulukCountdown = counterBoxes[0];
            sulukCountdown.innerHTML = `
                <h2 class="countdown-title">Suluk bulan Disember suluk 20 hari di Pondok Bidayatul Hidayah.</h2>
                <div class="countdown-days"><span id="suluk-days-remaining">0</span> hari lagi</div>
                <div class="countdown-time"><span id="hours-remaining">0</span> jam <span id="minutes-remaining">0</span> minit <span id="seconds-remaining">0</span> saat</div>
                <div class="countdown-date">Tarikh: 12 Dec 2024 - 1 Jan 2025</div>
                <div class="countdown-hijri">Tarikh Hijrah: 10 Jamadilakhir 1446H - 1 Rejab 1446H</div>
                <button class="counter-btn">Sebarkan</button>
            `;

            // Setup second countdown (Perjumpaan Bulanan)
            const monthlyCountdown = counterBoxes[1];
            monthlyCountdown.innerHTML = `
                <h2 class="countdown-title">Perjumpaan dan Tawajuh Bulanan Pada 23 November 2024</h2>
                <div class="countdown-days"><span id="monthly-days-remaining">0</span> hari lagi</div>
                <button class="counter-btn">Sebarkan</button>
            `;

            // Update countdown function
            const updateCountdown = () => {
                const now = new Date();
            
                // Update Suluk countdown
                const sulukDifference = sulukStartDate - now;
                if (sulukDifference > 0) {
                    const days = Math.floor(sulukDifference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((sulukDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((sulukDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((sulukDifference % (1000 * 60)) / 1000);

                    document.getElementById('suluk-days-remaining').textContent = days;
                    document.getElementById('hours-remaining').textContent = hours;
                    document.getElementById('minutes-remaining').textContent = minutes;
                    document.getElementById('seconds-remaining').textContent = seconds;
                }

                // Update Monthly Meeting countdown
                const monthlyDifference = monthlyMeetingDate - now;
                if (monthlyDifference > 0) {
                    const days = Math.floor(monthlyDifference / (1000 * 60 * 60 * 24));
                    document.getElementById('monthly-days-remaining').textContent = days;
                }
            };

            // Update countdown every second
            setInterval(updateCountdown, 1000);
            // Initial call
            updateCountdown();
        }
    };

    // Function to capture and share content
    const shareContent = async (element) => {
        try {
            // Add loading state to button
            const shareBtn = element.querySelector('.counter-btn');
            if (shareBtn) {
                shareBtn.classList.add('loading');
            }

            // Create canvas from the element
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2, // Higher quality
                logging: false,
                useCORS: true
            });

            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });

            // Create file from blob
            const file = new File([blob], 'suluk-info.png', { type: 'image/png' });

            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share({
                    files: [file],
                    title: 'Suluk Information',
                    text: 'Suluk information from Tareqat Naqsyabandiah Khalidiah'
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const shareUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = shareUrl;
                a.download = 'suluk-info.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(shareUrl);
            }
        } catch (error) {
            console.error('Error sharing content:', error);
            alert('Sorry, there was an error sharing the content. Please try again.');
        } finally {
            // Remove loading state from button
            const shareBtn = element.querySelector('.counter-btn');
            if (shareBtn) {
                shareBtn.classList.remove('loading');
            }
        }
    };

    // Add click event listeners to all share buttons
    const setupShareButtons = () => {
        const counterBoxes = document.querySelectorAll('.counter-box');
        
        counterBoxes.forEach((box, index) => {
            const shareBtn = box.querySelector('.counter-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    shareContent(box);
                });
            }
        });
    };

    // Slider functionality
    const sliderInit = () => {
        const slider = document.querySelector('.slider');
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelector('.slider-dots');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        
        if (!slider || !slides.length || !dots || !prevBtn || !nextBtn) {
            console.error('Slider elements not found');
            return;
        }

        let currentSlide = 0;
        let isAnimating = false;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!isAnimating) goToSlide(index);
            });
            dots.appendChild(dot);
        });

        // Initialize first slide
        slides[0].classList.add('active');

        function goToSlide(index) {
            if (currentSlide === index) return;
            
            isAnimating = true;
            
            // Remove active class from current slide and dot
            slides[currentSlide].classList.remove('active');
            dots.children[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Add active class to new slide and dot
            slides[currentSlide].classList.add('active');
            dots.children[currentSlide].classList.add('active');
            
            // Reset animation lock after transition
            setTimeout(() => {
                isAnimating = false;
            }, 500); // Match this with your CSS transition time
        }

        function nextSlide() {
            if (!isAnimating) {
                const next = (currentSlide + 1) % slides.length;
                goToSlide(next);
            }
        }

        function prevSlide() {
            if (!isAnimating) {
                const prev = (currentSlide - 1 + slides.length) % slides.length;
                goToSlide(prev);
            }
        }

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Auto slide
        let autoSlideInterval = setInterval(nextSlide, 11000);

        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        slider.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 11000);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(autoSlideInterval);
            } else {
                autoSlideInterval = setInterval(nextSlide, 11000);
            }
        });
    };

    // Initialize all functionalities
    setupCountdown();
    sliderInit();
    
    // Initialize share buttons once html2canvas is loaded
    script.onload = () => {
        setupShareButtons();
    };
});