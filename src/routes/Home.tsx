import { S01Hero } from '@/components/sections/S01Hero'
import { S02Ticker } from '@/components/sections/S02Ticker'
import { S03About } from '@/components/sections/S03About'
import { S04Skills } from '@/components/sections/S04Skills'
import { S05Experience } from '@/components/sections/S05Experience'
import { S06Work } from '@/components/sections/S06Work'
import { S07Education } from '@/components/sections/S07Education'
import { S08Languages } from '@/components/sections/S08Languages'
import { S09Exploring } from '@/components/sections/S09Exploring'
import { S10Contact } from '@/components/sections/S10Contact'

/**
 * Section order follows §6: S01 hero, S02 ticker, S03 about, S04 skills,
 * S05 experience, S06 work, S07 education, S08 languages, S09 exploring,
 * S10 contact. S11 is the footer, in the layout.
 */
export function Home() {
  return (
    <>
      <S01Hero />
      <S02Ticker />
      <S03About />
      <S04Skills />
      <S05Experience />
      <S06Work />
      <S07Education />
      <S08Languages />
      <S09Exploring />
      <S10Contact />
    </>
  )
}
