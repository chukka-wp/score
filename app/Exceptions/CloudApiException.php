<?php

namespace App\Exceptions;

use Exception;

class CloudApiException extends Exception
{
    public function __construct(
        string $message,
        public readonly int $statusCode = 500,
        public readonly array $responseBody = [],
    ) {
        parent::__construct($message, $statusCode);
    }
}
