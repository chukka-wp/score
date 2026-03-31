<?php

namespace App\Exceptions;

class CloudAuthenticationException extends CloudApiException
{
    public function __construct(string $message = 'Authentication failed')
    {
        parent::__construct($message, 401);
    }
}
