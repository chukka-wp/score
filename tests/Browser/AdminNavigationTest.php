<?php

it('redirects unauthenticated users to login', function () {
    $page = visit('/admin');

    $page->assertPathIs('/login');
});

it('redirects all admin routes to login when unauthenticated', function (string $path) {
    $page = visit($path);

    $page->assertPathIs('/login');
})->with([
    '/admin',
    '/admin/teams',
    '/admin/players',
    '/admin/statistics',
    '/admin/club',
]);
