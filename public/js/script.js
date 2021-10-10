document.addEventListener('DOMContentLoaded', () => {
    /* ESCRITORIO */
    if (window.innerWidth > 991) {
        /* ESCONDER MENU */
        window.addEventListener('wheel', (ev) => {
            console.log(ev)
            if( ev.deltaY > 0 ) {
                document.querySelector('header').classList.add('off')
            } else {
                document.querySelector('header').classList.remove('off')
            }
        });   
    }
    /* SACAR MENU EN HOVER */
    document.querySelector('#hover-main-menu').addEventListener('mouseover', () => {
        document.querySelector('header').classList.remove('off')
    });

    /* FALSO SCROLL */
    function getScrollPercent() {
       var h = document.documentElement,
           b = document.body,
           st = 'scrollTop',
           sh = 'scrollHeight';
       return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
   }
   let f_scroll =  () => document.querySelector('#progreso-scroll').style.width = getScrollPercent()*-1 +100 + '%';
   f_scroll();
   window.addEventListener('scroll', f_scroll);

    /* DESPLEGABLES */
    for (let padre of document.querySelectorAll('.padre-desplegable')) {
        padre.addEventListener('click', function() {
            padre.classList.toggle('on');
        });
    }

    /* Cambiar fractales? */
    $(document).ready(function () {
        let tmp_inter = setInterval(() => {
            if (window.screenTop < 500) {
                initIFS();
                set_colors();
                console.log('🦧')
            }
        }, 250);

        setTimeout(() => {
            clearInterval(tmp_inter);
            setInterval(() => {
                if (window.screenTop < 500) {
                    initIFS();
                    set_colors();
                    console.log('🦧')
                }
            }, 2500);
        }, 1500);

    });

    /* BOTON */
    for (btn of document.querySelectorAll('.MuiButtonBase-root')) {
        btn.classList.add('btn')
    }
});