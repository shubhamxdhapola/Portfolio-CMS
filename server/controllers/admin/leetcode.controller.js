import { LeetCodeSetting, LeetCodeCache } from '../../models/leetcode.model.js';
import { logActivity } from '../../utils/logger.js';

export async function refreshLeetCodeStatsInternal() {
  const setting = await LeetCodeSetting.findOne();
  if (!setting) {
    throw new Error('LeetCode settings not found.');
  }

  const { username, apiBaseUrl } = setting;
  if (!username) {
    throw new Error('LeetCode username is not configured.');
  }

  try {
    const parsedUrl = new URL(apiBaseUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are permitted.');
    }
  } catch (err) {
    throw new Error(`Invalid LeetCode API base URL: ${err.message}`);
  }

  try {
    const base = apiBaseUrl.replace(/\/+$/, '');
    const isPied = base.includes('pied') || base.includes('vercel') || base.includes('/user');
    const prefix = isPied ? `${base}/user/${username}` : `${base}/${username}`;

    const calUrl = `${prefix}/calendar`;
    const badgeUrl = `${prefix}/badges`;
    const subsUrl = isPied ? `${prefix}/submissions` : `${prefix}/submission?limit=15`;
    const contestUrl = isPied ? `${prefix}/contests` : `${prefix}/contest`;
    const userUrl = prefix;

    const [userRes, solvedRes, calRes, badgeRes, contestRes, subsRes] = await Promise.allSettled([
      fetch(userUrl).then((r) => {
        if (!r.ok) throw new Error(`User API returned ${r.status}`);
        return r.json();
      }),
      !isPied ? fetch(`${prefix}/solved`).then((r) => (r.ok ? r.json() : null)) : Promise.resolve(null),
      fetch(calUrl).then((r) => (r.ok ? r.json() : null)),
      fetch(badgeUrl).then((r) => (r.ok ? r.json() : { badges: [] })),
      fetch(contestUrl).then((r) => (r.ok ? r.json() : null)),
      fetch(subsUrl).then((r) => (r.ok ? r.json() : [])),
    ]);

    if (userRes.status !== 'fulfilled' || !userRes.value || userRes.value.detail === 'Not Found') {
      throw new Error(`User "${username}" not found or LeetCode API is unreachable.`);
    }

    const userData = userRes.value || {};
    const solvedData = solvedRes.status === 'fulfilled' && solvedRes.value ? solvedRes.value : {};
    const calendarData = calRes.status === 'fulfilled' ? calRes.value : null;
    const badgeData = badgeRes.status === 'fulfilled' ? badgeRes.value : { badges: [] };
    const contestData = contestRes.status === 'fulfilled' ? contestRes.value : null;
    const rawSubs = subsRes.status === 'fulfilled'
      ? Array.isArray(subsRes.value?.submission)
        ? subsRes.value.submission
        : Array.isArray(subsRes.value)
        ? subsRes.value
        : []
      : [];

    const acList = solvedData.acSubmissionNum || userData.submitStats?.acSubmissionNum || [];
    const totalSubmissionsList = solvedData.totalSubmissionNum || userData.submitStats?.totalSubmissionNum || [];

    const allSolved = solvedData.solvedProblem ?? (acList.find((s) => s.difficulty === 'All')?.count || 0);
    const easySolved = solvedData.easySolved ?? (acList.find((s) => s.difficulty === 'Easy')?.count || 0);
    const mediumSolved = solvedData.mediumSolved ?? (acList.find((s) => s.difficulty === 'Medium')?.count || 0);
    const hardSolved = solvedData.hardSolved ?? (acList.find((s) => s.difficulty === 'Hard')?.count || 0);

    const totalAcceptedSubmissions = acList.find((s) => s.difficulty === 'All')?.submissions || allSolved;
    const totalRawSubmissions = totalSubmissionsList.find((s) => s.difficulty === 'All')?.submissions || 0;
    const acceptanceRate =
      totalRawSubmissions > 0 ? ((totalAcceptedSubmissions / totalRawSubmissions) * 100).toFixed(1) : '0';

    const rawBadges = Array.isArray(badgeData?.badges) ? badgeData.badges : [];
    const badges = rawBadges.map((b) => {
      let icon = b?.icon || '';
      if (b?.medal?.config?.iconGif) icon = b.medal.config.iconGif;
      else if (icon.startsWith('/')) icon = `https://leetcode.com${icon}`;
      return { ...b, displayIcon: icon };
    });

    const parsedStats = {
      username,
      realName: userData.name || userData.profile?.realName || username,
      avatar: userData.avatar || userData.profile?.userAvatar || '',
      ranking: userData.ranking || userData.profile?.ranking || 0,
      reputation: userData.reputation || userData.profile?.reputation || 0,
      country: userData.country || userData.profile?.countryName || null,
      allSolved: Number(allSolved) || 0,
      easySolved: Number(easySolved) || 0,
      mediumSolved: Number(mediumSolved) || 0,
      hardSolved: Number(hardSolved) || 0,
      acceptanceRate,
      totalSubmissions: Number(totalRawSubmissions) || 0,
      stats: {
        totalSolved: Number(allSolved) || 0,
        easySolved: Number(easySolved) || 0,
        mediumSolved: Number(mediumSolved) || 0,
        hardSolved: Number(hardSolved) || 0,
        totalAcceptedSubmissions: Number(totalAcceptedSubmissions) || 0,
        totalRawSubmissions: Number(totalRawSubmissions) || 0,
        acceptanceRate,
      },
      badges,
      activeBadge: userData.activeBadge || null,
      contest: contestData
        ? contestData.userContestRanking
          ? {
              attendedCount: Number(contestData.userContestRanking.attendedContestsCount) || 0,
              rating: Math.round(Number(contestData.userContestRanking.rating) || 0),
              globalRanking: contestData.userContestRanking.globalRanking ?? null,
              totalParticipants: contestData.userContestRanking.totalParticipants ?? null,
              topPercentage:
                contestData.userContestRanking.topPercentage != null
                  ? `${Number(contestData.userContestRanking.topPercentage).toFixed(1)}%`
                  : null,
              history: contestData.userContestRankingHistory || [],
              userContestRanking: contestData.userContestRanking,
              userContestRankingHistory: contestData.userContestRankingHistory || [],
            }
          : contestData.contestAttend || contestData.contestRating
          ? {
              attendedCount: Number(contestData.contestAttend) || 0,
              rating: Math.round(Number(contestData.contestRating) || 0),
              globalRanking: contestData.contestGlobalRanking || null,
              totalParticipants: contestData.totalParticipants || null,
              topPercentage: contestData.contestTopPercentage ? `${contestData.contestTopPercentage}%` : null,
              history: contestData.contestParticipation || [],
            }
          : contestData
        : null,
      calendar: calendarData,
      recentSubmissions: rawSubs.slice(0, 15).map((s) => ({
        id: s.id || s.timestamp,
        title: s.title,
        titleSlug: s.titleSlug,
        statusDisplay: s.statusDisplay,
        langName: s.lang || s.langName,
        timestamp: s.timestamp,
      })),
      fetchedAt: new Date(),
    };

    await LeetCodeCache.findOneAndUpdate(
      { username },
      { username, statsData: parsedStats, fetchedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );

    setting.lastFetchedAt = new Date();
    setting.lastFetchStatus = 'success';
    setting.lastErrorMessage = '';
    await setting.save();

    return parsedStats;
  } catch (error) {
    setting.lastFetchedAt = new Date();
    setting.lastFetchStatus = 'error';
    setting.lastErrorMessage = error.message;
    await setting.save();
    throw error;
  }
}

export async function getLeetCodeSettings(req, res) {
  try {
    let setting = await LeetCodeSetting.findOne();
    if (!setting) setting = await LeetCodeSetting.create({});
    const cache = await LeetCodeCache.findOne();

    return res.status(200).json({
      success: true,
      data: {
        setting,
        cachedStats: cache?.statsData || null,
        lastCachedAt: cache?.fetchedAt || null,
      },
    });
  } catch (error) {
    console.error('Error in getLeetCodeSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateLeetCodeSettings(req, res) {
  try {
    const setting = await LeetCodeSetting.findOneAndUpdate({}, req.body, { returnDocument: 'after', upsert: true });
    await logActivity('UPDATE_LEETCODE_SETTINGS', 'LeetCode', 'Updated LeetCode username or API configuration', req);
    return res.status(200).json({ success: true, message: 'LeetCode settings saved.', data: setting });
  } catch (error) {
    console.error('Error in updateLeetCodeSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function refreshLeetCode(req, res) {
  try {
    const freshStats = await refreshLeetCodeStatsInternal();
    await logActivity('REFRESH_LEETCODE', 'LeetCode', 'Manually refreshed LeetCode statistics', req);
    return res.status(200).json({
      success: true,
      message: 'LeetCode statistics refreshed successfully.',
      data: freshStats,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: `Failed to refresh LeetCode stats: ${error.message}`,
    });
  }
}
