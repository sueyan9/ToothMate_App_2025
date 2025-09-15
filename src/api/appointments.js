import axiosApi from './axios';
// 允许从环境变量覆盖
const API_URL = process.env.API_BASE_URL || (axiosApi?.defaults?.baseURL ?? 'http://localhost:3000');

/** -------------------- 基础查询 -------------------- **/

// 按 NHI 获取预约列表
export async function getAppointmentsByNHI(nhi, params = {}) {
    const res = await axiosApi.get(`/Appointments/${encodeURIComponent(nhi)}`, {
        params: { limit: 100, ...params },
    });
    return res.data; // 由后端决定结构
}

// 按 id 获取单个预约
export async function getAppointmentById(appointmentId) {
    const res = await axiosApi.get(`/Appointments/byId/${appointmentId}`);
    return res.data;
}

/** -------------------- 图像（X-ray 等） -------------------- **/

// 返回 base64 数组（兼容你现有 <AppointmentImage base64="..." />）
export async function fetchAppointmentImages(appointmentId) {
    const url = `${API_URL}/Appointments/${appointmentId}/images`;
    const res = await fetch(url); // 用 fetch 避免 axios 把 base64 当 JSON 再处理
    if (!res.ok) throw new Error('Fetch images failed');
    const json = await res.json(); // { images: [{ contentType, base64 }, ...] }
    return (json.images || []).map(i => i.base64);
}

// 如果你想用“直链”方式（不走 base64，节省流量）：返回每张图的 RAW URL
export async function buildAppointmentImageRawUrls(appointmentId, count) {
    // 如果没有 count，就先用 base64 接口拿长度（会多一次请求）
    if (typeof count !== 'number') {
        const list = await fetchAppointmentImages(appointmentId);
        count = list.length;
    }
    return Array.from({ length: count }, (_, idx) => `${API_URL}/Appointments/${appointmentId}/images/${idx}/raw`);
}

/** -------------------- PDF（invoice / referral） -------------------- **/

// 只取 PDF 数量（后端 /pdfs 返回 { count }）
export async function fetchAppointmentPDFCount(appointmentId) {
    const res = await axiosApi.get(`/Appointments/${appointmentId}/pdfs`);
    return res.data?.count ?? 0;
}

// 返回每个 PDF 的原始直链（推荐用 WebBrowser.openBrowserAsync 打开）
export function buildAppointmentPdfRawUrls(appointmentId, count) {
    if (typeof count !== 'number') {
        throw new Error('buildAppointmentPdfRawUrls requires a count when used sync');
    }
    return Array.from({ length: count }, (_, idx) =>
        `${API_URL}/Appointments/${appointmentId}/pdfs/${idx}/raw`);
}

// 如果必须 base64（例如你用 <AppointmentPDF base64="...">）：把直链转 base64
export async function fetchAppointmentPDFBase64s(appointmentId) {
    const count = await fetchAppointmentPDFCount(appointmentId);
    const urls = buildAppointmentPdfRawUrls(appointmentId, count);

    // React Native 环境下可用 Buffer
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

/** -------------------- 聚合便捷函数（给 Profile 页面用） -------------------- **/

// 一次把该预约的图像与 PDF 直链都取好
export async function fetchAssetsForAppointment(appointmentId) {
    const [images, pdfCount] = await Promise.all([
        fetchAppointmentImages(appointmentId),           // base64 数组
        fetchAppointmentPDFCount(appointmentId),         // 数量
    ]);
    const pdfUrls = buildAppointmentPdfRawUrls(appointmentId, pdfCount); // 直链数组
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
