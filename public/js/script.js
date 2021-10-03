document.addEventListener('DOMContentLoaded', () => {
    /* SUBMENUS */
    for (padre of document.querySelectorAll('.padre-desplegable'))
        padre.addEventListener('click', function() {
            padre.classList.toggle('on')
        }.bind(padre));
});