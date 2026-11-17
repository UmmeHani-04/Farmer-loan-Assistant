import wave from "@/assets/people/farmer-wave.webp";
import grain from "@/assets/people/farmer-grain.webp";
import boy from "@/assets/people/boy-talk.webp";
import girl from "@/assets/people/girl-thumbs.webp";
import plant from "@/assets/people/woman-plant.webp";
import grandma from "@/assets/people/grandma.webp";

/** Friendly cartoon farmers used across the site. */
export const people = { wave, grain, boy, girl, plant, grandma } as const;

/** Which character appears on which tool page. */
export const pagePerson: Record<string, string> = {
  "/assistant": people.girl,
  "/crop-calendar": people.plant,
  "/crop-health": people.grandma,
  "/schemes": people.wave,
  "/weather": people.boy,
  "/mandi": people.grain,
  "/emi-calculator": people.boy,
  "/loan-eligibility": people.grain,
  "/profile": people.girl,
};
