USE db_pinterest;
CREATE TABLE nguoi_dung (
	nguoi_dung_id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(200),
	mat_khau VARCHAR(200),
	ho_ten VARCHAR(200),
	tuoi INT,
	anh_dai_dien VARCHAR(200),
	facebook_app_id VARCHAR(455)
);
INSERT INTO nguoi_dung (email, mat_khau, ho_ten, tuoi, anh_dai_dien, facebook_app_id) VALUES
	('tommyteo@example.com', 'matkhau1', 'Tèo Tommy', 19, 'avatar1.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('johnwick@example.com', 'matkhau2', 'John Wick', 23, 'avatar2.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('dom@example.com', 'matkhau3', 'DOM', 18, 'avatar3.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('eminem@example.com', 'matkhau4', 'Eminem', 25, 'avatar4.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('cardiB@example.com', 'matkhau5', 'Cardi B', 28, 'avatar5.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('jack97@example.com', 'matkhau6', '5 củ', 29, 'avatar6.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('anhbay@example.com', 'matkhau7', 'Ronaldo', 27, 'avatar7.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('kemkabi@example.com', 'matkhau8', 'gái nhật đó', 18, 'avatar8.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('anhbatracu@example.com', 'matkhau9', 'Anh Ba Trà Cú', 26, 'avatar9.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw'),
	('camlansuc@example.com', 'matkhau10', 'Linda', 35, 'avatar10.jpg', '25%3AUoYSPkMx-b8WlQ%3A2%3A1694014658%3A-1%3A6162%3A%3AAcWU9oOVsEy1PFyx24ukOukH0svq7VNu41fBPOulCw');

CREATE TABLE luu_anh (
	nguoi_dung_id INT,
	hinh_id INT,
	ngay_luu DATE,
	PRIMARY KEY (nguoi_dung_id, hinh_id),
	FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id),
	FOREIGN KEY (hinh_id) REFERENCES hinh_anh(hinh_id)
);
INSERT INTO luu_anh (nguoi_dung_id, hinh_id, ngay_luu)
VALUES
(1, 1, '2023-09-20'),
(2, 2, '2023-09-21'),
(3, 3, '2023-09-22'),
(4, 4, '2023-09-23'),
(5, 5, '2023-09-24'),
(6, 6, '2023-09-25'),
(7, 7, '2023-09-26'),
(8, 8, '2023-09-27'),
(9, 9, '2023-09-28'),
(10, 10, '2023-09-29');

CREATE TABLE hinh_anh (
	hinh_id INT PRIMARY KEY AUTO_INCREMENT,
	ten_hinh VARCHAR(200),
	duong_dan VARCHAR(200),
	mo_ta VARCHAR(200),
	nguoi_dung_id INT,
	FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
);
INSERT INTO hinh_anh (ten_hinh, duong_dan, mo_ta, nguoi_dung_id)
VALUES
('Hình 1', 'duongdan1.jpg', 'Hình mô tả 1', 1),
('Hình 2', 'duongdan2.jpg', 'Hình mô tả 2', 2),
('Hình 3', 'duongdan3.jpg', 'Hình mô tả 3', 3),
('Hình 4', 'duongdan4.jpg', 'Hình mô tả 4', 4),
('Hình 5', 'duongdan5.jpg', 'Hình mô tả 5', 5),
('Hình 6', 'duongdan6.jpg', 'Hình mô tả 6', 6),
('Hình 7', 'duongdan7.jpg', 'Hình mô tả 7', 7),
('Hình 8', 'duongdan8.jpg', 'Hình mô tả 8', 8),
('Hình 9', 'duongdan9.jpg', 'Hình mô tả 9', 9),
('Hình 10', 'duongdan10.jpg', 'Hình mô tả 10', 10);

CREATE TABLE binh_luan (
	binh_luan_id INT PRIMARY KEY AUTO_INCREMENT,
	nguoi_dung_id INT,
	hinh_id INT,
	ngay_binh_luan DATE,
	noi_dung VARCHAR(200),
	FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id),
	FOREIGN KEY (hinh_id) REFERENCES hinh_anh(hinh_id)
);
INSERT INTO binh_luan (nguoi_dung_id, hinh_id, ngay_binh_luan, noi_dung)
VALUES
(1, 1, '2023-09-20', 'cái này xấu quắc'),
(2, 2, '2023-09-21', 'awwwww đẹp quá'),
(3, 3, '2023-09-22', 'cute dọ'),
(4, 4, '2023-09-23', 'xấy quãi đạn'),
(5, 5, '2023-09-24', '??? thằng nào đăng vậy '),
(6, 6, '2023-09-25', 'toẹt dời'),
(7, 7, '2023-09-26', 'Cưng mà nói luôn'),
(8, 8, '2023-09-27', 'hết cứu'),
(9, 9, '2023-09-28', 'choáy áccccc'),
(10, 10, '2023-09-29', 'Bây để tao yên');