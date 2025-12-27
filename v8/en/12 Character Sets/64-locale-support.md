## 12.16 MySQL Server Locale Support

The locale indicated by the `lc_time_names` system variable controls the language used to display day and month names and abbreviations. This variable affects the output from the `DATE_FORMAT()`, `DAYNAME()`, and `MONTHNAME()` functions.

 `lc_time_names` does not affect the `STR_TO_DATE()` or `GET_FORMAT()` function.

The  `lc_time_names` value does not affect the result from  `FORMAT()`, but this function takes an optional third parameter that enables a locale to be specified to be used for the result number's decimal point, thousands separator, and grouping between separators. Permissible locale values are the same as the legal values for the `lc_time_names` system variable.

Locale names have language and region subtags listed by IANA (<http://www.iana.org/assignments/language-subtag-registry>) such as `'ja_JP'` or `'pt_BR'`. The default value is `'en_US'` regardless of your system's locale setting, but you can set the value at server startup, or set the `GLOBAL` value at runtime if you have privileges sufficient to set global system variables; see Section 7.1.9.1, “System Variable Privileges”. Any client can examine the value of `lc_time_names` or set its `SESSION` value to affect the locale for its own connection.

(The first  `SET NAMES` statement in the following example may not be necessary if no settings relating to character set and collation have been changed from their defaults; we include it for completeness.)

```
mysql> SET NAMES 'utf8mb4';
Query OK, 0 rows affected (0.09 sec)

mysql> SELECT @@lc_time_names;
+-----------------+
| @@lc_time_names |
+-----------------+
| en_US           |
+-----------------+
1 row in set (0.00 sec)

mysql> SELECT DAYNAME('2020-01-01'), MONTHNAME('2020-01-01');
+-----------------------+-------------------------+
| DAYNAME('2020-01-01') | MONTHNAME('2020-01-01') |
+-----------------------+-------------------------+
| Wednesday             | January                 |
+-----------------------+-------------------------+
1 row in set (0.00 sec)

mysql> SELECT DATE_FORMAT('2020-01-01','%W %a %M %b');
+-----------------------------------------+
| DATE_FORMAT('2020-01-01','%W %a %M %b') |
+-----------------------------------------+
| Wednesday Wed January Jan               |
+-----------------------------------------+
1 row in set (0.00 sec)

mysql> SET lc_time_names = 'es_MX';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@lc_time_names;
+-----------------+
| @@lc_time_names |
+-----------------+
| es_MX           |
+-----------------+
1 row in set (0.00 sec)

mysql> SELECT DAYNAME('2020-01-01'), MONTHNAME('2020-01-01');
+-----------------------+-------------------------+
| DAYNAME('2020-01-01') | MONTHNAME('2020-01-01') |
+-----------------------+-------------------------+
| miércoles             | enero                   |
+-----------------------+-------------------------+
1 row in set (0.00 sec)

mysql> SELECT DATE_FORMAT('2020-01-01','%W %a %M %b');
+-----------------------------------------+
| DATE_FORMAT('2020-01-01','%W %a %M %b') |
+-----------------------------------------+
| miércoles mié enero ene                 |
+-----------------------------------------+
1 row in set (0.00 sec)
```

The day or month name for each of the affected functions is converted from `utf8mb4` to the character set indicated by the `character_set_connection` system variable.

 `lc_time_names` may be set to any of the following locale values. The set of locales supported by MySQL may differ from those supported by your operating system.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Locale Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>ar_AE</code></td> <td>Arabic - United Arab Emirates</td> </tr><tr> <td><code>ar_BH</code></td> <td>Arabic - Bahrain</td> </tr><tr> <td><code>ar_DZ</code></td> <td>Arabic - Algeria</td> </tr><tr> <td><code>ar_EG</code></td> <td>Arabic - Egypt</td> </tr><tr> <td><code>ar_IN</code></td> <td>Arabic - India</td> </tr><tr> <td><code>ar_IQ</code></td> <td>Arabic - Iraq</td> </tr><tr> <td><code>ar_JO</code></td> <td>Arabic - Jordan</td> </tr><tr> <td><code>ar_KW</code></td> <td>Arabic - Kuwait</td> </tr><tr> <td><code>ar_LB</code></td> <td>Arabic - Lebanon</td> </tr><tr> <td><code>ar_LY</code></td> <td>Arabic - Libya</td> </tr><tr> <td><code>ar_MA</code></td> <td>Arabic - Morocco</td> </tr><tr> <td><code>ar_OM</code></td> <td>Arabic - Oman</td> </tr><tr> <td><code>ar_QA</code></td> <td>Arabic - Qatar</td> </tr><tr> <td><code>ar_SA</code></td> <td>Arabic - Saudi Arabia</td> </tr><tr> <td><code>ar_SD</code></td> <td>Arabic - Sudan</td> </tr><tr> <td><code>ar_SY</code></td> <td>Arabic - Syria</td> </tr><tr> <td><code>ar_TN</code></td> <td>Arabic - Tunisia</td> </tr><tr> <td><code>ar_YE</code></td> <td>Arabic - Yemen</td> </tr><tr> <td><code>be_BY</code></td> <td>Belarusian - Belarus</td> </tr><tr> <td><code>bg_BG</code></td> <td>Bulgarian - Bulgaria</td> </tr><tr> <td><code>ca_ES</code></td> <td>Catalan - Spain</td> </tr><tr> <td><code>cs_CZ</code></td> <td>Czech - Czech Republic</td> </tr><tr> <td><code>da_DK</code></td> <td>Danish - Denmark</td> </tr><tr> <td><code>de_AT</code></td> <td>German - Austria</td> </tr><tr> <td><code>de_BE</code></td> <td>German - Belgium</td> </tr><tr> <td><code>de_CH</code></td> <td>German - Switzerland</td> </tr><tr> <td><code>de_DE</code></td> <td>German - Germany</td> </tr><tr> <td><code>de_LU</code></td> <td>German - Luxembourg</td> </tr><tr> <td><code>el_GR</code></td> <td>Greek - Greece</td> </tr><tr> <td><code>en_AU</code></td> <td>English - Australia</td> </tr><tr> <td><code>en_CA</code></td> <td>English - Canada</td> </tr><tr> <td><code>en_GB</code></td> <td>English - United Kingdom</td> </tr><tr> <td><code>en_IN</code></td> <td>English - India</td> </tr><tr> <td><code>en_NZ</code></td> <td>English - New Zealand</td> </tr><tr> <td><code>en_PH</code></td> <td>English - Philippines</td> </tr><tr> <td><code>en_US</code></td> <td>English - United States</td> </tr><tr> <td><code>en_ZA</code></td> <td>English - South Africa</td> </tr><tr> <td><code>en_ZW</code></td> <td>English - Zimbabwe</td> </tr><tr> <td><code>es_AR</code></td> <td>Spanish - Argentina</td> </tr><tr> <td><code>es_BO</code></td> <td>Spanish - Bolivia</td> </tr><tr> <td><code>es_CL</code></td> <td>Spanish - Chile</td> </tr><tr> <td><code>es_CO</code></td> <td>Spanish - Colombia</td> </tr><tr> <td><code>es_CR</code></td> <td>Spanish - Costa Rica</td> </tr><tr> <td><code>es_DO</code></td> <td>Spanish - Dominican Republic</td> </tr><tr> <td><code>es_EC</code></td> <td>Spanish - Ecuador</td> </tr><tr> <td><code>es_ES</code></td> <td>Spanish - Spain</td> </tr><tr> <td><code>es_GT</code></td> <td>Spanish - Guatemala</td> </tr><tr> <td><code>es_HN</code></td> <td>Spanish - Honduras</td> </tr><tr> <td><code>es_MX</code></td> <td>Spanish - Mexico</td> </tr><tr> <td><code>es_NI</code></td> <td>Spanish - Nicaragua</td> </tr><tr> <td><code>es_PA</code></td> <td>Spanish - Panama</td> </tr><tr> <td><code>es_PE</code></td> <td>Spanish - Peru</td> </tr><tr> <td><code>es_PR</code></td> <td>Spanish - Puerto Rico</td> </tr><tr> <td><code>es_PY</code></td> <td>Spanish - Paraguay</td> </tr><tr> <td><code>es_SV</code></td> <td>Spanish - El Salvador</td> </tr><tr> <td><code>es_US</code></td> <td>Spanish - United States</td> </tr><tr> <td><code>es_UY</code></td> <td>Spanish - Uruguay</td> </tr><tr> <td><code>es_VE</code></td> <td>Spanish - Venezuela</td> </tr><tr> <td><code>et_EE</code></td> <td>Estonian - Estonia</td> </tr><tr> <td><code>eu_ES</code></td> <td>Basque - Spain</td> </tr><tr> <td><code>fi_FI</code></td> <td>Finnish - Finland</td> </tr><tr> <td><code>fo_FO</code></td> <td>Faroese - Faroe Islands</td> </tr><tr> <td><code>fr_BE</code></td> <td>French - Belgium</td> </tr><tr> <td><code>fr_CA</code></td> <td>French - Canada</td> </tr><tr> <td><code>fr_CH</code></td> <td>French - Switzerland</td> </tr><tr> <td><code>fr_FR</code></td> <td>French - France</td> </tr><tr> <td><code>fr_LU</code></td> <td>French - Luxembourg</td> </tr><tr> <td><code>gl_ES</code></td> <td>Galician - Spain</td> </tr><tr> <td><code>gu_IN</code></td> <td>Gujarati - India</td> </tr><tr> <td><code>he_IL</code></td> <td>Hebrew - Israel</td> </tr><tr> <td><code>hi_IN</code></td> <td>Hindi - India</td> </tr><tr> <td><code>hr_HR</code></td> <td>Croatian - Croatia</td> </tr><tr> <td><code>hu_HU</code></td> <td>Hungarian - Hungary</td> </tr><tr> <td><code>id_ID</code></td> <td>Indonesian - Indonesia</td> </tr><tr> <td><code>is_IS</code></td> <td>Icelandic - Iceland</td> </tr><tr> <td><code>it_CH</code></td> <td>Italian - Switzerland</td> </tr><tr> <td><code>it_IT</code></td> <td>Italian - Italy</td> </tr><tr> <td><code>ja_JP</code></td> <td>Japanese - Japan</td> </tr><tr> <td><code>ko_KR</code></td> <td>Korean - Republic of Korea</td> </tr><tr> <td><code>lt_LT</code></td> <td>Lithuanian - Lithuania</td> </tr><tr> <td><code>lv_LV</code></td> <td>Latvian - Latvia</td> </tr><tr> <td><code>mk_MK</code></td> <td>Macedonian - North Macedonia</td> </tr><tr> <td><code>mn_MN</code></td> <td>Mongolia - Mongolian</td> </tr><tr> <td><code>ms_MY</code></td> <td>Malay - Malaysia</td> </tr><tr> <td><code>nb_NO</code></td> <td>Norwegian(Bokmål) - Norway</td> </tr><tr> <td><code>nl_BE</code></td> <td>Dutch - Belgium</td> </tr><tr> <td><code>nl_NL</code></td> <td>Dutch - The Netherlands</td> </tr><tr> <td><code>no_NO</code></td> <td>Norwegian - Norway</td> </tr><tr> <td><code>pl_PL</code></td> <td>Polish - Poland</td> </tr><tr> <td><code>pt_BR</code></td> <td>Portugese - Brazil</td> </tr><tr> <td><code>pt_PT</code></td> <td>Portugese - Portugal</td> </tr><tr> <td><code>rm_CH</code></td> <td>Romansh - Switzerland</td> </tr><tr> <td><code>ro_RO</code></td> <td>Romanian - Romania</td> </tr><tr> <td><code>ru_RU</code></td> <td>Russian - Russia</td> </tr><tr> <td><code>ru_UA</code></td> <td>Russian - Ukraine</td> </tr><tr> <td><code>sk_SK</code></td> <td>Slovak - Slovakia</td> </tr><tr> <td><code>sl_SI</code></td> <td>Slovenian - Slovenia</td> </tr><tr> <td><code>sq_AL</code></td> <td>Albanian - Albania</td> </tr><tr> <td><code>sr_RS</code></td> <td>Serbian - Serbia</td> </tr><tr> <td><code>sv_FI</code></td> <td>Swedish - Finland</td> </tr><tr> <td><code>sv_SE</code></td> <td>Swedish - Sweden</td> </tr><tr> <td><code>ta_IN</code></td> <td>Tamil - India</td> </tr><tr> <td><code>te_IN</code></td> <td>Telugu - India</td> </tr><tr> <td><code>th_TH</code></td> <td>Thai - Thailand</td> </tr><tr> <td><code>tr_TR</code></td> <td>Turkish - Turkey</td> </tr><tr> <td><code>uk_UA</code></td> <td>Ukrainian - Ukraine</td> </tr><tr> <td><code>ur_PK</code></td> <td>Urdu - Pakistan</td> </tr><tr> <td><code>vi_VN</code></td> <td>Vietnamese - Vietnam</td> </tr><tr> <td><code>zh_CN</code></td> <td>Chinese - China</td> </tr><tr> <td><code>zh_HK</code></td> <td>Chinese - Hong Kong</td> </tr><tr> <td><code>zh_TW</code></td> <td>Chinese - Taiwan</td> </tr></tbody></table>
