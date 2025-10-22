import axiosApi from './axios';

// Keep baseURL consistent with global axios instance (strip trailing slash)
const BASE_URL = (axiosApi?.defaults?.baseURL || '').replace(/\/+$/, '');
if (!BASE_URL) {
    console.warn('[appointments] axiosApi.defaults.baseURL is not set, RAW links cannot be built');
}

/** -------------------- Basic queries -------------------- **/

// Get appointments by NHI
export async function getAppointmentsByNHI(nhi, params = {}) {
    const res = await axiosApi.get(`/Appointments/${encodeURIComponent(nhi)}`, {
        params: { limit: 100, ...params },
    });
    return res.data;
}

// Get a single appointment by ID
export async function getAppointmentById(appointmentId) {
    const res = await axiosApi.get(`/Appointments/byId/${appointmentId}`);
    return res.data;
}

/** -------------------- Images -------------------- **/

// Return images as base64 strings
export async function fetchAppointmentImages(appointmentId) {
    // This endpoint returns JSON, axios is safer here
    const { data } = await axiosApi.get(`/Appointments/${appointmentId}/images`);
    const list = Array.isArray(data?.images) ? data.images : [];
    return list.map(i => i?.base64 || i?.data || i?.content || ''); // support multiple field names
}

// Build direct RAW URLs for each image
export async function buildAppointmentImageRawUrls(appointmentId, count) {
    if (typeof count !== 'number') {
        const list = await fetchAppointmentImages(appointmentId);
        count = list.length;
    }
    if (!BASE_URL) throw new Error('BASE_URL not set, cannot build image RAW links');
    return Array.from({ length: count }, (_, idx) =>
        `${BASE_URL}/Appointments/${appointmentId}/images/${idx}/raw`
    );
}

/** -------------------- PDFs -------------------- **/

// Get PDF count from backend
export async function fetchAppointmentPDFCount(appointmentId) {
    const res = await axiosApi.get(`/Appointments/${appointmentId}/pdfs`);
    return res.data?.count ?? 0;
}

// Build direct RAW URLs for PDFs
export function buildAppointmentPdfRawUrls(appointmentId, count) {
    if (typeof count !== 'number') {
        throw new Error('buildAppointmentPdfRawUrls requires count');
    }
    if (!BASE_URL) throw new Error('BASE_URL not set, cannot build PDF RAW links');
    return Array.from({ length: count }, (_, idx) =>
        `${BASE_URL}/Appointments/${appointmentId}/pdfs/${idx}/raw`
    );
}

// Fetch PDFs as base64 (fallback when embedding inline)
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
    return arr;
}

/** -------------------- Aggregated helpers -------------------- **/

// Prefer the backend /assets endpoint; fallback to legacy logic if unavailable
export async function fetchAssetsForAppointment(appointmentId) {
    try {
        const res = await axiosApi.get(`/Appointments/${appointmentId}/assets`);
        const data = res.data || {};
        return {
            imagesBase64: Array.isArray(data.imagesBase64) ? data.imagesBase64 : [],
            pdfUrls: Array.isArray(data.pdfUrls) ? data.pdfUrls : [],
            pdfItems: Array.isArray(data.pdfItems) ? data.pdfItems : [],
            pdfCount: typeof data.count === 'number' ? data.count : (data.pdfUrls?.length || 0),
        };
    } catch (e) {
        console.warn('[assets] fallback to legacy logic:', appointmentId, e?.message || e);
        const [images, pdfCount] = await Promise.all([
            fetchAppointmentImages(appointmentId),
            fetchAppointmentPDFCount(appointmentId),
        ]);
        const pdfUrls = buildAppointmentPdfRawUrls(appointmentId, pdfCount);
        return { imagesBase64: images, pdfUrls, pdfItems: [], pdfCount };
    }
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
