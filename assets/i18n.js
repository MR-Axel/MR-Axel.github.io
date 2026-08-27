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
  'AI Product Manager<br>who still ships the code.':
    'AI Product Manager.<br>El código lo shippeo yo.',

  'Most of the systems we live inside were never designed badly on purpose; they just got old and nobody touched them. A car driving to work with one person in it. A kid in a classroom learning to memorize things that are one prompt away. <strong>Those are the ones I go after.</strong>':
    'A la mayoría de los sistemas que habitamos nadie los diseñó mal a propósito; simplemente quedaron viejos y nadie los tocó. Un auto yendo al trabajo con una sola persona adentro. Un chico en el aula aprendiendo a memorizar cosas que están a un prompt de distancia. <strong>A esos voy.</strong>',

  'I do AI product for a living: agent platforms, automation, data. The rest of the time I build products of my own, with Claude Code in the loop for most of the build.':
    'Hago producto de IA para vivir: plataformas de agentes, automatización, datos. El resto del tiempo construyo productos propios, con Claude Code en el loop durante casi toda la construcción.',

  'Products built': 'Productos construidos',
  'Live right now': 'Vivos hoy',
  'Years in software': 'Años en software',
  'Years building solo': 'Años construyendo solo',
  'Contributions, last year': 'Contribuciones, último año',

  /* --- work --- */
  'Products I built and still run. All of them are live, and you can walk into every one.':
    'Productos que construí y sigo manteniendo. Todos están vivos, y a todos se puede entrar.',

  'Tailored CVs per posting, tracked applications, and the eligibility check up front instead of after you have already applied.':
    'CV a medida para cada aviso, postulaciones con seguimiento, y la compuerta de elegibilidad antes de aplicar y no después.',

  'An AI tutor for kids in LatAm. Nova builds missions around what a kid already loves, and never hands over the answer.':
    'Un tutor de IA para chicos en LatAm. Nova arma misiones desde lo que al chico ya le copa, y nunca le da la respuesta.',

  'Daily carpooling in Buenos Aires. A flat prepaid fare that does not spike at rush hour, matched to drivers already making that trip.':
    'Carpooling diario en Buenos Aires. Tarifa prepaga que no se dispara en hora pico, con conductores que ya hacían ese viaje.',

  'Where early projects get found. Builders publish what they are working on and meet co-founders before there is anything to demo.':
    'Donde se encuentran los proyectos tempranos. Publicás en qué estás y conocés cofundadores antes de tener algo para mostrar.',

  'Specs, roadmaps, research and audits for PMs, founders and small product teams. Product management built on Claude.':
    'Specs, roadmaps, research y auditorías para PMs, fundadores y equipos chicos. Product management sobre Claude.',

  'AI agents for small businesses: WhatsApp, web and voice, wired to the data they already have, with a dashboard on top.':
    'Agentes de IA para negocios chicos: WhatsApp, web y voz, conectados a los datos que ya tienen, con un tablero arriba.',

  /* tags */
  'Job search': 'Búsqueda laboral',
  'Product': 'Producto',
  'Community': 'Comunidad',
  'AI agents': 'Agentes de IA',
  'Automation': 'Automatización',
  'Voice': 'Voz',
  'SMB': 'PyMEs',


  /* pills */
  'Live': 'Vivo',

  /* --- also built --- */
  'Also built': 'También construí',
  'Earlier builds. Two are still up, the rest are off, and another four ran their course and came down.':
    'Cosas anteriores. Dos siguen en pie, el resto está apagado, y hay otras cuatro que hicieron su recorrido y se bajaron.',


  'A community for tech and startup people, with a blog and paid memberships.':
    'Una comunidad de gente de tech y startups, con blog y membresías pagas.',

  'A social app for finding a training partner at your gym, at your hour.':
    'Una app social para encontrar con quién entrenar, en tu gimnasio y a tu hora.',

  'Translates and summarises whole books the same day, priced by word count.':
    'Traduce y resume libros enteros el mismo día, con precio por cantidad de palabras.',

  'Daily gamified challenges with rankings and a WhatsApp loop.':
    'Desafíos diarios gamificados con rankings y un loop de WhatsApp.',

  /* --- craft --- */
  'What I am genuinely good at.': 'En qué soy bueno de verdad.',

  'AI agent products': 'Productos con agentes de IA',
  'Agent systems end to end, across chat, WhatsApp and voice. The hard part is never the model, it is what the agent is allowed to do.':
    'Sistemas de agentes de punta a punta: chat, WhatsApp y voz. La parte difícil nunca es el modelo, es qué tiene permitido hacer el agente.',

  'Agentic coding': 'Programación con agentes',
  'Claude Code and Cursor every day. I write production features and ship them, so I do not just prioritize work, I move it.':
    'Claude Code y Cursor todos los días. Escribo features de producción y las shippeo, así que no solo priorizo el trabajo: lo muevo.',

  'Automation and internal tooling': 'Automatización y herramientas internas',
  'n8n, Activepieces, Retool, Zapier, Make. The boring machinery that hands a team its hours back, and the process that keeps it from rotting.':
    'n8n, Activepieces, Retool, Zapier, Make. La maquinaria aburrida que le devuelve las horas a un equipo, y el proceso que evita que se pudra.',

  '0 to 1': '0 a 1',
  'Standing up a function, a team or a product where none existed, then designing how it runs without me in the middle. More than once.':
    'Levantar una función, un equipo o un producto donde no había nada, y diseñar cómo funciona sin mí en el medio. Más de una vez.',

  'Quality and release engineering': 'Calidad e ingeniería de releases',
  'Six years in QA and release automation before product: test design, on-premise deployments, pipelines. It is why I only trust systems I can test.':
    'Seis años en QA y releases antes de producto: diseño de pruebas, despliegues on-premise, pipelines. Por eso solo confío en lo que puedo testear.',

  'Data and BI': 'Datos y BI',
  'SQL, Tableau, Metabase. Dashboards people actually make decisions on, not screenshots for a monthly deck.':
    'SQL, Tableau, Metabase. Tableros sobre los que la gente realmente decide, no capturas para un deck mensual.',

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
  "The same things, pointed at someone else's problem. Companies, startups, and people with a project that has not started yet.":
    'Lo mismo de arriba, apuntado al problema de otro. Empresas, startups, y gente con un proyecto que todavía no arrancó.',

  'Agent systems, spec to production': 'Sistemas de agentes, de la spec a producción',
  'What the agent is allowed to do, where it hands off to a person, and how you find out when it stops being good. Chat, WhatsApp or voice.':
    'Qué tiene permitido hacer el agente, dónde le pasa la posta a una persona, y cómo te enterás cuando deja de ser bueno. Chat, WhatsApp o voz.',
  'For a process that is currently a person copying between two screens.':
    'Para un proceso que hoy es una persona copiando entre dos pantallas.',

  'Zero to one': 'De cero a uno',
  'An idea to something people can use. Spec, build, release, with an agent in the loop, which is why this is weeks. You end up owning the repo.':
    'De una idea a algo que la gente pueda usar. Spec, construcción y release, con un agente en el loop, que es por qué son semanas. El repo queda tuyo.',
  'For a thesis with no product yet, or a company that needs a real thing in the room.':
    'Para una hipótesis que todavía no tiene producto, o una empresa que necesita algo funcionando arriba de la mesa.',

  'n8n, Activepieces, Retool, Zapier, Make. Plus the process that keeps it from rotting after I leave, which is the part that goes missing.':
    'n8n, Activepieces, Retool, Zapier, Make. Más el proceso que evita que se pudra cuando me voy, que es la parte que suele faltar.',
  'For an operation running on spreadsheets and goodwill.':
    'Para una operación que anda con planillas y buena voluntad.',

  'AI product advisory': 'Asesoría de producto de IA',
  'You have the engineers. What is missing is someone deciding what the AI should not do, and saying no to the demo that will not survive a user.':
    'Los ingenieros los tenés. Falta alguien que decida qué NO tiene que hacer la IA, y que le diga que no a la demo que no sobrevive a un usuario.',
  'For a team shipping AI features with nobody owning their shape.':
    'Para un equipo que shippea features de IA sin que nadie se haga cargo de su forma.',

  'Tell me what is broken and I will tell you whether I am the right person for it. If I am not, I will say so, which is cheaper for both of us than finding out in week three.':
    'Contame qué está roto y te digo si soy la persona indicada. Si no lo soy, te lo digo, que sale más barato para los dos que descubrirlo en la semana tres.',
  'Start a conversation': 'Empecemos a hablar',

  /* --- agent skills --- */
  'The skills I write for Claude Code. Six a product or engineering team would reach for, and the rest underneath.':
    'Los skills que escribo para Claude Code. Seis que un equipo de producto o ingeniería usaría, y el resto abajo.',
  'The other thirteen':
    'Los otros trece',
  'The 14 open ones, on GitHub<span class="arrow" aria-hidden="true">↗</span>':
    'Los 14 abiertos, en GitHub<span class="arrow" aria-hidden="true">↗</span>',
  'Reads your repo, asks for the rest, writes the shared profile.':
    'Lee tu repo, pregunta el resto, y escribe el perfil compartido.',
  "Implements a feature following your repo's own conventions.":
    'Implementa una feature siguiendo las convenciones de tu repo.',
  'Architecture review where you set the priority, not the skill.':
    'Revisión de arquitectura donde la prioridad la ponés vos, no el skill.',
  'UI audit: accessibility, responsive behavior, interaction states.':
    'Auditoría de UI: accesibilidad, responsive, estados de interacción.',
  'A business review: does it solve the real need, is the flow complete.':
    'Una revisión de negocio: resuelve la necesidad real, está completo el flujo.',
  'QA against what is live, depth picked by blast radius.':
    'QA contra lo que está vivo, con la profundidad según el radio de impacto.',
  'The decisions you cannot recover by reading the code.':
    'Las decisiones que no se recuperan leyendo el código.',
  'Four gates that fail a check instead of surviving a review.':
    'Cuatro compuertas que fallan un check en vez de sobrevivir a un review.',
  'Publishable content that never invents a metric.':
    'Contenido listo para publicar que nunca inventa una métrica.',
  'Scroll that carries a story, and the bugs nobody writes down.':
    'Scroll que cuenta algo, y los bugs que nadie escribe.',
  'Playwright, ElevenLabs and Remotion into one product video.':
    'Playwright, ElevenLabs y Remotion en un video de producto.',
  'Audits copy so it does not read as machine-made.':
    'Audita copy para que no se lea hecho por una máquina.',
  'A skill per codebase: its tokens, conventions and traps.':
    'Un skill por codebase: sus tokens, convenciones y trampas.',

  /* --- activity --- */
  'Most of the code lives in private product repos, so the graph is the honest part of it.':
    'Casi todo el código vive en repos privados de producto, así que el gráfico es la parte honesta.',

  'Less': 'Menos',
  'More': 'Más',

  'What is public is this site and the Agent Skills above. Everything else is product code in private repos, which is where most of that graph comes from. <a href="https://github.com/MR-Axel" target="_blank" rel="noopener">See the profile on GitHub<span class="arrow" aria-hidden="true">↗</span></a>':
    'Lo público es este sitio y los Agent Skills de arriba. Todo lo demás es código de producto en repos privados, que es de donde sale casi todo ese gráfico. <a href="https://github.com/MR-Axel" target="_blank" rel="noopener">Ver el perfil en GitHub<span class="arrow" aria-hidden="true">↗</span></a>',

  /* --- contact --- */
  'Let\'s talk': 'Hablemos',
  'Open to remote AI roles, open to building for you, and always up for a conversation about agents, automation, or why the commute is still broken. LinkedIn is the fastest way to reach me.':
    'Abierto a roles remotos de IA, abierto a construir para vos, y siempre listo para una charla sobre agentes, automatización, o por qué el viaje al trabajo sigue roto. Por LinkedIn es lo más rápido.',
  'Message me on LinkedIn': 'Escribime por LinkedIn',

  /* --- footer --- */

  /* --- the arc --- */
  'Path': 'Recorrido',
  'How I got here': 'Cómo llegué acá',
  'Before the current title, mostly in rooms where being wrong cost more than a rollback. In order.':
    'Antes del título actual, casi siempre en lugares donde equivocarse costaba más que un rollback. En orden.',

  'Consulting': 'Consultoría',
  'Process consulting for industry': 'Consultoría de procesos en industrias',
  'Before software: walking an operation and mapping how the work actually moves through it against how the manual says it does, then finding the step that costs the most. Nothing about that question changed when the subject became a product.':
    'Antes del software: recorrer una operación y mapear cómo se mueve el trabajo de verdad contra lo que dice el manual, y después encontrar el paso que más cuesta. Esa pregunta no cambió en nada cuando el sujeto pasó a ser un producto.',

  'Health': 'Salud',
  'Cardiology and clinical systems': 'Sistemas de cardiología y clínicos',
  'QA on systems where a wrong reading is not a bug report. It is where the habit started: I only trust a system I can test, and I would rather find the failure than be told it cannot happen.':
    'QA sobre sistemas donde una lectura equivocada no es un reporte de bug. Ahí empezó la costumbre: solo confío en un sistema que puedo testear, y prefiero encontrar la falla antes que escuchar que no puede pasar.',

  'Energy': 'Energía',
  'IoT and hardware in the field': 'IoT y hardware en el campo',
  'Devices and energy systems that live outside the datacentre, where a release you cannot roll back is a truck roll. Testing against real hardware behaviour instead of a mock that always agrees with you.':
    'Dispositivos y sistemas de energía que viven fuera del datacenter, donde un release que no se puede revertir es mandar una camioneta. Probar contra el comportamiento real del hardware en vez de un mock que siempre te da la razón.',

  'Security': 'Seguridad',
  'On-premise, locked down, Linux': 'On-premise, redes cerradas, Linux',
  'QA and on-premise deployments for enterprise clients with closed networks, simulating their Linux environments to test against and running the releases myself. Everything that ran twice got scripted.':
    'QA y despliegues on-premise para clientes enterprise con redes cerradas, simulando sus entornos Linux para poder testear y corriendo yo mismo los releases. Todo lo que se hacía dos veces terminaba en un script.',

  'Logistics': 'Logística',
  'Routing, fleets, and a team': 'Ruteo, flotas y un equipo',
  'Product for route optimisation and fleet operations. Built the prototyping practice from nothing and led it, short enough loops that a working thing showed up in the conversation instead of a slide.':
    'Producto para optimización de rutas y operación de flotas. Armé la práctica de prototipado desde cero y la lideré, con loops lo bastante cortos como para que en la conversación apareciera algo funcionando en vez de una lámina.',

  'AI product': 'Producto de IA',
  'Agents from zero to production': 'Agentes de cero a producción',
  'Architecture for agent systems and the roadmap over them: what the agent may do, where it escalates, how it is evaluated. Led the team that built the workflow builder those agents run on, and shipped features into production alongside it.':
    'Arquitectura de sistemas de agentes y el roadmap encima: qué puede hacer el agente, dónde escala a una persona, cómo se evalúa. Lideré el equipo que construyó el workflow builder sobre el que corren esos agentes, y shippeé features a producción en paralelo.',

  /* --- craft, the four new ones --- */
  'Agent architecture': 'Arquitectura de agentes',
  'The system the agents live in, zero to production, and the team that builds it: tool boundaries, escalation, what counts as a good answer.':
    'El sistema donde viven los agentes, de cero a producción, y el equipo que lo construye: límites, escalamiento, qué es una buena respuesta.',

  'Voice and multimodal': 'Voz y multimodal',
  'Voice LLMs on live calls, and images as input rather than decoration: reading a screenshot or a photo and deciding from it.':
    'LLMs de voz en llamadas reales, e imágenes como entrada y no como adorno: leer una captura o una foto y decidir a partir de eso.',

  'Generative production': 'Producción generativa',
  'Image generation and product video, prompt to rendered clip, on a pipeline. A landing gets its visuals the week it gets its copy.':
    'Generación de imágenes y video de producto, del prompt al clip, en un pipeline. Una landing tiene visuales la semana que tiene el texto.',

  'Growth and instrumentation': 'Growth e instrumentación',
  'Umami, LogRocket, session review, Meta Ads. Counting the funnel from the database and not the dashboard, because the dashboard lies.':
    'Umami, LogRocket, revisión de sesiones, Meta Ads. Contar el embudo desde la base y no desde el panel, porque el panel miente.',

  /* --- strings JS builds, so they are not in the DOM to be matched --- */
  '_contributions': '{n} contribuciones en el último año',
  '_switchToEs': 'Ver en español',
  '_switchToEn': 'View in English',
  '_theme': 'Cambiar entre claro y oscuro'
};

window.EN_META = {
  '_contributions': '{n} contributions in the last year',
  '_switchToEs': 'Ver en español',
  '_switchToEn': 'View in English',
  '_theme': 'Switch between light and dark'
};
