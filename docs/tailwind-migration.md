# Moving otech-web from Bootstrap 3 + Journal3 CSS to Tailwind

Goal: the same pixels as the original shop, written with Tailwind v4 (like monarchit-web).

## How the CSS is organised now (migration finished)
* The Bootstrap 3 + Journal3 CSS of the original shop is gone (`public/catalog` and `scripts/wrap-legacy-css.mjs` were deleted).
  A copy of the project from before that step is in `C:extraotech-web-backup-before-cleanup`.
* `src/app/globals.css`: Tailwind theme + **global** preflight, the fonts (`trebuc-webfont`, `icomoon`, `FontAwesome` - files in
  `public/font` and `public/fonts`), the page base (background, font, size 15px / line-height 1.9, `html` 10px), the four
  Font Awesome icons still used (`.fa-check-circle` ...), and `.legacy-html` (see below).
* Tailwind does **not** scan the whole project: `@import "tailwindcss/utilities.css" ... source(none)` plus one `@source` line per
  file that uses utilities. **Add a line when you create a component.** (Paths with `(...)` such as `app/(shop)` do not work in
  `@source`; keep Tailwind classes in `components/`.)
* `.legacy-html` marks scraped vendor HTML (product descriptions, the two text blocks under category products): it restores list,
  heading, table ... defaults that the reset removed.
* Design tokens (`@theme` in `globals.css`): fonts, shop red, ink, page background ...

## How a component is migrated (and checked)
1. Read the real values from the rendered original: computed styles of each element at desktop and phone width
   ((the old theme rules are no longer in the project; read them from the live original)
2. Write the component with Tailwind classes, **without** the old class names (otherwise the legacy rules still match).
3. Icons: glyph of the `icomoon` font in a CSS variable (`style={{"--i": '""'}}`) painted with `before:content-(--i) before:font-[icomoon]`.
4. Breakpoints: the old CSS uses `max-width: Npx` (inclusive). Tailwind's `max-[Npx]` is `width < N`, and Chrome rounds fractional
   media lengths, so use `max-[(N+1)px]` (e.g. `max-[471px]` for the old `max-width: 470px`).
5. Add the file to the `@source` list in `globals.css`.
6. Compare with the live original at many widths (text rectangles + image rectangles + height), then screenshots.

## Status
| Part | State |
|------|-------|
| Footer (`components/layout/Footer.tsx`, `NewsletterForm.tsx`) | redesigned on purpose (not a copy of the original): call-to-action band, support cards, 4 columns, newsletter pill, payment strip, bottom bar |
| Home SEO text (`components/home/SeoText.tsx`) | on Tailwind, identical at 390-1440 px (heading positions and page height) |
| Home brands carousel (`components/home/BrandCarousel.tsx`) | on Tailwind, same box/image sizes at 390-1440 px (arrow buttons are invisible in the original and were dropped) |
| Home hero sliders (`components/home/HeroSlider.tsx`, also used by the popup page) | on Tailwind, slider boxes, bullets and page height identical at 390-1440 px |
| Home category tiles + title + banners (`components/home/CategoryBlocks.tsx`) | on Tailwind, every tile/banner box and page height within 0.3 px of the original at 390-1440 px, including the 470/471 breakpoint |
| Home product blocks (`components/home/HomeProducts.tsx`, `HomeCardButtons.tsx`, `ProductCarousel.tsx`) | on Tailwind, card/tab/button boxes and page height identical at 390-1440 px; the old `Card` in `ProductSection.tsx` stays legacy because the product page still uses it |
| Header: `DesktopHeader.tsx`, `DesktopMenu.tsx`, `MobileHeader.tsx`, `MobileMenu.tsx`, `HeaderParts.tsx` (search, mini cart), `Header.tsx` (drawers + overlay), `HeaderShell.tsx` | on Tailwind; desktop/mobile switch at 1025 px with CSS only; text, image and background boxes match the original at 320-1440 px; drop-downs checked by screenshots |
| Home page grid frame (`components/home/HomeContent.tsx`: container, hero row, brands/notice/categories/banners rows, product rows) | on Tailwind; all legacy `grid-row` / `grid-col` / `grid-item` classes are gone from the home page |
| Category page: `Breadcrumb.tsx`, `CategoryBrowser.tsx` (frame, filter column + drawer, toolbar, refine links, pagination), `CatCard.tsx` (grid tile and list row), `PriceSlider.tsx` | on Tailwind; compared with the original at 390-1440 px in grid and list view; the two text blocks under the products (`#content-bottom`, scraped HTML) stay legacy, marked with the `legacy-html` class which the Tailwind reset skips |
| Product page: `ProductDetail.tsx` (gallery, details, tabs, compare table, review form, "From same brand", tags), `RelatedProducts.tsx` | on Tailwind; the page is now built from structured data in `src/data/pview/<id>.json` (made once from the scraped HTML); only the vendor description text (tab "Description") is still scraped HTML inside `legacy-html`; matches the original exactly at 1440 px and within a few px at 1024 / 390 px |
| Cart, checkout, compare: `CartView.tsx`, `CartNotice.tsx`, `CheckoutView.tsx`, `CompareView.tsx` | on Tailwind; cart and compare match the original at 1440 px (cart rows 0.5 px); checkout matches at 1440 px (the original prints its footer twice, the clone once); tablet / mobile (1024, 768, 390 px) match within 0.5 px; coupon, validation and order placing tested |
| Search form: `SearchForm.tsx`; toasts: `Toasts.tsx`; "Ask For Price" window: `AskPriceModal.tsx`; module popups (Corporate Deal, Become A Dealer, Online Pay Numbers): `ModulePopup.tsx` (no iframe any more, the `/popup/<id>` route is gone) | on Tailwind; toast, ask-price window, popups (500x328 / 345x530, also at 390 px) and the search form match the original within 1 px |

Everything is on Tailwind. Checked at 320 / 390 / 471 / 600 / 768 / 1024 / 1100 / 1300 / 1440 px against the live original by comparing the position of every text (product, category, search, cart, checkout, compare pages): they match within about 1 px. Known tiny differences: checkout shipping / payment radios at 390 px (about 1.9 px), compare label column at 470 px (1.3 px), and content the original picks at random (compat table rows, home carousels, search order of products with the same price). Full-page screenshots before and after the legacy CSS removal were identical (< 0.3 % noise).

Testing tip: on Windows Git Bash prefix scripts that take a URL argument with MSYS_NO_PATHCONV=1, or /path becomes C:/Program Files/Git/path.
