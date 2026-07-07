function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving...",
) {
  button.textContent = isLoading ? loadingText : defaultText;
}

export default setButtonText;
