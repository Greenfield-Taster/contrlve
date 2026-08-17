export type SocialId = 'youtube' | 'instagram' | 'threads' | 'tiktok'

export type Social = {
  id: SocialId
  label: string
  handle: string
  url: string
  /** null означає «число невідоме» — плитка рендериться без нього */
  followers: number | null
}

export const socials: Social[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@YanovychYevhenii',
    url: 'https://www.youtube.com/@YanovychYevhenii',
    followers: 264000,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@contrlve',
    url: 'https://www.instagram.com/contrlve/',
    followers: null,
  },
  {
    id: 'threads',
    label: 'Threads',
    handle: '@contrlve',
    url: 'https://www.threads.com/@contrlve',
    followers: null,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@contrlve',
    url: 'https://www.tiktok.com/@contrlve',
    followers: null,
  },
]
