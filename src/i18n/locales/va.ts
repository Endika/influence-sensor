// Valencià
export const va: Record<string, string> = {
  'coverage': 'Basat en la teua activitat de {from} a {to} (~{years} anys).',
  'legend.mutual': 'Mutus (cercle íntim)',
  'legend.followed': 'Segueixes (d\'anada)',
  'legend.leak': 'No segueixes (parasocial)',
  'kind.title': 'Com interactues',
  'kind.caption': 'La mescla de les teues interaccions per tipus.',
  'kind.story_like': 'M\'agrada a històries',
  'kind.story_poll': 'Enquestes',
  'kind.story_slider': 'Sliders',
  'kind.story_reaction': 'Reaccions a històries',
  'kind.like_comment': 'M\'agrada a comentaris',
  'kind.comment': 'Comentaris',
  'kind.like_post': 'M\'agrada a posts',
  'kind.saved': 'Guardats',
  'year.title': 'La teua activitat al llarg dels anys',
  'year.caption': 'Interaccions per any — com ha evolucionat el teu ús d\'Instagram.',
  'weekday.title': 'Quins dies t\'enganxes',
  'weekday.caption': 'La teua activitat per dia de la setmana.',
  'venn.caption': 'Seguits vs seguidors — la intersecció són els teus mutus.',
  'infection.title': 'Índex d\'infecció',
  'infection.caption': 'Quant et capturen uns pocs comptes externs — concentració, els teus vectors principals i tirament parasocial combinats. Més alt = més infectat.',
  'infection.low': 'Baixa',
  'infection.medium': 'Mitjana',
  'infection.high': 'Alta',
  'vectors.title': 'Els teus vectors d\'infecció',
  'vectors.caption': 'Només {n} comptes controlen el {pct}% de la teua atenció.',
  'trend.title': 'Va a més?',
  'trend.rising': 'La teua atenció es concentra MÉS amb el temps — cada vegada més capturat.',
  'trend.falling': 'La teua atenció es repartix més amb el temps — menys capturat.',
  'trend.flat': 'La teua concentració s\'ha mantingut més o menys estable amb el temps.',
  'drop.prompt':
    'Tria o arrossega el teu export d\'Instagram (.zip en format JSON). Mai ix del teu navegador.',
  'drop.helpSummary': 'Com descarregar l\'export correcte',
  'drop.helpSteps':
    'En Instagram: Configuració → Centre de comptes → La teua informació i permisos → Descarrega la teua informació. Tria "Part de la teua informació" i marca:',
  'drop.itemLikes': 'M\'agrada',
  'drop.itemComments': 'Comentaris',
  'drop.itemSaved': 'Guardat',
  'drop.itemStories': 'Interaccions amb històries',
  'drop.itemFollowers': 'Seguidors i seguits',
  'drop.helpFormat':
    'Posa Format: JSON (no HTML) i Rang de dates: Des del principi per al resultat més complet. Els "m\'agrada" a posts no es poden analitzar (Instagram omet l\'autor), així que "Interaccions amb històries" dona el resultat més ric.',

  'status.reading': 'Llegint…',
  'status.unrecognized': 'Export no reconegut. És un .zip d\'Instagram descarregat en format JSON?',
  'status.noInteractions':
    'No s\'han trobat m\'agrada/comentaris. L\'has descarregat en HTML en compte de JSON?',
  'status.badZip': 'No s\'ha pogut llegir este fitxer com a .zip.',

  'notice.lowData':
    'Només s\'han trobat {n} interaccions atribuïbles — insuficient per a un veredicte fiable. Els números de baix es mostren per transparència, però pren el score com a orientatiu. Torna a exportar en JSON amb un rang de dates més gran i incloent "Interaccions amb històries".',
  'notice.unattributed':
    '{n} m\'agrada a posts no s\'han pogut atribuir: l\'export actual d\'Instagram ja no registra qui va crear el post al qual vas donar like, per la qual cosa s\'exclouen. Els likes a històries, comentaris i likes a comentaris sí que porten el compte i s\'inclouen.',

  'verdict.title': 'Salut de la xarxa',
  'verdict.caption':
    'Una heurística transparent. Més alt = una dieta diversa i equilibrada. Més baix = poques veus acaparen la teua atenció. Diversitat {div}% · Concentració top-10 {conc}%.',
  'verdict.fewAccounts':
    ' (Tens ≤10 comptes amb interacció, així que la concentració top-10 és ~100% per naturalesa i el score és aproximat ací.)',
  'band.Healthy': 'Sana',
  'band.Moderate': 'Moderada',
  'band.Captured': 'Capturada',

  'headline.before': 'Segueixes {follows} comptes, però ',
  'headline.after': ' acapara el {pct}% de les teues {total} interaccions registrades.',

  'graph.title': 'El teu graf d\'atenció',
  'graph.caption':
    'Estàs al centre. Cada node és un compte amb el qual interactues — més gran = més atenció. Rosa = comptes que segueixes i amb els quals interactues (et capturen). Taronja = interactues sense seguir-los (fuga d\'atenció). Arrossega els nodes per a explorar.',

  'net.title': 'Tu vs la teua xarxa',
  'net.caption':
    '{followYouNotBack} et seguixen sense que tu els seguisques; {youFollowNotBack} que segueixes no et seguixen. Només {mutual} són mutus.',
  'stat.following': 'seguits',
  'stat.followers': 'seguidors',
  'stat.mutual': 'mutus',
  'leaning.caption':
    'Consumidor ↔ Creador — un proxy aproximat del teu ratio seguidors/seguits ({ratio}, {leaning}). L\'export no pot mesurar la teua influència real sobre els altres.',
  'leaning.consumerEnd': 'Consumidor (absorbeixes)',
  'leaning.creatorEnd': 'Creador (t\'absorbixen)',
  'leaning.consumer': 'consumidor',
  'leaning.balanced': 'equilibrat',
  'leaning.creator': 'creador',

  'bubble.title': 'La teua bombolla',
  'bubble.caption':
    'Quanta de la teua atenció es queda dins del teu cercle — comptes que segueixes i mutus que et seguixen. Un % alt no és necessàriament dolent: vol dir un cercle triat, no desconeguts que et posa l’algoritme. Baix = mires més cap a fora. És un equilibri, no una nota.',
  'bubble.followed': 'Atenció a comptes que segueixes',
  'bubble.mutual': 'Atenció a mutus (cercle íntim)',

  'dead.title': 'Seguits morts',
  'dead.caption':
    'Comptes que segueixes però als quals dones zero atenció. Una quota alta significa que la teua llista de seguits és sobretot soroll que ja ignores.',
  'dead.bar': '{n} de {total} que segueixes no reben res de la teua atenció',

  'when.title': 'Quan t\'enganxes',
  'when.caption':
    'La teua activitat per hora (UTC). Pic al voltant de les {hour}:00, al llarg de {days} dies d\'historial.',

  'close.title': 'Test del cercle íntim',
  'close.caption': 'Dels teus {total} close friends, de veritat interactues amb {engaged}.',
  'close.bar': 'Close friends amb els quals de veritat interactues',

  'para.title': 'Fugues parasocials',
  'para.caption': 'Comptes als quals abques atenció però ni tan sols segueixes.',

  'lorenz.title': 'Com de desigual està repartida la teua atenció?',
  'lorenz.caption':
    'Com més es corba per baix de la diagonal puntejada, més es concentra la teua atenció en uns pocs comptes. Gini {gini}.',

  'bars.title': 'On va la teua atenció',
  'bars.caption': 'Quota de les teues interaccions totals que s\'emporten els teus comptes principals.',

  'table.title': 'Les dades en brut',
  'table.caption': 'Tots els comptes amb els quals has interactuat, classificats. Ací no hi ha res ocult ni manipulat.',
  'table.colRank': '#',
  'table.colAccount': 'Compte',
  'table.colInteractions': 'Interaccions',
  'table.colShare': 'Quota',
  'table.colFollowed': 'Seguit?',
  'table.yes': 'sí',
  'table.no': 'no',
}
