// Euskara
export const eu: Record<string, string> = {
  'drop.prompt':
    'Aukeratu edo jaregin zure Instagram datu-esportazioa (.zip JSON formatuan). Ez da inoiz zure nabigatzailetik irteten.',
  'drop.helpSummary': 'Nola deskargatu esportazio egokia',
  'drop.helpSteps':
    'Instagram-en: Ezarpenak → Kontu-zentroa → Zure informazioa eta baimenak → Deskargatu zure informazioa. Hautatu "Zure informazioaren zati bat" eta markatu:',
  'drop.itemLikes': 'Atsegin dut',
  'drop.itemComments': 'Iruzkinak',
  'drop.itemSaved': 'Gordeta',
  'drop.itemStories': 'Istorioekin elkarrekintzak',
  'drop.itemFollowers': 'Jarraitzaileak eta jarraitutakoak',
  'drop.helpFormat':
    'Ezarri Formatua: JSON (ez HTML) eta Data-tartea: Hasiera-hasieratik, emaitzarik osoena lortzeko. Argitalpenetako "atsegin dut"-ak ezin dira aztertu (Instagram-ek autorea ez du jasotzen), beraz "Istorioekin elkarrekintzak" aukerak emaitza aberatsena ematen du.',

  'status.reading': 'Irakurtzen…',
  'status.unrecognized': 'Esportazio ezezaguna. Instagram-eko .zip bat al da JSON formatuan deskargatua?',
  'status.noInteractions':
    'Ez dira atsegin dut/iruzkinik aurkitu. HTML formatuan deskargatu al duzu JSON ordez?',
  'status.badZip': 'Ezin izan da fitxategi hori .zip gisa irakurri.',

  'notice.lowData':
    '{n} elkarrekintza atribuigarri baino ez dira aurkitu — ez da nahikoa epai fidagarri baterako. Beheko zenbakiak gardentasunagatik erakusten dira, baina puntuazioa orientagarritzat hartu. Berresportatu Instagram-etik JSON formatuan, data-tarte zabalagoarekin eta "Istorioekin elkarrekintzak" sartuta.',
  'notice.unattributed':
    '{n} argitapenetan emandako "atsegin dut"-ak ezin izan dira atribuitu: Instagram-en esportazio berriak ez du jasotzen argitapen baten autorea, beraz horiek kanpoan uzten dira. Istorioen atsegin dutak, iruzkinak eta iruzkinetako atsegin dutak kontua dute eta sartuta daude.',

  'verdict.title': 'Sarearen osasuna',
  'verdict.caption':
    'Heuristika garden bat. Altuagoa = dieta anitza eta orekatua. Baxuagoa = ahots gutxi batzuek zure arreta bereganatzen dute. Aniztasuna {div}% · Top-10 kontzentrazioa {conc}%.',
  'verdict.fewAccounts':
    ' (≤10 kontu dituzu elkarrekintzarekin, beraz top-10 kontzentrazioa naturalki ~100% da eta puntuazioa gutxi gorabeherakoa da hemen.)',
  'band.Healthy': 'Osasuntsua',
  'band.Moderate': 'Moderatua',
  'band.Captured': 'Harrapatuta',

  'headline.before': '{follows} kontu jarraitzen dituzu, baina ',
  'headline.after': '-k bakarrik hartzen du zure {total} erregistratutako elkarrekintzen %{pct}.',

  'graph.title': 'Zure arreta-grafikoa',
  'graph.caption':
    'Zu zaude erdian. Nodo bakoitza elkarrekin aritzen zaren kontu bat da — handiagoa = zure arreta gehiago. Arrosa = jarraitzen dituzun eta elkarrekin aritzen zaren kontuak (hauek bereganatzen zaituzte). Laranja = jarraitu gabe elkarrekin aritzen zara (arreta-ihesa). Arrastatu nodoak esploratzeko.',

  'net.title': 'Zu eta zure sarea',
  'net.caption':
    '{followYouNotBack} zuri jarraitzen dizute zuek jarraitzen ez dituzuenak; {youFollowNotBack} jarraitzen dituzu baina hauek ez dizute jarraitzen. {mutual} baino ez dira elkarrekikoak.',
  'stat.following': 'jarraitutakoak',
  'stat.followers': 'jarraitzaileak',
  'stat.mutual': 'elkarrekikoak',
  'leaning.caption':
    'Consumer ↔ Creator — jarraitzaile/jarraitutako ratioen proxy aproximatu bat ({ratio}, {leaning}). Esportazioak ezin du zure benetako eragina beste pertsonen gainean neurtu.',
  'leaning.consumerEnd': 'Consumer (xurgatzen duzu)',
  'leaning.creatorEnd': 'Creator (besteak xurgatzen zaitu)',
  'leaning.consumer': 'kontsumitzaile',
  'leaning.balanced': 'orekatua',
  'leaning.creator': 'sortzaile',

  'bubble.title': 'Zure burbuila',
  'bubble.caption':
    'Zure arretaren zenbat geratzen den zure zirkulu propioan. Altua = jadanik jarraitzen dituzun kontuen oihartzun-gela; baxua = kanpora begiratzen duzu.',
  'bubble.followed': 'Arreta jarraitzen dituzun kontuetan',
  'bubble.mutual': 'Arreta elkarrekikoetan (barne-zirkulua)',

  'dead.title': 'Jarraitzen hildakoak',
  'dead.caption':
    'Jarraitzen dituzun baina zero arreta ematen dizkiezun kontuak. Proportzio altu batek esan nahi du zure jarraitu-zerrenda gehienetan zarata dela dagoeneko ahaztu duzuna.',
  'dead.bar': 'Jarraitzen dituzun {total}etatik {n}k ez dute zure arretarik jasotzen',

  'when.title': 'Noiz engantxatzen zara',
  'when.caption':
    'Zure jarduera orduka (UTC). Unerik gailena {hour}:00 inguruan, {days} eguneko historiaren zehar.',

  'close.title': 'Lagun estuen errealitate-egiaztapena',
  'close.caption': 'Zure {total} lagun estuetan, benetan {engaged}rekin elkarrekin aritzen zara.',
  'close.bar': 'Benetan elkarrekin aritzen zaren lagun estuak',

  'para.title': 'Parasozial-ihesak',
  'para.caption': 'Arreta isurtzen diezun baina jarraitzen ere ez dituzu kontuak.',

  'lorenz.title': 'Zenbaterainoko desberdintasunez dago banatuta zure arreta?',
  'lorenz.caption':
    'Kurba puntuztatutako diagonaletik zenbat eta gehiago aldendu behera, orduan eta gehiago kontzentratzen da zure arreta kontu gutxi batzuetan. Gini {gini}.',

  'bars.title': 'Zure arreta nora doan',
  'bars.caption': 'Zure kontu nagusiek hartzen duten zure elkarrekintza guztien zatia.',

  'table.title': 'Datu gordinak',
  'table.caption': 'Elkarrekin aritu zaren kontu guztiak, sailkatuta. Hemen ez dago ezer ezkutatu edo modelatuta.',
  'table.colRank': '#',
  'table.colAccount': 'Kontua',
  'table.colInteractions': 'Elkarrekintzak',
  'table.colShare': 'Zatia',
  'table.colFollowed': 'Jarraitua?',
  'table.yes': 'bai',
  'table.no': 'ez',
}
