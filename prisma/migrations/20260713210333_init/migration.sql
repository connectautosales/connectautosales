-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `trim` VARCHAR(191) NULL,
    `vin` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `financePrice` DOUBLE NULL,
    `mileage` INTEGER NOT NULL,
    `titleType` VARCHAR(191) NOT NULL DEFAULT 'clean',
    `drivetrain` VARCHAR(191) NULL,
    `transmission` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `features` TEXT NULL,
    `images` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isNewArrival` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Car_stock_key`(`stock`),
    UNIQUE INDEX `Car_vin_key`(`vin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancingApplication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dob` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ssn` VARCHAR(191) NOT NULL,
    `driversLicense` VARCHAR(191) NOT NULL,
    `stateIssuance` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `housingStatus` VARCHAR(191) NULL,
    `monthlyRent` VARCHAR(191) NULL,
    `timeAtAddress` VARCHAR(191) NULL,
    `employmentStatus` VARCHAR(191) NOT NULL,
    `employer` VARCHAR(191) NULL,
    `jobTitle` VARCHAR(191) NULL,
    `monthlyIncome` VARCHAR(191) NOT NULL,
    `timeEmployed` VARCHAR(191) NULL,
    `vehicleYear` VARCHAR(191) NULL,
    `vehicleMake` VARCHAR(191) NULL,
    `vehicleModel` VARCHAR(191) NULL,
    `vehicleMileage` VARCHAR(191) NULL,
    `stockNumber` VARCHAR(191) NULL,
    `tradeIn` VARCHAR(191) NULL,
    `loanAmount` VARCHAR(191) NOT NULL,
    `downPayment` VARCHAR(191) NOT NULL,
    `desiredMonthly` VARCHAR(191) NULL,
    `refName` VARCHAR(191) NULL,
    `refPhone` VARCHAR(191) NULL,
    `refRelation` VARCHAR(191) NULL,
    `signature` VARCHAR(191) NOT NULL,
    `agreeTerms` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `adminNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuctionRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `auctionLink` TEXT NULL,
    `lotNumber` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `adminNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalvageInspection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `salvageTitle` VARCHAR(191) NULL,
    `validId` VARCHAR(191) NULL,
    `receipts` VARCHAR(191) NULL,
    `partsChanged` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `adminNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `adminNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransportRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `vehicle` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
