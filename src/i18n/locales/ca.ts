// Català
export const ca: Record<string, string> = {
  'drop.prompt':
    'Tria o deixa caure el teu export d’Instagram (.zip en format JSON). No surt mai del teu navegador.',
  'drop.helpSummary': 'Com descarregar l’export correcte',
  'drop.helpSteps':
    'A Instagram: Configuració → Centre de comptes → La teva informació i permisos → Descarrega la teva informació. Tria "Part de la teva informació" i marca:',
  'drop.itemLikes': 'M’agrada',
  'drop.itemComments': 'Comentaris',
  'drop.itemSaved': 'Guardat',
  'drop.itemStories': 'Interaccions amb històries',
  'drop.itemFollowers': 'Seguidors i seguits',
  'drop.helpFormat':
    'Posa Format: JSON (no HTML) i Rang de dates: Des del principi per al resultat més complet. Els "m’agrada" a posts no es poden analitzar (Instagram omet l’autor), de manera que "Interaccions amb històries" dona el resultat més ric.',

  'status.reading': 'Llegint…',
  'status.unrecognized': 'Export no reconegut. És un .zip d’Instagram descarregat en format JSON?',
  'status.noInteractions':
    'No s’han trobat m’agrada/comentaris. L’has descarregat en HTML en lloc de JSON?',
  'status.badZip': 'No s’ha pogut llegir aquest fitxer com a .zip.',

  'notice.lowData':
    'Només s’han trobat {n} interaccions atribuïbles — insuficients per a un veredicte fiable. Les xifres de sota es mostren per transparència, però tracta la puntuació com a orientativa. Torna a exportar en JSON amb un rang de dates més ampli i inclou "Interaccions amb històries".',
  'notice.unattributed':
    '{n} m’agrada a posts no s’han pogut atribuir: l’export actual d’Instagram ja no registra qui va crear el post que t’ha agradat, de manera que s’exclouen. Els likes a històries, comentaris i likes a comentaris sí que porten el compte i s’inclouen.',

  'verdict.title': 'Salut de la xarxa',
  'verdict.caption':
    'Una heurística transparent. Més alt = una dieta diversa i equilibrada. Més baix = poques veus acaparen la teva atenció. Diversitat {div}% · Concentració top-10 {conc}%.',
  'verdict.fewAccounts':
    ' (Tens ≤10 comptes amb interacció, de manera que la concentració top-10 és ~100% per naturalesa i la puntuació és aproximada aquí.)',
  'band.Healthy': 'Sana',
  'band.Moderate': 'Moderada',
  'band.Captured': 'Capturada',

  'headline.before': 'Segueixes {follows} comptes, però ',
  'headline.after': ' acapara el {pct}% de les teves {total} interaccions registrades.',

  'graph.title': 'El teu graf d’atenció',
  'graph.caption':
    'Ets al centre. Cada node és un compte amb el qual interactues — més gran = més atenció. Rosa = comptes que segueixes i amb els quals interactues (et capturen). Taronja = interactues sense seguir-los (fuga d’atenció). Arrossega els nodes per explorar.',

  'net.title': 'Tu vs la teva xarxa',
  'net.caption':
    '{followYouNotBack} et segueixen sense que tu els segueixis; {youFollowNotBack} que segueixes no et segueixen. Només {mutual} són mutus.',
  'stat.following': 'seguits',
  'stat.followers': 'seguidors',
  'stat.mutual': 'mutus',
  'leaning.caption':
    'Consumidor ↔ Creador — un proxy aproximat del teu ratio seguidors/seguits ({ratio}, {leaning}). L’export no pot mesurar la teva influència real sobre els altres.',
  'leaning.consumerEnd': 'Consumidor (absorbeixes)',
  'leaning.creatorEnd': 'Creador (t’absorbeixen)',
  'leaning.consumer': 'consumidor',
  'leaning.balanced': 'equilibrat',
  'leaning.creator': 'creador',

  'bubble.title': 'La teva bombolla',
  'bubble.caption':
    'Quanta de la teva atenció es queda dins del teu propi cercle. Alt = cambra de ressò de comptes que ja segueixes; baix = mires cap a fora.',
  'bubble.followed': 'Atenció a comptes que segueixes',
  'bubble.mutual': 'Atenció a mutus (cercle íntim)',

  'dead.title': 'Seguits morts',
  'dead.caption':
    'Comptes que segueixes però als quals no prestes cap atenció. Una quota alta significa que la teva llista de seguits és sobretot soroll que ja ignores.',
  'dead.bar': '{n} de {total} que segueixes no reben gens de la teva atenció',

  'when.title': 'Quan t’enganxes',
  'when.caption':
    'La teva activitat per hora (UTC). Pic cap a les {hour}:00, al llarg de {days} dies d’historial.',

  'close.title': 'Test de cercle íntim',
  'close.caption': 'Dels teus {total} close friends, de veritat interactues amb {engaged}.',
  'close.bar': 'Close friends amb qui de veritat interactues',

  'para.title': 'Fuites parasocials',
  'para.caption': 'Comptes als quals dediques atenció però que ni tan sols segueixes.',

  'lorenz.title': 'Com de desigual està repartida la teva atenció?',
  'lorenz.caption':
    'Com més s’arrodoneix per sota de la diagonal puntejada, més es concentra la teva atenció en uns pocs comptes. Gini {gini}.',

  'bars.title': 'Cap on va la teva atenció',
  'bars.caption': 'Quota de les teves interaccions totals que s’emporten els teus comptes principals.',

  'table.title': 'Les dades en brut',
  'table.caption': 'Tots els comptes amb els quals has interactuat, classificats. Aquí no hi ha res amagat ni manipulat.',
  'table.colRank': '#',
  'table.colAccount': 'Compte',
  'table.colInteractions': 'Interaccions',
  'table.colShare': 'Quota',
  'table.colFollowed': 'Seguit?',
  'table.yes': 'sí',
  'table.no': 'no',
}
