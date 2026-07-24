import { Request, Response, NextFunction } from "express";
import { ContactMessage } from "./contact.model";
import { sendEmail } from "../../config/resend";
import { AppError } from "../../middleware/error";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portfolio.dev";

export async function createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, subject, message, honeypot } = req.body;

    // Honeypot spam filtering: if filled, act like it succeeded but do not store or send mail
    if (honeypot && honeypot.trim() !== "") {
      res.status(200).json({ status: "success", message: "Message sent successfully" });
      return;
    }

    // Save message in DB
    const doc = await ContactMessage.create({ name, email, subject, message });

    // Send email alert to admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Contact Form] ${subject}`,
        html: `
          <p>You have received a new contact message:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #22d3ee; padding-left: 10px; margin-left: 0;">
            ${message.replace(/\n/g, "<br/>")}
          </blockquote>
        `,
      });
    } catch (emailErr) {
      // Log email failure but don't fail the API request (graceful degradation)
      console.error("Resend notification dispatch failed:", emailErr);
    }

    res.status(201).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function getMessagesList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const list = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments();

    res.status(200).json({
      status: "success",
      data: list,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMessageStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { read } = req.body;

    if (typeof read !== "boolean") {
      throw new AppError("Invalid read status parameter", 400);
    }

    const doc = await ContactMessage.findByIdAndUpdate(id, { read }, { new: true });
    if (!doc) {
      throw new AppError("Message not found", 404);
    }

    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError("Message not found", 404);
    }
    res.status(200).json({ status: "success", message: "Message successfully deleted" });
  } catch (error) {
    next(error);
  }
}
