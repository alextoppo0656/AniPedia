let lastSearchTimestamp = 0;

document.getElementById('searchInput').addEventListener('input', searchItems);

async function searchItems() {
    const searchInput = document.getElementById('searchInput');
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        resultsList.innerHTML = '';
        return;
    }

    // Increment the timestamp for each new search
    const currentTimestamp = Date.now();
    lastSearchTimestamp = currentTimestamp;

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}&timestamp=${currentTimestamp}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        console.log('Server response:', data);

        // Check if the response corresponds to the most recent search
        if (currentTimestamp === lastSearchTimestamp) {
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = item.Name; // Assuming "name" is a field in your CSV
                    resultsList.appendChild(listItem);

                    listItem.addEventListener('click', () => {
                        searchInput.value = item.Name;
                        resultsList.innerHTML = ''; // Clear the results list after selecting an item
                    });
                    listItem.style.color = 'white';
                });

                resultsList.style.maxHeight = '300px';
                resultsList.style.overflowY = 'auto';
            } else {
                console.error('Invalid data format:', data);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
