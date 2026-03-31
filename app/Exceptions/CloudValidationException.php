<?php

namespace App\Exceptions;

class CloudValidationException extends CloudApiException
{
    public function __construct(
        public readonly array $errors = [],
        string $message = 'Validation failed',
    ) {
        parent::__construct($message, 422);
    }
}
