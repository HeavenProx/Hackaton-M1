<?php

namespace App\Controller;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class SendEmailController
{
    #[Route('/api/send-mail', name: 'api_send_mail', methods: ['POST'])]
    public function __invoke(MailerInterface $mailer): JsonResponse
    {
        $email = (new Email())
            ->from('no-reply@example.com')
            ->to('recipient@example.com')
            ->subject('Mail envoyé via API')
            ->text('Ceci est un message envoyé via une route personnalisée de l\'API.');

        $mailer->send($email);

        return new JsonResponse(['status' => 'email sent']);
    }
}
