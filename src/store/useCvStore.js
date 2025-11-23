// src/store/useCvStore.js
import { create } from "zustand";
import { produce } from "immer";

/**
 * ✅ Penting:
 * - Initial state HARUS deterministik (ID statis), biar SSR == client.
 * - ID acak hanya dibuat SAAT menambah item baru (di action), bukan di module scope.
 */

// Generator ID untuk item BARU (dipakai di action add*)
const genId = (p = "id") => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// Initial dummy data — ID statis
const INITIAL_STATE = {
  personal: {
    name: "John Doe",
    jobTitle: "Full Stack Developer",
    email: "john.doe@example.com",
    phone: "0812-3456-7890",
    address: "Jakarta, Indonesia",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev",
  },
  summary:
    "Full Stack Developer berpengalaman lebih dari 5 tahun dengan keahlian dalam React, Next.js, dan Node.js. Bersemangat dalam membangun aplikasi web yang scalable, berperforma tinggi, dan memberikan pengalaman pengguna yang luar biasa. Terbukti mampu memimpin proyek dari konsepsi hingga deployment.",
  experience: [
    {
      id: "exp-1",
      company: "PT Teknologi Maju",
      position: "Senior Frontend Developer",
      startDate: "Jan 2022",
      endDate: "Sekarang",
      description:
        "Memimpin pengembangan antarmuka pengguna untuk produk SaaS utama.\nMeningkatkan performa aplikasi sebesar 30%.",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Universitas Indonesia",
      degree: "S1 Ilmu Komputer",
      startDate: "2015",
      endDate: "2019",
      location: "Depok",
    },
  ],
  skills: ["React", "Next.js", "Node.js", "Express", "Firebase", "TypeScript", "Docker"],
  projects: [
    {
      id: "proj-1",
      name: "Website CV Builder (Proyek Ini)",
      link: "github.com/johndoe/cv-builder",
      description: "Membangun aplikasi web full-stack untuk membuat CV profesional...",
    },
  ],
  languages: [
    { id: "lang-1", name: "Indonesia", level: "Native" },
    { id: "lang-2", name: "Inggris", level: "Mahir" },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Google Project Management: Professional Certificate",
      issuer: "Coursera",
      date: "2023",
    },
  ],
  organizations: [
    {
      id: "org-1",
      name: "Himpunan Mahasiswa Teknik Informatika",
      position: "Ketua Divisi Web",
      startDate: "2017",
      endDate: "2018",
      description: "Mengelola website himpunan.",
    },
  ],
};

export const useCvStore = create((set) => ({
  cv: INITIAL_STATE,

  /* ======= Helpers ======= */
  // GANTI seluruh CV. Diasumsikan payload sudah valid.
  setCv: (next) =>
    set(() =>
      // direct set — hindari panggil fungsi yang bikin ID baru
      ({ cv: next })
    ),

  // Patch sebagian field di root cv (shallow merge)
  patchCv: (patch) =>
    set(
      produce((state) => {
        Object.assign(state.cv, patch);
      })
    ),

  // Patch personal.* spesifik
  patchPersonal: (field, value) =>
    set(
      produce((state) => {
        state.cv.personal[field] = value;
      })
    ),

  /* ======= Personal & Summary ======= */
  updatePersonalInfo: (field, value) =>
    set(
      produce((state) => {
        state.cv.personal[field] = value;
      })
    ),

  updateSummary: (summary) =>
    set(
      produce((state) => {
        state.cv.summary = summary;
      })
    ),

  /* ======= Experience ======= */
  addExperience: () =>
    set(
      produce((state) => {
        state.cv.experience.push({
          id: genId("exp"),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        });
      })
    ),

  removeExperience: (index) =>
    set(
      produce((state) => {
        if (index >= 0 && index < state.cv.experience.length) {
          state.cv.experience.splice(index, 1);
        }
      })
    ),

  updateExperience: (index, field, value) =>
    set(
      produce((state) => {
        if (!state.cv.experience[index]) return;
        state.cv.experience[index][field] = value;
      })
    ),

  /* ======= Education ======= */
  addEducation: () =>
    set(
      produce((state) => {
        state.cv.education.push({
          id: genId("edu"),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          location: "",
        });
      })
    ),

  removeEducation: (index) =>
    set(
      produce((state) => {
        if (index >= 0 && index < state.cv.education.length) {
          state.cv.education.splice(index, 1);
        }
      })
    ),

  updateEducation: (index, field, value) =>
    set(
      produce((state) => {
        if (!state.cv.education[index]) return;
        state.cv.education[index][field] = value;
      })
    ),

  /* ======= Skills ======= */
  addSkill: (skill) =>
    set(
      produce((state) => {
        if (skill && !state.cv.skills.includes(skill)) {
          state.cv.skills.push(skill);
        }
      })
    ),

  removeSkill: (index) =>
    set(
      produce((state) => {
        if (index >= 0 && index < state.cv.skills.length) {
          state.cv.skills.splice(index, 1);
        }
      })
    ),

  /* ======= Certifications ======= */
  addCertification: () =>
    set(
      produce((state) => {
        state.cv.certifications.push({
          id: genId("cert"),
          name: "",
          issuer: "",
          date: "",
        });
      })
    ),

  removeCertification: (index) =>
    set(
      produce((state) => {
        if (index >= 0 && index < state.cv.certifications.length) {
          state.cv.certifications.splice(index, 1);
        }
      })
    ),

  updateCertification: (index, field, value) =>
    set(
      produce((state) => {
        if (!state.cv.certifications[index]) return;
        state.cv.certifications[index][field] = value;
      })
    ),

  /* ======= Organizations ======= */
  addOrganization: () =>
    set(
      produce((state) => {
        state.cv.organizations.push({
          id: genId("org"),
          name: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        });
      })
    ),

  removeOrganization: (index) =>
    set(
      produce((state) => {
        if (index >= 0 && index < state.cv.organizations.length) {
          state.cv.organizations.splice(index, 1);
        }
      })
    ),

  updateOrganization: (index, field, value) =>
    set(
      produce((state) => {
        if (!state.cv.organizations[index]) return;
        state.cv.organizations[index][field] = value;
      })
    ),

  /* ======= Utilities ======= */
  resetCv: () => set({ cv: INITIAL_STATE }),
}));

export default useCvStore;
