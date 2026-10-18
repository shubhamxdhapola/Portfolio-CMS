import SiteSettings from '../models/site.settings.model.js';
import HomePage from '../models/home.model.js';
import AboutMe from '../models/about.model.js';
import Project from '../models/project.model.js';
import { Skill, MarqueeItem } from '../models/skill.model.js';
import { Certification, CertificationPage } from '../models/certification.model.js';
import Education from '../models/education.model.js';
import { WorkExperience, WorkPage } from '../models/work.model.js';
import Resume from '../models/resume.model.js';
import SocialLink from '../models/social.link.model.js';
import { LeetCodeSetting, LeetCodeCache } from '../models/leetcode.model.js';
import { cloudinary } from '../config/cloudinary.js';

export async function getSiteContent(req, res) {
  try {
    const [settings, homePage, aboutMe, socialLinks, resume] = await Promise.all([
      SiteSettings.findOne().lean(),
      HomePage.findOne().lean(),
      AboutMe.findOne().lean(),
      SocialLink.find({ isVisible: true }).sort({ displayOrder: 1 }).lean(),
      Resume.findOne().select('-versions').lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        settings: settings || {},
        homePage: homePage || {},
        aboutMe: aboutMe || {},
        socialLinks: socialLinks || [],
        resume: resume || {},
      },
    });
  } catch (error) {
    console.error('Error in getSiteContent:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicProjects(req, res) {
  try {
    const projects = await Project.find({ published: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error in getPublicProjects:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicProjectBySlug(req, res) {
  try {
    const { slug } = req.params;
    const isNum = !isNaN(Number(slug));
    const orConditions = [{ slug }, { altSlugs: slug }];
    if (isNum) {
      orConditions.push({ id: Number(slug) });
    }

    const project = await Project.findOne({
      published: true,
      $or: orConditions,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with slug or ID "${slug}" was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error in getPublicProjectBySlug:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicSkills(req, res) {
  try {
    const [skills, marqueeItems] = await Promise.all([
      Skill.find({ isVisible: true }).sort({ displayOrder: 1 }).lean(),
      MarqueeItem.find({ isVisible: true }).sort({ displayOrder: 1 }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        skills,
        marqueeItems: marqueeItems.map((m) => m.text),
      },
    });
  } catch (error) {
    console.error('Error in getPublicSkills:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicCertifications(req, res) {
  try {
    const [certifications, pageSettings] = await Promise.all([
      Certification.find({ published: true }).sort({ displayOrder: 1 }).lean(),
      CertificationPage.findOne().lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        certifications,
        pageSettings: pageSettings || {},
      },
    });
  } catch (error) {
    console.error('Error in getPublicCertifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicEducation(req, res) {
  try {
    const education = await Education.find({ isVisible: true }).sort({ displayOrder: 1 }).lean();

    return res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    console.error('Error in getPublicEducation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicWork(req, res) {
  try {
    const [workExperiences, pageSettings] = await Promise.all([
      WorkExperience.find({ isVisible: true }).sort({ displayOrder: 1 }).lean(),
      WorkPage.findOne().lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        workExperiences,
        pageSettings: pageSettings || {},
      },
    });
  } catch (error) {
    console.error('Error in getPublicWork:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getPublicResume(req, res) {
  try {
    const resume = await Resume.findOne().select('-versions').lean();
    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error in getPublicResume:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function streamResumePdf(req, res) {
  try {
    const { versionId } = req.params;
    const resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume document not found' });
    }

    let pdfPublicId = resume.pdfPublicId;
    let fileName = resume.fileName || 'Resume.pdf';
    let pdfUrl = resume.pdfUrl;

    if (versionId && resume.versions?.length) {
      const v = resume.versions.id(versionId);
      if (v) {
        pdfPublicId = v.pdfPublicId || pdfPublicId;
        fileName = v.fileName || fileName;
        pdfUrl = v.pdfUrl || pdfUrl;
      }
    }

    const isDownload = req.query.download === 'true' || req.query.download === '1';
    const disposition = isDownload ? 'attachment' : 'inline';

    if (pdfPublicId) {
      try {
        const signedDownloadUrl = cloudinary.utils.private_download_url(pdfPublicId, 'pdf', {
          resource_type: 'image',
          type: 'upload',
          attachment: isDownload,
        });

        const response = await fetch(signedDownloadUrl);
        if (response.ok) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(fileName)}"`);
          const arrayBuffer = await response.arrayBuffer();
          return res.send(Buffer.from(arrayBuffer));
        }
      } catch (cloudErr) {
        console.error('Error fetching signed private URL from Cloudinary:', cloudErr.message);
      }
    }

    if (pdfUrl && pdfUrl.startsWith('http')) {
      const response = await fetch(pdfUrl);
      if (response.ok) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(fileName)}"`);
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    }

    if (pdfUrl && pdfUrl.startsWith('/')) {
      return res.redirect(pdfUrl);
    }

    return res.status(404).json({ success: false, message: 'Resume file is not accessible' });
  } catch (error) {
    console.error('Error in streamResumePdf:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while loading PDF' });
  }
}


export async function getPublicLeetCodeStats(req, res) {
  try {
    const setting = await LeetCodeSetting.findOne().lean();
    const cache = await LeetCodeCache.findOne().lean();

    return res.status(200).json({
      success: true,
      data: {
        config: {
          username: setting?.username || '',
          profileUrl: setting?.profileUrl || '',
          lastFetchedAt: setting?.lastFetchedAt || null,
        },
        stats: cache?.statsData || null,
      },
    });
  } catch (error) {
    console.error('Error in getPublicLeetCodeStats:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
