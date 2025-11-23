// src/components/resume/templates/registry.js

// NOTE: Ini versi JS murni (tanpa TypeScript). Kalau nanti mau pakai TS, tinggal ubah ke .ts dan tambahkan "export type" sesuai kebutuhan.

/**
 * @typedef {Object} TemplateMetaLocal
 * @property {string|null=} id          // null jika belum ada row di DB
 * @property {string} slug              // harus sama dgn yang dipakai ResumeViewer
 * @property {"free"|"premium"} tier
 * @property {string} name
 * @property {boolean} supports_word
 * @property {number|null=} price_pdf   // IDR
 * @property {number|null=} price_word  // IDR
 */

/** @type {Record<string, TemplateMetaLocal>} */
export const TEMPLATE_REGISTRY = {
  "ats-free": {
    id: null,
    slug: "ats-free",
    name: "ATS Free",
    tier: "free",
    supports_word: false,
    price_pdf: 0,
    price_word: null,
  },
  "modern-pro": {
    id: null,
    slug: "modern-pro",
    name: "Modern Professional",
    tier: "premium",
    supports_word: true,
    price_pdf: 15000,
    price_word: 25000,
  },
  // Tambahkan template lain sesuai koleksi lokal lo:
  // "creative-designer": {
  //   id: null,
  //   slug: "creative-designer",
  //   name: "Creative Designer",
  //   tier: "premium",
  //   supports_word: true,
  //   price_pdf: 15000,
  //   price_word: 25000,
  // },
};

/**
 * Helper opsional kalau mau ambil meta via fungsi.
 * @param {string} slug
 * @returns {TemplateMetaLocal|null}
 */
export function getLocalTemplateMeta(slug) {
  return TEMPLATE_REGISTRY[slug] || null;
}
