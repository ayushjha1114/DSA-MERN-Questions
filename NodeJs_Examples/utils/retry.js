let attempt = 0;

export async function fetchApiFn() {
    attempt++;
     console.log(`Attempt #${attempt}`);

    if(attempt < 4) {
        console.warn("🚀 ~ Api fetch failed")
        throw new Error('Api fetch failed')
    }

    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      console.log("Success on attempt", attempt);
    return response.json();
}


export async function retry(fetchApiFn, retries, delay) {
    try {
        return await fetchApiFn();
    } catch (error) {
        if (retries <= 0) {
            throw error;
        }
        console.log(`Retrying.... attempt left ${retries}`);
        await  new Promise((resolve) => setTimeout(resolve, delay));
        return retry(fetchApiFn, retries -1, delay)
    }
}


