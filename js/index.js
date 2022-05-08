const SPREADSHEET_ID = "1qA6bdIiZSv09FA5qgXhq0nRj_PeTWgp0ufYFmWqeDfM";
const GOOGLE_CLOUD_API_KEY = "AIzaSyC6lEYx6meglfkrIRHxixxRuYwk9UGtAzM";
            
function fetch_collections() {
    show_collections_loading_spinner();
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "?key=" + GOOGLE_CLOUD_API_KEY + "&includeGridData=true")
        .then(response => response.json())
        .then(result => {
            let collections = [];
            let books = {};
            const spreadsheet = result;
            spreadsheet.sheets.forEach(function (sheet) {
                if (sheet.properties.title === "collections") {
                    sheet.data.forEach(function (gridData) {
                        gridData.rowData.forEach(function (row, index) {
                            if (index < 1) { // header in spreadsheet
                                return;
                            }
                            try {
                                const id = row.values[0].formattedValue ? row.values[0].formattedValue : "";
                                const name = row.values[1].formattedValue ? row.values[1].formattedValue : "";
                                let books = row.values[2].formattedValue ? row.values[2].formattedValue : "";
                                books = books.replaceAll(' ', '');
                                books = books.split(",");
                                if (id === "") {
                                    return;
                                }
                                collections.push({ id: id, name: name, books: books });
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    });
                } else if (sheet.properties.title === "books") {
                    sheet.data.forEach(function (gridData) {
                        gridData.rowData.forEach(function (row, index) {
                            if (index < 1) { // header in spreadsheet
                                return;
                            }
                            try {
                                const id = row.values[0].formattedValue ? row.values[0].formattedValue : "";
                                const title = row.values[1].formattedValue ? row.values[1].formattedValue : "";
                                const author = row.values[2].formattedValue ? row.values[2].formattedValue : "";
                                const genre = row.values[3].formattedValue ? row.values[3].formattedValue : "";
                                const available = row.values[4].formattedValue ? row.values[4].formattedValue : "";
                                const available_date = row.values[5].formattedValue ? row.values[5].formattedValue : "";
                                const description = row.values[6].formattedValue ? row.values[6].formattedValue : "";
                                const thumbnail_url = row.values[7].formattedValue ? row.values[7].formattedValue : "";
                                if (id === "") {
                                    return;
                                }
                                books[id] = { id: id, title: title, author: author, genre: genre, available: available, available_date: available_date, description: description, thumbnail_url: thumbnail_url };
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    });
                }
            });
            return { collections: collections, books: books };
        })
        .then(collections_data => on_collections_fetched(collections_data))
        .finally(() => {
            hide_collections_loading_spinner();
        });
}

function show_collections_loading_spinner() {
}

function hide_collections_loading_spinner() {
}

function add_collection(collection, books, collections_ctr) {
    const article = document.createElement("article");
    collections_ctr.appendChild(article);

    article.innerHTML = '<p><b>' + collection.name + '</b></p><div class="collection-thumbs"></div>';
    article.classList.add("collection");

    const all_collection_thumbs = document.getElementsByClassName("collection-thumbs");
    const collection_thumbs = all_collection_thumbs[all_collection_thumbs.length - 1];
    collection.books.forEach(book => {
        add_collection_item(book, books, collection_thumbs);
    });
}

function add_collection_item(book, books, item_ctr) {
    if (!book in books) {
        console.log(`Unable to find book ${book} in books.`);
        return;
    }
    const collection_thumb = document.createElement("a");
    collection_thumb.setAttribute("href", books[book].thumbnail_url);
    collection_thumb.innerHTML = `<img class="collection-thumb" src="${books[book].thumbnail_url}">`;

    item_ctr.appendChild(collection_thumb);
}

function on_collections_fetched(collections_data) {
    console.log(collections_data);
    const collections_ctr = document.getElementsByClassName('collections-ctr')[0];
    collections_data.collections.forEach(collection => add_collection(collection, collections_data.books, collections_ctr));
}

function on_page_load() {
    fetch_collections();
}

window.onload = on_page_load;