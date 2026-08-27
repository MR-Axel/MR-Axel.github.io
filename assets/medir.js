/* La medición del portfolio. Umami propio, sitio aparte del de dametrabajo.

   Qué se quiere saber, y nada más que eso: cuánta gente entra, de dónde,
   quiénes abren el chat y quiénes intentan escribir. No hay embudo de producto
   acá porque no hay producto: hay una página y dos formas de dejar un mensaje.

   🔴 SIN GATE DE CONSENTIMIENTO, Y ES UNA DECISIÓN, NO UN OLVIDO. Umami no pone
   cookies ni guarda nada que identifique a una persona, así que no hay nada que
   consentir. Y el gate no sale gratis: en otro proyecto tiró en silencio los
   cuatro eventos del alta, porque ocurren ANTES de que exista una decisión, y
   dejó ciego justo el tramo donde más gente se perdía. Un banner acá costaría
   exactamente eso a cambio de nada.

   🔴 TODO SE EMITE DESDE EL NAVEGADOR, NUNCA DESDE EL SERVIDOR. El formulario y
   el chat pasan por el VPS y sería más cómodo emitir ahí, pero los recorridos de
   Umami son por SESIÓN: un evento mandado desde el servidor abre una sesión
   nueva y el último paso da cero para siempre. No es que nadie convierta, es que
   no se puede cruzar el límite cliente/servidor en una herramienta de sesiones.

   ⚠️ Y las visitas propias no cuentan. Entrando una vez a axelrosso.com?nomedir
   queda apagado en ese navegador para siempre. Sin eso, los tests propios inflan
   todo: en otro proyecto el único "cliente pago" de un mes resultó ser un amigo
   probando reembolsos. */

(function () {
  'use strict';

  var SITIO = '2e072eeb-87f5-4f25-98ee-78928a3122e6';
  var HOST = 'https://analytics.dametrabajo.com';
  var APAGADO = 'umami.disabled';

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  if (location.search.indexOf('nomedir') > -1) guardar(APAGADO, '1');
  if (leer(APAGADO) === '1') {
    window.medir = function () {};
    return;
  }

  var s = document.createElement('script');
  s.defer = true;
  s.src = HOST + '/script.js';
  s.setAttribute('data-website-id', SITIO);
  /* auto-track apagado: el pageview se manda a mano una vez, después de que el
     script de arranque decidió idioma y tema, para que viajen con él. */
  s.setAttribute('data-auto-track', 'false');
  document.head.appendChild(s);

  /* 🔴 La lista negra corre en CADA emisión, no es una convención que hay que
     recordar. Nada de lo que una persona escribe puede salir de acá: ni su
     mail, ni su nombre, ni el texto de un mensaje. Lo que se mide es que algo
     pasó, no qué decía. */
  /* ⚠️ DOS LISTAS Y NO UNA, y la razon es un error que casi entra. Con una sola
     lista por subcadena, "ip" mata a `tipo` y `equipo`, y "q" mata a `busqueda`.
     Se descartarian en silencio, que es exactamente el modo de fallar mas caro:
     el evento sale sin ese campo y nadie se entera nunca.
     Las palabras largas van por subcadena porque `mail_usuario` tiene que caer.
     Las cortas van por igualdad exacta, porque como subcadena son ruido. */
  var PROHIBIDO = ['mail', 'correo', 'nombre', 'name', 'texto', 'text',
                   'mensaje', 'message', 'telefono', 'phone', 'token',
                   'direccion', 'address', 'query', 'password', 'clave',
                   'documento', 'usuario', 'user'];
  var PROHIBIDO_EXACTO = ['ip', 'q', 'id', 'dni', 'cuit', 'tel'];

  function limpio(datos) {
    var out = {};
    for (var k in datos) {
      if (!Object.prototype.hasOwnProperty.call(datos, k)) continue;
      var bajo = k.toLowerCase();
      var malo = PROHIBIDO_EXACTO.indexOf(bajo) > -1;
      for (var i = 0; !malo && i < PROHIBIDO.length; i++) {
        if (bajo.indexOf(PROHIBIDO[i]) > -1) { malo = true; }
      }
      var v = datos[k];
      /* Un objeto anidado puede traer cualquier cosa adentro, así que tampoco
         pasa: solo primitivos. */
      if (malo || (v !== null && typeof v === 'object')) continue;
      out[k] = v;
    }
    return out;
  }

  var cola = [];
  var ultimo = {};

  window.medir = function (evento, datos) {
    /* Un mismo evento dos veces en 300ms es un doble click o un listener
       duplicado, no dos cosas que pasaron. */
    var ahora = Date.now();
    if (ultimo[evento] && ahora - ultimo[evento] < 300) return;
    ultimo[evento] = ahora;

    var carga = datos ? limpio(datos) : undefined;
    if (window.umami && window.umami.track) {
      window.umami.track(evento, carga);
    } else if (cola.length < 20) {
      cola.push([evento, carga]);
    }
  };

  s.addEventListener('load', function () {
    if (!window.umami) return;
    /* 🔴 UNA SOLA LLAMADA, Y ESTO CONTABA TODAS LAS VISITAS DOS VECES.
       `track(fn)` no solo fija las propiedades: manda el pageview con ellas.
       Agregarle un `track()` suelto al lado, creyendo que hacia falta para
       emitirlo, duplicaba cada visita. Medido: dos pageviews por carga.

       Va a mano y no por auto-track porque el automatico sale antes de que el
       script de arranque escriba data-lang y data-theme, y todas las visitas
       figurarian en el idioma equivocado. */
    window.umami.track(function (props) {
      /* ⚠️ Adentro de `data`, no en la raiz del payload. Puestos al lado de
         `url` y `referrer` viajan igual, el pedido sale con 200 y no dan error,
         pero Umami no guarda campos que no conoce: se pierden en silencio.
         `data` es su campo para propiedades propias y es el unico consultable.

         Y no es lo mismo que el `language` que Umami ya captura solo: aquel es
         el idioma del navegador, este es el idioma en el que la persona
         efectivamente leyo la pagina, que es la decision que se quiere medir. */
      return Object.assign({}, props, {
        data: {
          idioma: document.documentElement.getAttribute('data-lang') || 'en',
          tema: document.documentElement.getAttribute('data-theme') || 'light'
        }
      });
    });
    while (cola.length) {
      var e = cola.shift();
      window.umami.track(e[0], e[1]);
    }
  });

  /* Qué producto le interesó a alguien. Es lo único de la página que dice algo
     sobre la persona y no sobre la página. */
  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('.card, .sideitem');
    if (card) {
      var t = card.querySelector('.card__title, .sideitem__name');
      if (t) window.medir('producto', { cual: t.textContent.trim().replace('↗', '').trim() });
      return;
    }
    var mini = e.target.closest && e.target.closest('a.mini, .skill-card[href]');
    if (mini) window.medir('skill');
  }, true);
})();
