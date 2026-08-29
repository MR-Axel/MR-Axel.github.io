/* Spanish for the whole page, keyed by the English source.

   Keys are the element's innerHTML with whitespace collapsed, so nothing in
   index.html needs an id or a data attribute: app.js walks the candidate
   elements, normalises what it finds and looks it up here. A string that is
   the same in both languages (product names, stack chips, LinkedIn, GitHub)
   is simply absent, and the element is left alone.

   Rioplatense, voseo, and no em dashes: he reads those as machine-written. */

window.ES = {

  /* --- chrome --- */
  'Skip to content': 'Saltar al contenido',
  'Work': 'Productos',
  'Activity': 'Actividad',
  'Get in touch': 'Escribime',
  'See what I build': 'Mirá lo que construyo',

  /* --- hero --- */

  /* the job title is not translated on purpose: nobody in tech here says
     "Gerente de Producto", and "Product Manager de IA" is the half-translation
     that made the line read wrong. Only the second line changes. */



  'Products built': 'Productos construidos',
  'Years in software': 'Años en software',
  'Contributions, last year': 'Contribuciones, último año',

  /* --- work --- */
  'Products I built and still run. All of them are live, and you can walk into every one.':
    'Productos que construí y sigo manteniendo. Todos están vivos, y a todos se puede entrar.',

  'Tailored CVs per posting, tracked applications, and the eligibility check up front.':
    'CV a medida para cada aviso, postulaciones con seguimiento, y la compuerta de elegibilidad antes de aplicar.',

  'An AI tutor for kids in LatAm. Nova builds missions around what a kid already loves, and never hands over the answer.':
    'Un tutor de IA para chicos en LatAm. Nova arma misiones desde lo que al chico ya le copa, y nunca le da la respuesta.',


  'Where early projects get found. Builders publish what they are working on and meet co-founders before there is anything to demo.':
    'Donde se encuentran los proyectos tempranos. Publicás en qué estás y conocés cofundadores antes de tener algo para mostrar.',

  'Specs, roadmaps, research and audits for PMs, founders and small product teams. Product management built on Claude.':
    'Specs, roadmaps, research y auditorías para PMs, fundadores y equipos chicos. Product management sobre Claude.',

  'AI agents for small businesses: WhatsApp, web and voice, wired to the data they already have, with a dashboard on top.':
    'Agentes de IA para negocios chicos: WhatsApp, web y voz, conectados a los datos que ya tienen, con un tablero arriba.',

  /* tags */
  'Job search': 'Búsqueda laboral',
  'Community': 'Comunidad',
  'AI agents': 'Agentes de IA',
  'AI tutor': 'Tutor de IA',
  'Vision': 'Visión',
  'SMB': 'PyMEs',


  /* pills */
  /* "Live" se queda en ingles tambien en castellano. "Vivo" al lado de un
     producto se lee como que respira; el sentido es que esta en linea y se
     puede entrar, y para eso "Live" ya es la palabra que usa todo el mundo,
     incluso hablando en castellano. */
  'Live': 'Live',

  /* --- also built --- */
  'Also built': 'También construí',


  'A community for tech and startup people, with a blog and paid memberships.':
    'Una comunidad de gente de tech y startups, con blog y membresías pagas.',

  'A social app for finding a training partner at your gym, at your hour.':
    'Una app social para encontrar con quién entrenar, en tu gimnasio y a tu hora.',

  'Translates and summarises whole books the same day, priced by word count.':
    'Traduce y resume libros enteros el mismo día, con precio por cantidad de palabras.',

  'Daily gamified challenges with rankings and a WhatsApp loop.':
    'Desafíos diarios gamificados con rankings y un loop de WhatsApp.',

  /* --- craft --- */







  /* --- agent skills --- */



  'Picks the agent architecture a task deserves out of 32 methods, and returns the one to use, why not the others, and the signal to abandon it.':
    'Elige la arquitectura agéntica que la tarea merece, de 32 métodos. Devuelve cuál usar, por qué ese, y la señal para abandonarlo.',








  'The full loop for a feature: plan, implement, validate, review, deploy. Chains the other skills together.':
    'El loop completo de una feature: planear, implementar, validar, revisar, desplegar. Encadena los otros skills.',

  'Same as ship, delegated to five subagents with narrow tool access: the one writing the spec cannot write code.':
    'Lo mismo que ship, delegado a cinco subagentes con acceso acotado: el que escribe la spec no puede escribir código.',

  'Runs your validation pipeline and reports honestly: what passed, what failed, what got skipped. Never marks green something that never ran.':
    'Corre tu pipeline de validación y reporta con honestidad: qué pasó, qué falló, qué se salteó. Nunca marca en verde algo que no corrió.',

  'Code review of a diff. Every finding anchored to a real file and line, with the concrete failure scenario spelled out.':
    'Code review de un diff. Cada hallazgo anclado a un archivo y una línea reales, con el escenario de falla concreto escrito.',




  'The release pipeline. Separate permissions for commit, push and deploy, and it never ships a build that hasn\'t passed.':
    'El pipeline de release. Permisos separados para commit, push y deploy, y nunca shippea un build que no pasó.',






  /* --- services --- */
  'Services': 'Servicios',
  /* &#39; in the source, but the browser hands back a plain apostrophe, so the
     key has to be written the way innerHTML reads it */






  /* --- agent skills --- */
  'The 14 open ones, on GitHub<span class="arrow" aria-hidden="true">↗</span>':
    'Los 14 abiertos, en GitHub<span class="arrow" aria-hidden="true">↗</span>',

  /* --- activity --- */
  'Most of the code lives in private product repos, so the graph is the honest part of it.':
    'Casi todo el código vive en repos privados de producto, así que el gráfico es la parte honesta.',

  'Less': 'Menos',
  'More': 'Más',

  'What is public is this site and the Agent Skills above. Everything else is product code in private repos. <a href="https://github.com/MR-Axel" target="_blank" rel="noopener">See the profile on GitHub<span class="arrow" aria-hidden="true">↗</span></a>':
    'Lo público es este sitio y los Agent Skills de arriba. Todo lo demás es código de producto en repos privados. <a href="https://github.com/MR-Axel" target="_blank" rel="noopener">Ver el perfil en GitHub<span class="arrow" aria-hidden="true">↗</span></a>',

  /* --- contact --- */
  'Let\'s talk': 'Hablemos',

  /* --- the contact form --- */
  'Your name':
    'Tu nombre',
  'Email':
    'Mail',
  'What you are looking for':
    'Qué estás buscando',
  'Send it':
    'Mandalo',
  'Sending.':
    'Mandando.',
  'It arrived. I read these myself and answer from my own inbox, usually inside a day.':
    'Llegó. Los leo yo y contesto desde mi correo, casi siempre dentro del día.',
  'That did not go through. LinkedIn is the way around it, and I will see it there.':
    'No salió. Por LinkedIn le pego la vuelta y lo veo igual.',

  /* --- el hero --- */
  'Years on my own products':
    'Años con productos propios',
  'Tools delivered':
    'Herramientas entregadas',

  /* --- servicios --- */
  'Strategy and advisory':
    'Estrategia y asesoría',
  'MBA en Tecnología e Innovación':
    'MBA en Tecnología e Innovación',
  'Others':
    'Otros',
  'Point of sale, stock and the fiscal side wired together, for a monotributista who today invoices by hand.':
    'Punto de venta, stock y la parte fiscal atados entre sí, para un monotributista que hoy factura a mano.',
  'Earlier builds and one on pause. Two are still up and the rest are off.':
    'Cosas anteriores y una en pausa. Dos siguen en pie y el resto está apagado.',

  /* --- voz, revision completa --- */
  'Tell me what you need':
    'Contame qué necesitás',
  'WhatsApp agent':
    'Agente de WhatsApp',

  /* --- voz: recorrido, oficio y servicios --- */
  'Six places, and in most of them being wrong cost more than a rollback: a misread cardiology trace, an energy unit sitting out in a field.':
    'Seis lugares, y en casi todos equivocarse costaba más que un rollback: una lectura de cardiología, un equipo de energía en el medio del campo.',
  'Before software. I walked operations and drew how the work actually moved, which was never how the manual said it moved. I still open a product with that same question.':
    'Antes del software. Recorría operaciones y dibujaba cómo se movía el trabajo de verdad, que nunca era como decía el manual. Sigo abriendo un producto con esa misma pregunta.',
  'QA on cardiology systems. A wrong reading there is not a bug report, and that is where I picked up the habit of not believing anything I cannot test myself.':
    'QA en sistemas de cardiología. Una lectura equivocada ahí no es un reporte de bug, y de ahí me quedó la costumbre de no creerle a nada que no pueda testear yo.',
  'Closed networks: no remote access, no reading the logs from home. I rebuilt their Linux environments on my side to test against, and I ran the releases myself. Anything I did twice ended up as a script.':
    'Redes cerradas: nada de acceso remoto, nada de mirar los logs desde casa. Replicaba sus entornos Linux de este lado para poder testear, y los releases los corría yo. Lo que hice dos veces terminó en un script.',
  'Devices and energy systems out in the field, where undoing a release means sending a truck. I tested against the real hardware, which unlike a mock does not always agree with you.':
    'Dispositivos y sistemas de energía en el campo, donde deshacer un release es mandar una camioneta. Probaba contra el hardware real, que a diferencia de un mock no siempre te da la razón.',
  'Product for route optimisation and fleet operations. I built the prototyping team from nothing and led it, until nobody argued about an idea without something working in front of them.':
    'Producto para optimización de rutas y operación de flotas. Armé el equipo de prototipado desde cero y lo dirigí, hasta que nadie discutía una idea sin tener algo andando adelante.',
  'Agent architecture and the roadmap over it: what the agent may do, where it hands off, how you tell whether it is any good. I led the team that built the workflow builder they run on, and shipped features into it myself.':
    'Arquitectura de agentes y el roadmap encima: qué puede hacer el agente, dónde le pasa la posta, cómo te das cuenta de si es bueno. Lideré el equipo que construyó el workflow builder sobre el que corren, y shippeé features a producción yo mismo.',

  /* --- el hero --- */

  /* --- fuera lo generico --- */
  'The skills I write for Claude Code and use every day. These six are the ones I run most.':
    'Los skills que escribo para Claude Code y uso todos los días. Estos seis son los que más corro.',

  /* --- hero y oficio --- */
  'Agents and apps:<br>from idea to product.':
    'Agentes y aplicaciones:<br>de la idea al producto.',

  'Six years testing what other people built.<br>Now I build it myself, to that standard.':
    'Me pasé seis años testeando lo que construían otros.<br>Ahora lo construyo yo, con calidad.',

  'Agent chat, Voice AI, image generation and analysis. Automation with escalation when it is needed. Internal tools for your team, or to take to market.':
    'Chat de agentes, Voz IA, creación y análisis de imágenes. Automatizaciones con escalamiento si hace falta. Herramientas internas para tu equipo o para salir al mercado.',

  'Shared rides for the daily commute, on a flat fare. You travel comfortably, for a good price, and it earns you perks.':
    'Viajes compartidos para el día a día, con tarifa plana. Viajás cómodo, a buen precio y con beneficios.',


  /* --- el arbol de lo que puede construir --- */
  'Voice':
    'Voz',
  'Images':
    'Imágenes',
  'Architecture':
    'Arquitectura',
  'Web, WhatsApp and whatever channel the team already uses, answering from the business own data.':
    'Web, WhatsApp y el canal que el equipo ya usa, respondiendo con los datos del negocio.',
  'Live calls, with latency, interruptions and tone under control.':
    'Llamadas con control de latencia, interrupciones, tono.',
  'A screenshot or a photo comes in and the agent decides from it.':
    'Entra una captura o una foto y el agente decide a partir de eso.',
  'Script, generation and edit, prompt to finished clip.':
    'Guion, generación y edición, del prompt al clip terminado.',
  'Where they run, which tools they may touch, when they hand off to a person.':
    'Dónde corren, qué herramientas pueden tocar, cuándo le pasan la posta a una persona.',
  'Products, 0 to 1':
    'Productos de 0 a 1',
  'Strategy':
    'Estrategia',
  'Build':
    'Desarrollo',
  'Launch':
    'Lanzamiento',
  'What gets built, for whom, and what stays out of the first version.':
    'Qué se construye, para quién, y qué queda afuera de la primera versión.',
  'Spec to release, in weeks. The repo ends up yours.':
    'De la spec al release, en semanas. El repo queda tuyo.',
  'Out to market with the measurement wired in from day one.':
    'Salida al mercado con la medición puesta desde el día uno.',
  'Automation':
    'Automatizaciones',
  'Internal tools':
    'Herramientas internas',
  'Handover':
    'Continuidad',
  'The process that today is a person copying between two screens.':
    'El proceso que hoy es una persona copiando entre dos pantallas.',
  'Panels and back offices for your team, or to take to market.':
    'Paneles y back office para tu equipo, o para salir al mercado.',
  'That it still runs six months after whoever built it has gone.':
    'Que siga andando seis meses después de que el que la armó se fue.',
  'Dashboards':
    'Tableros',
  'The ones that get opened when there is a decision to make.':
    'Los que se abren cuando hay que decidir algo.',
  'Measurement':
    'Medición',
  'Funnel':
    'Embudo',
  'How many people arrive, where they leave, and what they did before leaving.':
    'Cuánta gente entra, por dónde se va, y qué hizo antes de irse.',
  'Finding the step that loses people and taking it out of the way.':
    'Encontrar el paso que pierde gente y sacarlo del camino.',
  'Generative production':
    'Producción generativa',
  'Brand':
    'Marca',
  'For the landing, the product and the campaign.':
    'Para la landing, el producto y la campaña.',
  'Prompt to rendered clip.':
    'Del prompt al clip renderizado.',

  /* --- la seccion unica --- */
  'What I can help with':
    'Con qué te puedo ayudar',
  'Ask about this':
    'Consultar por esto',
  'One to one':
    'Uno a uno',
  'Alongside the team':
    'Al lado del equipo',
  'With the founder, on what is about to be decided.':
    'Con el fundador, sobre lo que se está por decidir.',
  'Next to the people building, in the AI calls.':
    'Al lado de los que construyen, en las decisiones de IA.',
  'Built or redesigned so it says what you actually do.':
    'Armada o rediseñada para que diga lo que hacés de verdad.',

  /* --- las seis ramas --- */
  'An agent that answers':
    'Un agente que contesta',
  'Trained on your business, on the site and on WhatsApp.':
    'Entrenado con tu negocio, en el sitio y en WhatsApp.',
  'Your business online':
    'Tu negocio online',

  'Private': 'Privado',

  'Ask about a service': 'Consultar por servicios',

  'What it is about':
    'Sobre qué',
  'Something else':
    'Otro',

  'Put real value into your product, with features that stand out.':
    'Entregá valor en tus productos, con funcionalidades que se destaquen.',
  'Give your customers an experience that lands, and get the data to make good decisions.':
    'Lográ una experiencia increíble para tus clientes y obtené los mejores datos para tomar decisiones de calidad.',
  "Let's turn your idea into something real.":
    'Convirtamos tu sueño en una realidad.',
  "Let's save the hours that go into repetitive work, and get data and tracking on how it moves.":
    'Ahorremos horas de tareas repetitivas y obtené data y seguimiento de tus avances.',
  'I help you unblock agentic designs, get products out the door, or bring AI into your teams.':
    'Te ayudo a desbloquear diseños agénticos, llevar productos a la realidad o integrar IA en tus equipos.',
  "Let's make your site and your campaigns stand out.":
    'Destaquemos tu sitio y tus campañas.',
  'Logo and identity, with the pieces that hold it up.':
    'Logo e identidad, con las piezas que la sostienen.',
  'Product':
    'Producto',
  'Demo recordings of your product, ready to show.':
    'Grabación de demos de tu producto, listas para mostrar.',
  'Automation and<br>internal tooling':
    'Automatizaciones y<br>herramientas internas',

  "Tell me what idea you have and we'll talk about whether I'm the right person to make it real.":
    'Contame qué idea tenés y hablamos si soy la persona indicada para hacerla realidad.',

  'Automation and flows': 'Automatizaciones y flujos',

  'Automation and internal tooling':
    'Automatizaciones y herramientas internas',

  'Buenos Aires, Argentina · I take on work from companies and from people, remote':
    'Buenos Aires, Argentina · tomo proyectos de empresas y de personas, en remoto',
  'Bs. As. · for companies and for people, remote':
    'Bs. As. · para empresas y para personas, remoto',
  'I build for companies and for people with a project. Write it here and it lands on my phone in a few seconds.':
    'Construyo para empresas y para personas con un proyecto. Escribilo acá y me llega al teléfono en unos segundos.',

  /* --- Lima --- */
  "Axel's assistant":
    'Asistente de Axel',
  'Close':
    'Cerrar',
  'Your message':
    'Tu mensaje',
  'Send':
    'Mandar',
  'Hi, I am the assistant on this site. Tell me what you are trying to build or fix and I will point you at the right thing, or hand you straight to Axel.':
    'Hola, soy el asistente de este sitio. Contame qué estás tratando de construir o de arreglar y te oriento, o te paso derecho con Axel.',
  'Leave my details':
    'Dejar mis datos',
  'Thinking.':
    'Pensando.',
  'Something went wrong on my side. The form further up still reaches him.':
    'Algo se rompió de mi lado. El formulario de más arriba le llega igual.',

  /* --- footer --- */

  /* --- the arc --- */
  'Path': 'Recorrido',
  'How I got here': 'Cómo llegué acá',

  'Consulting': 'Consultoría',
  'Process consulting for industry': 'Consultoría de procesos en industrias',

  'Health': 'Salud',
  'Cardiology and clinical systems': 'Sistemas de cardiología y clínicos',

  'Energy': 'Energía',
  'IoT and hardware in the field': 'IoT y hardware en el campo',

  'Security': 'Seguridad',
  'On-premise, locked down, Linux': 'On-premise, redes cerradas, Linux',

  'Logistics': 'Logística',
  'Routing, fleets, and a team': 'Ruteo, flotas y un equipo',

  'AI product': 'Producto de IA',
  'Agents from zero to production': 'Agentes de cero a producción',

  /* --- craft, the four new ones --- */




  /* --- strings JS builds, so they are not in the DOM to be matched --- */
  '_contributions': '{n} contribuciones en el último año',
  '_contributions_6m': '{n} contribuciones en los últimos seis meses',
  '_switchToEs': 'Ver en español',
  '_switchToEn': 'View in English',
  '_theme': 'Cambiar entre claro y oscuro'
};

window.EN_META = {
  '_contributions': '{n} contributions in the last year',
  '_contributions_6m': '{n} contributions in the last six months',
  '_switchToEs': 'Ver en español',
  '_switchToEn': 'View in English',
  '_theme': 'Switch between light and dark'
};
