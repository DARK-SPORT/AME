let userStars = [];
let redoStack = [];
const usedPositions = [];

document.addEventListener('DOMContentLoaded', () => {
  const postBtn = document.getElementById('postThoughtsButton');
  const toggleBtn = document.getElementById('toggleModeBtn');
  const submissionBox = document.getElementById('bottom-form');
  const body = document.body;
  const emotions = ['sad', 'frustrated', 'numb', 'relieved', 'overstimulated'];

  const sampleMessages = {
    sad: [
      "I lost someone I love.",
      "I felt left out by my friends.",
      "I couldn’t stop crying that day."
    ],
    frustrated: [
      "things kept going wrong at work.",
      "I couldn’t explain what I was feeling.",
      "people kept interrupting me."
    ],
    numb: [
      "I just went through the motions.",
      "I felt nothing even though I knew I should.",
      "everything felt distant."
    ],
    relieved: [
      "a weight lifted off my chest.",
      "I finally got some good news.",
      "the results came back okay."
    ],
    overstimulated: [
      "everything was too loud and too bright.",
      "I couldn’t focus on anything.",
      "my brain just needed quiet."
    ]
  };

  for (let i = 0; i < 7; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const messages = sampleMessages[emotion];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    createFloatingStar(emotion, randomMessage);
  }

  postBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submissionBox.classList.toggle('hidden');
  });

  if (!body.classList.contains('night-mode')) {
    body.classList.add('day-mode');
    submissionBox.classList.add('day-mode');
    toggleBtn.textContent = 'Day Sky';
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('day-mode');
    body.classList.toggle('night-mode');
    submissionBox.classList.toggle('day-mode');
    submissionBox.classList.toggle('night-mode');
    toggleBtn.textContent = body.classList.contains('night-mode') ? 'Night Sky' : 'Day Sky';
  });

  function showFeedback(text, type) {
    const feedback = document.getElementById("feedbackMessage");
    feedback.textContent = text;
    feedback.classList.remove("hidden", "fade-out", "feedback-success", "feedback-error");
    feedback.classList.add(type === "success" ? "feedback-success" : "feedback-error");

    setTimeout(() => {
      feedback.classList.add("fade-out");
      setTimeout(() => feedback.classList.add("hidden"), 1100);
    }, 10000);
  }

  function getUniqueStarPosition() {
    const gridSize = 10;
    const cellWidth = 90 / gridSize;
    const cellHeight = 80 / gridSize;

    let attempts = 0;
    while (attempts < 100) {
      const xIndex = Math.floor(Math.random() * gridSize);
      const yIndex = Math.floor(Math.random() * gridSize);
      const key = `${xIndex},${yIndex}`;
      if (!usedPositions.includes(key)) {
        usedPositions.push(key);
        return {
          top: `${yIndex * cellHeight}%`,
          left: `${xIndex * cellWidth + 5}%`
        };
      }
      attempts++;
    }
    return { top: "50%", left: "50%" };
  }

  function createFloatingStar(emotion, message = null) {
    const wrapper = document.createElement('div');
    wrapper.className = 'star-wrapper';

    const { top, left } = getUniqueStarPosition();
    wrapper.style.top = top;
    wrapper.style.left = left;

    const star = document.createElement('img');
    star.src = `images/stars/${emotion}.png`;
    star.alt = `${emotion} star`;
    star.className = 'star';
    star.dataset.emotion = emotion;

    const directions = ['float-left', 'float-right', 'float-up', 'float-down'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const floatSpeed = Math.floor(Math.random() * 6) + 10;
    star.style.animation = `fadeIn 1s ease forwards, pulse 3s ease-in-out infinite, ${randomDirection} ${floatSpeed}s ease-in-out infinite`;

    const tooltip = document.createElement('div');
    tooltip.className = 'star-tooltip hidden';
    tooltip.innerText = message || `${emotion}...`;

    star.addEventListener('click', () => {
      tooltip.classList.toggle('hidden');
    });

    wrapper.appendChild(star);
    wrapper.appendChild(tooltip);
    document.getElementById('star-zone').appendChild(wrapper);

    return wrapper;
  }

  window.submitMessage = function () {
    const message = document.getElementById('messageInput').value.trim();
    const emotion = document.getElementById('emotionSelect').value.toLowerCase();

    if (!message) {
      showFeedback("Please enter a message before submitting.", "error");
      return;
    }

    if (message.length > 50) {
      showFeedback("Please keep your message under 50 characters.", "error");
      return;
    }

    showFeedback("Your star has been added to the sky — thank you for sharing your truth.", "success");
    document.getElementById('messageInput').value = "";

    const starWrapper = createFloatingStar(emotion, message);
    userStars.push(starWrapper);
    redoStack = [];
  };

  window.undoLastStar = function () {
    const last = userStars.pop();
    if (last) {
      last.remove();
      redoStack.push(last);
    }
  };

  window.redoStar = function () {
    const star = redoStack.pop();
    if (star) {
      document.getElementById('star-zone').appendChild(star);
      userStars.push(star);
    }
  };

  document.querySelectorAll('.emotion-filter').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = button.dataset.filter;

      const wrappers = document.querySelectorAll('#star-zone .star-wrapper');
      wrappers.forEach(wrapper => {
        const star = wrapper.querySelector('.star');
        if (filter === 'all' || star.dataset.emotion === filter) {
          wrapper.style.display = 'block';
        } else {
          wrapper.style.display = 'none';
        }
      });
    });
  });

  document.getElementById('viewVoicesBtn').addEventListener('click', () => {
    const starZone = document.getElementById('star-zone');

    if (document.querySelectorAll('.autistic-star').length >= 10) return;

    document.querySelectorAll('.star-wrapper').forEach(wrapper => {
      if (!wrapper.classList.contains('autistic-star')) {
        wrapper.remove();
      }
    });

    const autisticVoices = {
      sad: [
        "I was told to stop crying, so I hid it instead.",
        "Sadness didn’t look like how they expected it to."
      ],
      frustrated: [
        "They said I was overreacting. I was just overwhelmed.",
        "I knew what I meant, but the words wouldn't come out right."
      ],
      numb: [
        "I smiled to blend in, but inside I felt nothing.",
        "Numbness was safer than trying to explain myself."
      ],
      relieved: [
        "Someone finally understood without asking me to explain.",
        "Being alone gave me space to breathe again."
      ],
      overstimulated: [
        "The lights. The noise. Everything was too much.",
        "I needed silence, but the world kept shouting."
      ]
    };

    Object.entries(autisticVoices).forEach(([emotion, messages]) => {
      messages.forEach(msg => {
        const wrapper = createFloatingStar(emotion, msg);
        wrapper.classList.add('autistic-star');
      });
    });
  });
});
document.getElementById('viewVoicesBtn').addEventListener('click', () => {
  // prevent duplicates
  const alreadyLoaded = document.querySelectorAll('.autistic-star').length >= 10;
  if (alreadyLoaded) return;

  // remove ONLY user stars (not autistic ones)
  document.querySelectorAll('.star-wrapper:not(.autistic-star)').forEach(wrapper => {
    wrapper.remove();
  });

  const autisticVoices = {
    sad: [
      "I was told to stop crying, so I hid it instead.",
      "Sadness didn’t look like how they expected it to."
    ],
    frustrated: [
      "They said I was overreacting. I was just overwhelmed.",
      "I knew what I meant, but the words wouldn't come out right."
    ],
    numb: [
      "I smiled to blend in, but inside I felt nothing.",
      "Numbness was safer than trying to explain myself."
    ],
    relieved: [
      "Someone finally understood without asking me to explain.",
      "Being alone gave me space to breathe again."
    ],
    overstimulated: [
      "The lights. The noise. Everything was too much.",
      "I needed silence, but the world kept shouting."
    ]
  };

  document.addEventListener('DOMContentLoaded', () => {
    const postBtn = document.getElementById('postThoughtsButton');
    const toggleBtn = document.getElementById('toggleModeBtn');
    const submissionBox = document.getElementById('bottom-form');
    const body = document.body;
    const emotions = ['sad', 'frustrated', 'numb', 'relieved', 'overstimulated'];
  
    // Check the visibility state from sessionStorage and apply it
    const formVisibility = sessionStorage.getItem('formVisible');
    if (formVisibility === 'true') {
      submissionBox.classList.remove('hidden'); // Show form if sessionStorage indicates it
    } else {
      submissionBox.classList.add('hidden'); // Keep form hidden by default
    }
  
    postBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Toggle form visibility
      submissionBox.classList.toggle('hidden');
  
      // Save the form visibility state in sessionStorage
      sessionStorage.setItem('formVisible', !submissionBox.classList.contains('hidden'));
    });
  
    // Your other event listeners and logic...
    // Rest of your code...
  });
  

  const emotions = Object.keys(autisticVoices);
  emotions.forEach(emotion => {
    autisticVoices[emotion].forEach(message => {
      const wrapper = createFloatingStar(emotion, message);
      wrapper.classList.add('autistic-star');
    });
  });
});


