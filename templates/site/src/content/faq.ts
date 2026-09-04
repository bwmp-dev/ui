export type FaqItem = { question: string; answer: string }

export const FAQ: FaqItem[] = [
  {
    question: 'Does Meridian send anything to a server?',
    answer:
      'No. Indexing and querying happen on your machine, and there is no account to create. The only network calls are the update check and crash reporting, both of which can be turned off.',
  },
  {
    question: 'How large a log file can it handle?',
    answer:
      'The index is built incrementally and memory-mapped, so file size is bounded by your disk rather than your RAM. Tens of gigabytes is routine; the first index of a large file takes a few minutes, after which queries are immediate.',
  },
  {
    question: 'Which formats are supported?',
    answer:
      'JSON lines, logfmt, syslog and common plain-text layouts are detected automatically. Anything else can be described with a small parser definition, and unparsed lines remain searchable as text.',
  },
  {
    question: 'Is there a server or team version?',
    answer:
      'Not yet. Shared sessions are files you can send to anyone, which covers most of what teams ask for. A hosted index is on the roadmap, and it will stay optional.',
  },
  {
    question: 'What is the licence?',
    answer:
      'Meridian is open source under the Apache 2.0 licence. The desktop build and the CLI come from the same repository, and there is no paid tier that removes features.',
  },
]
