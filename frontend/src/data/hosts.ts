export type Host = {
  id: string
  name: string
  role: string
  photo: string
  caption: string | null
}

export const hosts: Host[] = [
  {
    id: 'myhal',
    name: 'Антон Мигаль',
    role: 'резидент',
    photo: '/hosts/myhal.webp',
    caption: 'мінус бал',
  },
  {
    id: 'andrienko',
    name: 'Дмитро Андрієнко',
    role: 'резидент',
    photo: '/hosts/andrienko.webp',
    caption: 'нічого не помітив',
  },
  {
    id: 'yanovych',
    name: 'Женя Янович',
    role: 'ведучий',
    photo: '/hosts/yanovych.webp',
    caption: 'завжди правий',
  },
  {
    id: 'razbeikov',
    name: 'Олександр Разбєйков',
    role: 'резидент',
    photo: '/hosts/razbeikov.webp',
    caption: 'зробив застосунок',
  },
]
