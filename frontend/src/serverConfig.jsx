// src/config/serverConfig.js

let configPromise = null;

// 한 번만 가져오고, 이후에는 캐시된 값 재사용함
export function loadServerConfig() {
    if (!configPromise) {
        configPromise = fetch("/serverinfo.json").then((res) => {
            if (!res.ok) {
                throw new Error("Failed to load serverinfo.json");
            }
            return res.json();
        });
    }
    return configPromise;
}
