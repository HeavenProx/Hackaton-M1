<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\CarRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CarRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(validationContext: ['groups' => ['Default', 'car:create']]),
        new Get(),
        new Put(),
        new Patch(),
        new Delete(),
        new GetCollection(
            uriTemplate: '/cars/{id}/interventions',
            normalizationContext: ['groups' => ['interventions_list::read']],
        )
    ],
    normalizationContext: ['groups' => ['car:read']],
    denormalizationContext: ['groups' => ['car:write']],
)]
class Car
{
    #[Groups(['car:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['car:write', 'car:read', 'user:read', 'interventions_pdf::read', 'interventions_list::read'])]
    #[ORM\Column(length: 255)]
    private ?string $brand = null;

    #[Groups(['car:write', 'car:read', 'user:read', 'interventions_pdf::read', 'interventions_list::read'])]
    #[ORM\Column(length: 255)]
    private ?string $model = null;

    #[Groups(['car:write', 'car:read', 'user:read', 'interventions_pdf::read'])]
    #[ORM\Column(length: 255)]
    private ?string $registration = null;

    #[Groups(['car:write', 'car:read', 'user:read'])]
    #[ORM\Column(length: 255)]
    private ?string $vin = null;

    #[Groups(['car:write', 'car:read', 'user:read'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $entryCirculationDate = null;

    #[Groups(['car:write', 'car:read', 'user:read', 'interventions_pdf::read'])]
    #[ORM\Column]
    private ?float $distance = null;

    #[Groups(['car:write', 'car:read', 'interventions_pdf::read'])]
    #[ORM\ManyToOne(inversedBy: 'cars')]
    private ?User $user = null;

    /**
     * @var Collection<int, Intervention>
     */
    #[ORM\OneToMany(targetEntity: Intervention::class, mappedBy: 'car')]
    #[Groups(['interventions_list::read'])]
    private Collection $interventions;

    public function __construct()
    {
        $this->interventions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): static
    {
        $this->brand = $brand;

        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(string $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getRegistration(): ?string
    {
        return $this->registration;
    }

    public function setRegistration(string $registration): static
    {
        $this->registration = $registration;

        return $this;
    }

    public function getVin(): ?string
    {
        return $this->vin;
    }

    public function setVin(string $vin): static
    {
        $this->vin = $vin;

        return $this;
    }

    public function getEntryCirculationDate(): ?\DateTimeImmutable
    {
        return $this->entryCirculationDate;
    }

    public function setEntryCirculationDate(\DateTimeImmutable $entryCirculationDate): static
    {
        $this->entryCirculationDate = $entryCirculationDate;

        return $this;
    }

    public function getDistance(): ?float
    {
        return $this->distance;
    }

    public function setDistance(float $distance): static
    {
        $this->distance = $distance;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Intervention>
     */
    public function getInterventions(): Collection
    {
        return $this->interventions;
    }

    public function addIntervention(Intervention $intervention): static
    {
        if (!$this->interventions->contains($intervention)) {
            $this->interventions->add($intervention);
            $intervention->setCar($this);
        }

        return $this;
    }

    public function removeIntervention(Intervention $intervention): static
    {
        if ($this->interventions->removeElement($intervention)) {
            // set the owning side to null (unless already changed)
            if ($intervention->getCar() === $this) {
                $intervention->setCar(null);
            }
        }

        return $this;
    }
}
