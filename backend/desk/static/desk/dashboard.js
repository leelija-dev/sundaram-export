(function () {
  function isDark() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function chartPalette() {
    var dark = isDark();
    return {
      brand: dark
        ? {
            primary: "#94a3b8",
            secondary: "#22d3ee",
            accent: "#fbbf24",
            muted: "#64748b",
            success: "#34d399",
            purple: "#a78bfa",
          }
        : {
            primary: "#123a52",
            secondary: "#0e7490",
            accent: "#d97706",
            muted: "#94a3b8",
            success: "#059669",
            purple: "#7c3aed",
          },
      grid: dark ? "#45494d" : "#ebebeb",
      tick: dark ? "#9aa0a6" : "#64748b",
      axis: dark ? "#d2d5d9" : "#334155",
      surface: dark ? "#323639" : "#ffffff",
      fill: dark ? "rgba(34, 211, 238, 0.18)" : "rgba(14, 116, 144, 0.14)",
    };
  }

  function destroyCharts() {
    ["chartTrend", "chartPipeline", "chartDestinations"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || typeof Chart === "undefined") return;
      var chart = Chart.getChart(el);
      if (chart) chart.destroy();
    });
  }

  function initDashboard() {
    var data = window.seDashboardCharts;
    if (!data || typeof Chart === "undefined") return;

    var palette = chartPalette();
    var brand = palette.brand;

    Chart.defaults.font = { family: "Inter, system-ui, sans-serif", size: 12 };
    Chart.defaults.color = palette.tick;

    var baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
    };

    var trendEl = document.getElementById("chartTrend");
    if (trendEl) {
      new Chart(trendEl, {
        type: "line",
        data: {
          labels: data.trend_labels,
          datasets: [{
            label: "Inquiries",
            data: data.trend_counts,
            borderColor: brand.secondary,
            backgroundColor: palette.fill,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: palette.surface,
            pointBorderColor: brand.secondary,
            pointBorderWidth: 2,
            borderWidth: 2.5,
          }],
        },
        options: {
          ...baseOptions,
          plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1, precision: 0 },
              grid: { color: palette.grid },
              border: { display: false },
            },
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 7 },
            },
          },
        },
      });
    }

    var pipelineEl = document.getElementById("chartPipeline");
    if (pipelineEl) {
      new Chart(pipelineEl, {
        type: "doughnut",
        data: {
          labels: data.pipeline_labels,
          datasets: [{
            data: data.pipeline_counts,
            backgroundColor: [brand.primary, brand.secondary, brand.purple, brand.success, brand.muted],
            borderWidth: 2,
            borderColor: palette.surface,
            hoverOffset: 8,
          }],
        },
        options: {
          ...baseOptions,
          cutout: "68%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 10, padding: 14, usePointStyle: true, pointStyle: "circle" },
            },
          },
        },
      });
    }

    var destEl = document.getElementById("chartDestinations");
    if (destEl && data.destination_labels && data.destination_labels.length) {
      var box = document.getElementById("chartDestinationsBox");
      var chartHeight = 300;

      if (box) {
        box.style.height = chartHeight + "px";
        box.style.minHeight = chartHeight + "px";
      }

      var secondaryRgb = isDark() ? "34, 211, 238" : "14, 116, 144";
      var barColors = data.destination_counts.map(function (_, i) {
        var alpha = 1 - i * 0.1;
        return i === 0
          ? brand.secondary
          : "rgba(" + secondaryRgb + ", " + Math.max(0.45, alpha) + ")";
      });

      new Chart(destEl, {
        type: "bar",
        data: {
          labels: data.destination_labels,
          datasets: [{
            label: "Leads",
            data: data.destination_counts,
            backgroundColor: barColors,
            borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
            borderSkipped: false,
            maxBarThickness: 56,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 500 },
          layout: { padding: { top: 8, right: 8 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: function (items) {
                  return items[0] ? data.destination_labels[items[0].dataIndex] : "";
                },
                label: function (ctx) {
                  var n = ctx.parsed.y;
                  return n + " lead" + (n === 1 ? "" : "s");
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1, precision: 0, font: { size: 11 } },
              grid: { color: palette.grid, drawBorder: false },
              border: { display: false },
              title: {
                display: true,
                text: "Number of leads",
                font: { size: 11, weight: "600" },
                color: palette.tick,
              },
            },
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 0,
                font: { size: 11, weight: "500" },
                color: palette.axis,
                callback: function (value) {
                  var label = this.getLabelForValue(value);
                  return label.length > 14 ? label.slice(0, 12) + "…" : label;
                },
              },
              grid: { display: false },
              border: { display: false },
            },
          },
        },
      });
    }
  }

  function boot() {
    destroyCharts();
    initDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("se-theme-change", boot);
})();
