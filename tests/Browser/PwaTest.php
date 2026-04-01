<?php

it('has a valid web app manifest link', function () {
    $page = visit('/login');

    $page->assertPresent('link[rel="manifest"]')
        ->assertAttribute('link[rel="manifest"]', 'href', '/manifest.webmanifest')
        ->assertNoJavaScriptErrors();
});

it('has PWA meta tags', function () {
    $page = visit('/login');

    $page->assertPresent('meta[name="theme-color"]')
        ->assertPresent('meta[name="apple-mobile-web-app-capable"]')
        ->assertNoJavaScriptErrors();
});

it('serves the offline fallback page', function () {
    $page = visit('/offline.html');

    $page->assertSee("You're offline")
        ->assertSee('sync automatically');
});
