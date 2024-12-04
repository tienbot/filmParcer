document.getElementById('parseButton').addEventListener('click', () => {
    let inputId = document.getElementById('inputId').value.trim();

    // Проверяем, если введена ссылка
    const urlPattern = /^https:\/\/www\.kinopoisk\.ru\/film\/(\d+)\/$/;
    const match = inputId.match(urlPattern);

    if (match) {
        // Если это ссылка, извлекаем ID
        inputId = match[1];
    }

    if (!inputId) {
        alert("Введите ID или ссылку перед обработкой!");
        return;
    }

    const nominatedYear = document.getElementById('nominatedYear').value.trim();

    if (!nominatedYear) {
        alert("Введите год номинации!");
        return;
    }

    const inputText = document.getElementById('inputText').value;
    const lines = inputText.split('\n');
    const result = {};

    // Функции для обработки текста
    const findLineValue = (key) => {
        const index = lines.findIndex(line => line.trim().toLowerCase() === key.toLowerCase());
        return index !== -1 && index + 1 < lines.length ? lines[index + 1].trim() : '';
    };

    // Данные из ID
    result.kinopoiskId = parseInt(inputId);
    const nameRuLine = lines[0].trim();
    result.nameRu = nameRuLine.replace(/\s*\(\d{4}\)$/, ""); // Убираем год в скобках
    const nameOriginalLine = lines[1].trim();
    result.nameOriginal = nameOriginalLine.replace(/\s*(16\+|18\+)$/, "");
    result.posterUrl = `https://kinopoiskapiunofficial.tech/images/posters/kp/${inputId}.jpg`;
    result.posterUrlPreview = `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${inputId}.jpg`;
    result.year = parseInt(findLineValue('Год производства'));
    result.nominatedYear = parseInt(nominatedYear); // Используем введенный год

    // Остальная обработка (как в вашем коде)
    const countries = findLineValue('Страна').split(',').map(country => ({ country: country.trim() }));
    result.countries = countries;

    const genres = findLineValue('Жанр').split(',').map(genre => ({ genre: genre.trim() }));
    result.genres = genres;

    result.filmLength = findLineValue('Время');
    result.description = lines.slice(lines.findIndex(line => line.startsWith('Гуляя'))).join(' ').trim();
    result.video = `https://www.kinopoisk.ru/film/${inputId}/`;
    result.webUrl = `https://www.kinopoisk.ru/film/${inputId}/`;

    // Форматирование результата
    const formattedResult = JSON.stringify(result, null, 4); // Используем стандартный JSON.stringify

    document.getElementById('output').textContent = formattedResult + ',';
    document.getElementById('copyButton').style.display = 'inline-block';

    // Обработчик для кнопки "Скопировать"
    document.getElementById('copyButton').addEventListener('click', () => {
        const outputText = document.getElementById('output').textContent;
        navigator.clipboard.writeText(outputText).then(() => {
            console.log('Copy!');
        }).catch(err => {
            alert("Ошибка при копировании текста: " + err);
        });
    });
});