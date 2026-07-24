import { Request, Response, NextFunction } from "express";
import { GlobalSettings } from "./settings.model";

export async function getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create({
        darkModeDefault: true,
        language: "en",
        soundToggle: true,
        animationToggle: true,
        accessibilityOptions: { screenReaderFriendly: false, highContrast: false },
        themeTokens: { primaryColor: "#00e5ff", secondaryColor: "#ff007f" },
        enabledSections: {
          about: true,
          skills: true,
          projects: true,
          blogs: true,
          contact: true,
          journey: true,
          achievements: true,
          resources: true,
          mentorship: true,
          resume: true,
          assistant: true,
          research: true,
        },
      });
    } else if (!settings.enabledSections || (settings.enabledSections instanceof Map ? settings.enabledSections.size === 0 : Object.keys(settings.enabledSections).length === 0)) {
      settings.enabledSections = new Map(Object.entries({
        about: true,
        skills: true,
        projects: true,
        blogs: true,
        contact: true,
        journey: true,
        achievements: true,
        resources: true,
        mentorship: true,
        resume: true,
        assistant: true,
        research: true,
      }));
      await settings.save();
    }
    res.status(200).json({ status: "success", data: settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings(req.body);
    } else {
      settings.darkModeDefault = req.body.darkModeDefault;
      settings.language = req.body.language;
      settings.soundToggle = req.body.soundToggle;
      settings.animationToggle = req.body.animationToggle;
      settings.accessibilityOptions = req.body.accessibilityOptions;
      settings.themeTokens = req.body.themeTokens;
      if (req.body.enabledSections) {
        settings.enabledSections = new Map(Object.entries(req.body.enabledSections));
      }
    }
    await settings.save();
    res.status(200).json({ status: "success", data: settings });
  } catch (error) {
    next(error);
  }
}
