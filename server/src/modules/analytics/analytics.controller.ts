import { Request, Response, NextFunction } from "express";
import { Visit } from "./visit.model";
import { Project } from "../projects/projects.model";
import { Blog } from "../blogs/blogs.model";
import { ContactMessage } from "../contact/contact.model";
import { MentorshipBooking } from "../mentorship/mentorship.model";

export async function getAdminSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rolling7Days = new Date();
    rolling7Days.setDate(rolling7Days.getDate() - 7);

    const [projectsCount, blogsCount, unreadMessages, pendingBookings, visitsThisWeek] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      MentorshipBooking.countDocuments({ status: "pending" }),
      Visit.countDocuments({ timestamp: { $gte: rolling7Days } }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        projectsCount,
        blogsCount,
        unreadMessages,
        pendingBookings,
        visitsThisWeek,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalyticsOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rolling30Days = new Date();
    rolling30Days.setDate(rolling30Days.getDate() - 30);

    const [visitsOverTime, topPages, topReferrers] = await Promise.all([
      // 1. Daily views and uniques aggregation
      Visit.aggregate([
        { $match: { timestamp: { $gte: rolling30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            views: { $sum: 1 },
            uniques: { $addToSet: "$sessionHash" },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: "$_id",
            views: 1,
            uniques: { $size: "$uniques" },
            _id: 0,
          },
        },
      ]),

      // 2. Top pages count
      Visit.aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { path: "$_id", count: 1, _id: 0 } },
      ]),

      // 3. Top referrers count
      Visit.aggregate([
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { referrer: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        visitsOverTime,
        topPages,
        topReferrers,
      },
    });
  } catch (error) {
    next(error);
  }
}
