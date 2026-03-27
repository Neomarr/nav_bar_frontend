let mockDB = { products: [] };

const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const suggestionsBox = document.getElementById('suggestions');
const searchFeedback = document.getElementById('searchFeedback');

fetch('./mockDatabase.json')
  .then(res => res.json())
  .then(data => {
    mockDB = data;
    console.log('Mock DB loaded', mockDB);
  })
  .catch(err => {
    console.error('Failed to load mock database', err);
  });

function createSuggestionItem(product) {
  const item = document.createElement('div');
  item.className = 'suggestion-item';
  item.textContent = `${product.name} · ${product.category}`;
  item.dataset.productId = product.id;

  item.addEventListener('mousedown', function(e) {
    e.preventDefault();
    searchInput.value = product.name;
    applySearch(product.name);
    hideSuggestions();
  });

  return item;
}

function showSuggestions(matches) {
  suggestionsBox.innerHTML = '';

  if (!matches.length) {
    hideSuggestions();
    return;
  }

  matches.slice(0, 6).forEach(product => {
    suggestionsBox.appendChild(createSuggestionItem(product));
  });

  suggestionsBox.classList.remove('d-none');
}

function hideSuggestions() {
  suggestionsBox.classList.add('d-none');
}

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

  searchFeedback.textContent = `Search query: "${query}" · ${results.length} result(s) found`;
  console.log('Search query:', query, 'results:', results);
}

searchInput.addEventListener('input', function() {
  const query = this.value.trim();

  if (query === '') {
    hideSuggestions();
    searchFeedback.textContent = 'Search products by name, category, or description.';
    return;
  }

  const products = (mockDB.products || []).filter(p =>
    p.name.toLowerCase().startsWith(query.toLowerCase())
  );

  showSuggestions(products);
  applySearch(query);
});

searchInput.addEventListener('focus', function() {
  if (this.value === '') {
    this.style.backgroundColor = '#FFFFFF';
  }
});

searchInput.addEventListener('blur', function() {
  if (this.value === '') {
    this.style.backgroundColor = '#F5F5F5';
  }
  setTimeout(() => hideSuggestions(), 100);
});

searchForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const searchQuery = searchInput.value.trim();

  if (!searchQuery) {
    return;
  }

  applySearch(searchQuery);
  hideSuggestions();
});

let cartCount = 0;

document.querySelector('.cart-icon').addEventListener('click', function(e) {
  e.preventDefault();
  console.log('Cart clicked. Items:', cartCount);
});

document.querySelector('.profile-icon').addEventListener('click', function(e) {
  e.preventDefault();
  console.log('Profile clicked');
});

console.log('Arcadia Hobby House navbar loaded successfully!');
