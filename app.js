document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://thronesapi.com/api/v2/Characters';
  const collection = document.getElementById('collection');
  const favorites = document.getElementById('favorites');
  const totalValueElement = document.getElementById('totalValue');
  const sortButton = document.getElementById('sortButton');

  let items = [];
  let favoritesList = [];
  let isSortedAZ = false;

  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      items = data.slice(0, 200);
      displayItems(items, collection, 'collection');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  function displayItems(items, container, type) {
    const listContainer = container.querySelector('.list-container');
    listContainer.innerHTML = '';
    items.forEach((item) => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';
      itemCard.innerHTML = `
              <h3>${item.fullName}</h3>
              <p class="title">${item.title}</p>
              <p class="family">${item.family}</p>
              <img src="${item.imageUrl}" alt="${item.fullName}">
              <button>${type === 'collection' ? '💚' : '🚫'}</button>
          `;
      itemCard.querySelector('button').addEventListener('click', () => {
        if (type === 'collection') {
          addToFavorites(item);
        } else {
          removeFromFavorites(item);
        }
      });
      listContainer.appendChild(itemCard);
    });
  }

  function addToFavorites(item) {
    items = items.filter((i) => i.id !== item.id);
    favoritesList.push(item);
    updateDisplay();
  }

  function removeFromFavorites(item) {
    favoritesList = favoritesList.filter((i) => i.id !== item.id);
    items.push(item);
    updateDisplay();
  }

  function updateDisplay() {
    displayItems(items, collection, 'collection');
    displayItems(favoritesList, favorites, 'favorites');
    updateTotalValue();
  }

  function updateTotalValue() {
    const totalValue = favoritesList.reduce((sum, item) => sum + item.title.length, 0);
    totalValueElement.textContent = totalValue;
  }

  sortButton.addEventListener('click', () => {
    isSortedAZ = !isSortedAZ;
    const sortOrder = isSortedAZ ? 1 : -1;
    items.sort((a, b) => a.fullName.localeCompare(b.fullName) * sortOrder);
    favoritesList.sort((a, b) => a.fullName.localeCompare(b.fullName) * sortOrder);
    updateDisplay();
  });

  fetchData();
});
