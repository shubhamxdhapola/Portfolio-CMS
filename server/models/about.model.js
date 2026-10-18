import mongoose from 'mongoose';

const whatIDoItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, default: 'code' },
  },
  { _id: false }
);

const aboutMeSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    shortName: { type: String, default: '' },
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    availability: { type: String, default: '' },
    stackSummary: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },
    avatarAltUrl: { type: String, default: '' },
    avatarAltPublicId: { type: String, default: '' },
    bioParagraph1: { type: String, default: '' },
    bioParagraph2: { type: String, default: '' },
    whatIDo: { type: [whatIDoItemSchema], default: [] },
    circularText: { type: String, default: '' },
    openToWorkStatus: { type: Boolean, default: true },
    badgeTopRight: { type: String, default: '' },
    badgeBottomLeft: { type: String, default: '' },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      email: { type: String, default: '' },
      leetcode: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const AboutMe = mongoose.model('AboutMe', aboutMeSchema);
export default AboutMe;
