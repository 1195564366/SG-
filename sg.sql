/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 80011
Source Host           : localhost:3306
Source Database       : sg

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2018-08-28 17:51:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `sg_class`
-- ----------------------------
DROP TABLE IF EXISTS `sg_class`;
CREATE TABLE `sg_class` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `name` varchar(10) NOT NULL COMMENT '组名',
  `create_time` bigint(11) NOT NULL COMMENT '添加组类时间',
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sg_class
-- ----------------------------
INSERT INTO `sg_class` VALUES ('17', '测试一组', '1535165979');
INSERT INTO `sg_class` VALUES ('18', '测试二组', '1535178867');
INSERT INTO `sg_class` VALUES ('22', '测试三组', '1535193321');
INSERT INTO `sg_class` VALUES ('23', '测试四组', '1535193327');
INSERT INTO `sg_class` VALUES ('24', '测试五组', '1535193332');
INSERT INTO `sg_class` VALUES ('25', '测试六组', '1535195466');
INSERT INTO `sg_class` VALUES ('26', '正式测试', '1535449286');

-- ----------------------------
-- Table structure for `sg_customer`
-- ----------------------------
DROP TABLE IF EXISTS `sg_customer`;
CREATE TABLE `sg_customer` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户表自增ID',
  `uid` int(11) NOT NULL COMMENT '员工ID',
  `class_id` int(11) NOT NULL COMMENT '分组ID',
  `num` bigint(50) NOT NULL COMMENT '添加客户的数量',
  `create_time` bigint(11) NOT NULL COMMENT '添加客户时间',
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sg_customer
-- ----------------------------
INSERT INTO `sg_customer` VALUES ('63', '16', '17', '1', '1535423504');
INSERT INTO `sg_customer` VALUES ('64', '16', '17', '6', '1535423630');
INSERT INTO `sg_customer` VALUES ('65', '18', '18', '100', '1535427089');
INSERT INTO `sg_customer` VALUES ('66', '33', '26', '50', '1535449446');
INSERT INTO `sg_customer` VALUES ('67', '33', '26', '100', '1535449450');
INSERT INTO `sg_customer` VALUES ('68', '33', '26', '16', '1535449454');
INSERT INTO `sg_customer` VALUES ('69', '33', '26', '14', '1535449459');
INSERT INTO `sg_customer` VALUES ('70', '34', '26', '1', '1535449507');
INSERT INTO `sg_customer` VALUES ('71', '34', '26', '1', '1535449508');
INSERT INTO `sg_customer` VALUES ('72', '34', '26', '1', '1535449509');
INSERT INTO `sg_customer` VALUES ('73', '34', '26', '1', '1535449510');
INSERT INTO `sg_customer` VALUES ('74', '34', '26', '4', '1535449522');
INSERT INTO `sg_customer` VALUES ('75', '35', '26', '7', '1535449531');
INSERT INTO `sg_customer` VALUES ('76', '35', '26', '6', '1535449534');
INSERT INTO `sg_customer` VALUES ('77', '36', '26', '8', '1535449547');
INSERT INTO `sg_customer` VALUES ('78', '36', '26', '5', '1535449549');
INSERT INTO `sg_customer` VALUES ('79', '36', '26', '4', '1535449551');

