import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// 简单判断是否 http(s)
const isHttpUrl = (u) => /^https?:\/\//i.test(String(u || ''));

export async function openDocument(doc) {
    // doc: { source: 'url' | 'dataUrl' | 'base64', value: string, name?: string }
    try {
        if (!doc || !doc.value) throw new Error('invalid-doc');

        if (doc.source === 'url') {
            const raw = doc.value.trim();
            const url = encodeURI(raw); // 处理空格/中文
            if (!isHttpUrl(url)) throw new Error('not-http-url');
            await WebBrowser.openBrowserAsync(url);
            return;
        }

        // dataUrl 或 base64：写临时文件再打开 / 分享
        const base64 =
            doc.source === 'dataUrl'
                ? (doc.value.split(',')[1] || '')
                : doc.value;

        if (!base64) throw new Error('empty-base64');

        const safeName = String(doc.name || 'document').replace(/[^\w.\-]+/g, '_');
        const fileUri = `${FileSystem.cacheDirectory}${safeName}.pdf`;

        await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                UTI: 'com.adobe.pdf',
                mimeType: 'application/pdf',
            });
            return;
        }

        if (Platform.OS === 'android') {
            const contentUri = await FileSystem.getContentUriAsync(fileUri);
            await WebBrowser.openBrowserAsync(contentUri);
        } else {
            await WebBrowser.openBrowserAsync(fileUri);
        }
    } catch (e) {
        console.error('Error opening PDF:', e);
        Alert.alert('Error', 'Failed to open document.');
    }
}
