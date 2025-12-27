### 12.10.7 Asian Character Sets

12.10.7.1 The cp932 Character Set

12.10.7.2 The gb18030 Character Set

The Asian character sets that we support include Chinese, Japanese, Korean, and Thai. These can be complicated. For example, the Chinese sets must allow for thousands of different characters. See Section 12.10.7.1, “The cp932 Character Set”, for additional information about the `cp932` and `sjis` character sets. See Section 12.10.7.2, “The gb18030 Character Set”, for additional information about character set support for the Chinese National Standard GB 18030.

For answers to some common questions and problems relating support for Asian character sets in MySQL, see Section A.11, “MySQL 9.5 FAQ: MySQL Chinese, Japanese, and Korean Character Sets”.

* `big5` (Big5 Traditional Chinese) collations:

  + `big5_bin`
  + `big5_chinese_ci` (default)
* `cp932` (SJIS for Windows Japanese) collations:

  + `cp932_bin`
  + `cp932_japanese_ci` (default)
* `eucjpms` (UJIS for Windows Japanese) collations:

  + `eucjpms_bin`
  + `eucjpms_japanese_ci` (default)
* `euckr` (EUC-KR Korean) collations:

  + `euckr_bin`
  + `euckr_korean_ci` (default)
* `gb2312` (GB2312 Simplified Chinese) collations:

  + `gb2312_bin`
  + `gb2312_chinese_ci` (default)
* `gbk` (GBK Simplified Chinese) collations:

  + `gbk_bin`
  + `gbk_chinese_ci` (default)
* `gb18030` (China National Standard GB18030) collations:

  + `gb18030_bin`
  + `gb18030_chinese_ci` (default)
  + `gb18030_unicode_520_ci`
* `sjis` (Shift-JIS Japanese) collations:

  + `sjis_bin`
  + `sjis_japanese_ci` (default)
* `tis620` (TIS620 Thai) collations:

  + `tis620_bin`
  + `tis620_thai_ci` (default)
* `ujis` (EUC-JP Japanese) collations:

  + `ujis_bin`
  + `ujis_japanese_ci` (default)

The `big5_chinese_ci` collation sorts on number of strokes.
