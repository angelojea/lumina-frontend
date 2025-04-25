export function signedInUser() {
    const storageItem = localStorage.getItem("logged-in");
    return storageItem ? JSON.parse(localStorage.getItem("logged-in") || "{}") : undefined;
}

export function signIn() {
    localStorage.setItem("logged-in", "true")
}

export function signOut() {
    localStorage.removeItem("logged-in")
}