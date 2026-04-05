<?php

test('home redirects to scorer code entry', function () {
    $this->get(route('home'))->assertRedirect('/score');
});
