(function initInvoiceLineFormset() {
  const body = document.getElementById("se-invoice-lines-body");
  const addBtn = document.getElementById("se-add-invoice-line");
  const emptyRow = document.getElementById("se-invoice-line-empty-row");
  if (!body || !addBtn || !emptyRow) return;

  const prefix = body.dataset.formsetPrefix;
  const totalInput = document.getElementById("id_" + prefix + "-TOTAL_FORMS");
  if (!totalInput) return;

  function allRows() {
    return Array.from(body.querySelectorAll("tr.se-invoice-line-row"));
  }

  function activeRows() {
    return allRows().filter(function (row) {
      return !row.classList.contains("is-removed");
    });
  }

  function reindexRows() {
    allRows().forEach(function (row, index) {
      row.querySelectorAll("input, select, textarea").forEach(function (input) {
        if (input.name) {
          input.name = input.name.replace(new RegExp(prefix + "-\\d+-"), prefix + "-" + index + "-");
        }
        if (input.id) {
          input.id = input.id.replace(new RegExp("id_" + prefix + "-\\d+-"), "id_" + prefix + "-" + index + "-");
        }
      });
      row.querySelectorAll("label[for]").forEach(function (label) {
        label.htmlFor = label.htmlFor.replace(
          new RegExp("id_" + prefix + "-\\d+-"),
          "id_" + prefix + "-" + index + "-"
        );
      });
    });
    totalInput.value = String(allRows().length);
  }

  function bindRemoveButton(row) {
    const btn = row.querySelector(".se-line-remove-btn");
    if (!btn || btn.dataset.seLineBound) return;
    btn.dataset.seLineBound = "1";
    btn.addEventListener("click", function () {
      if (activeRows().length <= 1) {
        if (typeof window.seDeskToast === "function") {
          window.seDeskToast("At least one line item is required.", "warning", 2800);
        }
        return;
      }

      const isExisting = row.dataset.lineExisting === "1";
      const deleteField = row.querySelector(".se-line-delete-field input[type='checkbox']");

      if (isExisting && deleteField) {
        deleteField.checked = true;
        row.classList.add("is-removed");
        row.querySelectorAll("input:not([type='hidden']):not([type='checkbox']), select, textarea").forEach(function (el) {
          el.disabled = true;
        });
        btn.disabled = true;
        return;
      }

      row.remove();
      reindexRows();
    });
  }

  function addRow() {
    const index = allRows().length;
    const clone = emptyRow.cloneNode(true);
    clone.removeAttribute("id");
    clone.className = "se-invoice-line-row";
    clone.setAttribute("data-line-row", "");
    clone.dataset.lineExisting = "0";

    clone.querySelectorAll("input, select, textarea").forEach(function (input) {
      if (input.name) {
        input.name = input.name.replace(/__prefix__/g, String(index));
      }
      if (input.id) {
        input.id = input.id.replace(/__prefix__/g, String(index));
      }
      if (input.type !== "hidden") {
        input.value = "";
      } else {
        input.value = "";
      }
    });

    body.appendChild(clone);
    totalInput.value = String(allRows().length);
    bindRemoveButton(clone);
    const firstInput = clone.querySelector("input:not([type='hidden'])");
    if (firstInput) firstInput.focus();
  }

  addBtn.addEventListener("click", addRow);
  allRows().forEach(bindRemoveButton);
})();
