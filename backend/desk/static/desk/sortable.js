(function () {
  function initSortable() {
    const tbody = document.querySelector(".se-sortable-tbody");
    if (!tbody || typeof Sortable === "undefined") return;

    const url = tbody.dataset.reorderUrl;

    function showToast(message, isError) {
      if (typeof window.seDeskToast === "function") {
        window.seDeskToast(message, isError ? "error" : "success", 2800);
      }
    }

    function getCsrf() {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta ? meta.getAttribute("content") : "";
    }

    function saveOrder() {
      const ids = Array.from(tbody.querySelectorAll("tr[data-id]")).map(function (row) {
        return parseInt(row.dataset.id, 10);
      });

      if (typeof window.seDeskFetching === "object" && window.seDeskFetching.show) {
        window.seDeskFetching.show();
      }

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrf(),
        },
        credentials: "same-origin",
        body: JSON.stringify({ order: ids }),
      })
        .then(function (response) {
          return response
            .json()
            .catch(function () {
              return { ok: false, error: "Server error (" + response.status + ")" };
            })
            .then(function (data) {
              return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
          if (result.ok && result.data.ok) {
            showToast("Order saved");
          } else {
            showToast(result.data.error || "Could not save order", true);
          }
        })
        .catch(function () {
          showToast("Could not save order", true);
        })
        .finally(function () {
          if (typeof window.seDeskFetching === "object" && window.seDeskFetching.hide) {
            window.seDeskFetching.hide();
          }
        });
    }

    Sortable.create(tbody, {
      handle: ".se-drag-handle",
      animation: 160,
      draggable: "tr[data-id]",
      ghostClass: "se-sortable-ghost",
      chosenClass: "se-sortable-chosen",
      onEnd: function () {
        saveOrder();
      },
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSortable);
  } else {
    initSortable();
  }
})();
