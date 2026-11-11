# Hooks for the ZAP baseline scan in .github/workflows/security.yml.
#
# The spider starts at the home page and follows links, and nothing links to
# the admin, to a page that does not exist, or to a share card. Each of these
# is opened once before the spider starts, so it is in what ZAP scans.

PAGES = [
    '/admin',
    '/admin/login',
    '/admin/no-such-page',
    '/admin/api/update',
    '/no-such-page',
    '/es/no-such-page',
    '/no-such-file.js',
    '/og?path=/pricing&locale=en',
    '/og?path=/no-such-page',
    '/company.json',
    '/sitemap.xml',
]


def zap_started(zap, target):
    base = target.rstrip('/')
    for page in PAGES:
        zap.core.access_url(url=base + page, followredirects='true')
