(function () {
  const TZ = "America/Edmonton";
  const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DAY_LABELS = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday"
  };
  const ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  function partsInTZ(date) {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const bits = Object.fromEntries(
      fmt.formatToParts(date).map((p) => [p.type, p.value])
    );
    return bits;
  }

  function weekdayKey(date) {
    const short = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short"
    }).format(date);
    // en-US short: Sun Mon Tue Wed Thu Fri Sat
    return short;
  }

  function fillSpecials(root, items) {
    root.querySelectorAll("[data-key]").forEach((el) => {
      const k = el.getAttribute("data-key");
      el.textContent = items[k] || "—";
    });
  }

  function renderWeek(grid, weekdays, activeKey) {
    grid.innerHTML = "";
    ORDER.forEach((key) => {
      const item = weekdays[key];
      if (!item) return;
      const card = document.createElement("article");
      card.className = "day-card" + (key === activeKey ? " is-today" : "");
      card.setAttribute("role", "listitem");
      const name = document.createElement("div");
      name.className = "day-name";
      name.innerHTML =
        DAY_LABELS[key] +
        (key === activeKey ? '<span class="pill">Today</span>' : "");
      const dl = document.createElement("dl");
      [
        ["Soup", item.soup],
        ["Savoury", item.savoury],
        ["Sweet", item.sweet],
        ["Muffin", item.muffin]
      ].forEach(([lab, val]) => {
        const dt = document.createElement("dt");
        dt.textContent = lab;
        const dd = document.createElement("dd");
        dd.textContent = val;
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      card.appendChild(name);
      card.appendChild(dl);
      grid.appendChild(card);
    });
  }

  async function main() {
    const res = await fetch("menu.json?v=20261007");
    if (!res.ok) throw new Error("Could not load menu.json");
    const menu = await res.json();

    const now = new Date();
    const bits = partsInTZ(now);
    const wd = weekdayKey(now); // Sun..Sat
    const isWeekend = wd === "Sat" || wd === "Sun";

    document.getElementById("month-label").textContent =
      (menu.month || "") + " Menu";

    const dateLine = document.getElementById("date-line");
    const weekendNote = document.getElementById("weekend-note");
    const badge = document.getElementById("today-badge");
    const heading = document.getElementById("today-heading");

    let showKey;
    if (isWeekend) {
      showKey = "Mon";
      badge.textContent = "Preview";
      heading.textContent = "Opens Monday";
      weekendNote.hidden = false;
      weekendNote.textContent =
        "Closed for the weekend — here’s Monday’s lineup to look forward to.";
      dateLine.textContent =
        bits.weekday +
        ", " +
        bits.month +
        " " +
        bits.day +
        ", " +
        bits.year +
        " · Edmonton";
    } else {
      showKey = wd;
      badge.textContent = "Today";
      heading.textContent = "Today’s specials";
      weekendNote.hidden = true;
      dateLine.textContent =
        DAY_LABELS[showKey] +
        ", " +
        bits.month +
        " " +
        bits.day +
        ", " +
        bits.year;
    }

    const todayItems = menu.weekdays[showKey];
    fillSpecials(document.getElementById("today-specials"), todayItems);

    const sandwiches = document.getElementById("standing-sandwiches");
    sandwiches.innerHTML = "";
    (menu.standing.sandwiches || []).forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      sandwiches.appendChild(li);
    });
    document.getElementById("standing-salad").textContent =
      menu.standing.salad || "—";
    document.getElementById("standing-feature").textContent =
      menu.standing.feature || "—";

    // Highlight today in week grid only on weekdays
    const activeKey = isWeekend ? null : showKey;
    renderWeek(document.getElementById("week-grid"), menu.weekdays, activeKey);
  }

  main().catch((err) => {
    console.error(err);
    document.getElementById("date-line").textContent =
      "Couldn’t load today’s menu — try refreshing.";
  });
})();
