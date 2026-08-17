export type Episode = {
  number: number
  guest: string
  videoId: string
}

export const playlistUrl =
  'https://www.youtube.com/playlist?list=PLLHZWI9bLm5mu2UvhLsH6l0CW0ejyKbCd'

const playlistId = 'PLLHZWI9bLm5mu2UvhLsH6l0CW0ejyKbCd'

export const thumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

export const watchUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`

export const episodes: Episode[] = [
  { number: 1, guest: 'Роман Міщеряков', videoId: 'O5eSviXCWT0' },
  { number: 2, guest: 'Влад Куран', videoId: 'J1ansYRJVQg' },
  { number: 3, guest: 'OTOY', videoId: 'jkdx6tIQ2W8' },
  { number: 4, guest: 'Вова Шумко', videoId: 'LHoZsBopjio' },
  { number: 5, guest: 'Костя Трембовецький', videoId: 'KHGd0ap15Sk' },
  { number: 6, guest: 'Вова Дантес', videoId: 'zNnfeS87sL0' },
  { number: 7, guest: 'Емма Антонюк', videoId: 'v1_zqRhWw8Q' },
  { number: 8, guest: 'Олег Маслюк', videoId: 'fLyI4_Svy6s' },
  { number: 9, guest: 'Валік Міхієнко', videoId: 'jfn4PNLIp-U' },
  { number: 10, guest: 'Даша Кубік', videoId: 'ba-NNHEykpE' },
  { number: 11, guest: 'MONATIK', videoId: 'uTroVQQ72fM' },
  { number: 12, guest: 'Віталій Волочай', videoId: 'fGt2KnbHpb8' },
  { number: 13, guest: 'Паша Остріков і Вова Кравчук', videoId: 'iqxRKbRJ7cQ' },
  { number: 14, guest: 'Дядя Жора', videoId: 'HWgBkuiHQJs' },
  { number: 15, guest: 'Артем Дамницький', videoId: 'vKARLfzY0IE' },
  { number: 16, guest: 'Слава Бу', videoId: 'FwhZ_GgMGIo' },
  { number: 17, guest: 'Тріо Різні', videoId: 'esgVv_NUKUs' },
  { number: 18, guest: 'Роман Щербан', videoId: 'vv1_KPBUUvU' },
  { number: 19, guest: 'Марк Куцевалов', videoId: 'iErhH5Wu8hs' },
  { number: 20, guest: 'Влад Шевченко', videoId: 'scUEwXZcsH4' },
]
