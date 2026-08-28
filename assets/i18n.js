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
  'Craft': 'Oficio',
  'Activity': 'Actividad',
  'Get in touch': 'Escribime',
  'See what I build': 'Mirá lo que construyo',

  /* --- hero --- */
  '<span class="dot"></span> Buenos Aires, Argentina · open to remote AI product &amp; AI engineering roles':
    '<span class="dot"></span> Buenos Aires, Argentina · abierto a roles remotos de producto e ingeniería de IA',

  /* the job title is not translated on purpose: nobody in tech here says
     "Gerente de Producto", and "Product Manager de IA" is the half-translation
     that made the line read wrong. Only the second line changes. */



  'Products built': 'Productos construidos',
  'Years in software': 'Años en software',
  'Contributions, last year': 'Contribuciones, último año',

  /* --- work --- */
  'Products I built and still run. All of them are live, and you can walk into every one.':
    'Productos que construí y sigo manteniendo. Todos están vivos, y a todos se puede entrar.',

  'Tailored CVs per posting, tracked applications, and the eligibility check up front instead of after you have already applied.':
    'CV a medida para cada aviso, postulaciones con seguimiento, y la compuerta de elegibilidad antes de aplicar y no después.',

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
  'Voice AI': 'Voz IA',
  'AI tutor': 'Tutor de IA',
  'Vision': 'Visión',
  'Automation': 'Automatización',
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

  'AI agent products': 'Productos con agentes de IA',

  'Agentic coding': 'Programación con agentes',


  '0 to 1': '0 a 1',

  'Quality and release engineering': 'Calidad e ingeniería de releases',

  'Data and BI': 'Datos y BI',

  /* --- agent skills --- */



  'Picks the agent architecture a task deserves out of 32 methods, and returns the one to use, why not the others, and the signal to abandon it.':
    'Elige la arquitectura agéntica que la tarea merece, de 32 métodos. Devuelve cuál usar, por qué ese, y la señal para abandonarlo.',




  'one per product': 'uno por producto',

  'private': 'sin publicar',



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
  'Work with me': 'Trabajemos juntos',
  /* &#39; in the source, but the browser hands back a plain apostrophe, so the
     key has to be written the way innerHTML reads it */

  'If somebody on your team spends the day moving the same data between two screens.':
    'Si alguien de tu equipo se pasa el día moviendo los mismos datos entre dos pantallas.',

  'If you have the idea and no team to build it.':
    'Si tenés la idea y no tenés equipo para construirla.',

  'n8n, Activepieces, Retool, Zapier, Make. Plus the process that keeps it from rotting after I leave.':
    'n8n, Activepieces, Retool, Zapier, Make. Más el proceso que evita que se pudra cuando me voy.',
  'If the process lives in a spreadsheet that only one person understands.':
    'Si el proceso vive en una planilla que entiende una sola persona.',

  'If you have engineers and the AI decisions are being made by whoever is free.':
    'Si tenés equipo técnico y las decisiones de IA las toma el que está libre.',

  'Tell me what is broken and I will tell you whether I am the right person for it. If I am not, I will say so, which is cheaper for both of us than finding out in week three.':
    'Contame qué está roto y te digo si soy la persona indicada. Si no lo soy, te lo digo, que sale más barato para los dos que descubrirlo en la semana tres.',
  'Start a conversation': 'Empecemos a hablar',

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
  'Agent systems, spec to production':
    'Sistemas de agentes, de la spec a producción',
  'For a process that is currently a person copying between two screens.':
    'Para un proceso que hoy es una persona copiando entre dos pantallas.',
  '0 to 1':
    'De 0 a 1',
  'An idea to something people can use. Spec, build, release, in weeks. You end up owning the repo.':
    'De una idea a algo que la gente pueda usar. Spec, construcción y release, en semanas. El repo queda tuyo.',
  'For a thesis with no product yet, or a company that needs a real thing in the room.':
    'Para una hipótesis que todavía no tiene producto, o una empresa que necesita algo funcionando arriba de la mesa.',
  'Your business online, and something that answers':
    'Tu negocio online, y algo que conteste',
  'If your site has not changed since you made it and you do not know how many people arrive.':
    'Si tu sitio no cambió desde que lo hiciste y no sabés cuánta gente entra.',
  'Automation and internal tooling':
    'Automatización y herramientas internas',
  'n8n, Activepieces, Retool, Zapier, Make. Plus the process that keeps it from rotting after I leave, which is the part that goes missing.':
    'n8n, Activepieces, Retool, Zapier, Make. Más el proceso que evita que se pudra cuando me voy, que es la parte que suele faltar.',
  'For an operation running on spreadsheets and goodwill.':
    'Para una operación que anda con planillas y buena voluntad.',
  'Strategy and advisory':
    'Estrategia y asesoría',
  'You have the engineers. What is missing is someone deciding what the AI should not do, and saying no to the demo that will not survive a user. One to one with a founder, or alongside the team.':
    'Los ingenieros los tenés. Falta alguien que decida qué NO tiene que hacer la IA, y que le diga que no a la demo que no sobrevive a un usuario. Uno a uno con un fundador, o al lado del equipo.',
  'For a team shipping AI features with nobody owning their shape.':
    'Para un equipo que shippea features de IA sin que nadie se haga cargo de su forma.',
  'Bs. As. · open to remote AI roles':
    'Bs. As. · abierto a roles remotos de IA',
  'MBA en Tecnología e Innovación':
    'MBA en Tecnología e Innovación',
  'Others':
    'Otros',
  'Point of sale, stock and the fiscal side wired together, for a monotributista who today invoices by hand.':
    'Punto de venta, stock y la parte fiscal atados entre sí, para un monotributista que hoy factura a mano.',
  'In progress':
    'En curso',
  'Earlier builds and one on pause. Two are still up and the rest are off.':
    'Cosas anteriores y una en pausa. Dos siguen en pie y el resto está apagado.',

  /* --- voz, revision completa --- */
  'What I do best.':
    'Lo que hago mejor.',
  'Claude Code and Cursor every day. I write the production features myself.':
    'Claude Code y Cursor todos los días. Las features de producción las escribo yo.',
  'SQL, Tableau, Metabase. Dashboards that get opened when there is a decision to make.':
    'SQL, Tableau, Metabase. Tableros que se abren cuando hay que decidir algo.',
  'Open to remote AI roles, and to building something for you. Write it here and it lands on my phone in a few seconds.':
    'Abierto a roles remotos de IA, y a construir algo para vos. Escribilo acá y me llega al teléfono en unos segundos.',
  'Tell me what you need':
    'Contame qué necesitás',
  'WhatsApp agent':
    'Agente de WhatsApp',
  'Buenos Aires, Argentina · open to remote AI product &amp; AI engineering roles':
    'Buenos Aires, Argentina · abierto a roles remotos de producto e ingeniería de IA',

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
  'Voice LLMs on live calls, where it all comes down to latency and to what happens when somebody interrupts you. And images as input: a screenshot comes in and something has to decide from it.':
    'LLMs de voz en llamadas reales, donde todo se juega en la latencia y en qué pasa cuando el otro te interrumpe. E imágenes como entrada: entra una captura y algo tiene que decidir con eso.',
  'I write what the agent may do, where it hands off to a person, and how you find out when it stops being good. Chat, WhatsApp and voice, and the ones that read an image and decide from it.':
    'Escribo qué tiene permitido hacer el agente, dónde le pasa la posta a una persona, y cómo te enterás cuando deja de ser bueno. Chat, WhatsApp y voz, y los que miran una imagen y deciden con eso.',
  'A landing that says what you actually do, with the measurement wired in from day one. Plus a chat agent trained on your business, so whoever turns up at three in the morning gets an answer.':
    'Una landing que diga lo que hacés de verdad, con la medición puesta desde el día uno. Y un agente entrenado con tu negocio, así el que cae a las tres de la mañana tiene respuesta.',

  /* --- el hero --- */

  /* --- fuera lo generico --- */
  'Image generation and product video, prompt to rendered clip. Every doodle on this page came out of that, including the one waving at you.':
    'Generación de imágenes y video de producto, del prompt al clip. Todos los dibujos de esta página salieron de ahí, incluido el que te saluda.',
  'Umami, LogRocket, session review, Meta Ads. On one of my own products 39% of signups were dying at the email confirmation. The dashboard did not show it. The database did.':
    'Umami, LogRocket, revisión de sesiones, Meta Ads. En uno de mis productos el 39% de las altas se moría en la confirmación del mail. El panel no lo mostraba. La base sí.',
  'Six years in QA and release automation before product: test design, on-premise deployments, pipelines. I still read a release plan looking for where it breaks.':
    'Seis años en QA y automatización de releases antes de producto: diseño de pruebas, despliegues on-premise, pipelines. Todavía leo un plan de release buscando dónde se rompe.',
  "The same things, pointed at someone else's problem.":
    'Lo mismo de arriba, apuntado al problema de otro.',
  'The skills I write for Claude Code and use every day. These six are the ones I run most.':
    'Los skills que escribo para Claude Code y uso todos los días. Estos seis son los que más corro.',

  /* --- hero y oficio --- */
  'Agents and apps:<br>from idea to product.':
    'Agentes y aplicaciones:<br>de la idea al producto.',
  'Agent systems end to end: chat, WhatsApp and voice. The hard part was never the model, it is what the agent is allowed to do.':
    'Sistemas de agentes de punta a punta: chat, WhatsApp y voz. Lo difícil nunca fue el modelo, es qué tiene permitido hacer el agente.',
  'Where the agents live and who builds them: which tools each one may touch, when it hands off to a person, and what counts as a good answer.':
    'Dónde viven los agentes y quién los construye: qué herramientas puede tocar cada uno, cuándo le pasa la posta a una persona, y qué cuenta como buena respuesta.',
  'n8n, Activepieces, Retool, Zapier, Make. And that it still runs six months after whoever built it has gone.':
    'n8n, Activepieces, Retool, Zapier, Make. Y que siga andando seis meses después de que el que la armó se fue.',
  'Building a team or a product where there was nothing, and then designing how it keeps running without me.':
    'Armar un equipo o un producto donde no había nada, y después diseñar cómo sigue andando sin mí.',

  'Six years testing what other people built. Now I build it myself, to that standard.':
    'Me pasé seis años testeando lo que construían otros. Ahora lo construyo yo, con calidad.',

  'Agent chat, Voice AI, image generation and analysis. Automation with escalation when it is needed. Internal tools for your team, or to take to market.':
    'Chat de agentes, Voz IA, creación y análisis de imágenes. Automatizaciones con escalamiento si hace falta. Herramientas internas para tu equipo o para salir al mercado.',

  'Shared rides for the daily commute, on a flat fare. You travel comfortably, for a good price, and it earns you perks.':
    'Viajes compartidos para el día a día, con tarifa plana. Viajás cómodo, a buen precio y con beneficios.',

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
  'Agent architecture': 'Arquitectura de agentes',

  'Voice and multimodal': 'Voz y multimodal',

  'Generative production': 'Producción generativa',

  'Growth and instrumentation': 'Growth e instrumentación',

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
