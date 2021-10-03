document.addEventListener('DOMContentLoaded', () => {
     /* FALSO SCROLL */
     function getScrollPercent() {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }
    let f_scroll =  () => document.querySelector('#progreso-scroll').style.width = getScrollPercent() + '%';
    f_scroll();
    window.addEventListener('scroll', f_scroll);

    /* SUBMENUS */
    for (padre of document.querySelectorAll('.padre-desplegable')) {
        padre.addEventListener('click', function() {
            padre.classList.toggle('on')
        }.bind(padre));
    }

    /* Cambiar fractales? */
    $(document).ready(function () {
        setInterval(() => {
            initIFS();
            set_colors();
            console.log('🦧')
        }, 5000);

    });
});