<?php

namespace App\Exceptions;

class CloudAuthorizationException extends CloudApiException
{
    public function __construct(string $message = 'Forbidden')
    {
        parent::__construct($message, 403);
    }
}
