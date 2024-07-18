function setLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

function removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
}

function clearLocalStorage(): void {
    localStorage.clear();
}