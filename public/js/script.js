/* const { removeAllListeners } = require("process"); */

document.addEventListener('DOMContentLoaded', () => {
    /* ESCRITORIO */
    if (window.innerWidth > 991) {
        /* ESCONDER MENU */
        /* let y_offs = window.pageYOffset;
        let last_y_offs = y_offs;
        window.addEventListener('wheel', (ev) => {
            console.log(ev);
            
            y_offs = window.pageYOffset;
            if( ev.deltaY > 0 && y_offs != last_y_offs) {
                document.querySelector('header').classList.add('off')
            } else {
                document.querySelector('header').classList.remove('off')
            }

            last_y_offs = y_offs;
        });   
        for (let btn of document.querySelectorAll('#hover-main-menu .desp-menu')) {
            btn.addEventListener('click', () => {
                document.querySelector('header').classList.toggle('off')
            });
        }
        for (let btn of document.querySelectorAll('#hover-main-menu .stats')) {
            btn.addEventListener('click', () => {
                document.querySelector('header').classList.toggle('off')
            });
        }
        document.querySelector('.MuiButton-root').addEventListener('click', () => {
            document.querySelector('header').classList.toggle('off')
        }); */
    }

    /* SACAR MENU EN HOVER */
    /* document.querySelector('#hover-main-menu').addEventListener('mouseover', () => {
        document.querySelector('header').classList.remove('off')
    }); */

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
        window.addEventListener('click', () => {
            initIFS();
            set_colors();
            clearInterval(window.inter)
            window.inter = setInterval(() => {
                if (window.screenTop < 500) {
                    initIFS();
                    set_colors();
                }
            }, 2500);

        });
       

        setTimeout(() => {
            document.querySelector('#hero').classList.add('visible');
        }, 1000);

        window.inter = setInterval(() => {
            if (window.screenTop < 500) {
                initIFS();
                set_colors();
                //console.log('🦧')
            }

        }, 2500);

        setInterval(() => {
            Array.from(document.querySelectorAll('.blink')).forEach(e => {
                e.classList.add('off');
                setTimeout(() => {
                    e.classList.remove('off');
                }, 250);
            });
        }, 1000);
    });
    

    /* REVEALS GALERIA */
    let triggers = ['#faq'];
    for (let i=1; i<=5; i++) {
        triggers.push(`#reveal-1-${i}`)
    }
    for (i=0; i<=5; i++) {
        triggers.push(`#reveal-2-${i}`);
    }

    function check_reveals() {
        let linea = (window.innerHeight/3) * 2;
        for (let trigger of document.querySelectorAll(triggers)) {

            if (linea > trigger.getBoundingClientRect().top) {
                trigger.classList.add('visible');
            }
        }
    }
    check_reveals();
    window.addEventListener('scroll', check_reveals);

    /* Delay FAQ */
    let c = 0;
    for (let padre of document.querySelectorAll('#faq .padre-desplegable')) {
        padre.style.transitionDelay = c+'s';
        c += .2;
    }

    


});

document.addEventListener('DOMContentLoaded', () => {
    // Detects mobile devices
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    if (isMobile.any()) {
        document.querySelector('body').classList.add('mobile');
    }
    
    // Custom cursor: 
    if (document.querySelector('#cursor')) {
        // Mousemove event
        document.addEventListener('mousemove', (e) => {
            let cursor = document.querySelector('#cursor');
            
            // Gets current mouse X and Y position
            let x = e.clientX;
            let y = e.clientY;
            cursor.style.transform = 'translate('+x+'px, '+y+'px)';
        });

        // Mouse hover on links
        for (let link of document.querySelectorAll('a, .Q, .btn')) {
            link.addEventListener('mouseover', () => {
                document.querySelector('#cursor').classList.add('on');
            });
            link.addEventListener('mouseout', () => {
                document.querySelector('#cursor').classList.remove('on');
            });
        }
        // Cursor
        document.addEventListener('mousedown', (ev) => {
        document.querySelector('#cursor').style.filter = 'invert(1)';
    });
    // Change cursor when the mouse is released
    document.addEventListener('mouseup', () => {
        document.querySelector('#cursor').style.filter = 'invert(0)';
    });
    }

});