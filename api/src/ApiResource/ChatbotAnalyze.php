<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\DTO\ChatbotRequestInput;
use App\DTO\ChatbotResponseOutput;
use App\State\ChatbotAnalyzeMileageProcessor;
use App\State\ChatbotAnalyzeProcessor;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/chatbot/analyze',
            input: ChatbotRequestInput::class,
            output: ChatbotResponseOutput::class,
            processor: ChatbotAnalyzeProcessor::class
        ),
        new Post(
            uriTemplate: '/chatbot/analyze/mileage',
            input: ChatbotRequestInput::class,
            output: ChatbotResponseOutput::class,
            name: 'analyze_mileage',
            processor: ChatbotAnalyzeMileageProcessor::class
        )
    ],
    paginationEnabled: false
)]
class ChatbotAnalyze {}
