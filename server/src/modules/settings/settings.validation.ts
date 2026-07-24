import { z } from "zod";

const accessibilityVal = z.object({
  screenReaderFriendly: z.boolean().default(false),
  highContrast: z.boolean().default(false),
});

const themeTokensVal = z.object({
  primaryColor: z.string().min(4).max(7),
  secondaryColor: z.string().min(4).max(7),
});

export const globalSettingsSchema = z.object({
  body: z.object({
    darkModeDefault: z.boolean(),
    language: z.string().min(2).max(5),
    soundToggle: z.boolean(),
    animationToggle: z.boolean(),
    accessibilityOptions: accessibilityVal,
    themeTokens: themeTokensVal,
    enabledSections: z.record(z.boolean()).optional(),
  }),
});
