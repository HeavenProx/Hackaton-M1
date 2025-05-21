<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521103310 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE car (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, brand VARCHAR(255) NOT NULL, model VARCHAR(255) NOT NULL, registration VARCHAR(255) NOT NULL, vin VARCHAR(255) NOT NULL, entry_circulation_date DATE NOT NULL COMMENT '(DC2Type:date_immutable)', distance DOUBLE PRECISION NOT NULL, INDEX IDX_773DE69DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE dealership (id INT AUTO_INCREMENT NOT NULL, dealership_name VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, zipcode INT NOT NULL, latitude VARCHAR(255) NOT NULL, longitude VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE intervention (id INT AUTO_INCREMENT NOT NULL, car_id INT NOT NULL, garage_id INT DEFAULT NULL, diagnostic VARCHAR(255) DEFAULT NULL, date DATETIME NOT NULL, INDEX IDX_D11814ABC3C6F69F (car_id), INDEX IDX_D11814ABC4FFF555 (garage_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE operation (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) DEFAULT NULL, help LONGTEXT DEFAULT NULL, comment LONGTEXT DEFAULT NULL, duration VARCHAR(255) DEFAULT NULL, price VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, roles JSON NOT NULL, title VARCHAR(255) DEFAULT NULL, society_name VARCHAR(255) DEFAULT NULL, lastname VARCHAR(255) DEFAULT NULL, firstname VARCHAR(255) DEFAULT NULL, phone_number VARCHAR(255) DEFAULT NULL, is_driver TINYINT(1) DEFAULT NULL, driver_phone_number VARCHAR(255) DEFAULT NULL, driver_firstname VARCHAR(255) DEFAULT NULL, driver_lastname VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE car ADD CONSTRAINT FK_773DE69DA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention ADD CONSTRAINT FK_D11814ABC3C6F69F FOREIGN KEY (car_id) REFERENCES car (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention ADD CONSTRAINT FK_D11814ABC4FFF555 FOREIGN KEY (garage_id) REFERENCES dealership (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE car DROP FOREIGN KEY FK_773DE69DA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention DROP FOREIGN KEY FK_D11814ABC3C6F69F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE intervention DROP FOREIGN KEY FK_D11814ABC4FFF555
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE car
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE dealership
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE intervention
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE operation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE refresh_tokens
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE `user`
        SQL);
    }
}
