<?php

namespace App\Exceptions;

use RuntimeException;

class ApiException extends RuntimeException
{
    /**
     * @param array<string, mixed> $details
     */

    public function __construct(private readonly string $errorCode, string $message, private readonly int $statusCode, private readonly array $details = [],){
        parent::__construct($message);
    }

    public function errorCode(): string{
        return $this->errorCode;
    }
    public function details(): array{
        return $this->details;
    }
    public function statusCode(): int{
        return $this->statusCode;
    }
}
