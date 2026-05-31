// Español
export const es: Record<string, string> = {
  'coverage': 'Basado en tu actividad de {from} a {to} (~{years} años).',
  'legend.mutual': 'Mutuos (círculo íntimo)',
  'legend.followed': 'Sigues (de ida)',
  'legend.leak': 'No sigues (parasocial)',
  'kind.title': 'Cómo interactúas',
  'kind.caption': 'La mezcla de tus interacciones por tipo.',
  'kind.story_like': 'Likes a historias',
  'kind.story_poll': 'Encuestas',
  'kind.story_slider': 'Sliders',
  'kind.story_reaction': 'Reacciones a historias',
  'kind.like_comment': 'Likes a comentarios',
  'kind.comment': 'Comentarios',
  'kind.like_post': 'Likes a posts',
  'kind.saved': 'Guardados',
  'year.title': 'Tu actividad a lo largo de los años',
  'year.caption': 'Interacciones por año — cómo ha evolucionado tu uso de Instagram.',
  'weekday.title': 'Qué días te enganchas',
  'weekday.caption': 'Tu actividad por día de la semana.',
  'venn.caption': 'Seguidos vs seguidores — la intersección son tus mutuos.',
  'infection.title': 'Índice de infección',
  'infection.caption':
    'Cuánto te capturan unas pocas cuentas externas — concentración, tus vectores principales y tirón parasocial combinados. Más alto = más infectado.',
  'infection.low': 'Baja',
  'infection.medium': 'Media',
  'infection.high': 'Alta',
  'vectors.title': 'Tus vectores de infección',
  'vectors.caption': 'Solo {n} cuentas controlan el {pct}% de tu atención.',
  'trend.title': '¿Va a más?',
  'trend.rising': 'Tu atención se concentra MÁS con el tiempo — cada vez más capturado.',
  'trend.falling': 'Tu atención se reparte más con el tiempo — menos capturado.',
  'trend.flat': 'Tu concentración se ha mantenido más o menos estable con el tiempo.',
  'drop.prompt':
    'Elige o suelta tu export de Instagram (.zip en formato JSON). Nunca sale de tu navegador.',
  'drop.helpSummary': 'Cómo descargar el export correcto',
  'drop.helpSteps':
    'En Instagram: Configuración → Centro de cuentas → Tu información y permisos → Descargar tu información. Elige “Parte de tu información” y marca:',
  'drop.itemLikes': 'Me gusta',
  'drop.itemComments': 'Comentarios',
  'drop.itemSaved': 'Guardado',
  'drop.itemStories': 'Interacciones con historias',
  'drop.itemFollowers': 'Seguidores y seguidos',
  'drop.helpFormat':
    'Pon Formato: JSON (no HTML) y Rango de fechas: Desde el principio para el resultado más completo. Los “me gusta” a posts no se pueden analizar (Instagram omite el autor), así que “Interacciones con historias” da el resultado más rico.',

  'status.reading': 'Leyendo…',
  'status.unrecognized': 'Export no reconocido. ¿Es un .zip de Instagram descargado en formato JSON?',
  'status.noInteractions':
    'No se encontraron me gusta/comentarios. ¿Lo descargaste en HTML en vez de JSON?',
  'status.badZip': 'No se pudo leer ese archivo como .zip.',

  'notice.lowData':
    'Solo se encontraron {n} interacciones atribuibles — insuficiente para un veredicto fiable. Los números de abajo se muestran por transparencia, pero toma el score como orientativo. Vuelve a exportar en JSON con un rango de fechas mayor e incluyendo “Interacciones con historias”.',
  'notice.unattributed':
    '{n} me gusta a posts no se pudieron atribuir: el export actual de Instagram ya no registra quién creó el post al que diste like, así que se excluyen. Los likes a historias, comentarios y likes a comentarios sí llevan la cuenta y se incluyen.',

  'verdict.title': 'Salud de la red',
  'verdict.caption':
    'Una heurística transparente. Más alto = una dieta diversa y equilibrada. Más bajo = pocas voces acaparan tu atención. Diversidad {div}% · Concentración top-10 {conc}%.',
  'verdict.fewAccounts':
    ' (Tienes ≤10 cuentas con interacción, así que la concentración top-10 es ~100% por naturaleza y el score es aproximado aquí.)',
  'band.Healthy': 'Sana',
  'band.Moderate': 'Moderada',
  'band.Captured': 'Capturada',

  'headline.before': 'Sigues a {follows} cuentas, pero ',
  'headline.after': ' acapara el {pct}% de tus {total} interacciones registradas.',

  'graph.title': 'Tu grafo de atención',
  'graph.caption':
    'Estás en el centro. Cada nodo es una cuenta con la que interactúas — más grande = más atención. Rosa = cuentas que sigues e interactúas (te captan). Naranja = interactúas sin seguirlas (fuga de atención). Arrastra los nodos para explorar.',

  'net.title': 'Tú vs tu red',
  'net.caption':
    '{followYouNotBack} te siguen sin que tú les sigas; {youFollowNotBack} que sigues no te siguen. Solo {mutual} son mutuos.',
  'stat.following': 'seguidos',
  'stat.followers': 'seguidores',
  'stat.mutual': 'mutuos',
  'leaning.caption':
    'Consumidor ↔ Creador — un proxy aproximado de tu ratio seguidores/seguidos ({ratio}, {leaning}). El export no puede medir tu influencia real sobre los demás.',
  'leaning.consumerEnd': 'Consumidor (absorbes)',
  'leaning.creatorEnd': 'Creador (te absorben)',
  'leaning.consumer': 'consumidor',
  'leaning.balanced': 'equilibrado',
  'leaning.creator': 'creador',

  'bubble.title': 'Tu burbuja',
  'bubble.caption':
    'Cuánta de tu atención se queda dentro de tu propio círculo. Alto = cámara de eco de cuentas que ya sigues; bajo = miras hacia fuera.',
  'bubble.followed': 'Atención a cuentas que sigues',
  'bubble.mutual': 'Atención a mutuos (círculo íntimo)',

  'dead.title': 'Seguidos muertos',
  'dead.caption':
    'Cuentas que sigues pero a las que das cero atención. Una cuota alta significa que tu lista de seguidos es sobre todo ruido que ya ignoras.',
  'dead.bar': '{n} de {total} que sigues no reciben nada de tu atención',

  'when.title': 'Cuándo te enganchas',
  'when.caption':
    'Tu actividad por hora (UTC). Pico sobre las {hour}:00, a lo largo de {days} días de historial.',

  'close.title': 'Test de círculo íntimo',
  'close.caption': 'De tus {total} close friends, de verdad interactúas con {engaged}.',
  'close.bar': 'Close friends con los que de verdad interactúas',

  'para.title': 'Fugas parasociales',
  'para.caption': 'Cuentas en las que vuelcas atención pero ni siquiera sigues.',

  'lorenz.title': '¿Cómo de desigual está repartida tu atención?',
  'lorenz.caption':
    'Cuanto más se curva por debajo de la diagonal punteada, más se concentra tu atención en unas pocas cuentas. Gini {gini}.',

  'bars.title': 'Hacia dónde va tu atención',
  'bars.caption': 'Cuota de tus interacciones totales que se llevan tus cuentas principales.',

  'table.title': 'Los datos crudos',
  'table.caption': 'Todas las cuentas con las que interactuaste, clasificadas. Aquí no hay nada oculto ni manipulado.',
  'table.colRank': '#',
  'table.colAccount': 'Cuenta',
  'table.colInteractions': 'Interacciones',
  'table.colShare': 'Cuota',
  'table.colFollowed': '¿Seguida?',
  'table.yes': 'sí',
  'table.no': 'no',
}
