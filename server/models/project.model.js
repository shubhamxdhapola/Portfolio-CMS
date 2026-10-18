import mongoose from 'mongoose';

const techBadgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: '#61DAFB' },
    logo: { type: String, default: '' },
  },
  { _id: false }
);

const caseStudySchema = new mongoose.Schema(
  {
    subtitle: { type: String, default: '' },
    role: { type: String, default: '' },
    duration: { type: String, default: '' },
    team: { type: String, default: '' },
    year: { type: String, default: '' },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    impact: { type: String, default: '' },
    process: { type: [String], default: [] },
    keyFeatures: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    learnings: { type: [String], default: [] },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    altSlugs: { type: [String], default: [] },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    type: { type: String, default: '' },
    year: { type: String, default: '' },
    accentColor: { type: String, default: '' },
    gradient: {
      type: String,
      default: '',
    },
    textColor: { type: String, default: '' },
    shadowColor: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    description: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    bullets: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    techBadges: { type: [techBadgeSchema], default: [] },
    caseStudy: { type: caseStudySchema, default: () => ({}) },
    featured: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ displayOrder: 1 });
projectSchema.index({ published: 1 });

const Project = mongoose.model('Project', projectSchema);
export { Project };
export default Project;
