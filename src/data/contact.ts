/** §S10 — The Break Room. All copy verbatim from the spec. */

export const CONTACT = {
  heading: 'The Break Room',
  formTitle: 'SEND A TRANSMISSION',
  intro: [
    "In case you're feeling tired — here are cookies and coffee. ☕ 🍪",
    'Thank you for stopping by my space. Take a seat, take a break, and say hello whenever you’re ready. I read everything.',
  ],
  submit: 'Send it',
  /** §13 — an action keeps its name through the whole flow. */
  submitting: 'sending…',
  retry: 'try again',
  success: {
    title: 'Transmission received. ✦',
    body: 'I’ll get back to you within a couple of days. In the meantime — help yourself to another cookie.',
    again: 'send another',
  },
} as const

export const FIELDS = {
  name: { label: 'Your name', placeholder: 'who’s there?' },
  email: { label: 'Email', placeholder: 'where do I reply?' },
  subject: { label: 'About' },
  message: {
    label: 'What’s on your mind?',
    placeholder: 'say anything — I read everything',
    max: 1500,
  },
} as const

/** §S10 — optional, and in the spec's order. */
export const SUBJECT_OPTIONS = [
  { value: 'Job opportunity', label: 'Job opportunity' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Collaboration', label: 'Collaboration' },
  { value: 'Just saying hi', label: 'Just saying hi' },
]

/**
 * §S10 error rules: say what happened and what to do. No apologies, no
 * vagueness. Verbatim.
 */
export const ERRORS = {
  nameEmpty: 'Add your name so I know who I’m replying to.',
  nameLength: 'Add your name so I know who I’m replying to.',
  emailEmpty: 'Add an email so I can write back.',
  emailInvalid: 'That email doesn’t look right — check for a typo.',
  messageShort: 'A few more words would help — 10 characters minimum.',
  messageLong: 'That’s over 1500 characters. Trim it, or email me directly.',
  networkFail: 'The message didn’t send. Check your connection and try again.',
} as const
