
export function getAuthToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken
}

export function saveAuthToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
    return true;
}

export function removeAuthToken() {
    localStorage.removeItem('token');
    return true;
}