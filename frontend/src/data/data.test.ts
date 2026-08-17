import { describe, expect, it } from 'vitest'
import { episodes, latestEpisode, thumbnailUrl, watchUrl } from './episodes'
import { hosts } from './hosts'
import { firstRules } from './rules'
import { socials } from './socials'
import { appInfo } from './app'
import { demo } from './demo'
import { randomWords } from './randomWords'

describe('episodes', () => {
  it('містить двадцять випусків', () => {
    expect(episodes).toHaveLength(20)
  })

  it('пронумеровані підряд від першого', () => {
    expect(episodes.map((e) => e.number)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it('має унікальні одинадцятисимвольні videoId', () => {
    const ids = episodes.map((e) => e.videoId)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[\w-]{11}$/)
  })

  it('має непорожні імена гостей', () => {
    for (const e of episodes) expect(e.guest.trim().length).toBeGreaterThan(0)
  })

  it('будує посилання на обкладинку і на відео', () => {
    expect(thumbnailUrl('O5eSviXCWT0')).toBe(
      'https://i.ytimg.com/vi/O5eSviXCWT0/hqdefault.jpg',
    )
    expect(watchUrl('O5eSviXCWT0')).toContain('https://www.youtube.com/watch?v=O5eSviXCWT0')
  })
})

describe('hosts', () => {
  it('містить ведучого і трьох резидентів', () => {
    expect(hosts).toHaveLength(4)
    expect(hosts.filter((h) => h.role === 'ведучий')).toHaveLength(1)
  })

  it('усі фото лежать у /hosts/', () => {
    for (const h of hosts) expect(h.photo).toMatch(/^\/hosts\/[a-z]+\.webp$/)
  })
})

describe('rules', () => {
  it('має сім варіантів першого правила', () => {
    expect(firstRules).toHaveLength(7)
  })
})

describe('socials', () => {
  it('містить чотири мережі з https-посиланнями', () => {
    expect(socials).toHaveLength(4)
    for (const s of socials) expect(s.url).toMatch(/^https:\/\//)
  })

  it('має перевірене число підписників на YouTube', () => {
    const youtube = socials.find((s) => s.id === 'youtube')
    expect(youtube?.followers).toBe(264000)
  })

  it('дозволяє невідому кількість підписників', () => {
    for (const s of socials) {
      expect(s.followers === null || typeof s.followers === 'number').toBe(true)
    }
  })
})

describe('appInfo', () => {
  it('веде на правильний застосунок і має чотири скріншоти', () => {
    expect(appInfo.url).toContain('id6762404205')
    expect(appInfo.screenshots).toHaveLength(4)
  })
})

describe('demo', () => {
  it('усі три слова справді заховані в тексті', () => {
    expect(demo.words).toHaveLength(3)
    for (const word of demo.words) {
      expect(demo.text.toLowerCase()).toContain(word.toLowerCase())
    }
  })
})

describe('randomWords', () => {
  it('має щонайменше двадцять унікальних слів', () => {
    expect(randomWords.length).toBeGreaterThanOrEqual(20)
    expect(new Set(randomWords).size).toBe(randomWords.length)
  })
})

describe('latestEpisode', () => {
  it('це випуск з найбільшим номером, а не просто останній у масиві', () => {
    const highest = Math.max(...episodes.map((e) => e.number))
    expect(latestEpisode.number).toBe(highest)
    expect(episodes).toContainEqual(latestEpisode)
  })
})
