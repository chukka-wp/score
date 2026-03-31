<?php

it('renders the login page with form fields', function () {
    $page = visit('/login');

    $page->assertSee('Chukka Score')
        ->assertSee('Sign in with your manager account')
        ->assertSee('Email')
        ->assertSee('Password')
        ->assertSee('Sign in')
        ->assertNoJavaScriptErrors();
});

it('has email and password inputs', function () {
    $page = visit('/login');

    $page->assertPresent('#email')
        ->assertPresent('#password')
        ->assertPresent('button[type="submit"]')
        ->assertNoJavaScriptErrors();
});
