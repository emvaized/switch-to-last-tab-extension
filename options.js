// Load saved options
chrome.storage.sync.get({
  changeBadge: true,
  activateOnClose: true,
}, (items) => {
  document.getElementById('changeBadge').checked = items.changeBadge;
  document.getElementById('activateOnClose').checked = items.activateOnClose;
});

// Save options
document.getElementById('optionsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const changeBadge = document.getElementById('changeBadge').checked;
  const activateOnClose = document.getElementById('activateOnClose').checked;
  
  chrome.storage.sync.set({
    changeBadge,
    activateOnClose
  }, () => {
    // alert('Options saved!');
  });
});