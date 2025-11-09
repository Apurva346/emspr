-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Nov 04, 2025 at 06:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sp_finance`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'admin123', 'admin1');

-- --------------------------------------------------------

--
-- Table structure for table `home`
--

CREATE TABLE `home` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `manager` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `position` varchar(255) NOT NULL,
  `birth` date DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `education` varchar(100) NOT NULL,
  `joining` date DEFAULT NULL,
  `working_mode` varchar(30) NOT NULL,
  `emp_type` varchar(30) NOT NULL,
  `address` varchar(255) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `emer_cont_no` varchar(20) NOT NULL,
  `relation` varchar(20) NOT NULL,
  `referred_by` varchar(20) NOT NULL,
  `leaving` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `home`
--

INSERT INTO `home` (`id`, `name`, `manager`, `department`, `salary`, `profile_pic`, `email`, `phone`, `position`, `birth`, `status`, `education`, `joining`, `working_mode`, `emp_type`, `address`, `gender`, `emer_cont_no`, `relation`, `referred_by`, `leaving`) VALUES
(5, 'Tushar', '', 'IT', 4997.00, 'http://localhost:3001/uploads/1758857568453.jpeg', 'wdha@gmail.com', '7854123698', 'Manager', '1996-12-27', 'inactive', 'BE', '2025-08-29', 'remote', 'full time', '', 'female', '', '', '', NULL),
(6, 'Raveena', 'Shilpa', 'testing', 78956.00, 'http://localhost:3001/uploads/1758865105509.jpeg', 'rave@gmail.com', '7896541236', 'Project Manager', '1996-12-29', 'inactive', 'BE', '2025-08-31', 'remote', 'part time', 'Capitol Homes 123', 'female', '8529637410', 'Father', 'Arif', NULL),
(7, 'Alvia', 'Rahul', 'testing', 12365.00, 'http://localhost:3001/uploads/1758865325301.jpeg', 'yousaft177777@gmail.com', '7894561236', 'Manager', '2018-11-20', 'blacklist', 'Bcom', '2025-09-02', 'remote', 'part time', 'Ramnath city 123', 'male', '8569741230', 'Friend', 'Ervin', NULL),
(8, 'Shubham', 'Rahul', 'development', 895623.00, 'http://localhost:3001/uploads/1758880902715.jpeg', 'ervin@gmail.com', '7854123697', 'Manager', '1996-12-26', 'inactive', 'Bcom', '2025-08-28', 'remote', 'part time', 'Ramnath City1', 'male', '2589631478', 'Friend', 'Aahana', NULL),
(28, 'Shivani', 'Anshika', 'testing', 78524.00, 'http://localhost:3001/uploads/1758886918330.jpeg', 'shiv@gmail.com', '7894563215', 'Project Manager', '2018-03-07', 'inactive', 'MBA', '2025-08-31', 'remote', 'part time', 'Ramnath City1', 'female', '8569741230', 'Brother', 'Riya', NULL),
(32, 'Seema', 'Robert Brown', 'HR', 20000.00, 'http://example.com/pic2.jpg', 'jane.smith@example.com', '0987654321', 'Manager', '1985-11-06', 'inactive', 'MBA', '2022-03-16', 'on-site', 'full time', '456 Oak Ave', 'female', '1234567890', 'Relative', 'Referral_V', NULL),
(33, 'Seema', 'Sanjana', 'it', 520000.00, 'http://localhost:3001/uploads/1759292994208.jpeg', 'apurva@gmail.com', '7894561236', 'Manager', '2022-06-02', 'inactive', 'Bcom', '2025-09-01', 'remote', 'part time', 'Capitol Homes 123', 'female', '8569741230', 'Brother', 'Ervin', NULL),
(35, 'Seema', 'Robert Brown', 'HR', 75000.00, 'http://example.com/pic2.jpg', 'jane.smith@example.com', '0987654321', 'HR Manager', '1985-11-09', 'inactive', 'MBA', '2022-03-19', 'on-site', 'full time', '456 Oak Ave', 'female', '1234567890', 'Relative', 'Referral_B', NULL),
(45, 'Software Engineer', '1990-05-20', 'Active', 0.00, 'Jane Smith', '1234567890', 'Male', 'john.doe@example.com', '0000-00-00', 'Remote', '123 Main St', '0000-00-00', 'Full-time', '80000', '9876543210', '2023-01-15', 'Friend', 'Referral_A', '', NULL),
(47, 'Apurva', 'Jane Smith', 'IT', 80000.00, 'http://example.com/pic1.jpg', 'john.doe@example.com', '1234567890', 'Software Engineer', '1990-05-20', 'Active', 'B.Tech', '2023-01-15', 'Remote', 'Full-time', '123 Main St', 'Male', '9876543210', 'Friend', 'Referral_A', NULL),
(48, 'Seema', 'Robert Brown', 'HR', 75000.00, 'http://example.com/pic2.jpg', 'jane.smith@example.com', '0987654321', 'HR Manager', '1985-11-10', 'Active', 'MBA', '2022-03-20', 'On-site', 'Full-time', '456 Oak Ave', 'Female', '1234567890', 'Relative', 'Referral_B', NULL),
(49, 'Apurva', 'shruti', 'it', 99998.00, 'http://localhost:3001/uploads/1760694675310.png', 'apurvajibhakate007@gmail.com', '7894561236', 'Manager', '2025-10-06', 'inactive', 'BE', '2025-10-10', 'remote', 'full time', 'Capitol Homes', 'male', '7896541233', 'Relative', 'Arif', NULL),
(50, 'Sneha', 'Mayuri', 'it', 15000.00, 'http://localhost:3001/uploads/1761073350256.png', 'sneha@gmail.com', '7894561236', 'Manager', '0000-00-00', 'active', 'BE', '0000-00-00', 'remote', 'part time', '', 'male', '', '', '', NULL),
(51, 'Apurva', 'Shruti', 'it', 15000.00, 'http://localhost:3001/uploads/1761296450819.png', 'wdha@gmail.com', '7894561236', 'Software Engineer', '2022-02-03', 'active', 'sdf', '2025-10-01', 'on-site', 'full time', 'Capitol Homes', 'female', '7896541233', 'Brother', 'Arif', NULL),
(53, 'Apurva Chhagan Jibhakate', 'Raj', 'IT', 52000.00, 'http://localhost:3001/uploads/1761638696646.png', 'apurvajibhakate007@gmail.com', '7894561236', 'Intern', '2022-01-25', 'blacklist', 'MBA', '2025-09-30', 'on-site', 'intern', 'Capitol Homes', 'male', '8569741230', 'Relative', 'Arif', NULL),
(54, 'Rashi', 'Vaishnavi', 'IYs', 10000.00, 'http://localhost:3001/uploads/1761715343909.png', 'apurvajibhakate007@gmail.com', '7894561236', 'Manager', '2021-02-02', 'blacklist', 'sdf', '2025-09-30', 'on-site', 'full time', 'Capitol Homes', 'male', '1234567890', 'Brother', 'Riya', '2025-10-28'),
(55, 'John Doe', 'Jane Smith', 'IT', 50000.00, '-', 'john@example.com', '9876543210', 'Software Engineer', '1995-05-10', 'Active', 'B.Tech', '2024-01-15', 'Hybrid', 'Full-time', 'Pune, India', 'Male', '9123456789', 'Brother', 'HR', '0000-00-00'),
(56, 'John Doe', 'Jane Smith', 'IT', 50000.00, '-', 'john@example.com', '9876543210', 'Software Engineer', '1995-05-10', 'Active', 'B.Tech', '2024-01-15', 'Hybrid', 'Full-time', 'Pune, India', 'Male', '9123456789', 'Brother', 'HR', '0000-00-00'),
(57, 'John Doe', 'Jane Smith', 'IT', 50000.00, '-', 'john@example.com', '9876543210', 'Software Engineer', '1995-05-10', 'Active', 'B.Tech', '2024-01-15', 'Hybrid', 'Full-time', 'Pune, India', 'Male', '9123456789', 'Brother', 'HR', '0000-00-00'),
(58, 'John Doe', 'Jane Smith', 'IT', 50000.00, '-', 'john@example.com', '9876543210', 'Software Engineer', '1995-05-10', 'Active', 'B.Tech', '2024-01-15', 'Hybrid', 'Full-time', 'Pune, India', 'Male', '9123456789', 'Brother', 'HR', '0000-00-00'),
(59, 'John Doe', 'Jane Smith', 'IT', 50000.00, '-', 'john@example.com', '9876543210', 'Software Engineer', '1995-05-10', 'Active', 'B.Tech', '2024-01-15', 'Hybrid', 'Full-time', 'Pune, India', 'Male', '9123456789', 'Brother', 'HR', '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `home`
--
ALTER TABLE `home`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `home`
--
ALTER TABLE `home`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
