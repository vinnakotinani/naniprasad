// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-btn');
const overlay = document.querySelector('.overlay');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

// Close sidebar when clicking on a link
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Slider Functionality
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (slider && prevBtn && nextBtn) {
    let slidePosition = 0;
    const slideWidth = 315; // Card width + margin
    const maxSlides = document.querySelectorAll('.slider-card').length - 3; // Show 3 cards at a time
    
    function updateSliderPosition() {
        slider.style.transform = `translateX(-${slidePosition * slideWidth}px)`;
    }
    
    prevBtn.addEventListener('click', () => {
        if (slidePosition > 0) {
            slidePosition--;
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (slidePosition < maxSlides) {
            slidePosition++;
            updateSliderPosition();
        }
    });
    
    // Touch functionality for slider
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
    });
    
    slider.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - endX;
        
        if (diffX > 50 && slidePosition < maxSlides) {
            // Swipe left
            slidePosition++;
            updateSliderPosition();
        } else if (diffX < -50 && slidePosition > 0) {
            // Swipe right
            slidePosition--;
            updateSliderPosition();
        }
    });
}

// Testimonial Slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevTestimonial = document.querySelector('.prev-testimonial');
const nextTestimonial = document.querySelector('.next-testimonial');

if (testimonialCards.length > 0 && prevTestimonial && nextTestimonial) {
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        testimonialCards[index].classList.add('active');
    }
    
    prevTestimonial.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    });
    
    nextTestimonial.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Login/Register Form Toggle
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

if (showRegisterBtn && loginForm && registerForm) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });
}

if (showLoginBtn && loginForm && registerForm) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });
}

// Password Toggle
const passwordToggles = document.querySelectorAll('.password-toggle');
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        const icon = toggle.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Form Validation
const loginFormElement = document.getElementById('loginForm');
const registerFormElement = document.getElementById('registerForm');

if (loginFormElement) {
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        // Form validation logic here
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            // Show success message or redirect
            alert('Login successful! (This is a demo)');
            // In a real application, you would handle the login process here
        } else {
            alert('Please fill in all fields');
        }
    });
}

