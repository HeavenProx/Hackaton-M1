<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521090906 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE intervention_operation (intervention_id INT NOT NULL, operation_id INT NOT NULL, INDEX IDX_5663C7448EAE3863 (intervention_id), INDEX IDX_5663C74444AC3583 (operation_id), PRIMARY KEY(intervention_id, operation_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention_operation ADD CONSTRAINT FK_5663C7448EAE3863 FOREIGN KEY (intervention_id) REFERENCES intervention (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention_operation ADD CONSTRAINT FK_5663C74444AC3583 FOREIGN KEY (operation_id) REFERENCES operation (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention_operation DROP FOREIGN KEY FK_5663C7448EAE3863
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention_operation DROP FOREIGN KEY FK_5663C74444AC3583
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE intervention_operation
        SQL);
    }
}
