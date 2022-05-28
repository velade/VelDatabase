"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerList = exports.Dependency = exports.veldatabaseProvider = exports.deactivate = exports.activate = void 0;
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
// import { resolve } from 'path';
// import { rejects } from 'assert';
var charsets = `<span value="" title="與資料庫相同" selected>默認</span>
<span value="armscii8_bin" title="亞美尼亞文, 二進位">armscii8_bin</span>
<span value="armscii8_general_ci" title="亞美尼亞文, 不區分大小寫">armscii8_general_ci</span>
<span value="armscii8_general_nopad_ci" title="亞美尼亞文, no-pad, 不區分大小寫">armscii8_general_nopad_ci</span>
<span value="armscii8_nopad_bin" title="亞美尼亞文, no-pad, 二進位">armscii8_nopad_bin</span>


<span value="ascii_bin" title="西歐文字, 二進位">ascii_bin</span>
<span value="ascii_general_ci" title="西歐文字, 不區分大小寫">ascii_general_ci</span>
<span value="ascii_general_nopad_ci" title="西歐文字, no-pad, 不區分大小寫">ascii_general_nopad_ci</span>
<span value="ascii_nopad_bin" title="西歐文字, no-pad, 二進位">ascii_nopad_bin</span>


<span value="big5_bin" title="繁體中文, 二進位">big5_bin</span>
<span value="big5_chinese_ci" title="繁體中文, 不區分大小寫">big5_chinese_ci</span>
<span value="big5_chinese_nopad_ci" title="繁體中文, no-pad, 不區分大小寫">big5_chinese_nopad_ci</span>
<span value="big5_nopad_bin" title="繁體中文, no-pad, 二進位">big5_nopad_bin</span>


<span value="binary" title="二進制碼">binary</span>


<span value="cp1250_bin" title="中歐文字, 二進位">cp1250_bin</span>
<span value="cp1250_croatian_ci" title="克羅埃西亞文, 不區分大小寫">cp1250_croatian_ci</span>
<span value="cp1250_czech_cs" title="捷克文, 區分大小寫">cp1250_czech_cs</span>
<span value="cp1250_general_ci" title="中歐文字, 不區分大小寫">cp1250_general_ci</span>
<span value="cp1250_general_nopad_ci" title="中歐文字, no-pad, 不區分大小寫">cp1250_general_nopad_ci</span>
<span value="cp1250_nopad_bin" title="中歐文字, no-pad, 二進位">cp1250_nopad_bin</span>
<span value="cp1250_polish_ci" title="波蘭文, 不區分大小寫">cp1250_polish_ci</span>


<span value="cp1251_bin" title="西里爾文字, 二進位">cp1251_bin</span>
<span value="cp1251_bulgarian_ci" title="保加利亞文, 不區分大小寫">cp1251_bulgarian_ci</span>
<span value="cp1251_general_ci" title="西里爾文字, 不區分大小寫">cp1251_general_ci</span>
<span value="cp1251_general_cs" title="西里爾文字, 區分大小寫">cp1251_general_cs</span>
<span value="cp1251_general_nopad_ci" title="西里爾文字, no-pad, 不區分大小寫">cp1251_general_nopad_ci</span>
<span value="cp1251_nopad_bin" title="西里爾文字, no-pad, 二進位">cp1251_nopad_bin</span>
<span value="cp1251_ukrainian_ci" title="烏克蘭文, 不區分大小寫">cp1251_ukrainian_ci</span>


<span value="cp1256_bin" title="阿拉伯文, 二進位">cp1256_bin</span>
<span value="cp1256_general_ci" title="阿拉伯文, 不區分大小寫">cp1256_general_ci</span>
<span value="cp1256_general_nopad_ci" title="阿拉伯文, no-pad, 不區分大小寫">cp1256_general_nopad_ci</span>
<span value="cp1256_nopad_bin" title="阿拉伯文, no-pad, 二進位">cp1256_nopad_bin</span>


<span value="cp1257_bin" title="波羅的海文字, 二進位">cp1257_bin</span>
<span value="cp1257_general_ci" title="波羅的海文字, 不區分大小寫">cp1257_general_ci</span>
<span value="cp1257_general_nopad_ci" title="波羅的海文字, no-pad, 不區分大小寫">cp1257_general_nopad_ci</span>
<span value="cp1257_lithuanian_ci" title="立陶宛文, 不區分大小寫">cp1257_lithuanian_ci</span>
<span value="cp1257_nopad_bin" title="波羅的海文字, no-pad, 二進位">cp1257_nopad_bin</span>


<span value="cp850_bin" title="西歐文字, 二進位">cp850_bin</span>
<span value="cp850_general_ci" title="西歐文字, 不區分大小寫">cp850_general_ci</span>
<span value="cp850_general_nopad_ci" title="西歐文字, no-pad, 不區分大小寫">cp850_general_nopad_ci</span>
<span value="cp850_nopad_bin" title="西歐文字, no-pad, 二進位">cp850_nopad_bin</span>


<span value="cp852_bin" title="中歐文字, 二進位">cp852_bin</span>
<span value="cp852_general_ci" title="中歐文字, 不區分大小寫">cp852_general_ci</span>
<span value="cp852_general_nopad_ci" title="中歐文字, no-pad, 不區分大小寫">cp852_general_nopad_ci</span>
<span value="cp852_nopad_bin" title="中歐文字, no-pad, 二進位">cp852_nopad_bin</span>


<span value="cp866_bin" title="俄文, 二進位">cp866_bin</span>
<span value="cp866_general_ci" title="俄文, 不區分大小寫">cp866_general_ci</span>
<span value="cp866_general_nopad_ci" title="俄文, no-pad, 不區分大小寫">cp866_general_nopad_ci</span>
<span value="cp866_nopad_bin" title="俄文, no-pad, 二進位">cp866_nopad_bin</span>


<span value="cp932_bin" title="日文, 二進位">cp932_bin</span>
<span value="cp932_japanese_ci" title="日文, 不區分大小寫">cp932_japanese_ci</span>
<span value="cp932_japanese_nopad_ci" title="日文, no-pad, 不區分大小寫">cp932_japanese_nopad_ci</span>
<span value="cp932_nopad_bin" title="日文, no-pad, 二進位">cp932_nopad_bin</span>


<span value="dec8_bin" title="西歐文字, 二進位">dec8_bin</span>
<span value="dec8_nopad_bin" title="西歐文字, no-pad, 二進位">dec8_nopad_bin</span>
<span value="dec8_swedish_ci" title="瑞典文, 不區分大小寫">dec8_swedish_ci</span>
<span value="dec8_swedish_nopad_ci" title="瑞典文, no-pad, 不區分大小寫">dec8_swedish_nopad_ci</span>


<span value="eucjpms_bin" title="日文, 二進位">eucjpms_bin</span>
<span value="eucjpms_japanese_ci" title="日文, 不區分大小寫">eucjpms_japanese_ci</span>
<span value="eucjpms_japanese_nopad_ci" title="日文, no-pad, 不區分大小寫">eucjpms_japanese_nopad_ci</span>
<span value="eucjpms_nopad_bin" title="日文, no-pad, 二進位">eucjpms_nopad_bin</span>


<span value="euckr_bin" title="韓文, 二進位">euckr_bin</span>
<span value="euckr_korean_ci" title="韓文, 不區分大小寫">euckr_korean_ci</span>
<span value="euckr_korean_nopad_ci" title="韓文, no-pad, 不區分大小寫">euckr_korean_nopad_ci</span>
<span value="euckr_nopad_bin" title="韓文, no-pad, 二進位">euckr_nopad_bin</span>


<span value="gb2312_bin" title="簡體中文, 二進位">gb2312_bin</span>
<span value="gb2312_chinese_ci" title="簡體中文, 不區分大小寫">gb2312_chinese_ci</span>
<span value="gb2312_chinese_nopad_ci" title="簡體中文, no-pad, 不區分大小寫">gb2312_chinese_nopad_ci</span>
<span value="gb2312_nopad_bin" title="簡體中文, no-pad, 二進位">gb2312_nopad_bin</span>


<span value="gbk_bin" title="簡體中文, 二進位">gbk_bin</span>
<span value="gbk_chinese_ci" title="簡體中文, 不區分大小寫">gbk_chinese_ci</span>
<span value="gbk_chinese_nopad_ci" title="簡體中文, no-pad, 不區分大小寫">gbk_chinese_nopad_ci</span>
<span value="gbk_nopad_bin" title="簡體中文, no-pad, 二進位">gbk_nopad_bin</span>


<span value="geostd8_bin" title="喬治亞文, 二進位">geostd8_bin</span>
<span value="geostd8_general_ci" title="喬治亞文, 不區分大小寫">geostd8_general_ci</span>
<span value="geostd8_general_nopad_ci" title="喬治亞文, no-pad, 不區分大小寫">geostd8_general_nopad_ci</span>
<span value="geostd8_nopad_bin" title="喬治亞文, no-pad, 二進位">geostd8_nopad_bin</span>


<span value="greek_bin" title="希臘文, 二進位">greek_bin</span>
<span value="greek_general_ci" title="希臘文, 不區分大小寫">greek_general_ci</span>
<span value="greek_general_nopad_ci" title="希臘文, no-pad, 不區分大小寫">greek_general_nopad_ci</span>
<span value="greek_nopad_bin" title="希臘文, no-pad, 二進位">greek_nopad_bin</span>


<span value="hebrew_bin" title="希伯來文, 二進位">hebrew_bin</span>
<span value="hebrew_general_ci" title="希伯來文, 不區分大小寫">hebrew_general_ci</span>
<span value="hebrew_general_nopad_ci" title="希伯來文, no-pad, 不區分大小寫">hebrew_general_nopad_ci</span>
<span value="hebrew_nopad_bin" title="希伯來文, no-pad, 二進位">hebrew_nopad_bin</span>


<span value="hp8_bin" title="西歐文字, 二進位">hp8_bin</span>
<span value="hp8_english_ci" title="英文, 不區分大小寫">hp8_english_ci</span>
<span value="hp8_english_nopad_ci" title="英文, no-pad, 不區分大小寫">hp8_english_nopad_ci</span>
<span value="hp8_nopad_bin" title="西歐文字, no-pad, 二進位">hp8_nopad_bin</span>


<span value="keybcs2_bin" title="捷克斯洛伐克文, 二進位">keybcs2_bin</span>
<span value="keybcs2_general_ci" title="捷克斯洛伐克文, 不區分大小寫">keybcs2_general_ci</span>
<span value="keybcs2_general_nopad_ci" title="捷克斯洛伐克文, no-pad, 不區分大小寫">keybcs2_general_nopad_ci</span>
<span value="keybcs2_nopad_bin" title="捷克斯洛伐克文, no-pad, 二進位">keybcs2_nopad_bin</span>


<span value="koi8r_bin" title="俄文, 二進位">koi8r_bin</span>
<span value="koi8r_general_ci" title="俄文, 不區分大小寫">koi8r_general_ci</span>
<span value="koi8r_general_nopad_ci" title="俄文, no-pad, 不區分大小寫">koi8r_general_nopad_ci</span>
<span value="koi8r_nopad_bin" title="俄文, no-pad, 二進位">koi8r_nopad_bin</span>


<span value="koi8u_bin" title="烏克蘭文, 二進位">koi8u_bin</span>
<span value="koi8u_general_ci" title="烏克蘭文, 不區分大小寫">koi8u_general_ci</span>
<span value="koi8u_general_nopad_ci" title="烏克蘭文, no-pad, 不區分大小寫">koi8u_general_nopad_ci</span>
<span value="koi8u_nopad_bin" title="烏克蘭文, no-pad, 二進位">koi8u_nopad_bin</span>


<span value="latin1_bin" title="西歐文字, 二進位">latin1_bin</span>
<span value="latin1_danish_ci" title="丹麥文, 不區分大小寫">latin1_danish_ci</span>
<span value="latin1_general_ci" title="西歐文字, 不區分大小寫">latin1_general_ci</span>
<span value="latin1_general_cs" title="西歐文字, 區分大小寫">latin1_general_cs</span>
<span value="latin1_german1_ci" title="德文 (字典排序), 不區分大小寫">latin1_german1_ci</span>
<span value="latin1_german2_ci" title="德文 (通訊錄排序), 不區分大小寫">latin1_german2_ci</span>
<span value="latin1_nopad_bin" title="西歐文字, no-pad, 二進位">latin1_nopad_bin</span>
<span value="latin1_spanish_ci" title="西班牙文 (現代), 不區分大小寫">latin1_spanish_ci</span>
<span value="latin1_swedish_ci" title="瑞典文, 不區分大小寫">latin1_swedish_ci</span>
<span value="latin1_swedish_nopad_ci" title="瑞典文, no-pad, 不區分大小寫">latin1_swedish_nopad_ci</span>


<span value="latin2_bin" title="中歐文字, 二進位">latin2_bin</span>
<span value="latin2_croatian_ci" title="克羅埃西亞文, 不區分大小寫">latin2_croatian_ci</span>
<span value="latin2_czech_cs" title="捷克文, 區分大小寫">latin2_czech_cs</span>
<span value="latin2_general_ci" title="中歐文字, 不區分大小寫">latin2_general_ci</span>
<span value="latin2_general_nopad_ci" title="中歐文字, no-pad, 不區分大小寫">latin2_general_nopad_ci</span>
<span value="latin2_hungarian_ci" title="匈牙利文, 不區分大小寫">latin2_hungarian_ci</span>
<span value="latin2_nopad_bin" title="中歐文字, no-pad, 二進位">latin2_nopad_bin</span>


<span value="latin5_bin" title="土耳其文, 二進位">latin5_bin</span>
<span value="latin5_nopad_bin" title="土耳其文, no-pad, 二進位">latin5_nopad_bin</span>
<span value="latin5_turkish_ci" title="土耳其文, 不區分大小寫">latin5_turkish_ci</span>
<span value="latin5_turkish_nopad_ci" title="土耳其文, no-pad, 不區分大小寫">latin5_turkish_nopad_ci</span>


<span value="latin7_bin" title="波羅的海文字, 二進位">latin7_bin</span>
<span value="latin7_estonian_cs" title="愛沙尼亞文, 區分大小寫">latin7_estonian_cs</span>
<span value="latin7_general_ci" title="波羅的海文字, 不區分大小寫">latin7_general_ci</span>
<span value="latin7_general_cs" title="波羅的海文字, 區分大小寫">latin7_general_cs</span>
<span value="latin7_general_nopad_ci" title="波羅的海文字, no-pad, 不區分大小寫">latin7_general_nopad_ci</span>
<span value="latin7_nopad_bin" title="波羅的海文字, no-pad, 二進位">latin7_nopad_bin</span>


<span value="macce_bin" title="中歐文字, 二進位">macce_bin</span>
<span value="macce_general_ci" title="中歐文字, 不區分大小寫">macce_general_ci</span>
<span value="macce_general_nopad_ci" title="中歐文字, no-pad, 不區分大小寫">macce_general_nopad_ci</span>
<span value="macce_nopad_bin" title="中歐文字, no-pad, 二進位">macce_nopad_bin</span>


<span value="macroman_bin" title="西歐文字, 二進位">macroman_bin</span>
<span value="macroman_general_ci" title="西歐文字, 不區分大小寫">macroman_general_ci</span>
<span value="macroman_general_nopad_ci" title="西歐文字, no-pad, 不區分大小寫">macroman_general_nopad_ci</span>
<span value="macroman_nopad_bin" title="西歐文字, no-pad, 二進位">macroman_nopad_bin</span>


<span value="sjis_bin" title="日文, 二進位">sjis_bin</span>
<span value="sjis_japanese_ci" title="日文, 不區分大小寫">sjis_japanese_ci</span>
<span value="sjis_japanese_nopad_ci" title="日文, no-pad, 不區分大小寫">sjis_japanese_nopad_ci</span>
<span value="sjis_nopad_bin" title="日文, no-pad, 二進位">sjis_nopad_bin</span>


<span value="swe7_bin" title="瑞典文, 二進位">swe7_bin</span>
<span value="swe7_nopad_bin" title="瑞典文, no-pad, 二進位">swe7_nopad_bin</span>
<span value="swe7_swedish_ci" title="瑞典文, 不區分大小寫">swe7_swedish_ci</span>
<span value="swe7_swedish_nopad_ci" title="瑞典文, no-pad, 不區分大小寫">swe7_swedish_nopad_ci</span>


<span value="tis620_bin" title="泰文, 二進位">tis620_bin</span>
<span value="tis620_nopad_bin" title="泰文, no-pad, 二進位">tis620_nopad_bin</span>
<span value="tis620_thai_ci" title="泰文, 不區分大小寫">tis620_thai_ci</span>
<span value="tis620_thai_nopad_ci" title="泰文, no-pad, 不區分大小寫">tis620_thai_nopad_ci</span>


<span value="ucs2_bin" title="Unicode, 二進位">ucs2_bin</span>
<span value="ucs2_croatian_ci" title="克羅埃西亞文, 不區分大小寫">ucs2_croatian_ci</span>
<span value="ucs2_croatian_mysql561_ci" title="克羅埃西亞文 (MySQL 5.6.1), 不區分大小寫">ucs2_croatian_mysql561_ci</span>
<span value="ucs2_czech_ci" title="捷克文, 不區分大小寫">ucs2_czech_ci</span>
<span value="ucs2_danish_ci" title="丹麥文, 不區分大小寫">ucs2_danish_ci</span>
<span value="ucs2_esperanto_ci" title="世界語, 不區分大小寫">ucs2_esperanto_ci</span>
<span value="ucs2_estonian_ci" title="愛沙尼亞文, 不區分大小寫">ucs2_estonian_ci</span>
<span value="ucs2_general_ci" title="Unicode, 不區分大小寫">ucs2_general_ci</span>
<span value="ucs2_general_mysql500_ci" title="Unicode (MySQL 5.0.0), 不區分大小寫">ucs2_general_mysql500_ci</span>
<span value="ucs2_general_nopad_ci" title="Unicode, no-pad, 不區分大小寫">ucs2_general_nopad_ci</span>
<span value="ucs2_german2_ci" title="德文 (通訊錄排序), 不區分大小寫">ucs2_german2_ci</span>
<span value="ucs2_hungarian_ci" title="匈牙利文, 不區分大小寫">ucs2_hungarian_ci</span>
<span value="ucs2_icelandic_ci" title="冰島文, 不區分大小寫">ucs2_icelandic_ci</span>
<span value="ucs2_latvian_ci" title="拉脫維亞文, 不區分大小寫">ucs2_latvian_ci</span>
<span value="ucs2_lithuanian_ci" title="立陶宛文, 不區分大小寫">ucs2_lithuanian_ci</span>
<span value="ucs2_myanmar_ci" title="緬甸文, 不區分大小寫">ucs2_myanmar_ci</span>
<span value="ucs2_nopad_bin" title="Unicode, no-pad, 二進位">ucs2_nopad_bin</span>
<span value="ucs2_persian_ci" title="波斯文, 不區分大小寫">ucs2_persian_ci</span>
<span value="ucs2_polish_ci" title="波蘭文, 不區分大小寫">ucs2_polish_ci</span>
<span value="ucs2_roman_ci" title="西歐文字, 不區分大小寫">ucs2_roman_ci</span>
<span value="ucs2_romanian_ci" title="羅馬尼亞文, 不區分大小寫">ucs2_romanian_ci</span>
<span value="ucs2_sinhala_ci" title="僧伽羅文, 不區分大小寫">ucs2_sinhala_ci</span>
<span value="ucs2_slovak_ci" title="斯洛伐克文, 不區分大小寫">ucs2_slovak_ci</span>
<span value="ucs2_slovenian_ci" title="斯洛維尼亞文, 不區分大小寫">ucs2_slovenian_ci</span>
<span value="ucs2_spanish2_ci" title="西班牙文 (傳統), 不區分大小寫">ucs2_spanish2_ci</span>
<span value="ucs2_spanish_ci" title="西班牙文 (現代), 不區分大小寫">ucs2_spanish_ci</span>
<span value="ucs2_swedish_ci" title="瑞典文, 不區分大小寫">ucs2_swedish_ci</span>
<span value="ucs2_thai_520_w2" title="泰文 (UCA 5.2.0), 多層次">ucs2_thai_520_w2</span>
<span value="ucs2_turkish_ci" title="土耳其文, 不區分大小寫">ucs2_turkish_ci</span>
<span value="ucs2_unicode_520_ci" title="Unicode (UCA 5.2.0), 不區分大小寫">ucs2_unicode_520_ci</span>
<span value="ucs2_unicode_520_nopad_ci" title="Unicode (UCA 5.2.0), no-pad, 不區分大小寫">ucs2_unicode_520_nopad_ci</span>
<span value="ucs2_unicode_ci" title="Unicode, 不區分大小寫">ucs2_unicode_ci</span>
<span value="ucs2_unicode_nopad_ci" title="Unicode, no-pad, 不區分大小寫">ucs2_unicode_nopad_ci</span>
<span value="ucs2_vietnamese_ci" title="越南文, 不區分大小寫">ucs2_vietnamese_ci</span>


<span value="ujis_bin" title="日文, 二進位">ujis_bin</span>
<span value="ujis_japanese_ci" title="日文, 不區分大小寫">ujis_japanese_ci</span>
<span value="ujis_japanese_nopad_ci" title="日文, no-pad, 不區分大小寫">ujis_japanese_nopad_ci</span>
<span value="ujis_nopad_bin" title="日文, no-pad, 二進位">ujis_nopad_bin</span>


<span value="utf16_bin" title="Unicode, 二進位">utf16_bin</span>
<span value="utf16_croatian_ci" title="克羅埃西亞文, 不區分大小寫">utf16_croatian_ci</span>
<span value="utf16_croatian_mysql561_ci" title="克羅埃西亞文 (MySQL 5.6.1), 不區分大小寫">utf16_croatian_mysql561_ci</span>
<span value="utf16_czech_ci" title="捷克文, 不區分大小寫">utf16_czech_ci</span>
<span value="utf16_danish_ci" title="丹麥文, 不區分大小寫">utf16_danish_ci</span>
<span value="utf16_esperanto_ci" title="世界語, 不區分大小寫">utf16_esperanto_ci</span>
<span value="utf16_estonian_ci" title="愛沙尼亞文, 不區分大小寫">utf16_estonian_ci</span>
<span value="utf16_general_ci" title="Unicode, 不區分大小寫">utf16_general_ci</span>
<span value="utf16_general_nopad_ci" title="Unicode, no-pad, 不區分大小寫">utf16_general_nopad_ci</span>
<span value="utf16_german2_ci" title="德文 (通訊錄排序), 不區分大小寫">utf16_german2_ci</span>
<span value="utf16_hungarian_ci" title="匈牙利文, 不區分大小寫">utf16_hungarian_ci</span>
<span value="utf16_icelandic_ci" title="冰島文, 不區分大小寫">utf16_icelandic_ci</span>
<span value="utf16_latvian_ci" title="拉脫維亞文, 不區分大小寫">utf16_latvian_ci</span>
<span value="utf16_lithuanian_ci" title="立陶宛文, 不區分大小寫">utf16_lithuanian_ci</span>
<span value="utf16_myanmar_ci" title="緬甸文, 不區分大小寫">utf16_myanmar_ci</span>
<span value="utf16_nopad_bin" title="Unicode, no-pad, 二進位">utf16_nopad_bin</span>
<span value="utf16_persian_ci" title="波斯文, 不區分大小寫">utf16_persian_ci</span>
<span value="utf16_polish_ci" title="波蘭文, 不區分大小寫">utf16_polish_ci</span>
<span value="utf16_roman_ci" title="西歐文字, 不區分大小寫">utf16_roman_ci</span>
<span value="utf16_romanian_ci" title="羅馬尼亞文, 不區分大小寫">utf16_romanian_ci</span>
<span value="utf16_sinhala_ci" title="僧伽羅文, 不區分大小寫">utf16_sinhala_ci</span>
<span value="utf16_slovak_ci" title="斯洛伐克文, 不區分大小寫">utf16_slovak_ci</span>
<span value="utf16_slovenian_ci" title="斯洛維尼亞文, 不區分大小寫">utf16_slovenian_ci</span>
<span value="utf16_spanish2_ci" title="西班牙文 (傳統), 不區分大小寫">utf16_spanish2_ci</span>
<span value="utf16_spanish_ci" title="西班牙文 (現代), 不區分大小寫">utf16_spanish_ci</span>
<span value="utf16_swedish_ci" title="瑞典文, 不區分大小寫">utf16_swedish_ci</span>
<span value="utf16_thai_520_w2" title="泰文 (UCA 5.2.0), 多層次">utf16_thai_520_w2</span>
<span value="utf16_turkish_ci" title="土耳其文, 不區分大小寫">utf16_turkish_ci</span>
<span value="utf16_unicode_520_ci" title="Unicode (UCA 5.2.0), 不區分大小寫">utf16_unicode_520_ci</span>
<span value="utf16_unicode_520_nopad_ci" title="Unicode (UCA 5.2.0), no-pad, 不區分大小寫">utf16_unicode_520_nopad_ci</span>
<span value="utf16_unicode_ci" title="Unicode, 不區分大小寫">utf16_unicode_ci</span>
<span value="utf16_unicode_nopad_ci" title="Unicode, no-pad, 不區分大小寫">utf16_unicode_nopad_ci</span>
<span value="utf16_vietnamese_ci" title="越南文, 不區分大小寫">utf16_vietnamese_ci</span>


<span value="utf16le_bin" title="Unicode, 二進位">utf16le_bin</span>
<span value="utf16le_general_ci" title="Unicode, 不區分大小寫">utf16le_general_ci</span>
<span value="utf16le_general_nopad_ci" title="Unicode, no-pad, 不區分大小寫">utf16le_general_nopad_ci</span>
<span value="utf16le_nopad_bin" title="Unicode, no-pad, 二進位">utf16le_nopad_bin</span>


<span value="utf32_bin" title="Unicode, 二進位">utf32_bin</span>
<span value="utf32_croatian_ci" title="克羅埃西亞文, 不區分大小寫">utf32_croatian_ci</span>
<span value="utf32_croatian_mysql561_ci" title="克羅埃西亞文 (MySQL 5.6.1), 不區分大小寫">utf32_croatian_mysql561_ci</span>
<span value="utf32_czech_ci" title="捷克文, 不區分大小寫">utf32_czech_ci</span>
<span value="utf32_danish_ci" title="丹麥文, 不區分大小寫">utf32_danish_ci</span>
<span value="utf32_esperanto_ci" title="世界語, 不區分大小寫">utf32_esperanto_ci</span>
<span value="utf32_estonian_ci" title="愛沙尼亞文, 不區分大小寫">utf32_estonian_ci</span>
<span value="utf32_general_ci" title="Unicode, 不區分大小寫">utf32_general_ci</span>
<span value="utf32_general_nopad_ci" title="Unicode, no-pad, 不區分大小寫">utf32_general_nopad_ci</span>
<span value="utf32_german2_ci" title="德文 (通訊錄排序), 不區分大小寫">utf32_german2_ci</span>
<span value="utf32_hungarian_ci" title="匈牙利文, 不區分大小寫">utf32_hungarian_ci</span>
<span value="utf32_icelandic_ci" title="冰島文, 不區分大小寫">utf32_icelandic_ci</span>
<span value="utf32_latvian_ci" title="拉脫維亞文, 不區分大小寫">utf32_latvian_ci</span>
<span value="utf32_lithuanian_ci" title="立陶宛文, 不區分大小寫">utf32_lithuanian_ci</span>
<span value="utf32_myanmar_ci" title="緬甸文, 不區分大小寫">utf32_myanmar_ci</span>
<span value="utf32_nopad_bin" title="Unicode, no-pad, 二進位">utf32_nopad_bin</span>
<span value="utf32_persian_ci" title="波斯文, 不區分大小寫">utf32_persian_ci</span>
<span value="utf32_polish_ci" title="波蘭文, 不區分大小寫">utf32_polish_ci</span>
<span value="utf32_roman_ci" title="西歐文字, 不區分大小寫">utf32_roman_ci</span>
<span value="utf32_romanian_ci" title="羅馬尼亞文, 不區分大小寫">utf32_romanian_ci</span>
<span value="utf32_sinhala_ci" title="僧伽羅文, 不區分大小寫">utf32_sinhala_ci</span>
<span value="utf32_slovak_ci" title="斯洛伐克文, 不區分大小寫">utf32_slovak_ci</span>
<span value="utf32_slovenian_ci" title="斯洛維尼亞文, 不區分大小寫">utf32_slovenian_ci</span>
<span value="utf32_spanish2_ci" title="西班牙文 (傳統), 不區分大小寫">utf32_spanish2_ci</span>
<span value="utf32_spanish_ci" title="西班牙文 (現代), 不區分大小寫">utf32_spanish_ci</span>
<span value="utf32_swedish_ci" title="瑞典文, 不區分大小寫">utf32_swedish_ci</span>
<span value="utf32_thai_520_w2" title="泰文 (UCA 5.2.0), 多層次">utf32_thai_520_w2</span>
<span value="utf32_turkish_ci" title="土耳其文, 不區分大小寫">utf32_turkish_ci</span>
<span value="utf32_unicode_520_ci" title="Unicode (UCA 5.2.0), 不區分大小寫">utf32_unicode_520_ci</span>
<span value="utf32_unicode_520_nopad_ci" title="Unicode (UCA 5.2.0), no-pad, 不區分大小寫">utf32_unicode_520_nopad_ci</span>
<span value="utf32_unicode_ci" title="Unicode, 不區分大小寫">utf32_unicode_ci</span>
<span value="utf32_unicode_nopad_ci" title="Unicode, no-pad, 不區分大小寫">utf32_unicode_nopad_ci</span>
<span value="utf32_vietnamese_ci" title="越南文, 不區分大小寫">utf32_vietnamese_ci</span>


<span value="utf8mb3_bin" title="不明, 二進位">utf8mb3_bin</span>
<span value="utf8mb3_croatian_ci" title="克羅埃西亞文, 不區分大小寫">utf8mb3_croatian_ci</span>
<span value="utf8mb3_croatian_mysql561_ci" title="克羅埃西亞文 (MySQL 5.6.1), 不區分大小寫">utf8mb3_croatian_mysql561_ci</span>
<span value="utf8mb3_czech_ci" title="捷克文, 不區分大小寫">utf8mb3_czech_ci</span>
<span value="utf8mb3_danish_ci" title="丹麥文, 不區分大小寫">utf8mb3_danish_ci</span>
<span value="utf8mb3_esperanto_ci" title="世界語, 不區分大小寫">utf8mb3_esperanto_ci</span>
<span value="utf8mb3_estonian_ci" title="愛沙尼亞文, 不區分大小寫">utf8mb3_estonian_ci</span>
<span value="utf8mb3_general_ci" title="不明, 不區分大小寫">utf8mb3_general_ci</span>
<span value="utf8mb3_general_mysql500_ci" title="不明 (MySQL 5.0.0), 不區分大小寫">utf8mb3_general_mysql500_ci</span>
<span value="utf8mb3_general_nopad_ci" title="不明, no-pad, 不區分大小寫">utf8mb3_general_nopad_ci</span>
<span value="utf8mb3_german2_ci" title="德文 (通訊錄排序), 不區分大小寫">utf8mb3_german2_ci</span>
<span value="utf8mb3_hungarian_ci" title="匈牙利文, 不區分大小寫">utf8mb3_hungarian_ci</span>
<span value="utf8mb3_icelandic_ci" title="冰島文, 不區分大小寫">utf8mb3_icelandic_ci</span>
<span value="utf8mb3_latvian_ci" title="拉脫維亞文, 不區分大小寫">utf8mb3_latvian_ci</span>
<span value="utf8mb3_lithuanian_ci" title="立陶宛文, 不區分大小寫">utf8mb3_lithuanian_ci</span>
<span value="utf8mb3_myanmar_ci" title="緬甸文, 不區分大小寫">utf8mb3_myanmar_ci</span>
<span value="utf8mb3_nopad_bin" title="不明, no-pad, 二進位">utf8mb3_nopad_bin</span>
<span value="utf8mb3_persian_ci" title="波斯文, 不區分大小寫">utf8mb3_persian_ci</span>
<span value="utf8mb3_polish_ci" title="波蘭文, 不區分大小寫">utf8mb3_polish_ci</span>
<span value="utf8mb3_roman_ci" title="西歐文字, 不區分大小寫">utf8mb3_roman_ci</span>
<span value="utf8mb3_romanian_ci" title="羅馬尼亞文, 不區分大小寫">utf8mb3_romanian_ci</span>
<span value="utf8mb3_sinhala_ci" title="僧伽羅文, 不區分大小寫">utf8mb3_sinhala_ci</span>
<span value="utf8mb3_slovak_ci" title="斯洛伐克文, 不區分大小寫">utf8mb3_slovak_ci</span>
<span value="utf8mb3_slovenian_ci" title="斯洛維尼亞文, 不區分大小寫">utf8mb3_slovenian_ci</span>
<span value="utf8mb3_spanish2_ci" title="西班牙文 (傳統), 不區分大小寫">utf8mb3_spanish2_ci</span>
<span value="utf8mb3_spanish_ci" title="西班牙文 (現代), 不區分大小寫">utf8mb3_spanish_ci</span>
<span value="utf8mb3_swedish_ci" title="瑞典文, 不區分大小寫">utf8mb3_swedish_ci</span>
<span value="utf8mb3_thai_520_w2" title="泰文 (UCA 5.2.0), 多層次">utf8mb3_thai_520_w2</span>
<span value="utf8mb3_turkish_ci" title="土耳其文, 不區分大小寫">utf8mb3_turkish_ci</span>
<span value="utf8mb3_unicode_520_ci" title="Unicode (UCA 5.2.0), 不區分大小寫">utf8mb3_unicode_520_ci</span>
<span value="utf8mb3_unicode_520_nopad_ci" title="Unicode (UCA 5.2.0), no-pad, 不區分大小寫">utf8mb3_unicode_520_nopad_ci</span>
<span value="utf8mb3_unicode_ci" title="Unicode, 不區分大小寫">utf8mb3_unicode_ci</span>
<span value="utf8mb3_unicode_nopad_ci" title="Unicode, no-pad, 不區分大小寫">utf8mb3_unicode_nopad_ci</span>
<span value="utf8mb3_vietnamese_ci" title="越南文, 不區分大小寫">utf8mb3_vietnamese_ci</span>


<span value="utf8mb4_bin" title="Unicode (UCA 4.0.0), 二進位">utf8mb4_bin</span>
<span value="utf8mb4_croatian_ci" title="克羅埃西亞文 (UCA 4.0.0), 不區分大小寫">utf8mb4_croatian_ci</span>
<span value="utf8mb4_croatian_mysql561_ci" title="克羅埃西亞文 (MySQL 5.6.1), 不區分大小寫">utf8mb4_croatian_mysql561_ci</span>
<span value="utf8mb4_czech_ci" title="捷克文 (UCA 4.0.0), 不區分大小寫">utf8mb4_czech_ci</span>
<span value="utf8mb4_danish_ci" title="丹麥文 (UCA 4.0.0), 不區分大小寫">utf8mb4_danish_ci</span>
<span value="utf8mb4_esperanto_ci" title="世界語 (UCA 4.0.0), 不區分大小寫">utf8mb4_esperanto_ci</span>
<span value="utf8mb4_estonian_ci" title="愛沙尼亞文 (UCA 4.0.0), 不區分大小寫">utf8mb4_estonian_ci</span>
<span value="utf8mb4_general_ci" title="Unicode (UCA 4.0.0), 不區分大小寫">utf8mb4_general_ci</span>
<span value="utf8mb4_general_nopad_ci" title="Unicode (UCA 4.0.0), no-pad, 不區分大小寫">utf8mb4_general_nopad_ci</span>
<span value="utf8mb4_german2_ci" title="德文 (通訊錄排序) (UCA 4.0.0), 不區分大小寫">utf8mb4_german2_ci</span>
<span value="utf8mb4_hungarian_ci" title="匈牙利文 (UCA 4.0.0), 不區分大小寫">utf8mb4_hungarian_ci</span>
<span value="utf8mb4_icelandic_ci" title="冰島文 (UCA 4.0.0), 不區分大小寫">utf8mb4_icelandic_ci</span>
<span value="utf8mb4_latvian_ci" title="拉脫維亞文 (UCA 4.0.0), 不區分大小寫">utf8mb4_latvian_ci</span>
<span value="utf8mb4_lithuanian_ci" title="立陶宛文 (UCA 4.0.0), 不區分大小寫">utf8mb4_lithuanian_ci</span>
<span value="utf8mb4_myanmar_ci" title="緬甸文 (UCA 4.0.0), 不區分大小寫">utf8mb4_myanmar_ci</span>
<span value="utf8mb4_nopad_bin" title="Unicode (UCA 4.0.0), no-pad, 二進位">utf8mb4_nopad_bin</span>
<span value="utf8mb4_persian_ci" title="波斯文 (UCA 4.0.0), 不區分大小寫">utf8mb4_persian_ci</span>
<span value="utf8mb4_polish_ci" title="波蘭文 (UCA 4.0.0), 不區分大小寫">utf8mb4_polish_ci</span>
<span value="utf8mb4_roman_ci" title="西歐文字 (UCA 4.0.0), 不區分大小寫">utf8mb4_roman_ci</span>
<span value="utf8mb4_romanian_ci" title="羅馬尼亞文 (UCA 4.0.0), 不區分大小寫">utf8mb4_romanian_ci</span>
<span value="utf8mb4_sinhala_ci" title="僧伽羅文 (UCA 4.0.0), 不區分大小寫">utf8mb4_sinhala_ci</span>
<span value="utf8mb4_slovak_ci" title="斯洛伐克文 (UCA 4.0.0), 不區分大小寫">utf8mb4_slovak_ci</span>
<span value="utf8mb4_slovenian_ci" title="斯洛維尼亞文 (UCA 4.0.0), 不區分大小寫">utf8mb4_slovenian_ci</span>
<span value="utf8mb4_spanish2_ci" title="西班牙文 (傳統) (UCA 4.0.0), 不區分大小寫">utf8mb4_spanish2_ci</span>
<span value="utf8mb4_spanish_ci" title="西班牙文 (現代) (UCA 4.0.0), 不區分大小寫">utf8mb4_spanish_ci</span>
<span value="utf8mb4_swedish_ci" title="瑞典文 (UCA 4.0.0), 不區分大小寫">utf8mb4_swedish_ci</span>
<span value="utf8mb4_thai_520_w2" title="泰文 (UCA 5.2.0), 多層次">utf8mb4_thai_520_w2</span>
<span value="utf8mb4_turkish_ci" title="土耳其文 (UCA 4.0.0), 不區分大小寫">utf8mb4_turkish_ci</span>
<span value="utf8mb4_unicode_520_ci" title="Unicode (UCA 5.2.0), 不區分大小寫">utf8mb4_unicode_520_ci</span>
<span value="utf8mb4_unicode_520_nopad_ci" title="Unicode (UCA 5.2.0), no-pad, 不區分大小寫">utf8mb4_unicode_520_nopad_ci</span>
<span value="utf8mb4_unicode_ci" title="Unicode (UCA 4.0.0), 不區分大小寫">utf8mb4_unicode_ci</span>
<span value="utf8mb4_unicode_nopad_ci" title="Unicode (UCA 4.0.0), no-pad, 不區分大小寫">utf8mb4_unicode_nopad_ci</span>
<span value="utf8mb4_vietnamese_ci" title="越南文 (UCA 4.0.0), 不區分大小寫">utf8mb4_vietnamese_ci</span>`;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let commands = context.subscriptions;
    let veldbP = new veldatabaseProvider();
    let addLinkView = undefined;
    let editLinkView = undefined;
    let addTableView = undefined;
    let editTableView = undefined;
    vscode.window.registerTreeDataProvider("vel-mainview", veldbP);
    //刷新列表
    commands.push(vscode.commands.registerCommand('veldb.refreshTree', () => {
        veldbP.refresh();
    }));
    //添加伺服器
    commands.push(vscode.commands.registerCommand('veldb.addLink', (actor) => {
        if (addLinkView) {
            addLinkView.reveal();
        }
        else {
            addLinkView = vscode.window.createWebviewPanel("addLink", "添加資料庫伺服器", vscode.ViewColumn.One, {
                "enableScripts": true,
                "localResourceRoots": [vscode.Uri.file(context.extensionPath)]
            });
            addLinkView.webview.html = getView("addLink", context.extensionUri);
            addLinkView.onDidDispose(() => {
                addLinkView = undefined;
            }, undefined, context.subscriptions);
            addLinkView.webview.onDidReceiveMessage(msg => {
                let fsres = fs.readFileSync(path.join(__filename, "..", "..", "servers.conf"));
                let serversArr = JSON.parse(fsres.toString());
                serversArr.push(msg);
                let servercnf = JSON.stringify(serversArr);
                fs.writeFileSync(path.join(__filename, "..", "..", "servers.conf"), servercnf);
                veldbP.refresh();
                addLinkView?.dispose();
            }, undefined, context.subscriptions);
        }
    }));
    //編輯伺服器
    commands.push(vscode.commands.registerCommand('veldb.editLink', (actor) => {
        let view = vscode.window.createWebviewPanel("editLink", "編輯資料庫伺服器 - " + actor.label, vscode.ViewColumn.One, {
            "enableScripts": true,
            "localResourceRoots": [vscode.Uri.file(context.extensionPath)]
        });
        view.webview.html = getView("editLink", context.extensionUri, [actor.serverid]);
        view.webview.onDidReceiveMessage(msg => {
            let fsres = fs.readFileSync(path.join(__filename, "..", "..", "servers.conf"));
            let serversArr = JSON.parse(fsres.toString());
            serversArr[actor.serverid] = msg;
            let servercnf = JSON.stringify(serversArr);
            fs.writeFileSync(path.join(__filename, "..", "..", "servers.conf"), servercnf);
            veldbP.refresh();
            view.dispose();
        }, undefined, context.subscriptions);
    }));
    //刪除伺服器
    commands.push(vscode.commands.registerCommand('veldb.delLink', (actor) => {
        let fsres = fs.readFileSync(path.join(__filename, "..", "..", "servers.conf"));
        let serversArr = JSON.parse(fsres.toString());
        delete serversArr[actor.serverid];
        let servercnf = JSON.stringify(serversArr.filter(Boolean));
        fs.writeFileSync(path.join(__filename, "..", "..", "servers.conf"), servercnf);
        veldbP.refresh();
    }));
    //添加資料庫
    commands.push(vscode.commands.registerCommand('veldb.addDB', (actor) => {
        vscode.window.showInputBox({ "title": "請輸入資料庫名稱" }).then(dbname => {
            if (dbname != undefined && dbname != "") {
                querySql(actor.server, "CREATE DATABASE `" + dbname + "`").then(() => {
                    veldbP.refresh();
                });
            }
        });
    }));
    //刪除資料庫
    commands.push(vscode.commands.registerCommand('veldb.delDB', (actor) => {
        vscode.window.showQuickPick(["是", "否"], {
            "title": `你真的要刪除(DROP) ${actor.label} 資料庫嗎？`
        }).then(choice => {
            if (choice == "是") {
                querySql(actor.server, "DROP DATABASE `" + actor.label + "`").then(() => {
                    veldbP.refresh();
                });
            }
        });
    }));
    //添加表
    commands.push(vscode.commands.registerCommand('veldb.addTable', (actor) => {
        if (addTableView) {
            addTableView.reveal();
        }
        else {
            addTableView = vscode.window.createWebviewPanel("addTable", "添加資料表", vscode.ViewColumn.One, {
                "enableScripts": true,
                "localResourceRoots": [vscode.Uri.file(context.extensionPath)]
            });
            addTableView.webview.html = getView("addTable", context.extensionUri);
            addTableView.onDidDispose(() => {
                addTableView = undefined;
            }, undefined, context.subscriptions);
            addTableView.webview.onDidReceiveMessage(msg => {
                let charsetStr = (msg.charset != "") ? ` CHARSET=${msg.charset} COLLATE ${msg.charsetOrder}` : "";
                let fullSql = "CREATE TABLE `" + actor.dbname + "`.`" + msg.tbname + "` (" + msg.colsSql + ")" + charsetStr + " COMMENT = '" + msg.tbcomment + "';";
                querySql(actor.server, fullSql).then(() => {
                    veldbP.refresh();
                    vscode.window.showInformationMessage("創建成功");
                    addTableView?.dispose();
                }).catch(() => { });
            }, undefined, context.subscriptions);
        }
    }));
    //編輯表
    commands.push(vscode.commands.registerCommand('veldb.editTable', (actor) => {
        let view = vscode.window.createWebviewPanel("editTable", "編輯資料表結構 - " + actor.label, vscode.ViewColumn.One, {
            "enableScripts": true,
            "localResourceRoots": [vscode.Uri.file(context.extensionPath)]
        });
        view.webview.html = getView("editTable", context.extensionUri);
        let args = {};
        querySql(actor.server, `select TABLE_NAME,TABLE_COLLATION,TABLE_COMMENT from information_schema.tables where table_schema='${actor.dbname}' and table_name='${actor.tbname}';`).then(tinfos => {
            querySql(actor.server, `show full columns from \`${actor.tbname}\` from \`${actor.dbname}\``).then(cinfos => {
                querySql(actor.server, `SHOW INDEX FROM \`${actor.dbname}\`.\`${actor.tbname}\`;`).then(iinfos => {
                    args = { "tinfos": tinfos, "cinfos": cinfos, "dbname": actor.dbname, "iinfos": iinfos };
                    console.log(args);
                    view.webview.postMessage(args);
                });
            });
        });
        view.onDidChangeViewState(() => {
            view.webview.postMessage(args);
        });
        view.webview.onDidReceiveMessage(msg => {
            veldbP.refresh();
            queryMutilSql(actor.server, msg.colsSql).then(() => {
                vscode.window.showInformationMessage("保存成功");
            });
        }, undefined, context.subscriptions);
    }));
    //查看表
    commands.push(vscode.commands.registerCommand('veldb.viewTable', (actor) => {
        let view = vscode.window.createWebviewPanel("viewTable", "資料表紀錄 - " + actor.label, vscode.ViewColumn.One, {
            "enableScripts": true,
            "localResourceRoots": [vscode.Uri.file(context.extensionPath)]
        });
        view.webview.html = getView("viewTable", context.extensionUri);
        let args = {};
        querySql(actor.server, `show full columns from \`${actor.tbname}\` from \`${actor.dbname}\``).then(cinfos => {
            querySql(actor.server, `select * from \`${actor.dbname}\`.\`${actor.tbname}\` LIMIT 0,20;`).then(rows => {
                querySql(actor.server, `select count(*) as num from \`${actor.dbname}\`.\`${actor.tbname}\`;`).then(count => {
                    args = {
                        "cinfos": cinfos,
                        "rows": rows,
                        "rowNum": count[0]["num"],
                        "range": [0, 20],
                        "dbname": actor.dbname,
                        "tbname": actor.tbname
                    };
                    view.webview.postMessage(args);
                });
            });
        });
        view.onDidChangeViewState(() => {
            view.webview.postMessage(args);
        });
        view.webview.onDidReceiveMessage(msg => {
            if (msg.command == "save") {
                let adds = msg.addRows;
                let updates = msg.updateRows;
                let dels = msg.delRows;
                let done = 0;
                let count = adds.length + updates.length + dels.length;
                queryMutilSql(actor.server, adds, (res) => {
                    if (res.affectedRows == 0) {
                        vscode.window.showErrorMessage("新增數據失敗！請檢查錯誤信息！");
                    }
                    done++;
                    if (done >= count) {
                        vscode.window.showInformationMessage("操作全部執行完畢！");
                        view.webview.postMessage(args);
                    }
                });
                queryMutilSql(actor.server, updates, (res) => {
                    if (res.affectedRows == 0) {
                        vscode.window.showErrorMessage("更新數據失敗！可能數據已在別處發生變更，為防止錯誤覆蓋，請刷新後重新嘗試！");
                    }
                    done++;
                    if (done >= count) {
                        vscode.window.showInformationMessage("操作全部執行完畢！");
                        view.webview.postMessage(args);
                    }
                });
                queryMutilSql(actor.server, dels, (res) => {
                    if (res.affectedRows == 0) {
                        vscode.window.showErrorMessage("刪除數據失敗！可能數據已在別處發生變更或已被刪除，為防止錯誤刪除，請刷新後重新嘗試！");
                    }
                    done++;
                    if (done >= count) {
                        vscode.window.showInformationMessage("操作全部執行完畢！");
                        view.webview.postMessage(args);
                    }
                });
            }
            else if (msg.command == "append") {
                let appendStr = "";
                if (msg.order) {
                    appendStr += ` ORDER BY ${msg.order}`;
                }
                if (msg.from !== undefined) {
                    appendStr += ` LIMIT ${msg.from},20`;
                }
                querySql(actor.server, `show full columns from \`${actor.tbname}\` from \`${actor.dbname}\``).then(cinfos => {
                    querySql(actor.server, `select * from \`${actor.dbname}\`.\`${actor.tbname}\`${appendStr};`).then(rows => {
                        querySql(actor.server, `select count(*) as num from \`${actor.dbname}\`.\`${actor.tbname}\`;`).then(count => {
                            args = {
                                "cinfos": cinfos,
                                "rows": rows,
                                "rowNum": count[0]["num"],
                                "range": [msg.from, 20],
                                "dbname": actor.dbname,
                                "tbname": actor.tbname
                            };
                            view.webview.postMessage(args);
                        });
                    });
                });
            }
        }, undefined, context.subscriptions);
    }));
    //抹除表數據
    commands.push(vscode.commands.registerCommand('veldb.clearTable', (actor) => {
        vscode.window.showQuickPick(["是", "否"], {
            "title": `你真的要抹除(Truncate) ${actor.dbname} 下的 ${actor.label} 資料表的所有數據嗎？`
        }).then(choice => {
            if (choice == "是") {
                querySql(actor.server, "TRUNCATE TABLE `" + actor.dbname + "`.`" + actor.label + "`").then(() => {
                    veldbP.refresh();
                });
            }
        });
    }));
    //刪除表
    commands.push(vscode.commands.registerCommand('veldb.delTable', (actor) => {
        vscode.window.showQuickPick(["是", "否"], {
            "title": `你真的要刪除(DROP) ${actor.dbname} 下的 ${actor.label} 資料表嗎？`
        }).then(choice => {
            if (choice == "是") {
                querySql(actor.server, "DROP TABLE `" + actor.dbname + "`.`" + actor.label + "`").then(() => {
                    veldbP.refresh();
                });
            }
        });
    }));
}
exports.activate = activate;
function getView(viewname, extendurl, args) {
    let viewcontent = "";
    switch (viewname) {
        case "addLink":
            var scripturl = vscode.Uri.joinPath(extendurl, "public", "addserver.js");
            scripturl = (scripturl).with({ 'scheme': "vscode-resource" });
            var controller = vscode.Uri.joinPath(extendurl, "public", "controller.js");
            controller = (controller).with({ 'scheme': "vscode-resource" });
            var style = vscode.Uri.joinPath(extendurl, "public", "addedit.css");
            style = (style).with({ 'scheme': "vscode-resource" });
            viewcontent = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${style}" rel="stylesheet">
				</head>
				<body>
				<h1 align="center">添加新伺服器</h1>
				<div class="group out"><span>數據庫類型</span>
					<div class="select" id="dbtype" value="mysql" data-coll="yes">
						<div class="options">
							<span value="mysql" selected>Mysql|MariaDB</span>
						</div>
					</div>
				</div>
				<div class="group"><span>標籤</span><input type="text" id="label" placeholder="添加用來展示的標籤" value="localhost"></div>
				<div class="group"><span>主機</span><input type="text" id="host" placeholder="主機名或IP地址" value="127.0.0.1"></div>
				<div class="group"><span>端口號</span><input type="text" id="port" placeholder="數據庫的端口號" value="3306"></div>
				<div class="group"><span>用戶名</span><input type="text" id="user" placeholder="用戶名" value="root"></div>
				<div class="group"><span>密碼</span><input type="text" id="password" placeholder="密碼"></div>
				<div class="group"><button onclick="addServer()">添加伺服器</button></div>

				<script src="${scripturl}"></script>
				<script src="${controller}"></script>
			</body>
			</html>`;
            break;
        case "editLink":
            var scripturl = vscode.Uri.joinPath(extendurl, "public", "editserver.js");
            scripturl = (scripturl).with({ 'scheme': "vscode-resource" });
            var controller = vscode.Uri.joinPath(extendurl, "public", "controller.js");
            controller = (controller).with({ 'scheme': "vscode-resource" });
            var style = vscode.Uri.joinPath(extendurl, "public", "addedit.css");
            style = (style).with({ 'scheme': "vscode-resource" });
            let fsres = fs.readFileSync(path.join(__filename, "..", "..", "servers.conf"));
            let serversArr = JSON.parse(fsres.toString());
            if (!args) {
                return "";
            }
            let serverinfo = serversArr[args[0]];
            viewcontent = `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${style}" rel="stylesheet">
					</head>
					<body>
					<h1 align="center">編輯伺服器</h1>
					<div class="group out"><span>數據庫類型</span>
						<div class="select" id="dbtype" value="mysql" data-coll="yes">
							<div class="options">
								<span value="mysql" selected>Mysql|MariaDB</span>
							</div>
						</div>
					</div>
					<div class="group"><span>標籤</span><input type="text" id="label" placeholder="添加用來展示的標籤" value="${serverinfo.label}"></div>
					<div class="group"><span>主機</span><input type="text" id="host" placeholder="主機名或IP地址" value="${serverinfo.host}"></div>
					<div class="group"><span>端口號</span><input type="text" id="port" placeholder="數據庫的端口號" value="${serverinfo.port}"></div>
					<div class="group"><span>用戶名</span><input type="text" id="user" placeholder="用戶名" value="${serverinfo.user}"></div>
					<div class="group"><span>密碼</span><input type="text" id="password" placeholder="密碼" value="${serverinfo.password}"></div>
					<div class="group"><button onclick="saveServer()">保存伺服器</button></div>
	
					<script src="${scripturl}"></script>
					<script src="${controller}"></script>
				</body>
				</html>`;
            break;
        case "addTable":
            var scripturl = vscode.Uri.joinPath(extendurl, "public", "addtable.js");
            scripturl = (scripturl).with({ 'scheme': "vscode-resource" });
            var controller = vscode.Uri.joinPath(extendurl, "public", "controller.js");
            controller = (controller).with({ 'scheme': "vscode-resource" });
            var style = vscode.Uri.joinPath(extendurl, "public", "tablestruct.css");
            style = (style).with({ 'scheme': "vscode-resource" });
            viewcontent = `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<link href="${style}" rel="stylesheet">
						</head>
						<body>
						<h1 align="center">添加資料表</h1>
						<div class="base">
							<div class="group"><span>表名</span><input type="text" id="tbname"></div>
							<div class="group"><span>備註</span><input type="text" id="tbcomment"></div>
							<div class="group out"><span>編碼&排序</span>
								<div class="select" id="charset" value="" data-coll="yes">
									<div class="options">
									${charsets}
									</div>
								</div>
							</div>
						</div>
						<table>
							<thead>
								<tr><th>名稱</th><th>類型</th><th>長度</th><th>預設值</th><th>屬性</th><th>空值</th><th>自增</th><th>索引</th><th>備註</th></tr>
							</thead>
							<tbody id="cols">
								<tr>
									<td><input type="text" class="name" value="id"></td>
									<td><input type="text" class="type" list="typelist" value="INT"></td>
									<td><input type="number" class="length" value="11"></td>
									<td><input type="text" class="default"></td>
									<td><input type="text" class="prop" list="proplist"></td>
									<td><input type="checkbox" class="null" value="isNull"></td>
									<td><input type="checkbox" class="ai" value="ai" checked></td>
									<td><input type="index" class="index" list="indexlist" onchange="indexChange(this)" value="PRIMARY"><input type="index" class="indexName"></td>
									<td><input type="text" class="comment"></td>
								</tr>
							</tbody>
							<tfoot>
								<tr><th colspan="9" style="font-size:20px" id="addCol" onclick="addCol()">+</th></tr>
							</tfoot>
						</table>
						<div class="bottombar"><button onclick="submit()">創建表</button></div>
						<datalist id="typelist">
							<option value="INT">
							<option value="VARCHAR">
							<option value="TEXT">
							<option value="DATE">
							<option value="TINYINT">
							<option value="SMALLINT">
							<option value="MEDIUMINT">
							<option value="BIGINT">
							<option value="DECIMAL">
							<option value="FLOAT">
							<option value="DOUBLE">
							<option value="REAL">
							<option value="BIT">
							<option value="BOOLEAN">
							<option value="SERIAL">
							<option value="DATETIME">
							<option value="TIMESTAMP">
							<option value="TIME">
							<option value="YEAR">
							<option value="CHAR">
							<option value="TINYTEXT">
							<option value="MEDIUMTEXT">
							<option value="LONGTEXT">
							<option value="BINARY">
							<option value="VARBINARY">
							<option value="TINYBLOB">
							<option value="BLOB">
							<option value="MEDIUMBLOB">
							<option value="LONGBLOB">
							<option value="ENUM">
							<option value="SET">
							<option value="INET6">
							<option value="GEOMETRY">
							<option value="POINT">
							<option value="LINESTRING">
							<option value="POLYGON">
							<option value="MULTIPOINT">
							<option value="MULTILINESTRING">
							<option value="MULTIPOLYGON">
							<option value="GEOMETRYCOLLECTION">
							<option value="JSON">
						</datalist>
						<datalist id="proplist">
							<option value="BINARY">
							<option value="UNSIGNED">
							<option value="UNSIGNED ZEROFILL">
							<option value="on update CURRENT_TIMESTAMP">
						</datalist>
						<datalist id="indexlist">
							<option value="PRIMARY">
							<option value="UNIQUE">
							<option value="INDEX">
							<option value="FULLTEXT">
							<option value="SPATIAL">
						</datalist>
						<script src="${scripturl}"></script>
						<script src="${controller}"></script>
					</body>
					</html>`;
            break;
        case "editTable":
            var scripturl = vscode.Uri.joinPath(extendurl, "public", "edittable.js");
            scripturl = (scripturl).with({ 'scheme': "vscode-resource" });
            var controller = vscode.Uri.joinPath(extendurl, "public", "controller.js");
            controller = (controller).with({ 'scheme': "vscode-resource" });
            var style = vscode.Uri.joinPath(extendurl, "public", "tablestruct.css");
            style = (style).with({ 'scheme': "vscode-resource" });
            viewcontent = `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<link href="${style}" rel="stylesheet">
						</head>
						<body>
						<h1 align="center">編輯資料表</h1>
						<div class="base">
							<input type="hidden" id="dbname" value="">
							<div class="group"><span>表名</span><input type="text" id="tbname"></div>
							<div class="group"><span>備註</span><input type="text" id="tbcomment"></div>
							<div class="group out"><span>編碼&排序</span>
								<div class="select" id="charset" value="" data-coll="yes">
									<div class="options">
									${charsets}
									</div>
								</div>
							</div>
						</div>
						<table>
							<thead>
								<tr><th>名稱</th><th>類型</th><th>長度</th><th>預設值</th><th>屬性</th><th>空值</th><th>自增</th><th>索引</th><th>備註</th></tr>
							</thead>
							<tbody id="cols">
								
							</tbody>
							<tfoot>
								<tr><th colspan="9" style="font-size:20px" id="addCol" onclick="addCol()">+</th></tr>
							</tfoot>
						</table>
						<div class="bottombar"><button onclick="reset()">還原更改</button><button onclick="submit()">保存表結構</button></div>
						<datalist id="typelist">
							<option value="INT">
							<option value="VARCHAR">
							<option value="TEXT">
							<option value="DATE">
							<option value="TINYINT">
							<option value="SMALLINT">
							<option value="MEDIUMINT">
							<option value="BIGINT">
							<option value="DECIMAL">
							<option value="FLOAT">
							<option value="DOUBLE">
							<option value="REAL">
							<option value="BIT">
							<option value="BOOLEAN">
							<option value="SERIAL">
							<option value="DATETIME">
							<option value="TIMESTAMP">
							<option value="TIME">
							<option value="YEAR">
							<option value="CHAR">
							<option value="TINYTEXT">
							<option value="MEDIUMTEXT">
							<option value="LONGTEXT">
							<option value="BINARY">
							<option value="VARBINARY">
							<option value="TINYBLOB">
							<option value="BLOB">
							<option value="MEDIUMBLOB">
							<option value="LONGBLOB">
							<option value="ENUM">
							<option value="SET">
							<option value="INET6">
							<option value="GEOMETRY">
							<option value="POINT">
							<option value="LINESTRING">
							<option value="POLYGON">
							<option value="MULTIPOINT">
							<option value="MULTILINESTRING">
							<option value="MULTIPOLYGON">
							<option value="GEOMETRYCOLLECTION">
							<option value="JSON">
						</datalist>
						<datalist id="proplist">
							<option value="BINARY">
							<option value="UNSIGNED">
							<option value="UNSIGNED ZEROFILL">
							<option value="on update CURRENT_TIMESTAMP">
						</datalist>
						<datalist id="indexlist">
							<option value="PRIMARY">
							<option value="UNIQUE">
							<option value="INDEX">
							<option value="FULLTEXT">
						</datalist>
						<script src="${scripturl}"></script>
						<script src="${controller}"></script>
					</body>
					</html>`;
            break;
        case "viewTable":
            var scripturl = vscode.Uri.joinPath(extendurl, "public", "viewtable.js");
            scripturl = (scripturl).with({ 'scheme': "vscode-resource" });
            var controller = vscode.Uri.joinPath(extendurl, "public", "controller.js");
            controller = (controller).with({ 'scheme': "vscode-resource" });
            var style = vscode.Uri.joinPath(extendurl, "public", "tablestruct.css");
            style = (style).with({ 'scheme': "vscode-resource" });
            viewcontent = `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<link href="${style}" rel="stylesheet">
						</head>
						<body>
						<h1 align="center"><span class="datapage" onclick="dataPrev()">
						<svg width="16" height="16" version="1.1">
							<path class="ColorScheme-Text" d="m10.363 1.6367-6.3633 6.3633 6.3633 6.3633 0.70703-0.70703-5.6562-5.6562 5.6562-5.6562-0.70703-0.70703z" fill="currentColor"/>
						</svg>
						</span>&#12288;資料表紀錄 <span class="range"></span>&#12288;<span class="datapage" onclick="dataNext()">
						<svg width="16" height="16" version="1.1">
							<path class="ColorScheme-Text" d="M 4.6367,1.6367 11,8 4.6367,14.3633 3.92967,13.65627 9.58587,8.00007 3.92967,2.34387 4.6367,1.63684 Z" fill="currentColor"/>
						</svg>
						</span></h1>
						<table>
							<thead id="cols">
								
							</thead>
							<tbody id="rows">
								
							</tbody>
							<tfoot>
								<tr><th colspan="9" style="font-size:20px" id="addCol" onclick="addCol()" class="not-col">+</th></tr>
							</tfoot>
						</table>
						<div class="bottombar"><button onclick="reset()">還原更改</button><button onclick="submit()">保存數據</button></div>
						<script src="${scripturl}"></script>
						<script src="${controller}"></script>
					`;
            break;
    }
    return viewcontent;
}
// tdis method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class veldatabaseProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        //vscode.window.showInformationMessage(element?.label || "");
        let deps = [];
        if (element) {
            deps = await this.query(element);
        }
        else {
            let fsres = fs.readFileSync(path.join(__filename, "..", "..", "servers.conf"));
            let serversArr = JSON.parse(fsres.toString());
            for (const serverKey in serversArr) {
                let serverA = serversArr[serverKey];
                let server = mysql.createPool({
                    "host": serverA.host,
                    "port": serverA.port || 3306,
                    "user": serverA.user,
                    "password": serverA.password
                });
                deps.push(new Dependency(serverA.label, serverA.host, vscode.TreeItemCollapsibleState.Collapsed, "server", server, "", "", "server", serverKey));
            }
        }
        return Promise.resolve(deps);
    }
    query(element) {
        return new Promise((resolve, reject) => {
            element.server.getConnection((e, conn) => {
                if (e) {
                    reject("連接錯誤：" + e.message);
                }
                else if (element.dbname == "") {
                    conn.query("show databases", (e, res, f) => {
                        if (e) {
                            reject("連接錯誤：" + e.message);
                        }
                        let deps = [];
                        for (const db of res) {
                            deps.push(new Dependency(db.Database, "", vscode.TreeItemCollapsibleState.Collapsed, "database", element.server, db.Database, "", "database"));
                        }
                        resolve(deps);
                        conn.release();
                    });
                }
                else if (element.tbname == "") {
                    conn.query(`show tables from \`${element.dbname}\``, (e, res, f) => {
                        if (e) {
                            reject("連接錯誤：" + e.message);
                        }
                        let deps = [];
                        for (const tb of res) {
                            deps.push(new Dependency(tb[`Tables_in_${element.dbname}`], "", vscode.TreeItemCollapsibleState.Collapsed, "preview", element.server, element.dbname, tb[`Tables_in_${element.dbname}`], "table"));
                        }
                        resolve(deps);
                        conn.release();
                    });
                }
                else {
                    conn.query(`show full columns from \`${element.tbname}\` from \`${element.dbname}\``, (e, res, f) => {
                        if (e) {
                            reject("連接錯誤：" + e.message);
                        }
                        let deps = [];
                        for (const co of res) {
                            deps.push(new Dependency(co.Field, co.Type + " " + co.Comment, vscode.TreeItemCollapsibleState.None, "list-unordered", element.server, element.dbname, element.tbname, "columns"));
                        }
                        resolve(deps);
                        conn.release();
                    });
                }
            });
        });
    }
}
exports.veldatabaseProvider = veldatabaseProvider;
function querySql(server, sql) {
    return new Promise((resolve, reject) => {
        server.getConnection((e, conn) => {
            conn.query(sql, (e, res) => {
                if (e) {
                    vscode.window.showErrorMessage(`SQL執行失敗：${e.sqlMessage || "Unknow"}`);
                    reject();
                }
                resolve(res);
                conn.release();
            });
        });
    });
}
async function queryMutilSql(server, sqls, callback) {
    for await (const sql of sqls) {
        querySql(server, sql).then(res => {
            if (callback) {
                callback(res);
            }
        });
    }
}
class Dependency extends vscode.TreeItem {
    constructor(label, des, collapsibleState, icon, server, dbname, tbname, tag, serverid, command) {
        super(label, collapsibleState);
        this.label = label;
        this.des = des;
        this.collapsibleState = collapsibleState;
        this.icon = icon;
        this.server = server;
        this.dbname = dbname;
        this.tbname = tbname;
        this.tag = tag;
        this.serverid = serverid;
        this.command = command;
        this.iconPath = new vscode.ThemeIcon(this.icon);
        this.contextValue = this.tag;
        this.tooltip = `${this.des}`;
        this.description = this.des;
    }
}
exports.Dependency = Dependency;
class ServerList extends Object {
    constructor() {
        super();
        this.dbtype = "";
        this.label = "";
        this.host = "";
        this.port = 0;
        this.user = "";
        this.password = "";
        this.server = mysql.createPool("");
    }
}
exports.ServerList = ServerList;
//# sourceMappingURL=extension.js.map