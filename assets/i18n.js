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

  'AI Product Manager<br>who still ships the code.':
    'Product Manager de IA<br>que igual shippea el código.',

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
  'Products I founded or co-founded. All of them are live, all of them are mine to keep running.':
    'Productos que fundé o cofundé. Todos están vivos, y todos son míos de mantener andando.',

  "A job-application product for LatAm candidates applying locally and abroad: tailored CVs per posting, tracked applications, and eligibility checks up front instead of after you've already applied.":
    'Un producto de postulaciones para candidatos de LatAm que aplican acá y afuera: CV a medida para cada aviso, postulaciones con seguimiento, y las compuertas de elegibilidad antes de aplicar y no después.',

  'An AI tutor for kids and teens in LatAm. Nova gets to know a kid, builds missions around what they already love, and never hands over the answer.':
    'Un tutor de IA para chicos y adolescentes en LatAm. Nova conoce al chico, le arma misiones desde lo que ya le copa, y nunca le da la respuesta.',

  'Daily urban carpooling in Buenos Aires. Flat prepaid fare that does not spike at rush hour, matching passengers with drivers who were already making that trip.':
    'Carpooling urbano diario en Buenos Aires. Tarifa plana prepaga que no se dispara en hora pico, que junta pasajeros con conductores que ya iban a hacer ese viaje.',

  'A discovery platform for early stage projects. Builders publish what they are working on and find co-founders, investors and collaborators before there is anything to demo.':
    'Una plataforma de descubrimiento para proyectos en etapa temprana. Los creadores publican en qué están y encuentran cofundadores, inversores y colaboradores antes de tener algo para mostrar.',

  'An AI product management platform. Specs, roadmaps, sprints, research and audits for PMs, founders and small product teams, built on Claude.':
    'Una plataforma de product management con IA. Specs, roadmaps, sprints, research y auditorías para PMs, fundadores y equipos chicos de producto, construida sobre Claude.',

  'Custom AI agents for small businesses: WhatsApp, web and voice, wired to the data they already have, with a dashboard on top.':
    'Agentes de IA a medida para negocios chicos: WhatsApp, web y voz, conectados a los datos que ya tienen, con un tablero arriba.',

  /* tags */
  'Job search': 'Búsqueda laboral',
  'Product': 'Producto',
  'Community': 'Comunidad',
  'AI agents': 'Agentes de IA',
  'Automation': 'Automatización',
  'Voice': 'Voz',
  'SMB': 'PyMEs',

  /* roles */
  'Founder': 'Fundador',
  'Co-founder · product': 'Cofundador · producto',
  'Co-founder · product and commercial': 'Cofundador · producto y comercial',

  /* pills */
  'Live': 'Vivo',
  'In progress': 'En curso',
  'Paused': 'Pausado',

  /* --- also built --- */
  'Also built': 'También construí',
  'Side projects and earlier launches. Another four are finished and off the air. The six above are the ones I still run.':
    'Proyectos paralelos y lanzamientos anteriores. Hay otros cuatro terminados y fuera del aire. Los seis de arriba son los que sigo manteniendo.',

  'A desktop game with on-chain assets on Hedera. Solidity contracts, a Tauri client and a sprite pipeline, mostly an excuse to go deep on the chain.':
    'Un juego de escritorio con assets on-chain en Hedera. Contratos en Solidity, un cliente Tauri y un pipeline de sprites, sobre todo una excusa para estudiar la cadena en serio.',

  'A community for tech and startup people, with a blog, a following graph and paid memberships.':
    'Una comunidad de gente de tech y startups, con blog, grafo de seguidores y membresías pagas.',

  'A social app for finding a training partner. React Native and Expo, passwordless sign in, built around who is at the gym at the same hour as you.':
    'Una app social para encontrar compañero de entrenamiento. React Native y Expo, ingreso sin contraseña, armada alrededor de quién está en el gimnasio a la misma hora que vos.',

  'Translates and summarises whole books and documents, same day. Five domains over one FastAPI backend, Calibre on a VPS, priced by word count.':
    'Traduce y resume libros y documentos enteros, el mismo día. Cinco dominios sobre un solo backend FastAPI, Calibre en un VPS, precio por cantidad de palabras.',

  'Daily gamified challenges with rankings and a WhatsApp loop to keep the streak alive.':
    'Desafíos diarios gamificados con rankings y un loop de WhatsApp para no cortar la racha.',

  /* --- craft --- */
  'What I am genuinely good at, and what I am not.': 'En qué soy bueno de verdad, y en qué no.',

  'AI agent products': 'Productos con agentes de IA',
  'Spec and ship agent systems end to end: trigger detection, data retrieval, multi channel interaction across chat, WhatsApp and voice, and action execution. The hard part is never the model, it is deciding what the agent is allowed to do.':
    'Especificar y shippear sistemas de agentes de punta a punta: detección de disparadores, recuperación de datos, interacción multicanal entre chat, WhatsApp y voz, y ejecución de acciones. La parte difícil nunca es el modelo, es decidir qué tiene permitido hacer el agente.',

  'Agentic coding': 'Programación con agentes',
  'Claude Code and Cursor as daily drivers. I write production features, put them through review and ship them, which means I do not just prioritize work, I move it.':
    'Claude Code y Cursor todos los días. Escribo features de producción, las paso por review y las shippeo, así que no solo priorizo el trabajo: lo muevo.',

  'Automation and internal tooling': 'Automatización y herramientas internas',
  'n8n, Activepieces, Retool, Zapier, Make. Building the boring machinery that hands a team its hours back, and the process that keeps it from rotting.':
    'n8n, Activepieces, Retool, Zapier, Make. Construir la maquinaria aburrida que le devuelve las horas a un equipo, y el proceso que evita que se pudra.',

  '0 to 1': '0 a 1',
  'Standing up a function, a team or a product where none existed, then designing the way it runs without me in the middle of it. I have done this from zero more than once.':
    'Levantar una función, un equipo o un producto donde no había nada, y después diseñar cómo funciona sin mí en el medio. Ya lo hice desde cero más de una vez.',

  'Quality and release engineering': 'Calidad e ingeniería de releases',
  'Six years in QA and release automation before product: test design, on-premise deployments for enterprise clients, pipelines in Python and Jenkins. It is why I only trust systems I can test.':
    'Seis años en QA y automatización de releases antes de producto: diseño de pruebas, despliegues on-premise para clientes enterprise, pipelines en Python y Jenkins. Por eso solo confío en los sistemas que puedo testear.',

  'Data and BI': 'Datos y BI',
  'SQL, Tableau, Metabase. Dashboards people actually make decisions on, not screenshots for a monthly deck.':
    'SQL, Tableau, Metabase. Tableros sobre los que la gente realmente decide, no capturas para un deck mensual.',

  "<strong>Not my thing, at least not yet:</strong> Kubernetes and distributed systems, training ML models, and being the person who reviews everyone else's code in a large TypeScript codebase. I ship features with an agent in the loop and I read every diff, but that is a different job. I would rather tell you now than find out together in week three.":
    '<strong>No es lo mío, al menos todavía:</strong> Kubernetes y sistemas distribuidos, entrenar modelos, y ser el que revisa el código de todos los demás en un codebase grande de TypeScript. Shippeo features con un agente en el loop y leo cada diff, pero ese es otro trabajo. Prefiero decírtelo ahora y no que lo descubramos juntos en la semana tres.',

  /* --- agent skills --- */
  '14 open Agent Skills for Claude Code. No hardcoded stack or preferences: each one asks once, saves the answer in your repo, and says so instead of guessing when that file is missing.':
    '14 Agent Skills abiertos para Claude Code. Sin stack ni preferencias cableadas: cada uno pregunta una vez, guarda la respuesta en tu repo, y lo dice en vez de adivinar cuando ese archivo no está.',

  'Run this first. Reads what it can from your repo, asks the rest with the evidence in front of you, writes the shared profile.':
    'Corré este primero. Lee lo que puede de tu repo, pregunta el resto con la evidencia delante, y escribe el perfil compartido.',

  'Implements a feature or fixes a bug following your repo\'s own conventions. Reports what it assumed and what it left out.':
    'Implementa una feature o arregla un bug siguiendo las convenciones de tu propio repo. Informa qué asumió y qué dejó afuera.',

  'The full loop for a feature: plan, implement, validate, review, deploy. Chains the other skills together.':
    'El loop completo de una feature: planear, implementar, validar, revisar, desplegar. Encadena los otros skills.',

  'Same as ship, delegated to five subagents with narrow tool access: the one writing the spec can\'t write code. For changes too big for one context to hold.':
    'Lo mismo que ship, delegado a cinco subagentes con acceso acotado: el que escribe la spec no puede escribir código. Para cambios demasiado grandes para un solo contexto.',

  'Runs your validation pipeline and reports honestly: what passed, what failed, what got skipped. Never marks green something that never ran.':
    'Corre tu pipeline de validación y reporta con honestidad: qué pasó, qué falló, qué se salteó. Nunca marca en verde algo que no corrió.',

  'Code review of a diff. Every finding anchored to a real file and line, with the concrete failure scenario spelled out.':
    'Code review de un diff. Cada hallazgo anclado a un archivo y una línea reales, con el escenario de falla concreto escrito.',

  'Interactive architecture review. Every issue comes with options, effort and risk; you decide the priority, not the skill.':
    'Revisión de arquitectura interactiva. Cada problema viene con opciones, esfuerzo y riesgo; la prioridad la decidís vos, no el skill.',

  'UI audit: accessibility, responsive behavior, interaction states, and consistency with your own design system.':
    'Auditoría de UI: accesibilidad, comportamiento responsive, estados de interacción, y consistencia con tu propio design system.',

  'A business review: does it solve the real need, do the gates hold, is the flow complete, can people actually find it.':
    'Una revisión de negocio: resuelve la necesidad real, aguantan las compuertas, está completo el flujo, la gente puede encontrarlo.',

  'The release pipeline. Separate permissions for commit, push and deploy, and it never ships a build that hasn\'t passed.':
    'El pipeline de release. Permisos separados para commit, push y deploy, y nunca shippea un build que no pasó.',

  'QA after the deploy, against what\'s actually live. Picks its depth by blast radius instead of running the same checklist every time.':
    'QA después del deploy, contra lo que está vivo de verdad. Elige la profundidad por radio de impacto en vez de correr siempre el mismo checklist.',

  'A log of the decisions you can\'t recover by reading the code: why that limit, why that model, what got ruled out and why.':
    'Un registro de las decisiones que no se recuperan leyendo el código: por qué ese límite, por qué ese modelo, qué se descartó y por qué.',

  'Sets up a design system where there is none, and enforces the one you already have: four gates that fail a check instead of surviving review.':
    'Arma un design system donde no hay ninguno, y hace cumplir el que ya tenés: cuatro compuertas que fallan un check en vez de sobrevivir a un review.',

  'Ready-to-publish content for X, LinkedIn, Instagram and more, on your own brand profile and funnel. Never invents metrics, testimonials or social proof.':
    'Contenido listo para publicar en X, LinkedIn, Instagram y más, sobre tu propio perfil de marca y tu embudo. Nunca inventa métricas, testimonios ni prueba social.',

  'All 14, on GitHub<span class="arrow" aria-hidden="true">↗</span>':
    'Los 14, en GitHub<span class="arrow" aria-hidden="true">↗</span>',

  /* --- activity --- */
  'Most of the code lives in private product repos, so the graph is the honest part of it.':
    'Casi todo el código vive en repos privados de producto, así que el gráfico es la parte honesta.',

  'Less': 'Menos',
  'More': 'Más',

  'What is public is this site and the Agent Skills above. Everything else is product code in private repos, which is where most of that graph comes from. <a href="https://github.com/MR-Axel" target="_blank" rel="noopener">See the profile on GitHub<span class="arrow" aria-hidden="true">↗</span></a>':
    'Lo público es este sitio y los Agent Skills de arriba. Todo lo demás es código de producto en repos privados, que es de donde sale casi todo ese gráfico. <a href="https://github.com/MR-Axel" target="_blank" rel="noopener">Ver el perfil en GitHub<span class="arrow" aria-hidden="true">↗</span></a>',

  /* --- contact --- */
  'Let\'s talk': 'Hablemos',
  'Open to remote AI product roles, and always up for a conversation about agents, automation, or why the commute is still broken. LinkedIn is the fastest way to reach me.':
    'Abierto a roles remotos de producto de IA, y siempre listo para una charla sobre agentes, automatización, o por qué el viaje al trabajo sigue roto. Por LinkedIn es lo más rápido.',
  'Message me on LinkedIn': 'Escribime por LinkedIn',

  /* --- footer --- */
  'Built with Claude Code. Data refreshed daily from the GitHub API.':
    'Construido con Claude Code. Datos actualizados a diario desde la API de GitHub.',

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
