import { Request, Response, NextFunction } from "express";
import { MentorshipService, MentorshipBooking, MentorshipConfig } from "./mentorship.model";
import { AppError } from "../../middleware/error";

export async function getMentorshipDetails(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const services = await MentorshipService.find().sort({ price: 1 });
    let config = await MentorshipConfig.findOne();
    if (!config) {
      config = await MentorshipConfig.create({ testimonials: [], faqs: [] });
    }
    res.status(200).json({
      status: "success",
      data: {
        services,
        config: {
          testimonials: config.testimonials || [],
          faqs: config.faqs || [],
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function bookSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await MentorshipBooking.create(req.body);
    res.status(201).json({ status: "success", data: booking });
  } catch (error) {
    next(error);
  }
}

export async function getBookings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await MentorshipBooking.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: list });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "declined"].includes(status)) {
      throw new AppError("Invalid status transition requested", 400);
    }

    const doc = await MentorshipBooking.findByIdAndUpdate(id, { status }, { new: true });
    if (!doc) {
      throw new AppError("Booking record not found", 404);
    }

    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function updateMentorshipConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { testimonials, faqs } = req.body;
    let config = await MentorshipConfig.findOne();
    if (!config) {
      config = new MentorshipConfig();
    }
    config.testimonials = testimonials;
    config.faqs = faqs;
    await config.save();

    res.status(200).json({ status: "success", data: config });
  } catch (error) {
    next(error);
  }
}

// Mentorship services CRUD
export async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await MentorshipService.create(req.body);
    res.status(201).json({ status: "success", data: service });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const service = await MentorshipService.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!service) {
      throw new AppError("Service not found", 404);
    }
    res.status(200).json({ status: "success", data: service });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const service = await MentorshipService.findByIdAndDelete(id);
    if (!service) {
      throw new AppError("Service not found", 404);
    }
    res.status(200).json({ status: "success", message: "Service successfully deleted" });
  } catch (error) {
    next(error);
  }
}
