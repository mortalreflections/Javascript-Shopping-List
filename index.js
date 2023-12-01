// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');

const itemForm = document.querySelector('#item-form');
const inputBox = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearAllButton = document.querySelector('#clear');
const filterBox = document.querySelector('#filter-list');
const formButton = itemForm.querySelector('button');
let editFlag = false;
// localStorage.removeItem('items');

const addItem = (e) => {
  e.preventDefault();
  const inputBoxValue = inputBox.value;
  if (inputBoxValue === '') {
    alert('Please enter a item to add!');
    return;
  }

  if (editFlag) {
    const editItem = itemList.querySelector('.edit-mode');
    editItem.classList.remove('edit-mode');
    editItem.remove();
    editFlag = false;
  }

  addDataToLocal(inputBoxValue);
  addToDom(inputBoxValue);
  clearUIState();
};

function displayItems() {
  const itemsFromStorage = getDataFromLocal();
  itemsFromStorage.forEach((item) => {
    addToDom(item);
    clearUIState();
  });
}

function addDataToLocal(inputBoxValue) {
  const itemsFromStorage = getDataFromLocal();
  itemsFromStorage.push(inputBoxValue);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getDataFromLocal() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function addToDom(inputBoxValue) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(inputBoxValue));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
  inputBox.value = '';
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-circle-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      e.target.parentElement.parentElement.remove();
      removeItemFromStorage(e.target.parentElement.parentElement);
    }
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  editFlag = true;
  itemList.querySelectorAll('li').forEach((i) => {
    i.classList.remove('edit-mode');
  });
  item.classList.add('edit-mode');
  formButton.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formButton.style.backgroundColor = '#228B22';
  console.log(formButton);
  inputBox.value = item.textContent;
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getDataFromLocal();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item.textContent);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeAllItem(e) {
  e.preventDefault();
  while (itemList.firstChild) {
    removeItemFromStorage(itemList.firstChild);
    itemList.firstChild.remove();
  }
  clearUIState();
}

function clearUIState() {
  inputBox.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearAllButton.style.display = 'none';
    filterBox.style.display = 'none';
  } else {
    clearAllButton.style.display = 'block';
    filterBox.style.display = 'block';
  }
  formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formButton.style.backgroundColor = '#333';

  editFlag = false;
}

function getSearchedItem(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const listText = item.firstChild.textContent.toLowerCase();
    if (listText.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = none;
    }
  });
}

function init() {
  itemForm.addEventListener('submit', addItem);
  itemList.addEventListener('click', onClickItem);
  clearAllButton.addEventListener('click', removeAllItem);
  filterBox.addEventListener('input', getSearchedItem);
  window.addEventListener('load', displayItems());
  clearUIState();
}

init();
