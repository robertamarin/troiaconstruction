diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..5c20baf77b36d4ea2bb111f8d2643fce97f994cc
--- /dev/null
+++ b/README.md
@@ -0,0 +1,39 @@
+# Troia Construction Website
+
+Static marketing site for Troia Construction built with HTML and CSS for hosting on GitHub Pages. The site includes dedicated pages for:
+
+- Home (`index.html`)
+- Services (`services.html`)
+- Team (`team.html`)
+- Frequently Asked Questions (`faq.html`)
+- Contact (`contact.html`)
+
+## Brand Assets
+
+- Company logo: `assets/images/troia-logo.svg`
+- Team portraits: `assets/images/robert-amarin.svg`, `assets/images/angelos-stavrou.svg`
+
+## Local Development
+
+Open any page in a browser directly from the repository root:
+
+```bash
+python -m http.server 8000
+```
+
+Then visit `http://localhost:8000` to preview the site.
+
+## Contact Form Setup
+
+The contact form on `contact.html` posts to [Formspree](https://formspree.io/). To receive inquiries:
+
+1. Create a Formspree account and generate a form endpoint.
+2. Replace `https://formspree.io/f/your-form-id` with your endpoint URL in the `<form>` tag.
+3. Submit the form once to confirm the connection and verify your email address with Formspree.
+4. Replies to prospective clients can be sent directly from the notification email you receive.
+
+If you prefer a different form handler, update the `action` attribute accordingly or replace the form with a `mailto:` link.
+
+## Deployment
+
+Push the repository to GitHub and enable GitHub Pages from the repository settings. Choose the `main` branch and `/ (root)` directory to publish the site.
