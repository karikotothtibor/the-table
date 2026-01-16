-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 16. 01:31
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `restaurant`
--
CREATE DATABASE IF NOT EXISTS `restaurant` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `restaurant`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `status` enum('ELKULDVE','SIKERTELEN','VARAKOZAS','') NOT NULL,
  `sender_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `reservation_id`, `message`, `status`, `sender_id`) VALUES
(6, 2, 25, 'Minden rendben van köszönjük a foglalást!', '', 5),
(8, 5, 1, 'Köszönöm az értesítést!', 'ELKULDVE', 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `opening_hours`
--

CREATE TABLE `opening_hours` (
  `id` int(11) NOT NULL,
  `day_of_week` text NOT NULL,
  `open_time` int(11) NOT NULL,
  `close_time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `opening_hours`
--

INSERT INTO `opening_hours` (`id`, `day_of_week`, `open_time`, `close_time`) VALUES
(1, 'Hétfő', 10, 22),
(2, 'Kedd', 10, 22),
(3, 'Szerda', 9, 22),
(4, 'Csütörtök', 9, 22),
(5, 'Péntek', 10, 23),
(6, 'Szombat', 9, 23),
(7, 'Vasárnap', 10, 22);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `dtime_from` datetime NOT NULL,
  `dtime_to` datetime NOT NULL,
  `number_of_customers` int(11) NOT NULL,
  `guest_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `reservation`
--

INSERT INTO `reservation` (`id`, `user_id`, `table_id`, `status_id`, `dtime_from`, `dtime_to`, `number_of_customers`, `guest_name`) VALUES
(1, 2, 2, 2, '2025-11-09 17:00:00', '2025-11-09 18:00:00', 3, 'Szabics Péterer'),
(4, 2, 3, 2, '2025-11-14 17:00:00', '2025-11-14 18:00:00', 5, 'Szabics Péterer'),
(6, 2, 2, 2, '2025-11-12 17:00:00', '2025-11-12 18:00:00', 2, 'Szabics Péterer'),
(8, 2, 2, 2, '2025-11-29 19:00:00', '2025-11-29 20:30:00', 3, 'Szabics Péterer'),
(9, 2, 2, 2, '2025-11-29 18:00:00', '2025-11-29 20:00:00', 4, 'Szabics Péterer'),
(10, 2, 2, 2, '2025-11-29 20:00:00', '2025-11-29 22:00:00', 3, 'Szabics Péterer'),
(11, 2, 1, 2, '2025-11-29 21:00:00', '2025-11-28 23:00:00', 4, 'Szabics Péterer'),
(12, 2, 2, 2, '2025-11-29 22:00:00', '2025-11-28 23:00:00', 4, 'Szabics Péterer'),
(13, 2, 1, 2, '2025-11-29 22:00:00', '2025-11-29 23:59:00', 3, 'Szabics Péterer'),
(14, 2, 2, 2, '2025-11-30 17:00:00', '2025-11-30 19:00:00', 3, 'Szabics Péterer'),
(15, 2, 1, 2, '2025-11-30 19:00:00', '2025-11-30 21:00:00', 3, 'Szabics Péterer'),
(16, 2, 2, 2, '2025-11-30 16:00:00', '2025-11-30 17:00:00', 2, 'Szabics Péterer'),
(17, 2, 2, 2, '2025-11-30 16:00:00', '2025-11-30 17:00:00', 3, 'Szabics Péterer'),
(18, 2, 2, 2, '2025-11-30 16:00:00', '2025-11-30 17:00:00', 3, 'Szabics Péterer'),
(19, 2, 2, 2, '2025-11-29 19:00:00', '2025-11-29 20:00:00', 2, 'Szabics Péterer'),
(20, 2, 2, 2, '2011-09-21 16:00:00', '2011-09-21 17:00:00', 3, 'Szabics Péterer'),
(21, 2, 2, 2, '2011-07-01 16:00:00', '2011-07-01 17:00:00', 3, 'Szabics Péterer'),
(22, 2, 3, 2, '2020-03-21 17:00:00', '2020-03-21 18:00:00', 4, 'Szabics Péterer'),
(23, 2, 2, 2, '2025-12-01 18:00:00', '2025-12-01 20:00:00', 4, 'Szabics Péterer'),
(24, 2, 1, 2, '2025-12-02 18:00:00', '2025-12-02 20:00:00', 3, 'Szabics Péterer'),
(25, 2, 1, 2, '2025-12-02 18:00:00', '2025-12-02 20:00:00', 3, 'Szabics Péterer'),
(26, 2, 1, 2, '2025-12-03 19:00:00', '2025-12-03 20:30:00', 4, 'Szabics Péterer'),
(27, 2, 3, 2, '2025-12-09 19:00:00', '2025-12-09 20:30:00', 5, 'Szabics Péterer'),
(29, 2, 3, 2, '2025-12-09 19:00:00', '2025-12-09 21:00:00', 5, 'Szabics Péterer'),
(36, 2, 10, 2, '2025-12-15 19:00:00', '2025-12-15 21:00:00', 3, 'Szabics Péterer'),
(37, 2, 3, 2, '2025-12-15 16:00:00', '2025-12-15 17:30:00', 4, 'Szabics Péterer'),
(38, 2, 2, 2, '2025-12-30 19:00:00', '2025-12-30 20:00:00', 3, 'Szabics Péter'),
(39, 2, 7, 2, '2025-12-30 18:00:00', '2025-12-30 19:30:00', 3, 'Szabics Péter'),
(40, 2, 5, 2, '2025-12-31 17:00:00', '2025-12-31 19:00:00', 4, 'Szabics Péter'),
(42, 2, 10, 2, '2025-12-30 15:00:00', '2025-12-30 17:00:00', 3, 'Szabics Péter'),
(43, 2, 5, 2, '2026-01-02 15:00:00', '2026-01-02 17:00:00', 4, 'Szabics Péter'),
(44, 2, 4, 2, '2026-01-02 15:00:00', '2026-01-02 16:30:00', 3, 'Szabics Péter'),
(45, 2, 3, 2, '2026-01-02 18:00:00', '2026-01-02 20:00:00', 6, 'Szabics Péter'),
(47, 2, 5, 2, '2026-01-04 17:00:00', '2026-01-04 19:00:00', 4, 'Szabics Péter'),
(56, 1, 1, 2, '2026-01-16 17:00:00', '2026-01-16 19:00:00', 5, 'Makk Marcell');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reservation_status`
--

