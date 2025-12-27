## 10.16 MySQL Server Locale Support

The locale indicated by the `lc_time_names` system variable controls the language used to display day and month names and abbreviations. This variable affects the output from the `DATE_FORMAT()`, `DAYNAME()`, and `MONTHNAME()` functions.

`lc_time_names` does not affect the `STR_TO_DATE()` or `GET_FORMAT()` function.

The `lc_time_names` value does not affect the result from `FORMAT()`, but this function takes an optional third parameter that enables a locale to be specified to be used for the result number's decimal point, thousands separator, and grouping between separators. Permissible locale values are the same as the legal values for the `lc_time_names` system variable.

Locale names have language and region subtags listed by IANA (<http://www.iana.org/assignments/language-subtag-registry>) such as `'ja_JP'` or `'pt_BR'`. The default value is `'en_US'` regardless of your system's locale setting, but you can set the value at server startup, or set the `GLOBAL` value at runtime if you have privileges sufficient to set global system variables; see Section 5.1.8.1, “System Variable Privileges”. Any client can examine the value of `lc_time_names` or set its `SESSION` value to affect the locale for its own connection.

```sql
mysql> SET NAMES 'utf8';
Query OK, 0 rows affected (0.09 sec)

mysql> SELECT @@lc_time_names;
+-----------------+
| @@lc_time_names |
+-----------------+
| en_US           |
+-----------------+
1 row in set (0.00 sec)

mysql> SELECT DAYNAME('2010-01-01'), MONTHNAME('2010-01-01');
+-----------------------+-------------------------+
| DAYNAME('2010-01-01') | MONTHNAME('2010-01-01') |
+-----------------------+-------------------------+
| Friday                | January                 |
+-----------------------+-------------------------+
1 row in set (0.00 sec)

mysql> SELECT DATE_FORMAT('2010-01-01','%W %a %M %b');
+-----------------------------------------+
| DATE_FORMAT('2010-01-01','%W %a %M %b') |
+-----------------------------------------+
| Friday Fri January Jan                  |
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

mysql> SELECT DAYNAME('2010-01-01'), MONTHNAME('2010-01-01');
+-----------------------+-------------------------+
| DAYNAME('2010-01-01') | MONTHNAME('2010-01-01') |
+-----------------------+-------------------------+
| viernes               | enero                   |
+-----------------------+-------------------------+
1 row in set (0.00 sec)

mysql> SELECT DATE_FORMAT('2010-01-01','%W %a %M %b');
+-----------------------------------------+
| DATE_FORMAT('2010-01-01','%W %a %M %b') |
+-----------------------------------------+
| viernes vie enero ene                   |
+-----------------------------------------+
1 row in set (0.00 sec)
```

The day or month name for each of the affected functions is converted from `utf8` to the character set indicated by the `character_set_connection` system variable.

`lc_time_names` may be set to any of the following locale values. The set of locales supported by MySQL may differ from those supported by your operating system.

<table summary="Locale values to which lc_time_names may be set. The locale values are presented in a two-column table and in alphabetical order from top to bottom."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Locale Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">ar_AE</code></td> <td>Arabic - United Arab Emirates</td> </tr><tr> <td><code class="literal">ar_BH</code></td> <td>Arabic - Bahrain</td> </tr><tr> <td><code class="literal">ar_DZ</code></td> <td>Arabic - Algeria</td> </tr><tr> <td><code class="literal">ar_EG</code></td> <td>Arabic - Egypt</td> </tr><tr> <td><code class="literal">ar_IN</code></td> <td>Arabic - India</td> </tr><tr> <td><code class="literal">ar_IQ</code></td> <td>Arabic - Iraq</td> </tr><tr> <td><code class="literal">ar_JO</code></td> <td>Arabic - Jordan</td> </tr><tr> <td><code class="literal">ar_KW</code></td> <td>Arabic - Kuwait</td> </tr><tr> <td><code class="literal">ar_LB</code></td> <td>Arabic - Lebanon</td> </tr><tr> <td><code class="literal">ar_LY</code></td> <td>Arabic - Libya</td> </tr><tr> <td><code class="literal">ar_MA</code></td> <td>Arabic - Morocco</td> </tr><tr> <td><code class="literal">ar_OM</code></td> <td>Arabic - Oman</td> </tr><tr> <td><code class="literal">ar_QA</code></td> <td>Arabic - Qatar</td> </tr><tr> <td><code class="literal">ar_SA</code></td> <td>Arabic - Saudi Arabia</td> </tr><tr> <td><code class="literal">ar_SD</code></td> <td>Arabic - Sudan</td> </tr><tr> <td><code class="literal">ar_SY</code></td> <td>Arabic - Syria</td> </tr><tr> <td><code class="literal">ar_TN</code></td> <td>Arabic - Tunisia</td> </tr><tr> <td><code class="literal">ar_YE</code></td> <td>Arabic - Yemen</td> </tr><tr> <td><code class="literal">be_BY</code></td> <td>Belarusian - Belarus</td> </tr><tr> <td><code class="literal">bg_BG</code></td> <td>Bulgarian - Bulgaria</td> </tr><tr> <td><code class="literal">ca_ES</code></td> <td>Catalan - Spain</td> </tr><tr> <td><code class="literal">cs_CZ</code></td> <td>Czech - Czech Republic</td> </tr><tr> <td><code class="literal">da_DK</code></td> <td>Danish - Denmark</td> </tr><tr> <td><code class="literal">de_AT</code></td> <td>German - Austria</td> </tr><tr> <td><code class="literal">de_BE</code></td> <td>German - Belgium</td> </tr><tr> <td><code class="literal">de_CH</code></td> <td>German - Switzerland</td> </tr><tr> <td><code class="literal">de_DE</code></td> <td>German - Germany</td> </tr><tr> <td><code class="literal">de_LU</code></td> <td>German - Luxembourg</td> </tr><tr> <td><code class="literal">el_GR</code></td> <td>Greek - Greece</td> </tr><tr> <td><code class="literal">en_AU</code></td> <td>English - Australia</td> </tr><tr> <td><code class="literal">en_CA</code></td> <td>English - Canada</td> </tr><tr> <td><code class="literal">en_GB</code></td> <td>English - United Kingdom</td> </tr><tr> <td><code class="literal">en_IN</code></td> <td>English - India</td> </tr><tr> <td><code class="literal">en_NZ</code></td> <td>English - New Zealand</td> </tr><tr> <td><code class="literal">en_PH</code></td> <td>English - Philippines</td> </tr><tr> <td><code class="literal">en_US</code></td> <td>English - United States</td> </tr><tr> <td><code class="literal">en_ZA</code></td> <td>English - South Africa</td> </tr><tr> <td><code class="literal">en_ZW</code></td> <td>English - Zimbabwe</td> </tr><tr> <td><code class="literal">es_AR</code></td> <td>Spanish - Argentina</td> </tr><tr> <td><code class="literal">es_BO</code></td> <td>Spanish - Bolivia</td> </tr><tr> <td><code class="literal">es_CL</code></td> <td>Spanish - Chile</td> </tr><tr> <td><code class="literal">es_CO</code></td> <td>Spanish - Colombia</td> </tr><tr> <td><code class="literal">es_CR</code></td> <td>Spanish - Costa Rica</td> </tr><tr> <td><code class="literal">es_DO</code></td> <td>Spanish - Dominican Republic</td> </tr><tr> <td><code class="literal">es_EC</code></td> <td>Spanish - Ecuador</td> </tr><tr> <td><code class="literal">es_ES</code></td> <td>Spanish - Spain</td> </tr><tr> <td><code class="literal">es_GT</code></td> <td>Spanish - Guatemala</td> </tr><tr> <td><code class="literal">es_HN</code></td> <td>Spanish - Honduras</td> </tr><tr> <td><code class="literal">es_MX</code></td> <td>Spanish - Mexico</td> </tr><tr> <td><code class="literal">es_NI</code></td> <td>Spanish - Nicaragua</td> </tr><tr> <td><code class="literal">es_PA</code></td> <td>Spanish - Panama</td> </tr><tr> <td><code class="literal">es_PE</code></td> <td>Spanish - Peru</td> </tr><tr> <td><code class="literal">es_PR</code></td> <td>Spanish - Puerto Rico</td> </tr><tr> <td><code class="literal">es_PY</code></td> <td>Spanish - Paraguay</td> </tr><tr> <td><code class="literal">es_SV</code></td> <td>Spanish - El Salvador</td> </tr><tr> <td><code class="literal">es_US</code></td> <td>Spanish - United States</td> </tr><tr> <td><code class="literal">es_UY</code></td> <td>Spanish - Uruguay</td> </tr><tr> <td><code class="literal">es_VE</code></td> <td>Spanish - Venezuela</td> </tr><tr> <td><code class="literal">et_EE</code></td> <td>Estonian - Estonia</td> </tr><tr> <td><code class="literal">eu_ES</code></td> <td>Basque - Spain</td> </tr><tr> <td><code class="literal">fi_FI</code></td> <td>Finnish - Finland</td> </tr><tr> <td><code class="literal">fo_FO</code></td> <td>Faroese - Faroe Islands</td> </tr><tr> <td><code class="literal">fr_BE</code></td> <td>French - Belgium</td> </tr><tr> <td><code class="literal">fr_CA</code></td> <td>French - Canada</td> </tr><tr> <td><code class="literal">fr_CH</code></td> <td>French - Switzerland</td> </tr><tr> <td><code class="literal">fr_FR</code></td> <td>French - France</td> </tr><tr> <td><code class="literal">fr_LU</code></td> <td>French - Luxembourg</td> </tr><tr> <td><code class="literal">gl_ES</code></td> <td>Galician - Spain</td> </tr><tr> <td><code class="literal">gu_IN</code></td> <td>Gujarati - India</td> </tr><tr> <td><code class="literal">he_IL</code></td> <td>Hebrew - Israel</td> </tr><tr> <td><code class="literal">hi_IN</code></td> <td>Hindi - India</td> </tr><tr> <td><code class="literal">hr_HR</code></td> <td>Croatian - Croatia</td> </tr><tr> <td><code class="literal">hu_HU</code></td> <td>Hungarian - Hungary</td> </tr><tr> <td><code class="literal">id_ID</code></td> <td>Indonesian - Indonesia</td> </tr><tr> <td><code class="literal">is_IS</code></td> <td>Icelandic - Iceland</td> </tr><tr> <td><code class="literal">it_CH</code></td> <td>Italian - Switzerland</td> </tr><tr> <td><code class="literal">it_IT</code></td> <td>Italian - Italy</td> </tr><tr> <td><code class="literal">ja_JP</code></td> <td>Japanese - Japan</td> </tr><tr> <td><code class="literal">ko_KR</code></td> <td>Korean - Republic of Korea</td> </tr><tr> <td><code class="literal">lt_LT</code></td> <td>Lithuanian - Lithuania</td> </tr><tr> <td><code class="literal">lv_LV</code></td> <td>Latvian - Latvia</td> </tr><tr> <td><code class="literal">mk_MK</code></td> <td>Macedonian - North Macedonia</td> </tr><tr> <td><code class="literal">mn_MN</code></td> <td>Mongolia - Mongolian</td> </tr><tr> <td><code class="literal">ms_MY</code></td> <td>Malay - Malaysia</td> </tr><tr> <td><code class="literal">nb_NO</code></td> <td>Norwegian(Bokmål) - Norway</td> </tr><tr> <td><code class="literal">nl_BE</code></td> <td>Dutch - Belgium</td> </tr><tr> <td><code class="literal">nl_NL</code></td> <td>Dutch - The Netherlands</td> </tr><tr> <td><code class="literal">no_NO</code></td> <td>Norwegian - Norway</td> </tr><tr> <td><code class="literal">pl_PL</code></td> <td>Polish - Poland</td> </tr><tr> <td><code class="literal">pt_BR</code></td> <td>Portugese - Brazil</td> </tr><tr> <td><code class="literal">pt_PT</code></td> <td>Portugese - Portugal</td> </tr><tr> <td><code class="literal">rm_CH</code></td> <td>Romansh - Switzerland</td> </tr><tr> <td><code class="literal">ro_RO</code></td> <td>Romanian - Romania</td> </tr><tr> <td><code class="literal">ru_RU</code></td> <td>Russian - Russia</td> </tr><tr> <td><code class="literal">ru_UA</code></td> <td>Russian - Ukraine</td> </tr><tr> <td><code class="literal">sk_SK</code></td> <td>Slovak - Slovakia</td> </tr><tr> <td><code class="literal">sl_SI</code></td> <td>Slovenian - Slovenia</td> </tr><tr> <td><code class="literal">sq_AL</code></td> <td>Albanian - Albania</td> </tr><tr> <td><code class="literal">sr_RS</code></td> <td>Serbian - Serbia</td> </tr><tr> <td><code class="literal">sv_FI</code></td> <td>Swedish - Finland</td> </tr><tr> <td><code class="literal">sv_SE</code></td> <td>Swedish - Sweden</td> </tr><tr> <td><code class="literal">ta_IN</code></td> <td>Tamil - India</td> </tr><tr> <td><code class="literal">te_IN</code></td> <td>Telugu - India</td> </tr><tr> <td><code class="literal">th_TH</code></td> <td>Thai - Thailand</td> </tr><tr> <td><code class="literal">tr_TR</code></td> <td>Turkish - Turkey</td> </tr><tr> <td><code class="literal">uk_UA</code></td> <td>Ukrainian - Ukraine</td> </tr><tr> <td><code class="literal">ur_PK</code></td> <td>Urdu - Pakistan</td> </tr><tr> <td><code class="literal">vi_VN</code></td> <td>Vietnamese - Vietnam</td> </tr><tr> <td><code class="literal">zh_CN</code></td> <td>Chinese - China</td> </tr><tr> <td><code class="literal">zh_HK</code></td> <td>Chinese - Hong Kong</td> </tr><tr> <td><code class="literal">zh_TW</code></td> <td>Chinese - Taiwan</td> </tr></tbody></table>
