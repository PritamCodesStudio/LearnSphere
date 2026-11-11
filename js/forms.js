/* =========================================================
   LearnSphere Academy — Forms & demo authentication
   IMPORTANT: this is a frontend-only demonstration. Accounts,
   messages and newsletter entries are stored in localStorage and
   are NOT secure or delivered anywhere.
   ========================================================= */
(function () {
  "use strict";

  var util = LS.util;
  var store = LS.store;
  var icon = LS.icons.svg;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldOf(input) {
    return input ? input.closest(".form-field") : null;
  }

  function setError(input, message) {
    if (!input) return;
    var field = fieldOf(input) || input.parentElement;
    if (!field) return;
    field.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    var node = field.querySelector(".field-error");
    if (!node) {
      node = document.createElement("p");
      node.className = "field-error";
      field.appendChild(node);
    }
    node.innerHTML = icon("alert") + "<span></span>";
    node.querySelector("span").textContent = message;
    if (!node.id) node.id = "error-" + (input.id || Math.random().toString(36).slice(2, 7));
    input.setAttribute("aria-describedby", node.id);
  }

  function clearError(input) {
    if (!input) return;
    var field = fieldOf(input) || input.parentElement;
    if (!field) return;
    field.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
  }

  function clearFormErrors(form) {
    Array.prototype.forEach.call(form.querySelectorAll(".has-error"), function (field) {
      field.classList.remove("has-error");
    });
    Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (input) {
      input.removeAttribute("aria-invalid");
    });
  }

  function focusFirstError(form) {
    var input = form.querySelector(".form-field.has-error .input, .form-field.has-error .select, .form-field.has-error .textarea");
    if (input) input.focus();
  }

  function required(input, message) {
    if (!input) return true;
    if (!String(input.value || "").trim()) {
      setError(input, message || "This field is required.");
      return false;
    }
    return true;
  }

  function validEmail(input) {
    if (!required(input, "Enter your email address.")) return false;
    if (!EMAIL_RE.test(input.value.trim())) {
      setError(input, "Enter a valid email address, for example you@example.com.");
      return false;
    }
    return true;
  }

  function setLoading(button, loading, label) {
    if (!button) return;
    if (loading) {
      if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
      button.classList.add("is-loading");
      button.disabled = true;
      button.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>' + (label || "Please wait…") + "</span>";
    } else {
      button.classList.remove("is-loading");
      button.disabled = false;
      if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
        delete button.dataset.originalHtml;
      }
    }
  }

  function showSuccess(node, text) {
    if (!node) return;
    node.innerHTML = icon("check-circle") + "<span></span>";
    node.querySelector("span").textContent = text;
    node.classList.add("is-visible");
  }

  function hideSuccess(node) {
    if (node) node.classList.remove("is-visible");
  }

  function redirect(path) {
    window.location.href = util.page(path);
  }

  /* ---------- Password visibility ---------- */
  function initPasswordToggles() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-password-toggle]");
      if (!button) return;
      event.preventDefault();
      var targetId = button.getAttribute("data-target");
      var input = targetId
        ? document.getElementById(targetId)
        : button.parentElement.querySelector("input");
      if (!input) return;
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      button.innerHTML = icon(show ? "eye-off" : "eye");
      button.setAttribute("aria-pressed", show ? "true" : "false");
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
      input.focus();
    });
  }

  /* ---------- Password strength ---------- */
  function passwordScore(value) {
    var password = String(value || "");
    var score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(4, score);
  }

  function initStrength() {
    var input = document.getElementById("signup-password");
    var meter = document.getElementById("signup-strength");
    if (!input || !meter) return;
    var label = meter.querySelector(".password-strength__label");
    var labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
    function update() {
      var score = passwordScore(input.value);
      if (!input.value) score = 0;
      meter.setAttribute("data-score", String(score));
      if (label) {
        label.textContent = input.value
          ? labels[score] + " · use 8+ characters with a mix of letters, numbers and symbols"
          : "Use 8+ characters with a mix of letters, numbers and symbols.";
      }
    }
    input.addEventListener("input", update);
    update();
  }

  /* ---------- Login ---------- */
  function initLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;
    var email = form.querySelector("#login-email");
    var password = form.querySelector("#login-password");
    var remember = form.querySelector("#login-remember");
    var button = form.querySelector('button[type="submit"]');
    var success = document.getElementById("login-success");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFormErrors(form);
      hideSuccess(success);

      var ok = validEmail(email);
      if (!required(password, "Enter your password.")) ok = false;
      if (!ok) {
        focusFirstError(form);
        return;
      }

      var users = store.users();
      var address = email.value.trim().toLowerCase();
      var user = null;
      users.forEach(function (item) {
        if (String(item.email || "").toLowerCase() === address) user = item;
      });

      setLoading(button, true, "Checking…");
      util
        .hashPassword(password.value)
        .then(function (hash) {
          window.setTimeout(function () {
            setLoading(button, false);
            if (!user || user.passwordHash !== hash) {
              setError(password, "The email and password do not match a demo account in this browser.");
              LS.toast(
                "Demo accounts only exist in this browser. Create an account first, or check your details.",
                "error",
                "Sign-in failed"
              );
              password.focus();
              return;
            }
            store.setSession(user, !!(remember && remember.checked));
            store.logActivity("auth", "Signed in to the demo dashboard");
            store.flash("success", "Signed in as " + user.name + " (demo account).");
            redirect("pages/dashboard.html");
          }, 380);
        })
        .catch(function () {
          setLoading(button, false);
          LS.toast("The demo sign-in could not complete. Please try again.", "error");
        });
    });
  }

  /* ---------- Signup ---------- */
  function initSignup() {
    var form = document.getElementById("signup-form");
    if (!form) return;
    var name = form.querySelector("#signup-name");
    var email = form.querySelector("#signup-email");
    var password = form.querySelector("#signup-password");
    var confirm = form.querySelector("#signup-confirm");
    var terms = form.querySelector("#signup-terms");
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFormErrors(form);

      var ok = required(name, "Enter your full name.");
      if (name && name.value.trim().length > 0 && name.value.trim().length < 2) {
        setError(name, "Use at least two characters.");
        ok = false;
      }
      if (!validEmail(email)) ok = false;
      if (!required(password, "Create a password.")) {
        ok = false;
      } else if (password.value.length < 8) {
        setError(password, "Use at least 8 characters.");
        ok = false;
      }
      if (!required(confirm, "Repeat your password.")) {
        ok = false;
      } else if (password && confirm.value !== password.value) {
        setError(confirm, "The passwords do not match.");
        ok = false;
      }
      if (terms && !terms.checked) {
        setError(terms, "Please confirm that you understand this is a demo.");
        ok = false;
      }
      if (!ok) {
        focusFirstError(form);
        if (terms && !terms.checked) terms.focus();
        return;
      }

      var address = email.value.trim().toLowerCase();
      var exists = store.users().some(function (user) {
        return String(user.email || "").toLowerCase() === address;
      });
      if (exists) {
        setError(email, "An account with this email already exists in this browser.");
        email.focus();
        return;
      }

      setLoading(button, true, "Creating account…");
      util
        .hashPassword(password.value)
        .then(function (hash) {
          window.setTimeout(function () {
            var user = {
              id: util.uid(),
              name: name.value.trim(),
              email: address,
              passwordHash: hash,
              createdAt: new Date().toISOString(),
              demo: true
            };
            store.addUser(user);
            store.setSession(user, true);
            store.logActivity("auth", "Created a local demo account");
            store.flash(
              "success",
              "Your demo account is ready. It exists only in this browser's storage."
            );
            redirect("pages/dashboard.html");
          }, 420);
        })
        .catch(function () {
          setLoading(button, false);
          LS.toast("The demo account could not be created. Please try again.", "error");
        });
    });
  }

  /* ---------- Forgot password ---------- */
  function initForgot() {
    var form = document.getElementById("forgot-form");
    if (!form) return;
    var email = form.querySelector("#forgot-email");
    var button = form.querySelector('button[type="submit"]');
    var success = document.getElementById("forgot-success");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFormErrors(form);
      hideSuccess(success);
      if (!validEmail(email)) {
        focusFirstError(form);
        return;
      }
      setLoading(button, true, "Checking…");
      window.setTimeout(function () {
        setLoading(button, false);
        showSuccess(
          success,
          "If a demo account exists for this address, reset instructions would be shown here. This preview does not send email, generate reset links or change passwords."
        );
        LS.toast("No email was sent — this is a frontend demonstration.", "info", "Demo only");
        form.reset();
      }, 420);
    });
  }

  /* ---------- Contact ---------- */
  function initContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var name = form.querySelector("#contact-name");
    var email = form.querySelector("#contact-email");
    var topic = form.querySelector("#contact-topic");
    var message = form.querySelector("#contact-message");
    var success = document.getElementById("contact-success");
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFormErrors(form);
      hideSuccess(success);

      var ok = required(name, "Tell us your name.");
      if (!validEmail(email)) ok = false;
      if (topic && !topic.value) {
        setError(topic, "Choose a topic.");
        ok = false;
      }
      if (!required(message, "Write a message.")) {
        ok = false;
      } else if (message.value.trim().length < 10) {
        setError(message, "Please write at least 10 characters.");
        ok = false;
      }
      if (!ok) {
        focusFirstError(form);
        return;
      }

      setLoading(button, true, "Saving…");
      window.setTimeout(function () {
        store.addMessage({
          id: util.uid(),
          name: name.value.trim(),
          email: email.value.trim().toLowerCase(),
          topic: topic ? topic.value : "General",
          message: message.value.trim(),
          at: new Date().toISOString(),
          demo: true
        });
        setLoading(button, false);
        showSuccess(
          success,
          "Your message has been saved in this browser for the demo. Nothing was sent to a real inbox and no reply is guaranteed."
        );
        LS.toast("Message stored locally — no email was sent.", "success", "Demo message saved");
        form.reset();
      }, 420);
    });
  }

  /* ---------- Footer newsletter ---------- */
  function initNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;
    var input = form.querySelector('input[type="email"]');
    if (!input) return;
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!EMAIL_RE.test(input.value.trim())) {
        input.setAttribute("aria-invalid", "true");
        LS.toast("Enter a valid email address to join the demo list.", "error", "Check your email");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      store.newsletter(input.value.trim().toLowerCase());
      setLoading(button, true, "Adding…");
      window.setTimeout(function () {
        setLoading(button, false);
        LS.toast(
          "You are on the local demo list. Nothing was subscribed and no email will be sent.",
          "success",
          "Demo newsletter"
        );
        form.reset();
      }, 340);
    });

    input.addEventListener("input", function () {
      input.removeAttribute("aria-invalid");
    });
  }

  /* ---------- Clear errors while typing ---------- */
  document.addEventListener("input", function (event) {
    if (event.target.matches(".input, .textarea, .select")) {
      clearError(event.target);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggles();
    initStrength();
    initLogin();
    initSignup();
    initForgot();
    initContact();
    initNewsletter();
  });
})();
