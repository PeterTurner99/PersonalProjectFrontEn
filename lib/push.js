const PUSH_URL = "/api/push/"

export async function send_notification(message, title) {
    
    const data = {
        'body': message,
        'title': title,
        'url': window.location.href
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };

    fetch(`${PUSH_URL}/current/`, requestOptions)
}