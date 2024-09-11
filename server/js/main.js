document.addEventListener('DOMContentLoaded', () => {
    const actionsContainer = document.getElementById('actions-container');

    async function fetchActions() {
        try {
            const response = await fetch('https://gamesggge.ru:1445/actions');
            if (!response.ok) {
                throw new Error('что то не так с инетом');
            }
            const data = await response.json();
            displayActions(data.data);
        } catch (error) {
            console.error('не удалось загрузить данные:', error);
            actionsContainer.innerHTML = `<p>Ошибка загрузки данных.</p>`;
        }
    }

    function displayActions(actions) {
        if (actions.length === 0) {
            actionsContainer.innerHTML = '<p>Нет данных для отображения.</p>';
            return;
        }

        actionsContainer.innerHTML = actions.map(action => `
            <div class="action-item">
                <p><strong>ID:</strong> ${action.id}</p>
                <p><strong>Type:</strong> ${action.action_type}</p>
                <p><strong>Product ID:</strong> ${action.product_id}</p>
                <p><strong>Details:</strong> ${JSON.stringify(action.details)}</p>
            </div>
        `).join('');
    }

    fetchActions();
});
