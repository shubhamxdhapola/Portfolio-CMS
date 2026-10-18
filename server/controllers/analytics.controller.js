import crypto from 'crypto';
import PageView from '../models/analytics.model.js';

function getDeviceType(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android|touch/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getBrowserName(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
  return 'Other';
}

export async function recordPageView(req, res) {
  try {
    const { path, referrer, visitorId } = req.body;

    if (!path || !visitorId) {
      return res.status(400).json({ success: false, message: 'Path and visitorId are required.' });
    }

    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return res.status(200).json({ success: true, ignored: true });
    }

    const userAgent = req.headers['user-agent'] || '';
    const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(String(rawIp)).digest('hex').substring(0, 16);

    const fifteenSecondsAgo = new Date(Date.now() - 15000);
    const recentDuplicate = await PageView.findOne({
      visitorId,
      path,
      timestamp: { $gte: fifteenSecondsAgo },
    });

    if (recentDuplicate) {
      return res.status(200).json({ success: true, deduped: true });
    }

    await PageView.create({
      visitorId,
      path: path.split('?')[0],
      referrer: referrer ? new URL(referrer, 'http://localhost').hostname : 'Direct',
      deviceType: getDeviceType(userAgent),
      browser: getBrowserName(userAgent),
      ipHash,
      timestamp: new Date(),
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}

export async function getAnalyticsOverview(req, res) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalPageViews,
      allVisitors,
      todayViews,
      todayVisitors,
      sevenDaysViews,
      sevenDaysVisitors,
      thirtyDaysViews,
      thirtyDaysVisitors,
      topPages,
      topReferrers,
      devices,
    ] = await Promise.all([
      PageView.countDocuments(),
      PageView.distinct('visitorId'),
      PageView.countDocuments({ timestamp: { $gte: todayStart } }),
      PageView.distinct('visitorId', { timestamp: { $gte: todayStart } }),
      PageView.countDocuments({ timestamp: { $gte: sevenDaysAgo } }),
      PageView.distinct('visitorId', { timestamp: { $gte: sevenDaysAgo } }),
      PageView.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      PageView.distinct('visitorId', { timestamp: { $gte: thirtyDaysAgo } }),
      PageView.aggregate([
        { $group: { _id: '$path', count: { $sum: 1 }, uniqueVisitors: { $addToSet: '$visitorId' } } },
        { $project: { path: '$_id', views: '$count', uniques: { $size: '$uniqueVisitors' }, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      PageView.aggregate([
        { $match: { referrer: { $ne: '' } } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $project: { referrer: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      PageView.aggregate([
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $project: { device: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalPageViews,
        totalUniqueVisitors: allVisitors.length,
        today: { views: todayViews, uniqueVisitors: todayVisitors.length },
        last7Days: { views: sevenDaysViews, uniqueVisitors: sevenDaysVisitors.length },
        last30Days: { views: thirtyDaysViews, uniqueVisitors: thirtyDaysVisitors.length },
        topPages,
        topReferrers,
        devices,
      },
    });
  } catch (error) {
    console.error('Error in getAnalyticsOverview:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getAnalyticsTimeline(req, res) {
  try {
    const { range = '30d' } = req.query;
    let days = 30;
    if (range === '7d') days = 7;
    else if (range === '90d') days = 90;
    else if (range === 'all') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days + 1));
    startDate.setHours(0, 0, 0, 0);

    const timeline = await PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          views: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
        },
      },
      {
        $project: {
          date: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$visitors' },
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    const dateMap = new Map();
    timeline.forEach((item) => dateMap.set(item.date, item));

    const filledTimeline = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      if (filledTimeline.length > 0 && filledTimeline[filledTimeline.length - 1].date === dateStr) {
        continue;
      }
      if (dateMap.has(dateStr)) {
        filledTimeline.push(dateMap.get(dateStr));
      } else {
        filledTimeline.push({ date: dateStr, views: 0, uniqueVisitors: 0 });
      }
    }

    return res.status(200).json({
      success: true,
      data: filledTimeline,
    });
  } catch (error) {
    console.error('Error in getAnalyticsTimeline:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
