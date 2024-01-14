export default class LoadSort {
  constructor(jsonString) {
    this.data = JSON.parse(jsonString);
    this.sortIndex = 0; // указывает по какому столбцу идет сортировка
    this.ascending = true; // флаг, указывающий на направление сортировки
  }

  init() {
    const tagBody = document.querySelector("body");
    const container = document.createElement("div");
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    // Формируем заголовки
    for (const key in this.data[0]) {
      const headerCell = document.createElement("th");

      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    }

    table.appendChild(headerRow);

    // Наполняем таблицу
    this.data.forEach((el) => {
      const filmRow = document.createElement("tr");

      filmRow.dataset.id = el["id"];
      filmRow.dataset.title = el["title"];
      filmRow.dataset.year = el["year"];
      filmRow.dataset.imdb = el["imdb"].toFixed(2);

      for (const key in el) {
        const cell = document.createElement("td");

        if (key === "year") {
          cell.textContent = `(${el[key]})`;
        } else if (key === "imdb") {
          cell.textContent = el[key].toFixed(2);
        } else {
          cell.textContent = el[key];
        }

        filmRow.appendChild(cell);
      }

      table.appendChild(filmRow);
    });

    container.appendChild(table);
    tagBody.appendChild(container);

    // Запускаем поочередную сортировку
    setInterval(() => {
      if (this.sortIndex >= 4) {
        this.sortIndex = 0;
      }

      this.sortEl(this.sortIndex);

      this.ascending = !this.ascending;

      if (this.ascending) {
        this.sortIndex++;
      }
    }, 2000);
  }

  sortEl(index) {
    const tableBody = document.querySelector("table");
    const rows = Array.from(tableBody.querySelectorAll("tr")).slice(1);
    const domIds = rows.map((row) => row.dataset.id);

    // Отсортированный массив идентификаторов элементов
    const sortedIds = rows
      .sort((a, b) => {
        if (index === 0) {
          // Код сортировки по id
          const idA = parseInt(a.dataset.id);
          const idB = parseInt(b.dataset.id);
          if (this.ascending) {
            return idA - idB; // сортировка по возрастанию
          } else {
            return idB - idA; // сортировка по убыванию
          }
        } else if (index === 1) {
          // Код сортировки по title (по алфавиту)
          const titleA = a.dataset.title.toLowerCase();
          const titleB = b.dataset.title.toLowerCase();
          if (this.ascending) {
            return titleA.localeCompare(titleB); // сортировка по возрастанию
          } else {
            return titleB.localeCompare(titleA); // сортировка по убыванию
          }
        } else if (index === 2) {
          // Код сортировки по imdb
          const imdbA = parseFloat(a.dataset.imdb);
          const imdbB = parseFloat(b.dataset.imdb);
          if (this.ascending) {
            return imdbA - imdbB; // сортировка по возрастанию
          } else {
            return imdbB - imdbA; // сортировка по убыванию
          }
        } else if (index === 3) {
          // Код сортировки по year
          const yearA = parseInt(a.dataset.year);
          const yearB = parseInt(b.dataset.year);
          if (this.ascending) {
            return yearA - yearB; // сортировка по возрастанию
          } else {
            return yearB - yearA; // сортировка по убыванию
          }
        } else {
          return 0;
        }
      })
      .map((row) => row.dataset.id);

    // Находим различия между двумя массивами
    const diff = sortedIds.filter((id) => !domIds.includes(id));

    // Перемещаем каждый отличающийся элемент в DOM-дереве
    diff.forEach((id) => {
      // Находим текущий индекс элемента в DOM-дереве
      const currentIndex = domIds.indexOf(id);

      // Находим новый индекс элемента в отсортированном массиве идентификаторов
      const newIndex = sortedIds.indexOf(id);

      // Перемещаем элемент в новую позицию в DOM-дереве
      tableBody.insertBefore(rows[currentIndex], rows[newIndex]);
    });

    let arrow; // для хранения элемента-стрелки

    // Удаляем все стрелки из заголовков таблицы
    const headers = tableBody.querySelectorAll("th");

    headers.forEach((header) => {
      const existingArrow = header.querySelector(".arrow");
      if (existingArrow) {
        header.removeChild(existingArrow);
      }
    });

    // Создаем новый элемент-стрелку и добавляем его в заголовок таблицы, соответствующий выбранному столбцу
    const header = headers[index];

    arrow = document.createElement("span");
    arrow.classList.add("arrow");
    header.appendChild(arrow);

    rows.forEach((row) => tableBody.appendChild(row));

    // Меняем направление стрелки в зависимости от флага 'ascending'
    if (this.ascending) {
      arrow.classList.remove("down");
      arrow.classList.add("up");
    } else {
      arrow.classList.remove("up");
      arrow.classList.add("down");
    }
  }
}

// NOTE: метод без реализации diff между положением элементов в DOM-дереве и в отсортированном вами массиве, если положение отличается, то должна быть произведено перемещение элемента в DOM-дереве (а не пересобирайте всё DOM-дерево)
// sortEl(index) {
//   const tableBody = document.querySelector("table");
//   const rows = Array.from(tableBody.querySelectorAll("tr")).slice(1);
//   let arrow;

//   const headers = tableBody.querySelectorAll("th");
//   headers.forEach((header) => {
//     const existingArrow = header.querySelector(".arrow");
//     if (existingArrow) {
//       header.removeChild(existingArrow);
//     }
//   });

//   const header = headers[index];
//   arrow = document.createElement("span");
//   arrow.classList.add("arrow");
//   header.appendChild(arrow);

//   rows.sort((a, b) => {
//     if (index === 0) {
//       const idA = parseInt(a.dataset.id);
//       const idB = parseInt(b.dataset.id);

//       if (this.ascending) {
//         // сортировка по возрастанию
//         return idA - idB;
//       } else {
//         // сортировка по убыванию
//         return idB - idA;
//       }
//     } else if (index === 1) {
//       // сортировка по алфавиту
//       const titleA = a.dataset.title.toLowerCase();
//       const titleB = b.dataset.title.toLowerCase();

//       if (this.ascending) {
//         // сортировка по возрастанию
//         return titleA.localeCompare(titleB);
//       } else {
//         // сортировка по убыванию
//         return titleB.localeCompare(titleA);
//       }
//     } else if (index === 2) {
//       const imdbA = parseFloat(a.dataset.imdb);
//       const imdbB = parseFloat(b.dataset.imdb);

//       if (this.ascending) {
//         // сортировка по возрастанию
//         return imdbA - imdbB;
//       } else {
//         // сортировка по убыванию
//         return imdbB - imdbA;
//       }
//     } else if (index === 3) {
//       const yearA = parseInt(a.dataset.year);
//       const yearB = parseInt(b.dataset.year);

//       if (this.ascending) {
//         // сортировка по возрастанию
//         return yearA - yearB;
//       } else {
//         // сортировка по убыванию
//         return yearB - yearA;
//       }
//     } else {
//       return 0;
//     }
//   });

//   if (this.ascending) {
//     arrow.classList.remove("down");
//     arrow.classList.add("up");
//   } else {
//     arrow.classList.remove("up");
//     arrow.classList.add("down");
//   }

//   rows.forEach((row) => tableBody.appendChild(row));
// }
