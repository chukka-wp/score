<?php

it('serves the login page without errors', function () {
    $page = visit('/login');

    $page->assertNoJavaScriptErrors();
});

it('redirects home to login', function () {
    $page = visit('/');

    $page->assertPathIs('/login');
});

it('smoke tests public pages', function () {
    $pages = visit(['/login']);

    $pages->assertNoSmoke();
});
