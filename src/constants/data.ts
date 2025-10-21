import type { Level, Program } from "./types";

export const departments: Program[] = [
  {
    key: "CYSDSC",
    name: "Cybersecurity & Data Science",
    description:
      "Study of protecting digital systems and using data science for insights and innovation",
  },
  {
    key: "ICTIFT",
    name: "ICT & Information Technology",
    description:
      "Focus on communication networks and the application of information technology",
  },
  {
    key: "SWIS",
    name: "Software Engr & Information Systems",
    description:
      "Study of designing, building, and maintaining reliable software systems",
  },
  {
    key: "CSC",
    name: "Computer Science",
    description:
      "Study of computation, algorithms, programming, and systems design",
  },
];

export const levels: Level[] = [
  {
    key: "L100",
    name: "100 Level",
    value: "100",
  },
  {
    key: "L200F",
    name: "Direct Entry",
    value: "200 D.E",
  },
  {
    key: "L200",
    name: "200 Level",
    value: "200",
  },
  {
    key: "L300",
    name: "300 Level",
    value: "300",
  },
  {
    key: "L400",
    name: "400 Level",
    value: "400",
  },
];

export const types = ["college", "departmental"];

export interface ExecutiveContacts {
  whatsapp?: string;
  email?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

export interface Executive {
  id: number;
  name: string;
  position: string;
  image: string;
  contacts?: ExecutiveContacts;
}
export const executives: Executive[] = [
  {
    id: 1,
    name: "Amoniyan Ayomide Faith",
    position: "President",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759878576/IMG-20251007-WA0154_ggo4zf.jpg",
  },
  {
    id: 2,
    name: "Taiwo Oluwadarasimi John (The Lord Techdee)",
    position: "Vice President",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759905917/WhatsApp_Image_2025-10-08_at_5.54.46_AM_nq79nw.jpg",
    contacts: {
      whatsapp: "+2347054345693",
      instagram: "thelordtechdee",
      twitter: "TheLordTechdee",
      linkedin: "oluwadarasimi-taiwo",
    },
  },
  {
    id: 3,
    name: "Ogunfolaji Ayomide (Cheers)",
    position: "General Secretary",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1760087249/9440461_uipslj.jpg",
  },
  {
    id: 4,
    name: "Egbetola Ayomikun (mikun)",
    position: "Director of Software, Research and Innovation",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/c_crop,w_1700,h_1750,g_auto,e_improve/v1759803966/IMG-20251005-WA0020_pdspqp.jpg",
    contacts: {
      whatsapp: "+2349161285212",
    },
  },
  {
    id: 5,
    name: "Ibrahim Oloyede",
    position: "Assistant General Secretary",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759907101/WhatsApp_Image_2025-10-08_at_4.04.36_AM_lsl2cd.jpg",
  },
  {
    id: 6,
    name: "Odey Favour Irinen",
    position: "Financial Secretary",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759912727/fav_h4pcmb.jpg",
    contacts: {
      whatsapp: "+2349074660245",
      twitter: "@justiriii",
      instagram: "Just_irii",
    },
  },
  {
    id: 7,
    name: "Coker Peace",
    position: "Treasurer",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759952077/WhatsApp_Image_2025-10-08_at_8.04.01_PM_kdrumy.jpg",
  },
  {
    id: 8,
    name: "Nwabuoku Williams Babatunde",
    position: "Public Relations Officer",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759878575/IMG-20251007-WA0133_apg3zm.jpg",
    contacts: {
      whatsapp: "+2348094308250",
      linkedin: "babatunde-williams",
      instagram: "babatundewilliams",
    },
  },
  {
    id: 9,
    name: "Alabi Itiayo",
    position: "Welfare Director",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759952077/WhatsApp_Image_2025-10-08_at_7.10.21_PM_kz6ww2.jpg",
  },
  {
    id: 10,
    name: "Alayo Quadri Mautin (Fresh)",
    position: "Social Director",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759878577/IMG-20251007-WA0132_i569eb.jpg",
  },
  {
    id: 11,
    name: "Adesina Semiu Ayomide",
    position: "Sports Director",
    image:
      "https://res.cloudinary.com/dqp54assh/image/upload/v1759878576/IMG-20251007-WA0150_dkk34w.jpg",
  },
];
