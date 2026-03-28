let mockDB = { products: [] };

const searchFeedback = document.getElementById('searchFeedback');

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');

const searchFormMobile = document.getElementById('searchFormMobile');
const searchInputMobile = document.getElementById('searchInputMobile');
const suggestionsBoxMobile = document.getElementById('suggestionsMobile');

fetch('./mockDatabase.json')
  .then(res => res.json())
  .then(data => {
    mockDB = data;
    console.log('Mock DB loaded', mockDB);
  })
  .catch(err => {
    console.error('Failed to load mock database', err);
  });

function applySearch(query) {
  const queryLower = query.trim().toLowerCase();
  const products = mockDB.products || [];

  if (!queryLower) {
    searchFeedback.textContent = 'Search products by name.';
    return;
  }

  const results = products.filter(p =>
    p.name.toLowerCase().startsWith(queryLower)
  );

  searchFeedback.textContent =
    `Search query: "${query}" · ${results.length} result(s) found`;

  console.log('Search query:', query, 'results:', results);
  return results;
}

function createSuggestionItem(product, inputElement, suggestionsElement) {
  const item = document.createElement('div');
  item.className = 'suggestion-item';

  item.textContent = product.name;
  item.dataset.productId = product.id;

  item.addEventListener('mousedown', function (e) {
    e.preventDefault();
    inputElement.value = product.name;
    applySearch(product.name);
    hideSuggestions(suggestionsElement);
  });

  return item;
}

function showSuggestions(matches, suggestionsElement, inputElement) {
  suggestionsElement.innerHTML = '';

  if (!matches.length) {
    hideSuggestions(suggestionsElement);
    return;
  }

  matches.slice(0, 6).forEach(product => {
    suggestionsElement.appendChild(
      createSuggestionItem(product, inputElement, suggestionsElement)
    );
  });

  suggestionsElement.classList.remove('d-none');
}

function hideSuggestions(suggestionsElement) {
  suggestionsElement.classList.add('d-none');
}

function handleSearchInput(event, suggestionsElement) {
  const inputValue = event.target.value.trim();

  if (inputValue === '') {
    hideSuggestions(suggestionsElement);
    searchFeedback.textContent =
      'Search products by name.';
    return;
  }

  const results = (mockDB.products || []).filter(p =>
    p.name.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  showSuggestions(results, suggestionsElement, event.target);
  applySearch(inputValue);
}

function setupInputEvents(inputElement, formElement, suggestionsElement) {
  if (!inputElement || !formElement || !suggestionsElement) return;

  inputElement.addEventListener('input', event =>
    handleSearchInput(event, suggestionsElement)
  );

  inputElement.addEventListener('blur', function () {
    setTimeout(() => hideSuggestions(suggestionsElement), 120);
  });

  formElement.addEventListener('submit', function (e) {
    e.preventDefault();

    const searchQuery = inputElement.value.trim();
    if (!searchQuery) return;

    applySearch(searchQuery);
    hideSuggestions(suggestionsElement);
  });
}

setupInputEvents(searchInput, searchForm, suggestionsBox);
setupInputEvents(searchInputMobile, searchFormMobile, suggestionsBoxMobile);

const categoryChips = document.querySelectorAll('.category-chip');

categoryChips.forEach(chip => {
  chip.addEventListener('click', function () {
    const query = this.textContent.replace(/[^\w\s]/gi, '').trim();

    if (searchInputMobile) {
      searchInputMobile.value = query;
      applySearch(query);
    }

    if (searchInput) {
      searchInput.value = query;
    }

    hideSuggestions(suggestionsBox);
    hideSuggestions(suggestionsBoxMobile);
  });
});

let cartCount = 0;

document.querySelectorAll('.cart-icon').forEach(icon => {
  icon.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Cart clicked. Items:', cartCount);
  });
});

document.querySelectorAll('.profile-icon').forEach(icon => {
  icon.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Profile clicked');
  });
});

console.log('Arcadia Hobby House navbar loaded successfully!');