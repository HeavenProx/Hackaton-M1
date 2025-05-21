<?php

namespace App\DTO;

final class ChatbotResponseOutput
{
    public function __construct(
        public string $raw_response,
        public array $parsed,
    ) {}
}
