<?php

test('home redirects to admin', function () {
    $this->get(route('home'))->assertRedirect('/admin');
});
