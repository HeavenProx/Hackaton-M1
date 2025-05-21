<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final class ChatbotRequestInput
{
    #[Assert\NotBlank]
    public array $messages = [];
}
