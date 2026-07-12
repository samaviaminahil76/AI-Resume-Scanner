# Maintenance Checklist

Recommended items to address in a follow-up PR:

- [ ] Add GitHub Actions CI to run tests and linters (added in `.github/workflows/ci.yml`).
- [ ] Add `pre-commit` hooks and formatting (black/ruff/isort) and CI checks.
- [ ] Add type checking (`mypy`) and include in CI.
- [ ] Add `LICENSE` and `CONTRIBUTING.md` if repository will be public.
- [ ] Remove or git-ignore committed output files under `data/outputs/`.
- [ ] Consider adding a lockfile or pinned dependencies for reproducible installs.
- [ ] Add a `Makefile` or `scripts/` helpers for common dev tasks.
- [ ] Add a GitHub Actions badge to `README.md` after CI is enabled.

Notes:

- Keep secrets out of the repo; use GitHub Actions secrets for CI deployments.
- Consider adding a simple `tox` configuration if supporting multiple Python versions locally.
