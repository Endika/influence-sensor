// English — source of truth. Every other locale mirrors these keys.
// Placeholders use {name}. Usernames are never translated.
export const en: Record<string, string> = {
  'drop.prompt':
    'Pick or drop your Instagram data export (.zip in JSON format). It never leaves your browser.',
  'drop.helpSummary': 'How to download the right export',
  'drop.helpSteps':
    'In Instagram: Settings → Accounts Center → Your information and permissions → Download your information. Choose “Some of your information” and tick:',
  'drop.itemLikes': 'Likes',
  'drop.itemComments': 'Comments',
  'drop.itemSaved': 'Saved',
  'drop.itemStories': 'Story interactions',
  'drop.itemFollowers': 'Followers and following',
  'drop.helpFormat':
    'Set Format: JSON (not HTML) and Date range: All time for the fullest picture. Liked posts can’t be analysed (Instagram omits the author), so “Story interactions” gives the richest result.',

  'status.reading': 'Reading…',
  'status.unrecognized': 'Unrecognized export. Is this an Instagram .zip downloaded in JSON format?',
  'status.noInteractions':
    'No likes/comments found. Did you download in HTML instead of JSON format?',
  'status.badZip': 'Could not read that file as a .zip.',

  'notice.lowData':
    'Only {n} attributable interactions found — not enough for a reliable verdict. The numbers below are shown for transparency, but treat the score as indicative only. Re-export from Instagram in JSON with a wider date range and “Story interactions” included.',
  'notice.unattributed':
    '{n} liked posts couldn’t be attributed: Instagram’s current export no longer records who authored a liked post, so those are excluded. Story likes, comments and liked comments still carry the account and are included.',

  'verdict.title': 'Network Health',
  'verdict.caption':
    'A transparent heuristic. Higher = a diverse, balanced diet. Lower = a few voices own your attention. Diversity {div}% · Top-10 concentration {conc}%.',
  'verdict.fewAccounts':
    ' (You have ≤10 engaged accounts, so top-10 concentration is naturally ~100% and the score is rough here.)',
  'band.Healthy': 'Healthy',
  'band.Moderate': 'Moderate',
  'band.Captured': 'Captured',

  'headline.before': 'You follow {follows} accounts, but ',
  'headline.after': ' alone takes {pct}% of your {total} logged interactions.',

  'graph.title': 'Your attention graph',
  'graph.caption':
    'You are at the center. Each node is an account you engage with — bigger = more of your attention. Pink = accounts you follow and engage with (they capture you). Orange = you engage without following (attention leak). Drag nodes to explore.',

  'net.title': 'You vs your network',
  'net.caption':
    '{followYouNotBack} follow you that you don’t follow back; {youFollowNotBack} you follow don’t follow you back. Only {mutual} are mutual.',
  'stat.following': 'following',
  'stat.followers': 'followers',
  'stat.mutual': 'mutual',
  'leaning.caption':
    'Consumer ↔ Creator — a rough proxy from your follower/following ratio ({ratio}, {leaning}). The export cannot measure your real influence on others.',
  'leaning.consumerEnd': 'Consumer (you absorb)',
  'leaning.creatorEnd': 'Creator (others absorb you)',
  'leaning.consumer': 'consumer',
  'leaning.balanced': 'balanced',
  'leaning.creator': 'creator',

  'bubble.title': 'Your bubble',
  'bubble.caption':
    'How much of your attention stays inside your own circle. High = an echo chamber of accounts you already follow; low = you look outward.',
  'bubble.followed': 'Attention to accounts you follow',
  'bubble.mutual': 'Attention to mutuals (inner circle)',

  'dead.title': 'Dead follows',
  'dead.caption':
    'Accounts you follow but give zero attention to. A high share means your following list is mostly noise you’ve tuned out.',
  'dead.bar': '{n} of {total} you follow get none of your attention',

  'when.title': 'When you get hooked',
  'when.caption':
    'Your activity by hour (UTC). Busiest around {hour}:00, across {days} days of history.',

  'close.title': 'Close-friends reality check',
  'close.caption': 'Of your {total} close friends, you actually engage with {engaged}.',
  'close.bar': 'Close friends you actually engage with',

  'para.title': 'Parasocial leaks',
  'para.caption': 'Accounts you pour attention into but don’t even follow.',

  'lorenz.title': 'How unevenly is your attention spread?',
  'lorenz.caption':
    'The further the curve bows below the dotted diagonal, the more your attention concentrates in a few accounts. Gini {gini}.',

  'bars.title': 'Where your attention goes',
  'bars.caption': 'Share of your total interactions held by your top accounts.',

  'table.title': 'The raw data',
  'table.caption': 'Every account you engaged with, ranked. Nothing here is hidden or modeled away.',
  'table.colRank': '#',
  'table.colAccount': 'Account',
  'table.colInteractions': 'Interactions',
  'table.colShare': 'Share',
  'table.colFollowed': 'Followed?',
  'table.yes': 'yes',
  'table.no': 'no',
}
