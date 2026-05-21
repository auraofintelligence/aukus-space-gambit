(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const topButton = document.querySelector(".back-to-top");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (topButton) {
    const updateTopButton = () => {
      topButton.classList.toggle("is-visible", window.scrollY > 260);
    };

    window.addEventListener("scroll", updateTopButton, { passive: true });
    updateTopButton();
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const form = document.querySelector("[data-support-form]");
  const output = document.querySelector("[data-support-output]");
  const copyButton = document.querySelector("[data-copy-support]");
  const downloadButton = document.querySelector("[data-download-support]");

  if (!form || !output) {
    return;
  }

  const field = (name) => {
    const input = form.elements.namedItem(name);
    return input ? input.value.trim() : "";
  };

  const fallback = (value, text) => value || text;

  const buildMarkdown = () => {
    const name = fallback(field("name"), "[name or organisation]");
    const contact = fallback(field("contact"), "[contact path]");
    const lane = fallback(field("lane"), "General early supporter");
    const offer = fallback(field("offer"), "[what you can help test]");
    const boundaries = fallback(field("boundaries"), "[evidence, caution or boundary]");
    const next = fallback(field("next"), "[useful next step]");

    return [
      "# AUKUS Space Gambit - Review Support Signal",
      "",
      "## Reviewer",
      `- Name or organisation: ${name}`,
      `- Best contact path: ${contact}`,
      `- Review lane: ${lane}`,
      "",
      "## What I can help test",
      offer,
      "",
      "## Evidence, caution or boundary",
      boundaries,
      "",
      "## Useful next step",
      next,
      "",
      "## Public/private note",
      "This is an early support signal for an independent public hypothesis. It is not an official AUKUS, NASA, SpaceX, Australian Government or ISS partner-agency proposal."
    ].join("\n");
  };

  const updateOutput = () => {
    output.value = buildMarkdown();
  };

  form.addEventListener("input", updateOutput);
  form.addEventListener("change", updateOutput);
  updateOutput();

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      output.select();
      try {
        await navigator.clipboard.writeText(output.value);
        copyButton.textContent = "Copied";
      } catch (error) {
        document.execCommand("copy");
        copyButton.textContent = "Copied";
      }
      window.setTimeout(() => {
        copyButton.textContent = "Copy Markdown";
      }, 1600);
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      const blob = new Blob([output.value], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "aukus-space-gambit-review-signal.md";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }
})();
