(function() {
  const TOKEN_NAME = 'JwtToken';
  setTimeout(function() {
    // 1. If token already exists, set it from sessionStorage
    const JWTToken = sessionStorage.getItem(TOKEN_NAME);
    if (JWTToken) {
      ui.authActions.preAuthorizeImplicit({
        auth: {
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorication',
            get: function(key) {
              return this[key];
            },
          },
          name: 'bearer',
          value: JWTToken,
        },
        token: {},
        isValid: true,
      });
    }

    // 2. If token was not set yet, save it to sessionStorage
    const openBtnCollection = document.getElementsByClassName('btn authorize unlocked');
    const openBtn = openBtnCollection.item(0);
    if (openBtn) {
      openBtn.addEventListener('click', function() {
        setTimeout(function() {
          const authBtnCollection = document.getElementsByClassName(
            'btn modal-btn auth authorize button'
          );
          const authBtn = authBtnCollection.item(0);
          authBtn.addEventListener('click', function(e) {
            const tokenInput = document.querySelector('input:not([class])');
            if (tokenInput && tokenInput.value) {
              sessionStorage.setItem(TOKEN_NAME, tokenInput.value);
              console.log('Token vas successfully saved!!!');
            }
          });
        }, 1000);
      });
    }
  }, 1000);
})();
