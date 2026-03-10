import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Position, PositionCategory, BodyType, SkillLevel } from '../types'

export type PlayingStyle = string

export type DominantArea = 'on_the_ball' | 'off_the_ball' | 'in_transition' | 'defensive_shape'
export type TrainingFrequency = '2-3x' | '4-5x' | '6-7x'
export type TrainingIntensity = 'moderate' | 'intense' | 'elite'
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'active' | 'very_active'

export interface ScheduleSlot {
  day: string
  time: string
}

interface OnboardingState {
  // Step tracking
  currentStep: number

  // Basic profile
  age: number | null
  firstName: string
  positionCategory: PositionCategory | null   // main category (goalkeeper/defender/midfielder/forward)
  position: Position | null                   // specific sub-position (cb, lw, st, etc.)
  bodyType: BodyType | null
  skillLevel: SkillLevel | null
  trainingDaysPerWeek: number | null

  // Soccer identity
  playingStyle: PlayingStyle | null
  dominantArea: DominantArea | null

  // Training setup
  trainingFrequency: TrainingFrequency | null
  trainingIntensity: TrainingIntensity | null

  // Physical
  currentWeight: string
  activityLevel: ActivityLevel | null
  heightCm: string

  // Goals
  goals: string[]
  goalsText: string

  // Schedule
  schedule: ScheduleSlot[]

  // Health
  hasInjuries: boolean | null
  parQCleared: boolean | null

  // Where they play
  wherePlaysCategory: string
  wherePlaysSpecific: string

  // Pro player comparison
  proPlayerSlug: string

  // COPPA
  parentEmail: string

  // Setters
  setCurrentStep: (step: number) => void
  setAge: (age: number) => void
  setFirstName: (name: string) => void
  setPositionCategory: (category: PositionCategory) => void
  setPosition: (position: Position) => void
  setBodyType: (bodyType: BodyType) => void
  setSkillLevel: (skillLevel: SkillLevel) => void
  setTrainingDaysPerWeek: (days: number) => void
  setPlayingStyle: (style: PlayingStyle) => void
  setDominantArea: (area: DominantArea) => void
  setTrainingFrequency: (freq: TrainingFrequency) => void
  setTrainingIntensity: (intensity: TrainingIntensity) => void
  setCurrentWeight: (weight: string) => void
  setActivityLevel: (level: ActivityLevel) => void
  setHeightCm: (height: string) => void
  toggleGoal: (goal: string) => void
  setGoalsText: (text: string) => void
  toggleScheduleSlot: (day: string, time: string) => void
  setHasInjuries: (value: boolean) => void
  setParQCleared: (value: boolean) => void
  setWherePlaysCategory: (category: string) => void
  setWherePlaysSpecific: (specific: string) => void
  setProPlayerSlug: (slug: string) => void
  setParentEmail: (email: string) => void
  reset: () => void

  // Legacy compat (some older code may use birthYear)
  birthYear: number | null
  setBirthYear: (year: number) => void
}

const initialState = {
  currentStep: 1,
  age: null,
  birthYear: null,
  firstName: '',
  positionCategory: null,
  position: null,
  bodyType: null,
  skillLevel: null,
  trainingDaysPerWeek: null,
  playingStyle: null,
  dominantArea: null,
  trainingFrequency: null,
  trainingIntensity: null,
  currentWeight: '',
  activityLevel: null,
  heightCm: '',
  goals: [] as string[],
  goalsText: '',
  schedule: [] as ScheduleSlot[],
  hasInjuries: null,
  parQCleared: null,
  parentEmail: '',
  wherePlaysCategory: '',
  wherePlaysSpecific: '',
  proPlayerSlug: '',
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
  ...initialState,

  setCurrentStep: (currentStep) => set({ currentStep }),
  setAge: (age) => set({ age, birthYear: new Date().getFullYear() - age }),
  setBirthYear: (birthYear) => set({ birthYear, age: new Date().getFullYear() - birthYear }),
  setFirstName: (firstName) => set({ firstName }),
  setPositionCategory: (positionCategory) => set({ positionCategory }),
  setPosition: (position) => set({ position }),
  setBodyType: (bodyType) => set({ bodyType }),
  setSkillLevel: (skillLevel) => set({ skillLevel }),
  setTrainingDaysPerWeek: (trainingDaysPerWeek) => set({ trainingDaysPerWeek }),
  setPlayingStyle: (playingStyle) => set({ playingStyle }),
  setDominantArea: (dominantArea) => set({ dominantArea }),
  setTrainingFrequency: (trainingFrequency) => set({ trainingFrequency }),
  setTrainingIntensity: (trainingIntensity) => set({ trainingIntensity }),
  setCurrentWeight: (currentWeight) => set({ currentWeight }),
  setActivityLevel: (activityLevel) => set({ activityLevel }),
  setHeightCm: (heightCm) => set({ heightCm }),
  setGoalsText: (goalsText) => set({ goalsText }),
  setHasInjuries: (hasInjuries) => set({ hasInjuries }),
  setParQCleared: (parQCleared) => set({ parQCleared }),
  setParentEmail: (parentEmail) => set({ parentEmail }),
  setWherePlaysCategory: (wherePlaysCategory) => set({ wherePlaysCategory }),
  setWherePlaysSpecific: (wherePlaysSpecific) => set({ wherePlaysSpecific }),
  setProPlayerSlug: (proPlayerSlug) => set({ proPlayerSlug }),

  toggleGoal: (goal) => {
    const { goals } = get()
    if (goals.includes(goal)) {
      set({ goals: goals.filter((g) => g !== goal) })
    } else if (goals.length < 2) {
      set({ goals: [...goals, goal] })
    }
  },

  toggleScheduleSlot: (day, time) => {
    const { schedule } = get()
    const exists = schedule.some((s) => s.day === day && s.time === time)
    if (exists) {
      set({ schedule: schedule.filter((s) => !(s.day === day && s.time === time)) })
    } else {
      set({ schedule: [...schedule, { day, time }] })
    }
  },

  reset: () => set(initialState),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
