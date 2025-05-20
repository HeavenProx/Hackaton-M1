<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Dto\ChatbotRequestInput;
use App\Dto\ChatbotResponseOutput;
use App\State\ChatbotAnalyzeProcessor;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/chatbot/analyze',
            input: ChatbotRequestInput::class,
            output: ChatbotResponseOutput::class,
            processor: ChatbotAnalyzeProcessor::class
        )
    ],
    paginationEnabled: false
)]
class ChatbotAnalyze {}
