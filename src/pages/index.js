import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import "./index.css";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];
// Profile
const editBtn = document.querySelector(".profile__edit-button");
const addBtn = document.querySelector(".profile__add-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeBtnProfile = editProfileModal.querySelector(".modal__close-button");
const profileContent = document.querySelector("#profile-content");
const profileName = profileContent.querySelector(".profile__name");
const profileDescription = profileContent.querySelector(
  ".profile__description",
);
const inputName = editProfileModal.querySelector("#profile-name-input");
const inputDescription = editProfileModal.querySelector(
  "#profile-description-input",
);
const saveProfileForm = editProfileModal.querySelector("#profile-form");

// Post
const addNewPostModal = document.querySelector("#new-post-modal");
const closeBtnPost = addNewPostModal.querySelector(".modal__close-button");
const inputImageLink = addNewPostModal.querySelector("#card-image-input");
const inputCaption = addNewPostModal.querySelector("#card-caption-input");
const savePostForm = addNewPostModal.querySelector("#post-form");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

// Preview
const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal.querySelector(".modal__image");
const modalCaption = previewModal.querySelector(".modal__caption");

// General
const closePreviewBtn = previewModal.querySelector(".modal__close-button");
const cardSaveButton = savePostForm.querySelector(".modal__save-button");
const modals = document.querySelectorAll(".modal");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = data.name;
  cardImage.alt = data.name;
  cardImage.src = data.link;

  cardLikeBtn.addEventListener("click", () =>
    cardLikeBtn.classList.toggle("card__like-button_liked"),
  );
  cardDeleteBtn.addEventListener("click", () => cardElement.remove());
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
  });
  return cardElement;
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    closeModal(currentOpenModal);
  }
}
let currentOpenModal;
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  currentOpenModal = modal;
  document.addEventListener("keydown", handleEscape);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  currentOpenModal = null;
  document.removeEventListener("keydown", handleEscape);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(editProfileModal);
}
function handlePostFormSubmit(evt) {
  evt.preventDefault();
  const data = { name: inputCaption.value, link: inputImageLink.value };
  const cardElement = getCardElement(data);

  cardsList.prepend(cardElement);
  closeModal(addNewPostModal);
  evt.target.reset();
  disableButton(cardSaveButton, settings);
}

editBtn.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  resetValidation(saveProfileForm, [inputName, inputDescription], settings);
  openModal(editProfileModal);
});

addBtn.addEventListener("click", () => openModal(addNewPostModal));

closeBtnProfile.addEventListener("click", () => closeModal(editProfileModal));

closeBtnPost.addEventListener("click", () => closeModal(addNewPostModal));

closePreviewBtn.addEventListener("click", () => closeModal(previewModal));

saveProfileForm.addEventListener("submit", handleProfileFormSubmit);

savePostForm.addEventListener("submit", handlePostFormSubmit);

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

initialCards.forEach(function (card) {
  const cardElement = getCardElement(card);
  cardsList.prepend(cardElement);
});

enableValidation(settings);
