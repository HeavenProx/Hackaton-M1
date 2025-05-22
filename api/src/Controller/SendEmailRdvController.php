<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
class SendEmailRdvController
{
    #[Route('/api/send-mail-rdv', name: 'api_send_rdv', methods: ['POST'])]
    public function __invoke(Request $request, MailerInterface $mailer): JsonResponse
    {
        $email = $request->request->get('emailClient');

        // Email setup
        $email = (new Email())
            ->from('no_reply@garage-folie.com')
            ->to($email)
            ->subject('Prise de rendez-vous. (ne pas répondre)')
            ->text('Nous vous validons la prise en compte de votre demande de rendez-vous.');

        // Send email
        $mailer->send($email);

        return new JsonResponse(['message' => 'PDF envoyé avec succès']);
    }
}
