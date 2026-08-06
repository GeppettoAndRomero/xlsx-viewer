# Third-party notices

The source code in this repository is licensed under the [MIT License](./LICENSE).
It depends on the following runtime component under a different license.

## SheetJS Community Edition (`xlsx`) — Apache-2.0

- **Package:** `xlsx` 0.20.3
- **License:** Apache License 2.0
- **Upstream:** <https://git.sheetjs.com/SheetJS/sheetjs> (project site: <https://sheetjs.com/>)
- **Use in this project:** parses and reads XLSX/XLS/XLSM workbook data in the browser
- **Modifications:** none; the published package is used as a dependency

### Install source note

This dependency is installed from SheetJS's official CDN tarball
(`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`), pinned directly in
`package.json`, rather than from the npm registry. The npm-published `xlsx`
package is frozen at 0.18.5 and carries two unresolved High-severity CVEs
(CVE-2023-30533 prototype pollution, CVE-2024-22363 ReDoS); SheetJS ships the
fixed 0.20.x line only through its own CDN. `npm ci` resolves this URL with an
integrity hash recorded in `package-lock.json`, and it is still identified as
Apache-2.0 by license tooling. See `handbook/LICENSE-AUDIT.md` §1.1 for the
full rationale.

The Apache License 2.0 text is included with the `xlsx` package and is also
available at <https://www.apache.org/licenses/LICENSE-2.0>.

Other runtime dependencies — Astro, Preact, and `@astrojs/preact` — are
distributed under the MIT License.
