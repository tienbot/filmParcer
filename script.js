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

    const inputText = document.getElementById('inputText').value;
    const lines = inputText.split('\n');
    const result = {};

    // Данные из ID
    result.kinopoiskId = parseInt(inputId);
    const nameRuLine = lines[0].trim();
    result.nameRu = nameRuLine.replace(/\s*\(\d{4}\)$/, ""); // Убираем год в скобках
    const nameOriginalLine = lines[1].trim();
    result.nameOriginal = nameOriginalLine.replace(/\s*(16\+|18\+)$/, "");
    result.posterUrl = `https://kinopoiskapiunofficial.tech/images/posters/kp/${inputId}.jpg`;
    result.posterUrlPreview = `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${inputId}.jpg`;
    result.webUrl = `https://www.kinopoisk.ru/film/${inputId}/`;

    // Функции для обработки текста
    const findLineValue = (key) => {
        const index = lines.findIndex(line => line.trim().toLowerCase() === key.toLowerCase());
        return index !== -1 && index + 1 < lines.length ? lines[index + 1].trim() : '';
    };

    const findMultiLineValue = (startKey) => {
        const index = lines.findIndex(line => line.trim().toLowerCase() === startKey.toLowerCase());
        const values = [];
        for (let i = index + 1; i < lines.length && lines[i].trim(); i++) {
            values.push(lines[i].trim());
        }
        return values;
    };

    // Добавляем данные в результат
    result.year = parseInt(findLineValue('Год производства'));
    result.filmLength = findLineValue('Время');
    result.description = lines.slice(lines.findIndex(line => line.startsWith('Гуляя'))).join(' ').trim();

    // Рейтинг MPAA и возрастные ограничения
    const ratingMpaaLine = findLineValue('Рейтинг MPAA'); // ищем строку с рейтингом
    if (ratingMpaaLine) {
        result.ratingMpaa = ratingMpaaLine.toLowerCase(); // сохраняем рейтинг в формате строки (например, 'r')
    }

    const ageLimitLine = findLineValue('Возраст'); // ищем строку с возрастным ограничением
    if (ageLimitLine) {
        result.ratingAgeLimits = `age${ageLimitLine.replace('+', '')}`; // Преобразуем "18+" в "age18"
    }

    // Страны
    const countries = findLineValue('Страна').split(',').map(country => ({ country: country.trim() }));
    result.countries = countries;

    // Жанры
    const genres = findLineValue('Жанр').split(',').map(genre => ({ genre: genre.trim() }));
    result.genres = genres;

    // Режиссер, сценарий и прочие данные
    const directorLine = findLineValue('Режиссер');
    result.director = directorLine.split(',').map(director => director.trim());
    const scenarioLine = findLineValue('Сценарий');
    result.scenario = scenarioLine.split(',').map(scenario => scenario.trim());
    const producerLine = findLineValue('Продюсер');
    result.producer = producerLine.split(',').map(producer => producer.trim());
    const operatorLine = findLineValue('Оператор');
    result.operator = operatorLine.split(',').map(operator => operator.trim());
    const composerLine = findLineValue('Композитор');
    result.composer = composerLine.split(',').map(composer => composer.trim());
    const artistLine = findLineValue('Художник');
    result.artist = artistLine.split(',').map(artist => artist.trim());
    const installationLine = findLineValue('Монтаж');
    result.installation = installationLine.split(',').map(installation => installation.trim());
    result.worldPremiere = findLineValue('Премьера в мире').split(',')[0];
    result.video = '';

    // Обработка номинаций
    const nominations = [];
    const nominationOptions = [
        { id: 'isWinBestFilm', name: 'Лучший фильм' },
        { id: 'isWinOriginalScript', name: 'Лучший сценарий' },
        { id: 'isWinAdaptedScreenplay', name: 'Лучший адаптированный сценарий' },
        { id: 'isWinShortAnimatedFilm', name: 'Лучший короткометражный анимационный фильм' },
        { id: 'isWinShortFeatureFilm', name: 'Лучший короткометражный игровой фильм' },
        { id: 'isWinShortDocumentaryFilm', name: 'Лучший короткометражный документальный фильм' },
        { id: 'isWinBestDocumentary', name: 'Лучший документальный фильм' },
        { id: 'isWinForeignLanguageFilm', name: 'Лучший фильм на иностранном языке' },
        { id: 'isWinBestAnimatedFilm', name: 'Лучший анимационный фильм' },
    ];

    nominationOptions.forEach(option => {
        const checkbox = document.getElementById(option.id);
        if (checkbox.checked) {
            const nomination = {
                name: option.name,
                [option.id]: false, // Флаг по умолчанию
            };
            nominations.push(nomination);
        }
    });

    if (nominations.length > 0) {
        result.nomination = nominations;
    }

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