/// <reference types="node" />

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { commonNcvStudies, ncvStudies, supplementalNcvStudies } from './ncvStudies'
import { ncvNavigationEntries, ncvNavigationGroups } from './ncvNavigation'

describe('NCV technique reference', () => {
  it('contains the complete textbook technique set plus F-wave', () => {
    expect(ncvStudies).toHaveLength(34)
    expect(new Set(ncvStudies.map((study) => study.id)).size).toBe(ncvStudies.length)
    expect(ncvStudies.some((study) => study.id === 'blink-reflex')).toBe(true)
    expect(ncvStudies.some((study) => study.id === 'soleus-h-reflex')).toBe(true)
    expect(ncvStudies.some((study) => study.id === 'f-wave')).toBe(true)
  })

  it('keeps every study clinically actionable and linked to a textbook image', () => {
    for (const study of ncvStudies) {
      expect(study.englishTitle).not.toBe('')
      expect(study.title).not.toBe('')
      expect(study.recording.target).not.toBe('')
      expect(study.recording.g1).not.toBe('')
      expect(study.recording.g2).not.toBe('')
      expect(study.recording.ground).not.toBe('')
      expect(study.cathode).not.toBe('')
      expect(study.position).not.toBe('')
      expect(study.stimulations.length).toBeGreaterThan(0)
      expect(study.normalValues.length).toBeGreaterThan(0)
      expect(study.notes.length).toBeGreaterThan(0)
      expect(study.images.length).toBeGreaterThan(0)
      expect(study.images.every((entry) => entry.src.startsWith('/ncv-guides/'))).toBe(true)
      expect(study.sourceLocator).not.toBe('')
    }
  })

  it('keeps common studies visually separate from supplemental studies', () => {
    expect(commonNcvStudies.length).toBeGreaterThan(10)
    expect(supplementalNcvStudies.length).toBeGreaterThan(10)
    expect(commonNcvStudies.length + supplementalNcvStudies.length).toBe(ncvStudies.length)
  })

  it('maps every study exactly once into the four clinical navigation categories', () => {
    const studyIds = ncvStudies.map((study) => study.id).sort()
    const navigationIds = ncvNavigationEntries.map((entry) => entry.studyId).sort()

    expect(Object.keys(ncvNavigationGroups)).toEqual(['upper', 'lower', 'face', 'special'])
    expect(navigationIds).toEqual(studyIds)
    expect(new Set(navigationIds).size).toBe(ncvStudies.length)
  })

  it('keeps recorded-muscle abbreviations out of list titles', () => {
    const recordedMusclePattern = /\b(?:APB|ADM|FDI|EIP|AHB|EDB|TA|nasalis|soleus|lumbrical|interossei|rectus femoris)\b/i

    for (const entry of ncvNavigationEntries) {
      expect(entry.listTitle).not.toMatch(recordedMusclePattern)
      expect(entry.listSubtitle).not.toMatch(recordedMusclePattern)
    }
  })

  it('keeps the audited textbook photos attached to the correct figure labels', () => {
    const auditedStudyImages: Record<string, string[]> = {
      'median-radial-digit1': ['fig-10-11-a.jpg', 'fig-10-11-b.jpg'],
      'median-ulnar-palmar-mixed': ['fig-10-12-a.jpg', 'fig-10-12-b.jpg'],
      'radial-motor-eip': ['fig-10-13-a.jpg', 'fig-10-13-b.jpg', 'fig-10-13-c.jpg', 'fig-10-13-d.jpg'],
      'radial-sensory': ['fig-10-14.jpg'],
      'mabc-sensory': ['fig-10-15.jpg'],
      'labc-sensory': ['fig-10-16.jpg'],
      'peroneal-motor-edb': ['fig-11-02-a.jpg', 'fig-11-02-b.jpg', 'fig-11-02-c.jpg'],
    }
    const auditedImageHashes: Record<string, string> = {
      'fig-10-11-a.jpg': '237ebe1f2c7ed1eada9a09f8308c0148fbe142d8caacc6e5fa28f5df2b332760',
      'fig-10-11-b.jpg': '075d01385fd0ba4f8fd5ac1bb9e7395936e9e071fe811332b5708890086722f8',
      'fig-10-12-a.jpg': 'eabb8cad00939d09d1f67b2a65ac2d01a0295817fb8c2ddf7334819c64e0bca1',
      'fig-10-12-b.jpg': '2a97583ba7bef38d02f70d36a97fa2b73d2c87b1578daf319a76f6243b65a6a9',
      'fig-10-13-a.jpg': 'd5cd7e6087c4aadc10f254115f32aeb033b3dd74ca4590e1702f8c7b7a93ffc1',
      'fig-10-13-b.jpg': '6a9a3afec3daf107c89a0d14e93934bc7a040a02491681ed9ba91b8a7fd6f230',
      'fig-10-13-c.jpg': '0ce1e7477881a8959c82b0399a70f617c0d8c1bdbf36fc78ec2c416bf590271a',
      'fig-10-13-d.jpg': 'd9cb03e30f736fd0beefb3deab5850771e341528fdc50e631f12adb5e5e8dc0d',
      'fig-10-14.jpg': 'a7c5c80bb0506098bd294e4b62a1f2b5207082f3bdde048176ec686d5d5ffe25',
      'fig-10-15.jpg': 'e3794dd4583d7941c9e6ccd4849be7e50908422b2156b6ce7f4d73ce47396d18',
      'fig-10-16.jpg': '32a3ebef1409a98eca941bd31901a1e6f120f204747ca01cdce25caed2c02615',
      'fig-11-02-a.jpg': '5d675dcb5ee63257a8c3b95009af342a770d98e62983147e77f059924edad18f',
      'fig-11-02-b.jpg': 'bcaad182bfdda14b8479be57ddbbce1f0fbe2357364eecf72256d5746e12dcd0',
      'fig-11-02-c.jpg': '4844923e36b8b0caa541c9566afdd7baf2493d0c6f155d1fa99d135c90b5911b',
    }

    for (const [studyId, expectedFilenames] of Object.entries(auditedStudyImages)) {
      const study = ncvStudies.find((entry) => entry.id === studyId)
      expect(study?.images.map((entry) => entry.src.split('/').at(-1)), studyId).toEqual(expectedFilenames)
    }

    for (const [filename, expectedHash] of Object.entries(auditedImageHashes)) {
      const asset = readFileSync(resolve(process.cwd(), 'public/ncv-guides', filename))
      expect(createHash('sha256').update(asset).digest('hex'), filename).toBe(expectedHash)
    }
  })
})