CREATE TABLE `reservation_status` (
  `id` int(11) NOT NULL,
  `status` enum('szabad','foglalt','torolve','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `reservation_status`
--

INSERT INTO `reservation_status` (`id`, `status`) VALUES
(1, 'szabad'),
(2, 'foglalt');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` tinyint(5) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `reviews`
--

INSERT INTO `reviews` (`id`, `reservation_id`, `user_id`, `rating`, `comment`, `created_at`) VALUES
(4, 29, 2, 5, 'Minden szupe', '2025-12-14 19:41:31'),
(5, 29, 2, 5, 'Minden szupe', '2025-12-14 19:41:33'),
(6, 29, 2, 5, 'Minden szuper', '2025-12-14 19:41:37'),
(7, 29, 2, 5, 'Minden szuper', '2025-12-14 19:41:39'),
(10, 44, 2, 5, 'Szuper volt minden , mint mindig.', '2026-01-01 20:56:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews_logout`
--

CREATE TABLE `reviews_logout` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `rating` tinyint(5) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `reviews_logout`
--

INSERT INTO `reviews_logout` (`id`, `name`, `email`, `comment`, `rating`, `created_at`) VALUES
(10, 'Szabics Tibor', 'teszt@teszt.hu', 'Nagyon szuper', 4, '2025-11-12'),
(11, 'Szabics Tibor', 'teszt@teszt.hu', 'Nagyon szuper', 4, '2025-11-12'),
(12, 'Szabics Tibor', 'teszt@teszt.hu', 'MINDEN NAGYON SZUPÉRE VOLT', 0, '2025-11-12'),
(13, 'Szabics Tibor', 'teszt@teszt.hu', 'MINDEN NAGYON SZUPÉRE VOLT', 4, '2025-11-12'),
(14, 'Szabics Tibor', 'teszt@teszt.hu', 'MINDEN NAGYON SZUPÉRE VOLT', 5, '2025-11-12'),
(15, 'Szabics Tibor', 'teszt@teszt.hu', 'MINDEN NAGYON SZUPÉRE VOLT', 5, '2025-11-12');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `tables`
--

INSERT INTO `tables` (`id`, `capacity`) VALUES
(1, 7),
(2, 4),
(3, 7),
(4, 4),
(5, 5),
(6, 0),
(7, 5),
(10, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN','LETILTVA') NOT NULL DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`) VALUES
(1, 'Józsi', 'test@test.hu', '06307563889', 'testjelszo', 'LETILTVA'),
(2, 'Szabics Péter', 'test1@test.hu', '06301234522', '$2b$10$pM1VEFo9nqBnPHBPTiyv4uThRsYRyTldiAlZ0j3SY59zaQGEQkfYO', 'USER'),
(4, 'Kovács József', 'test2@test.hu', '06309876543', '$2b$10$ef.81.J3fMK97M5uzITjeuk6xpN0ivwV78iaSDr5VDl9Hn3BjxD1O', 'USER'),
(5, 'Admin', 'admin@admin.hu', '06301234567', '$2b$10$qlbeuwhT1JtQ0b8A.aJjUeodoe1kMLu5D1c2Fx53m87tKNfuTyPOC', 'ADMIN'),
(6, 'Szabó Tamás', 'test3@test.hu', '06304356789', '$2b$10$lYEk/c93RDegZnsabb7oD.Ks6YLp.V4YZAadjHvuMglFqkxc2qCU.', 'USER'),
(11, 'Kovács Pista', 'pista@admin.hu', '06735674523', '$2b$10$yx.N5SSOf/n0JZdFsAViUO3/ktizJcfchBxi4b4FKLEOJ4Z4zSedy', 'USER');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- A tábla indexei `opening_hours`
--
ALTER TABLE `opening_hours`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `status_id` (`status_id`);

--
-- A tábla indexei `reservation_status`
--
ALTER TABLE `reservation_status`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `reviews_logout`
--
ALTER TABLE `reviews_logout`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `opening_hours`
--
ALTER TABLE `opening_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT a táblához `reservation_status`
--
ALTER TABLE `reservation_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `reviews_logout`
--
ALTER TABLE `reviews_logout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_6` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
  ADD CONSTRAINT `reservation_ibfk_7` FOREIGN KEY (`status_id`) REFERENCES `reservation_status` (`id`);

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
