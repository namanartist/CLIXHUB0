// Push Notification Service
// Handles browser push notifications and in-app alerts

export interface PushNotificationOptions {
    title: string;
    options?: NotificationOptions;
}

export class PushNotificationService {
    private static instance: PushNotificationService;

    private constructor() { }

    static getInstance(): PushNotificationService {
        if (!this.instance) {
            this.instance = new PushNotificationService();
        }
        return this.instance;
    }

    /**
     * Request permission for push notifications
     */
    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notifications');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return 'denied';
    }

    /**
     * Show a push notification
     */
    async showNotification(title: string, options?: NotificationOptions): Promise<void> {
        const permission = await this.requestPermission();

        if (permission === 'granted') {
            if ('serviceWorker' in navigator) {
                // Use Service Worker if available
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification(title, {
                    icon: '/image.png',
                    badge: '/image.png',
                    ...options
                });
            } else {
                // Fallback to standard Notification API
                new Notification(title, {
                    icon: '/image.png',
                    ...options
                });
            }
        }
    }

    /**
     * Show a message notification
     */
    async notifyMessage(senderName: string, messagePreview: string, clickHandler?: () => void): Promise<void> {
        const options: any = {
            body: messagePreview.substring(0, 100),
            tag: `chat-${senderName}`,
            requireInteraction: true,
            actions: [
                {
                    action: 'open',
                    title: 'Open'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };

        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(`Message from ${senderName}`, options);

            if (clickHandler) {
                // Store the clickHandler for later use by service worker
                sessionStorage.setItem(`notif-click-${senderName}`, 'true');
            }
        }
    }

    /**
     * Show an announcement notification
     */
    async notifyAnnouncement(title: string, body: string, clickHandler?: () => void): Promise<void> {
        const options: NotificationOptions = {
            body,
            tag: 'announcement',
            requireInteraction: true,
            badge: '/image.png'
        };

        await this.showNotification(title, options);
    }

    /**
     * Show an alert for system events
     */
    async notifyEvent(eventName: string, details: string): Promise<void> {
        const options: NotificationOptions = {
            body: details,
            tag: `event-${eventName}`,
            requireInteraction: false
        };

        await this.showNotification(`Event: ${eventName}`, options);
    }

    /**
     * Check if notifications are enabled
     */
    isNotificationEnabled(): boolean {
        return 'Notification' in window && Notification.permission === 'granted';
    }

    /**
     * Get current permission status
     */
    getPermissionStatus(): NotificationPermission {
        if (!('Notification' in window)) {
            return 'denied';
        }
        return Notification.permission;
    }
}

export const pushNotificationService = PushNotificationService.getInstance();
