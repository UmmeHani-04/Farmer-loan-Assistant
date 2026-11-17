import assistant from "@/assets/tools/assistant.webp";
import cropCalendar from "@/assets/tools/crop-calendar.webp";
import cropHealth from "@/assets/tools/crop-health.webp";
import schemes from "@/assets/tools/schemes.webp";
import weather from "@/assets/tools/weather.webp";
import mandi from "@/assets/tools/mandi.webp";
import emi from "@/assets/tools/emi-calculator.webp";
import loan from "@/assets/tools/loan-eligibility.webp";

/** Illustration for each tool, keyed by its route path. */
export const toolImages: Record<string, string> = {
  "/assistant": assistant,
  "/crop-calendar": cropCalendar,
  "/crop-health": cropHealth,
  "/schemes": schemes,
  "/weather": weather,
  "/mandi": mandi,
  "/emi-calculator": emi,
  "/loan-eligibility": loan,
};
