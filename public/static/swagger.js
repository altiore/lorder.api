(function() {
  setTimeout(function() {
    const openModalCollection = document.getElementsByClassName('btn authorize unlocked');
    const openBtn = openModalCollection.item(0);
    if (openBtn) {
      openBtn.addEventListener('click', function() {
        setTimeout(function() {
          const authCollection = document.getElementsByClassName(
            'btn modal-btn auth authorize button'
          );
          const authBtn = authCollection.item(0);
          authBtn.addEventListener('click', function(e) {
            console.log('click to AUTH button!!!');
          });
        }, 1000);
        console.log('Button was clicked!!!');
      });
    }

    const ui = SwaggerUIBundle({});
    console.log('SwaggerUIBundle', {
      SwaggerUIBundle,
      ui,
      uiProps: Object.getOwnPropertyNames(ui),
      uiState: ui.getState(),
    });
  }, 1000);
})();
