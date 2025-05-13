const slider = document.querySelector('.feedback-slider');
const sliderFill = document.querySelector('.slider-fill');
const feedbackMessage = document.getElementById('feedback-message');

// Update the filled area of the slider based on the value
slider.addEventListener('input', () => {
  const value = slider.value;
  sliderFill.style.width = `${value}%`;

  // Update feedback message based on the slider's value
  if (value < 30) {
    feedbackMessage.textContent = "Didn't like it.";
    feedbackMessage.style.color = "#e94f37"; // Red for dislike
  } else if (value > 70) {
    feedbackMessage.textContent = "Liked it!";
    feedbackMessage.style.color = "#28a745"; // Green for like
  } else {
    feedbackMessage.textContent = "It was okay.";
    feedbackMessage.style.color = "#ffb74d"; // Orange for neutral
  }
});
