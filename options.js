// Load saved options
chrome.storage.sync.get({
  changeBadge: false,
  changeIcon: true,
  activateOnClose: false,
}, (items) => {
  document.getElementById('changeBadge').checked = items.changeBadge;
  document.getElementById('changeIcon').checked = items.changeIcon;
  document.getElementById('activateOnClose').checked = items.activateOnClose;
});

// Save options
document.getElementById('optionsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const changeBadge = document.getElementById('changeBadge').checked;
  const changeIcon = document.getElementById('changeIcon').checked;
  const activateOnClose = document.getElementById('activateOnClose').checked;
  
  chrome.storage.sync.set({
    changeBadge,
    changeIcon,
    activateOnClose
  }, () => {
    // alert('Options saved!');
  });
});