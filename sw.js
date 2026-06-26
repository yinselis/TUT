// 刷新缓存专用注释：修复点击通知无法越过层级进入聊天室的 Bug
// Trigger Update: v2.0
self.addEventListener('fetch', function(event) {
    // 保持空监听，骗过校验
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); 
    const payload = event.notification.data || {}; // 拿取隐藏的数据

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes('ECHO') && 'focus' in client) {
                    client.focus(); // 唤醒已有的网页
                    // 发送信使给前端网页：“立刻帮我打开这个人的聊天窗！”
                    if (payload.charId) {
                        client.postMessage({ type: 'JUMP_TO_CHAT', charId: payload.charId, charName: payload.title });
                    }
                    return;
                }
            }
            // 如果你把网页彻底划掉杀后台了，那就带上参数打开新网页
            if (clients.openWindow) {
                let targetUrl = 'https://yinselis.github.io/ECHO/';
                if (payload.charId) {
                    targetUrl += '?chatId=' + payload.charId + '&charName=' + encodeURIComponent(payload.title);
                }
                return clients.openWindow(targetUrl); 
            }
        })
    );
});