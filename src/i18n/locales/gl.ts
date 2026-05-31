// Galego
export const gl: Record<string, string> = {
  'drop.prompt':
    'Escolle ou solta o teu export de Instagram (.zip en formato JSON). Non sae nunca do teu navegador.',
  'drop.helpSummary': 'Como descargar o export correcto',
  'drop.helpSteps':
    'En Instagram: Configuración → Centro de contas → A túa información e permisos → Descargar a túa información. Escolle "Parte da túa información" e marca:',
  'drop.itemLikes': 'Gústame',
  'drop.itemComments': 'Comentarios',
  'drop.itemSaved': 'Gardado',
  'drop.itemStories': 'Interaccións con historias',
  'drop.itemFollowers': 'Seguidores e seguidos',
  'drop.helpFormat':
    'Pon Formato: JSON (non HTML) e Intervalo de datas: Desde o principio para o resultado máis completo. Os "gústame" a publicacións non se poden analizar (Instagram omite o autor), así que "Interaccións con historias" dá o resultado máis rico.',

  'status.reading': 'Lendo…',
  'status.unrecognized': 'Export non recoñecido. É un .zip de Instagram descargado en formato JSON?',
  'status.noInteractions':
    'Non se atoparon gústame/comentarios. Descargaches en HTML en vez de JSON?',
  'status.badZip': 'Non se puido ler ese ficheiro como .zip.',

  'notice.lowData':
    'Só se atoparon {n} interaccións atribuíbles — insuficiente para un veredicto fiable. Os números de abaixo móstranse por transparencia, pero toma o score como orientativo. Vuelve a exportar en JSON cun intervalo de datas maior e incluíndo "Interaccións con historias".',
  'notice.unattributed':
    '{n} gústame a publicacións non se puideron atribuír: o export actual de Instagram xa non rexistra quen creou a publicación á que deches like, polo que se exclúen. Os likes a historias, comentarios e likes a comentarios si levan a conta e inclúense.',

  'verdict.title': 'Saúde da rede',
  'verdict.caption':
    'Unha heurística transparente. Máis alto = dieta diversa e equilibrada. Máis baixo = poucas voces acaparan a túa atención. Diversidade {div}% · Concentración top-10 {conc}%.',
  'verdict.fewAccounts':
    ' (Tes ≤10 contas con interacción, polo que a concentración top-10 é ~100% por natureza e o score é aproximado aquí.)',
  'band.Healthy': 'Sa',
  'band.Moderate': 'Moderada',
  'band.Captured': 'Capturada',

  'headline.before': 'Segues {follows} contas, pero ',
  'headline.after': ' acapara o {pct}% das túas {total} interaccións rexistradas.',

  'graph.title': 'O teu grafo de atención',
  'graph.caption':
    'Estás no centro. Cada nodo é unha conta coa que interactúas — máis grande = máis atención. Rosa = contas que segues e coas que interactúas (cáptante). Laranxa = interactúas sen seguílas (fuga de atención). Arrastra os nodos para explorar.',

  'net.title': 'Ti vs a túa rede',
  'net.caption':
    '{followYouNotBack} séguente sen que ti as sigas; {youFollowNotBack} que segues non te seguen. Só {mutual} son mutuos.',
  'stat.following': 'seguidos',
  'stat.followers': 'seguidores',
  'stat.mutual': 'mutuos',
  'leaning.caption':
    'Consumer ↔ Creator — un proxy aproximado do teu ratio seguidores/seguidos ({ratio}, {leaning}). O export non pode medir a túa influencia real sobre os demais.',
  'leaning.consumerEnd': 'Consumidor (absorbes)',
  'leaning.creatorEnd': 'Creador (absórbente)',
  'leaning.consumer': 'consumidor',
  'leaning.balanced': 'equilibrado',
  'leaning.creator': 'creador',

  'bubble.title': 'A túa burbulla',
  'bubble.caption':
    'Canta da túa atención fica dentro do teu propio círculo. Alta = cámara de eco de contas que xa segues; baixa = miras cara a fóra.',
  'bubble.followed': 'Atención a contas que segues',
  'bubble.mutual': 'Atención a mutuos (círculo íntimo)',

  'dead.title': 'Seguidos mortos',
  'dead.caption':
    'Contas que segues pero ás que prestas cero atención. Unha cota alta significa que a túa lista de seguidos é sobre todo ruído que xa ignoras.',
  'dead.bar': '{n} de {total} que segues non reciben nada da túa atención',

  'when.title': 'Cando te enganchas',
  'when.caption':
    'A túa actividade por hora (UTC). Pico ao redor das {hour}:00, ao longo de {days} días de historial.',

  'close.title': 'Proba do círculo íntimo',
  'close.caption': 'Dos teus {total} close friends, de verdade interactúas con {engaged}.',
  'close.bar': 'Close friends cos que de verdade interactúas',

  'para.title': 'Fugas parasociais',
  'para.caption': 'Contas nas que volques atención pero nin sequera segues.',

  'lorenz.title': 'Como de desigual está repartida a túa atención?',
  'lorenz.caption':
    'Canto máis se curva por baixo da diagonal punteada, máis se concentra a túa atención nunhas poucas contas. Gini {gini}.',

  'bars.title': 'Cara a onde vai a túa atención',
  'bars.caption': 'Cota das túas interaccións totais que se levan as túas contas principais.',

  'table.title': 'Os datos en bruto',
  'table.caption': 'Todas as contas coas que interactuaches, clasificadas. Aquí non hai nada oculto nin modelado.',
  'table.colRank': '#',
  'table.colAccount': 'Conta',
  'table.colInteractions': 'Interaccións',
  'table.colShare': 'Cota',
  'table.colFollowed': 'Seguida?',
  'table.yes': 'si',
  'table.no': 'non',
}