-- ----------------------------
-- Table structure for `sg_user`
-- ----------------------------
DROP TABLE IF EXISTS `sg_user`;
CREATE TABLE `sg_user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户自增ID',
  `account` varchar(16) NOT NULL COMMENT '账号',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `token` varchar(100) DEFAULT NULL COMMENT 'token',
  `name` varchar(16) NOT NULL COMMENT '姓名',
  `state` bigint(2) NOT NULL COMMENT '职位 1：超级 2：审核员 3：普通',
  `wx_num` varchar(50) DEFAULT NULL COMMENT '员工微信号',
  `class_id` bigint(2) DEFAULT NULL COMMENT '分组',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `last_time` int(11) DEFAULT NULL COMMENT '最后操作时间',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sg_user
-- ----------------------------
INSERT INTO `sg_user` VALUES ('10', 'admin', '82b79b4738ae223f5a24d5a683d2d4cc', '476633e10790d38514f299a17e74aa9b', '李开心', '1', null, null, '1534766525', '1535449695');
INSERT INTO `sg_user` VALUES ('17', 'shenhe1', 'f492f272d07397a3fdf421004fd16aef', null, '审核员一号', '2', null, null, '1535166238', null);
INSERT INTO `sg_user` VALUES ('16', 'ceshi1', '3fade4d3f9a9b0d575b1d132a64bf805', 'a51b61b8eaa2071c52adcfe01137958f', '测试一号', '3', 'wxid_e4v8rfhziggc23', '17', '1535166002', '1535423630');
INSERT INTO `sg_user` VALUES ('18', 'ceshi2', 'ef1ad9fa20bbaad218641745b667fcb4', 'a87a7c1770b4f1a07f91f3dd1a932a78', '测试二号', '3', 'wxid_e4v8rfhziggc22', '18', '1535172066', '1535427089');
INSERT INTO `sg_user` VALUES ('19', 'ceshi3', 'da177164afd030706c25456132cf2bde', 'd55687f20ab5d34497166a46c419c721', '测试三号', '3', 'waynexzw', '17', '1535178906', '1535222162');
INSERT INTO `sg_user` VALUES ('20', 'ceshi5', 'e3860ce74706bd2a5925831f45328e96', '77a99a32e3701bcc6869b18172cb5046', '测试四号', '3', 'ceshi5', '24', '1535195153', '1535267104');
INSERT INTO `sg_user` VALUES ('21', 'ceshi6', '039f022fb25cf9e01fe8266c89ac501b', 'f37512c68f9c719aa1eabd2555ad8c82', '测试六号', '3', '呵呵哒', '22', '1535220747', '1535267173');
INSERT INTO `sg_user` VALUES ('22', 'ceshi7', 'da0018efdc4a6ef9213751e99d980ed2', '53ee0c7d7688e63b7ce9a59bc1fe04ad', '测试七号', '3', '渣渣辉', '22', '1535220768', '1535220985');
INSERT INTO `sg_user` VALUES ('23', 'cheshi8', '7760e3b050e924e667fa3e9ec9a298fc', '94b02a9e8c1ab34b9b2df3e0b0accc4b', '测试八号', '3', '测试八号', '24', '1535220792', '1535222217');
INSERT INTO `sg_user` VALUES ('24', 'ceshi9', '472440737c2133a3f28a6cda2b72bfb4', '50018c79b4a6f0d25fff7681121d5e76', '测试九号', '3', '测试九号', '25', '1535220815', '1535222230');
INSERT INTO `sg_user` VALUES ('25', 'ceshi10', '6b29eb9e39df127ab8be7a4ce0336afc', 'f0b7d4ee6a9c37a913388604089c614a', '测试十号', '3', '测试十号', '25', '1535220834', '1535222242');
INSERT INTO `sg_user` VALUES ('26', 'ceshi11', 'bc4e18061a50c3adc9a77a07f9ab2790', '5e39ce93afb62440d0cd558b9d006307', '测试十一号', '3', '测试十一号', '22', '1535220856', '1535335948');
INSERT INTO `sg_user` VALUES ('27', 'ceshi12', '84f81e21392a82fbfc0a8fee49eab485', '79ffb3b1283438c20094a87a76c5d7f4', '测试十二号', '3', '测试十二号', '18', '1535220880', '1535222273');
INSERT INTO `sg_user` VALUES ('28', 'ceshi13', '51cf1e4f505e0189e744ce5911fb74d7', '8529233e539f35e0f55ad8df2d8827fb', '测试十三号', '3', '测试十三号', '25', '1535220899', '1535222284');
INSERT INTO `sg_user` VALUES ('29', 'ceshi14', '1be12a4725875ead172c3d1bf675043b', '9079a46d91e4f8db822341d81be50ba1', '测试十四号', '3', '测试十四号', '22', '1535220924', '1535346419');
INSERT INTO `sg_user` VALUES ('30', 'ceshi15', '43fcad410b464da690c96844598187cc', 'edd53a547353e0925c1776f07324d42e', 'ceshi15', '3', 'ceshi15', '18', '1535220933', '1535222313');
INSERT INTO `sg_user` VALUES ('31', 'ceshi16', '73bca48e6a8aa7efe8738b2e339ac73f', '83fa441d79f6fdb254236770fc3a5bc9', 'ceshi16', '3', 'ceshi16', '23', '1535220944', '1535222325');
INSERT INTO `sg_user` VALUES ('32', 'ceshi17', 'c85249e87c4e472a5a8ac20729f16593', '181753760cb31d9d784f8d2f28f81806', 'ceshi17', '3', 'ceshi17', '18', '1535220954', '1535222343');
INSERT INTO `sg_user` VALUES ('33', 'zs1111', '2778917abad54ebac63d70edbafa4880', 'f0b7326237a51f9689a2945ad70e1a2c', 'zs1111', '3', 'zs1111', '26', '1535449307', '1535449459');
INSERT INTO `sg_user` VALUES ('34', 'zs2222', '5e98ea52f4eea582feaa255d845d2180', '455993fae4ff0c23dd1943ae94079234', 'zs2222', '3', 'zs2222', '26', '1535449317', '1535449522');
INSERT INTO `sg_user` VALUES ('35', 'zs3333', 'aa2fbca6a59a7f76f4347fcab2f21372', 'a9ec0f87cbbb9facfeb2d1e796e80113', 'zs3333', '3', 'zs3333', '26', '1535449335', '1535449534');
INSERT INTO `sg_user` VALUES ('36', 'zs4444', 'd95e789494cd346854f8aa91e19d50a7', '4c81723d4ea3828f66cc6836e0cb7377', 'zs4444', '3', 'zs4444', '26', '1535449346', '1535449551');

-- ----------------------------
-- Table structure for `sg_user_delete`
-- ----------------------------
DROP TABLE IF EXISTS `sg_user_delete`;
CREATE TABLE `sg_user_delete` (
  `did` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `name` varchar(16) NOT NULL COMMENT '姓名',
  `state` bigint(2) NOT NULL COMMENT '职位',
  `cid` int(11) DEFAULT NULL COMMENT '分组ID',
  `delete_time` bigint(11) NOT NULL COMMENT '删除时间',
  PRIMARY KEY (`did`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sg_user_delete
-- ----------------------------

-- ----------------------------
-- Table structure for `sg_wx_img_log`
-- ----------------------------
DROP TABLE IF EXISTS `sg_wx_img_log`;
CREATE TABLE `sg_wx_img_log` (
  `wid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `wx_img_url` varchar(100) NOT NULL COMMENT '微信截图图片路径',
  `uid` int(11) NOT NULL,
  `create_time` bigint(11) NOT NULL COMMENT '添加时间',
  `wx_num` bigint(11) NOT NULL COMMENT '微信人数',
  PRIMARY KEY (`wid`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sg_wx_img_log
-- ----------------------------
INSERT INTO `sg_wx_img_log` VALUES ('17', 'http://182.61.44.197/api/wximage/测试一组/2018-08-26/测试一号.png', '16', '1535126400', '226');
INSERT INTO `sg_wx_img_log` VALUES ('18', 'http://182.61.44.197/api/wximage/测试二组/2018-08-26/测试二号.png', '18', '1535126400', '1649');
INSERT INTO `sg_wx_img_log` VALUES ('19', 'http://182.61.44.197/api/wximage/测试一组/2018-08-26/测试三号.png', '19', '1535126400', '1430');
INSERT INTO `sg_wx_img_log` VALUES ('20', 'http://182.61.44.197/api/wximage/测试五组/2018-08-26/测试四号.png', '20', '1535126400', '1264');
INSERT INTO `sg_wx_img_log` VALUES ('21', 'http://182.61.44.197/api/wximage/测试三组/2018-08-26/测试六号.png', '21', '1535126400', '1264');
INSERT INTO `sg_wx_img_log` VALUES ('22', 'http://182.61.44.197/api/wximage/测试五组/2018-08-26/测试八号.png', '23', '1535126400', '621');
INSERT INTO `sg_wx_img_log` VALUES ('23', 'http://182.61.44.197/api/wximage/测试六组/2018-08-26/测试九号.png', '24', '1535126400', '438');
INSERT INTO `sg_wx_img_log` VALUES ('24', 'http://182.61.44.197/api/wximage/测试三组/2018-08-26/测试十一号.png', '26', '1535126400', '438');
INSERT INTO `sg_wx_img_log` VALUES ('25', 'http://182.61.44.197/api/wximage/测试二组/2018-08-26/测试十二号.png', '27', '1535126400', '1024');
INSERT INTO `sg_wx_img_log` VALUES ('26', 'http://182.61.44.197/api/wximage/测试六组/2018-08-26/测试十三号.png', '28', '1535126400', '2006');
INSERT INTO `sg_wx_img_log` VALUES ('27', 'http://182.61.44.197/api/wximage/测试三组/2018-08-26/测试十四号.png', '29', '1535126400', '1264');
INSERT INTO `sg_wx_img_log` VALUES ('28', 'http://182.61.44.197/api/wximage/测试二组/2018-08-26/ceshi15.png', '30', '1535126400', '846');
INSERT INTO `sg_wx_img_log` VALUES ('29', 'http://182.61.44.197/api/wximage/测试四组/2018-08-26/ceshi16.png', '31', '1535126400', '1022');
INSERT INTO `sg_wx_img_log` VALUES ('30', 'http://182.61.44.197/api/wximage/测试二组/2018-08-26/ceshi17.png', '32', '1535126400', '1429');
