import axiosApi from './axios';
// Allow override from env; otherwise fall back to axios default or localhost
const API_URL = process.env.API_BASE_URL || (axiosApi?.defaults?.baseURL ?? 'http://localhost:3000');

/** -------------------- Basic queries - -------------------- **/

// Get appointments by NHI
export async function getAppointmentsByNHI(nhi, params = {}) {
    const res = await axiosApi.get(`/Appointments/${encodeURIComponent(nhi)}`, {
        params: { limit: 100, ...params },
    });
    return res.data; // 由后端决定结构
}

// Get a single appointment by id
export async function getAppointmentById(appointmentId) {
    const res = await axiosApi.get(`/Appointments/byId/${appointmentId}`);
    return res.data;
}

/** -------------------- Images (X-ray, etc.) -------------------- **/

// Return an array of base64 strings (compatible with <AppointmentImage base64="..." />)
export async function fetchAppointmentImages(appointmentId) {
    const url = `${API_URL}/Appointments/${appointmentId}/images`;
    const res = await fetch(url); // 用 fetch 避免 axios 把 base64 当 JSON 再处理
    if (!res.ok) throw new Error('Fetch images failed');
    const json = await res.json(); // { images: [{ contentType, base64 }, ...] }
    return (json.images || []).map(i => i.base64);
}

// If you prefer "direct links" (skip base64 to save bandwidth): return RAW URLs for each image
export async function buildAppointmentImageRawUrls(appointmentId, count) {
    // If count is not provided, call the base64 API to infer length (costs one extra request)
    if (typeof count !== 'number') {
        const list = await fetchAppointmentImages(appointmentId);
        count = list.length;
    }
    return Array.from({ length: count }, (_, idx) => `${API_URL}/Appointments/${appointmentId}/images/${idx}/raw`);
}

/** -------------------- PDF（invoice / referral） -------------------- **/

// Fetch only the PDF count (backend /pdfs returns { count })
export async function fetchAppointmentPDFCount(appointmentId) {
    const res = await axiosApi.get(`/Appointments/${appointmentId}/pdfs`);
    return res.data?.count ?? 0;
}

// Build direct RAW URLs for each PDF (use with WebBrowser.openBrowserAsync)
export function buildAppointmentPdfRawUrls(appointmentId, count) {
    if (typeof count !== 'number') {
        throw new Error('buildAppointmentPdfRawUrls requires a count when used sync');
    }
    return Array.from({ length: count }, (_, idx) =>
        `${API_URL}/Appointments/${appointmentId}/pdfs/${idx}/raw`);
}

// If you must embed base64 (e.g., <AppointmentPDF base64="...">): convert RAW to base64
export async function fetchAppointmentPDFBase64s(appointmentId) {
    const count = await fetchAppointmentPDFCount(appointmentId);
    const urls = buildAppointmentPdfRawUrls(appointmentId, count);


    const { Buffer } = require('buffer');

    const arr = [];
    for (const url of urls) {
        const r = await fetch(url);
        if (!r.ok) continue;
        const ab = await r.arrayBuffer();
        const b64 = Buffer.from(ab).toString('base64');
        arr.push(b64);
    }
    return arr; // ['JVBERi0xLjQKJc...', ...]
}

/** -------------------- Aggregated helpers (for Profile screens) --------------------------- **/

// Fetch all images (base64) and PDF direct links for a single appointment
export async function fetchAssetsForAppointment(appointmentId) {
    const [images, pdfCount] = await Promise.all([
        fetchAppointmentImages(appointmentId),           // array of base64 strings
        fetchAppointmentPDFCount(appointmentId),         // count
    ]);
    const pdfUrls = buildAppointmentPdfRawUrls(appointmentId, pdfCount);
    return { imagesBase64: images, pdfUrls, pdfCount };
}

export default {
    getAppointmentsByNHI,
    getAppointmentById,
    fetchAppointmentImages,
    buildAppointmentImageRawUrls,
    fetchAppointmentPDFCount,
    buildAppointmentPdfRawUrls,
    fetchAppointmentPDFBase64s,
    fetchAssetsForAppointment,
};
