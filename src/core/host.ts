export function sendToHost(message: any) {
    if ((window as any).chrome?.webview)
        (window as any).chrome.webview.postMessage(message);
    else
        console.error("WebView2 is not available. The application is not running inside a WebView2 host.", message);
}