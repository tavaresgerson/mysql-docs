--- title: MySQL 8.4 Reference Manual :: 12.10.3 Central European Character Sets url: https://dev.mysql.com/doc/refman/8.4/en/charset-ce-sets.html order: 41 ---



### 12.10.3 Central European Character Sets

MySQL provides some support for character sets used in the Czech Republic, Slovakia, Hungary, Romania, Slovenia, Croatia, Poland, and Serbia (Latin).

* `cp1250` (Windows Central European) collations:

  + `cp1250_bin`
  + `cp1250_croatian_ci`
  + `cp1250_czech_cs`
  + `cp1250_general_ci` (default)
  + `cp1250_polish_ci`
* `cp852` (DOS Central European) collations:

  + `cp852_bin`
  + `cp852_general_ci` (default)
* `keybcs2` (DOS Kamenicky Czech-Slovak) collations:

  + `keybcs2_bin`
  + `keybcs2_general_ci` (default)
* `latin2` (ISO 8859-2 Central European) collations:

  + `latin2_bin`
  + `latin2_croatian_ci`
  + `latin2_czech_cs`
  + `latin2_general_ci` (default)
  + `latin2_hungarian_ci`
* `macce` (Mac Central European) collations:

  + `macce_bin`
  + `macce_general_ci` (default)

  `macce` is deprecated; expect support for it to be removed in a subsequent MySQL release.

