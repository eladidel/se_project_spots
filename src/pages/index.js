import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import setButtonText from "../utils/helper.js";
import "./index.css";

//Api
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    "Content-Type": "application/json",
    authorization: "b91871d4-b8ba-4fde-bdb0-c5ec0ccc13ce",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
  })
  .catch((err) => console.log(err));

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
const profileAvatar = document.querySelector(".profile__avatar");
const inputName = editProfileModal.querySelector("#profile-name-input");
const inputDescription = editProfileModal.querySelector(
  "#profile-description-input",
);
const saveProfileForm = editProfileModal.querySelector("#profile-form");

// Avatar
const avatarBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-button");
const avatarForm = avatarModal.querySelector("#avatar-form");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");

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

// Cards deletion
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__delete-form");
const cancelBtn = deleteModal.querySelector(".modal__button-cancel");
const closeBtnDelete = deleteModal.querySelector(".modal__close-button");

// Preview
const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal.querySelector(".modal__image");
const modalCaption = previewModal.querySelector(".modal__caption");

// General
const closePreviewBtn = previewModal.querySelector(".modal__close-button");
const modals = document.querySelectorAll(".modal");

let selectedCard;
let selectedCardId;
let submitbutton;

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  submitbutton = evt.submitter;
  setButtonText(submitbutton, true);

  api
    .editAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      evt.target.reset();
      disableButton(submitbutton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbutton, false);
    });
}

function handleLikeClick(evt, id) {
  const isLike = evt.target.classList.contains("card__like-button_liked");
  api
    .handleLike(id, isLike)
    .then((data) => {
      data.isLiked
        ? evt.target.classList.add("card__like-button_liked")
        : evt.target.classList.remove("card__like-button_liked");
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  submitbutton = evt.submitter;
  setButtonText(submitbutton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbutton, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = data.name;
  cardImage.alt = data.name;
  cardImage.src = data.link;
  data.isLiked
    ? cardLikeBtn.classList.add("card__like-button_liked")
    : cardLikeBtn.classList.remove("card__like-button_liked");

  cardLikeBtn.addEventListener("click", (evt) =>
    handleLikeClick(evt, data._id),
  );
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data),
  );
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

  submitbutton = evt.submitter;
  setButtonText(submitbutton, true);

  api
    .editUserInfo({ name: inputName.value, about: inputDescription.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
      disableButton(submitbutton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbutton, false);
    });
}

function handlePostFormSubmit(evt) {
  evt.preventDefault();

  submitbutton = evt.submitter;
  setButtonText(submitbutton, true);

  api
    .postNewCard({ name: inputCaption.value, link: inputImageLink.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(addNewPostModal);
      evt.target.reset();
      disableButton(submitbutton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbutton, false);
    });
}

editBtn.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  resetValidation(saveProfileForm, [inputName, inputDescription], settings);
  openModal(editProfileModal);
});

addBtn.addEventListener("click", () => openModal(addNewPostModal));

avatarBtn.addEventListener("click", () => openModal(avatarModal));

closeBtnProfile.addEventListener("click", () => closeModal(editProfileModal));

closeBtnPost.addEventListener("click", () => closeModal(addNewPostModal));

closePreviewBtn.addEventListener("click", () => closeModal(previewModal));

closeBtnDelete.addEventListener("click", () => closeModal(deleteModal));

avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

saveProfileForm.addEventListener("submit", handleProfileFormSubmit);

savePostForm.addEventListener("submit", handlePostFormSubmit);

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

cancelBtn.addEventListener("click", () => closeModal(deleteModal));

enableValidation(settings);
