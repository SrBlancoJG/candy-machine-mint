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

    /* SUBMENUS */
    for (padre of document.querySelectorAll('.padre-desplegable')) {
        padre.addEventListener('click', function() {
            padre.classList.toggle('on')
        }.bind(padre));
    }
    const faqDespegables = document.querySelectorAll('.faq-despegable');

    let i = 0;
    for(let faq of document.querySelectorAll('.faq-padre')){
        faq.addEventListener('click', function(){
            faqDespegables[i].classList.toggle('desplegado');
        });
        i++;
    }

    /* Cambiar fractales? */
    $(document).ready(function () {
        setInterval(() => {
            initIFS();
            set_colors();
            console.log('🦧')
        }, 5000);
    });

    /* BOTON */
    for (btn of document.querySelectorAll('.MuiButtonBase-root')) {
        btn.classList.add('btn')
    }
});