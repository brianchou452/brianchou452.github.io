type Cleanup = () => void;

type CleanupWindow = Window & Record<string, Cleanup | undefined>;

export function createScriptLifecycle(cleanupKey: string) {
    const targetWindow = window as unknown as CleanupWindow;
    targetWindow[cleanupKey]?.();

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const disposers: Cleanup[] = [];
    let destroyed = false;

    const schedule = (callback: Cleanup, delay: number) => {
        const timer = setTimeout(() => {
            timers.delete(timer);

            if (!destroyed) {
                callback();
            }
        }, delay);

        timers.add(timer);
    };

    const addDisposer = (cleanup: Cleanup) => {
        disposers.push(cleanup);
    };

    const destroy = () => {
        if (destroyed) {
            return;
        }

        destroyed = true;
        timers.forEach(clearTimeout);
        timers.clear();

        while (disposers.length > 0) {
            disposers.pop()?.();
        }

        delete targetWindow[cleanupKey];
    };

    targetWindow[cleanupKey] = destroy;

    return {
        addDisposer,
        destroy,
        isDestroyed: () => destroyed,
        schedule,
    };
}