if (registerFormElement) {
    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        // Form validation logic here
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (fullName && email && password && terms) {
            // Show success message or redirect
            alert('Registration successful! (This is a demo)');
            // In a real application, you would handle the registration process here
        } else {
            alert('Please fill in all fields and accept the terms');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe sub-cards
document.querySelectorAll('.sub-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe course cards
document.querySelectorAll('.course-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe blog cards
document.querySelectorAll('.blog-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe expertise cards
document.querySelectorAll('.expertise-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observe category cards
document.querySelectorAll('.category-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Chat Functionality
const chatItems = document.querySelectorAll('.chat-item');
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.send-btn');

if (chatItems.length > 0) {
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            chatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

if (chatInput && sendBtn) {
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            // Create new message element
            const messagesContainer = document.querySelector('.chat-messages');
            const newMessage = document.createElement('div');
            newMessage.className = 'message sent';
            newMessage.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            `;
            messagesContainer.appendChild(newMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Simulate response after 1 second
            setTimeout(() => {
                const responseMessage = document.createElement('div');
                responseMessage.className = 'message received';
                responseMessage.innerHTML = `
                    <div class="message-avatar" style="background-image: url('https://picsum.photos/seed/user1/100/100.jpg');"></div>
                    <div class="message-content">
                        <p>Thank you for your message! I'll get back to you soon.</p>
                        <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                `;
                messagesContainer.appendChild(responseMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Quiz Functionality
const quizCategories = document.querySelectorAll('.quiz-category-card');
const quizInterface = document.getElementById('quizInterface');
const quizResults = document.getElementById('quizResults');
const backToCategories = document.querySelector('.back-to-categories');
const quiznextBtn = document.getElementById('nextBtn');
const skipBtn = document.querySelector('.skip-btn');
const retakeBtn = document.querySelector('.retake-btn');
const newQuizBtn = document.querySelector('.new-quiz-btn');

// Quiz Data
const quizData = {
    python: [
        {
            question: "What is the correct file extension for Python files?",
            answers: [".py", ".python", ".pyt", ".pt"],
            correct: 0
        },
        {
            question: "Which keyword is used to define a function in Python?",
            answers: ["func", "def", "function", "define"],
            correct: 1
        },
        {
            question: "What does the 'len()' function do?",
            answers: ["Returns the length of an object", "Creates a list", "Deletes an object", "Copies an object"],
            correct: 0
        }
    ],
    mysql: [
        {
            question: "Which SQL statement is used to extract data from a database?",
            answers: ["GET", "OPEN", "EXTRACT", "SELECT"],
            correct: 3
        },
        {
            question: "Which SQL keyword is used to sort the result-set?",
            answers: ["SORT BY", "ORDER", "ORDER BY", "SORT"],
            correct: 2
        }
    ],
    excel: [
        {
            question: "Which function is used to add values in Excel?",
            answers: ["TOTAL", "SUM", "ADD", "PLUS"],
            correct: 1
        },
        {
            question: "What does VLOOKUP stand for?",
            answers: ["Vertical Lookup", "Value Lookup", "Variable Lookup", "View Lookup"],
            correct: 0
        }
    ],
    powerbi: [
        {
            question: "What is DAX in Power BI?",
            answers: ["Data Analysis Expressions", "Data Access XML", "Database Analysis XQuery", "Data Analysis XLS"],
            correct: 0
        }
    ],
    ml: [
        {
            question: "What is supervised learning?",
            answers: ["Learning with labeled data", "Learning without labels", "Learning with images", "Learning with text"],
            correct: 0
        }
    ],
    webdev: [
        {
            question: "What does HTML stand for?",
            answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
            correct: 0
        }
    ]
};

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let skipped = 0;
let timer;
let timeLeft = 600; // 10 minutes

if (quizCategories.length > 0) {
    quizCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryType = category.dataset.category;
            startQuiz(categoryType);
        });
    });
}

function startQuiz(category) {
    currentQuiz = quizData[category] || quizData.python;
    currentQuestionIndex = 0;
    score = 0;
    skipped = 0;
    timeLeft = 600;
    
    document.querySelector('.quiz-categories-section').style.display = 'none';
    quizInterface.classList.add('active');
    quizResults.classList.remove('active');
    
    document.getElementById('totalQuestions').textContent = currentQuiz.length;
    
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = question.question;
    
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const label = document.createElement('label');
        label.className = 'answer-option';
        label.innerHTML = `
            <input type="radio" name="answer" value="${index}">
            <span class="answer-text">${answer}</span>
        `;
        answersContainer.appendChild(label);
    });
    
    updateProgress();
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults();
        }
    }, 1000);
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value);
            if (answerIndex === currentQuiz[currentQuestionIndex].correct) {
                score++;
            }
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentQuiz.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });
}

if (skipBtn) {
    skipBtn.addEventListener('click', () => {
        skipped++;
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentQuiz.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });
}

function showResults() {
    clearInterval(timer);
    quizInterface.classList.remove('active');
    quizResults.classList.add('active');
    
    document.getElementById('scoreNumber').textContent = score;
    document.getElementById('correctAnswers').textContent = score;
    document.getElementById('incorrectAnswers').textContent = currentQuiz.length - score - skipped;
    document.getElementById('skippedAnswers').textContent = skipped;
    
    const percentage = (score / currentQuiz.length) * 100;
    let message = '';
    
    if (percentage >= 80) {
        message = "Excellent! You're a master!";
    } else if (percentage >= 60) {
        message = "Good job! Keep practicing!";
    } else if (percentage >= 40) {
        message = "Not bad! Room for improvement.";
    } else {
        message = "Keep learning! You'll do better next time.";
    }
    
    document.getElementById('resultsMessage').textContent = message;
}

if (backToCategories) {
    backToCategories.addEventListener('click', () => {
        clearInterval(timer);
        quizInterface.classList.remove('active');
        quizResults.classList.remove('active');
        document.querySelector('.quiz-categories-section').style.display = 'block';
    });
}

if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
        const currentCategory = document.querySelector('.quiz-category-card.active')?.dataset.category || 'python';
        startQuiz(currentCategory);
    });
}

if (newQuizBtn) {
    newQuizBtn.addEventListener('click', () => {
        clearInterval(timer);
        quizResults.classList.remove('active');
        document.querySelector('.quiz-categories-section').style.display = 'block';
    });
}

