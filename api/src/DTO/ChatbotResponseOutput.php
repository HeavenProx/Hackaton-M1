<?php

namespace App\DTO;

final class ChatbotResponseOutput
{
    public function __construct(
        public array $response,
    ) {}
}
