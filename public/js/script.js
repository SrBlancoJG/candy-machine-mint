document.addEventListener('DOMContentLoaded', () => {
    /* ESCRITORIO */
    if (window.innerWidth > 991) {
        /* ESCONDER MENU */
        let y_offs = window.pageYOffset;
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
        });
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


    /* function getColors(c) {
        var col, colors = {};
        var pixels, r, g, b, a;
        r = g = b = a = 0;
        pixels = c.getImageData(0, 0, c.width, c.height);
        for (var i = 0, data = pixels.data; i < data.length; i += 4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3]; // alpha
            // skip pixels >50% transparent
            if (a < (255 / 2))
                continue; 
            col = rgbToHex(r, g, b);
            if (!colors[col])
                colors[col] = 0;
            colors[col]++;
        }
        return colors;
    } */
    /* console.log(getColors(document.querySelector('#fractal-container > canvas'))) */
});