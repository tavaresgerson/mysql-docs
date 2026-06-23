## 12.16 Suporte ao Locale do MySQL Server

O local indicado pela variável de sistema `lc_time_names` controla o idioma usado para exibir os nomes e abreviações de dia e mês. Essa variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`.

`lc_time_names` não afeta a função `STR_TO_DATE()` ou `GET_FORMAT()`.

O valor `lc_time_names` não afeta o resultado do `FORMAT()`, mas essa função aceita um terceiro parâmetro opcional que permite especificar um local a ser usado para o ponto decimal do número do resultado, o separador de milhares e a agrupamento entre separadores. Os valores de local permitidos são os mesmos dos valores legais para a variável de sistema `lc_time_names`.

Os nomes dos locais têm subtags de idioma e região listadas pela IANA (<http://www.iana.org/assignments/language-subtag-registry>) como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'`, independentemente da configuração do idioma do sistema, mas você pode definir o valor na inicialização do servidor ou definir o valor de `GLOBAL` no runtime, se você tiver privilégios suficientes para definir variáveis de sistema globais; consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Qualquer cliente pode examinar o valor de `lc_time_names` ou definir seu valor de `SESSION` para afetar o idioma para sua própria conexão.

(A primeira declaração `SET NAMES` no exemplo a seguir pode não ser necessária se nenhuma configuração relacionada ao conjunto de caracteres e à correção de erros foi alterada em relação aos seus valores padrão; a incluímos por completo.)

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

O nome do dia ou mês para cada uma das funções afetadas é convertido de `utf8mb4` para o conjunto de caracteres indicado pela variável do sistema `character_set_connection`.

`lc_time_names` pode ser definido para qualquer um dos seguintes valores de localização. O conjunto de locais suportados pelo MySQL pode diferir dos suportados pelo seu sistema operacional.

<table summary="Locale values to which lc_time_names may be set. The locale values are presented in a two-column table and in alphabetical order from top to bottom."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Locale Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>ar_AE</code></td> <td>Árabe - Emirados Árabes Unidos</td> </tr><tr> <td><code>ar_BH</code></td> <td>Árabe - Bahrein</td> </tr><tr> <td><code>ar_DZ</code></td> <td>Árabe - Argélia</td> </tr><tr> <td><code>ar_EG</code></td> <td>Árabe - Egito</td> </tr><tr> <td><code>ar_IN</code></td> <td>Árabe - Índia</td> </tr><tr> <td><code>ar_IQ</code></td> <td>Árabe - Iraque</td> </tr><tr> <td><code>ar_JO</code></td> <td>Árabe - Jordânia</td> </tr><tr> <td><code>ar_KW</code></td> <td>Árabe - Kuwait</td> </tr><tr> <td><code>ar_LB</code></td> <td>Árabe - Líbano</td> </tr><tr> <td><code>ar_LY</code></td> <td>Árabe - Líbia</td> </tr><tr> <td><code>ar_MA</code></td> <td>Árabe - Marrocos</td> </tr><tr> <td><code>ar_OM</code></td> <td>Árabe - Omã</td> </tr><tr> <td><code>ar_QA</code></td> <td>Árabe - Catar</td> </tr><tr> <td><code>ar_SA</code></td> <td>Árabe - Arábia Saudita</td> </tr><tr> <td><code>ar_SD</code></td> <td>Árabe - Sudão</td> </tr><tr> <td><code>ar_SY</code></td> <td>Árabe - Síria</td> </tr><tr> <td><code>ar_TN</code></td> <td>Árabe - Tunísia</td> </tr><tr> <td><code>ar_YE</code></td> <td>Árabe - Iêmen</td> </tr><tr> <td><code>be_BY</code></td> <td>Bielorrussão - Belarus</td> </tr><tr> <td><code>bg_BG</code></td> <td>búlgaro - Bulgária</td> </tr><tr> <td><code>ca_ES</code></td> <td>catalão - Espanha</td> </tr><tr> <td><code>cs_CZ</code></td> <td>Checo - República Checa</td> </tr><tr> <td><code>da_DK</code></td> <td>Dinamarquês - Dinamarca</td> </tr><tr> <td><code>de_AT</code></td> <td>Alemão - Áustria</td> </tr><tr> <td><code>de_BE</code></td> <td>Alemão - Bélgica</td> </tr><tr> <td><code>de_CH</code></td> <td>alemão - Suíça</td> </tr><tr> <td><code>de_DE</code></td> <td>Alemão - Alemanha</td> </tr><tr> <td><code>de_LU</code></td> <td>alemão - Luxemburgo</td> </tr><tr> <td><code>el_GR</code></td> <td>Grego - Grécia</td> </tr><tr> <td><code>en_AU</code></td> <td>Inglês - Austrália</td> </tr><tr> <td><code>en_CA</code></td> <td>Inglês - Canadá</td> </tr><tr> <td><code>en_GB</code></td> <td>Inglês - Reino Unido</td> </tr><tr> <td><code>en_IN</code></td> <td>Inglês - Índia</td> </tr><tr> <td><code>en_NZ</code></td> <td>Inglês - Nova Zelândia</td> </tr><tr> <td><code>en_PH</code></td> <td>Inglês - Filipinas</td> </tr><tr> <td><code>en_US</code></td> <td>Inglês - Estados Unidos</td> </tr><tr> <td><code>en_ZA</code></td> <td>Inglês - África do Sul</td> </tr><tr> <td><code>en_ZW</code></td> <td>Inglês - Zimbábue</td> </tr><tr> <td><code>es_AR</code></td> <td>Espanhol - Argentina</td> </tr><tr> <td><code>es_BO</code></td> <td>Espanhol - Bolívia</td> </tr><tr> <td><code>es_CL</code></td> <td>Espanhol - Chile</td> </tr><tr> <td><code>es_CO</code></td> <td>Espanhol - Colômbia</td> </tr><tr> <td><code>es_CR</code></td> <td>Espanhol - Costa Rica</td> </tr><tr> <td><code>es_DO</code></td> <td>Espanhol - República Dominicana</td> </tr><tr> <td><code>es_EC</code></td> <td>Espanhol - Equador</td> </tr><tr> <td><code>es_ES</code></td> <td>Espanhol - Espanha</td> </tr><tr> <td><code>es_GT</code></td> <td>Espanhol - Guatemala</td> </tr><tr> <td><code>es_HN</code></td> <td>Espanhol - Honduras</td> </tr><tr> <td><code>es_MX</code></td> <td>Espanhol - México</td> </tr><tr> <td><code>es_NI</code></td> <td>Espanhol - Nicarágua</td> </tr><tr> <td><code>es_PA</code></td> <td>Espanhol - Panamá</td> </tr><tr> <td><code>es_PE</code></td> <td>Espanhol - Peru</td> </tr><tr> <td><code>es_PR</code></td> <td>Espanhol - Porto Rico</td> </tr><tr> <td><code>es_PY</code></td> <td>Espanhol - Paraguai</td> </tr><tr> <td><code>es_SV</code></td> <td>Espanhol - El Salvador</td> </tr><tr> <td><code>es_US</code></td> <td>Espanhol - Estados Unidos</td> </tr><tr> <td><code>es_UY</code></td> <td>Espanhol - Uruguai</td> </tr><tr> <td><code>es_VE</code></td> <td>Espanhol - Venezuela</td> </tr><tr> <td><code>et_EE</code></td> <td>Eesti - Estônia</td> </tr><tr> <td><code>eu_ES</code></td> <td>Basco - Espanha</td> </tr><tr> <td><code>fi_FI</code></td> <td>Finlandês - Finlândia</td> </tr><tr> <td><code>fo_FO</code></td> <td>Faroês - Ilhas Faroé</td> </tr><tr> <td><code>fr_BE</code></td> <td>Francês - Bélgica</td> </tr><tr> <td><code>fr_CA</code></td> <td>francês - Canadá</td> </tr><tr> <td><code>fr_CH</code></td> <td>Francês - Suíça</td> </tr><tr> <td><code>fr_FR</code></td> <td>Francês - França</td> </tr><tr> <td><code>fr_LU</code></td> <td>Francês - Luxemburgo</td> </tr><tr> <td><code>gl_ES</code></td> <td>Galego - Espanha</td> </tr><tr> <td><code>gu_IN</code></td> <td>gujarati - Índia</td> </tr><tr> <td><code>he_IL</code></td> <td>Hebreu - Israel</td> </tr><tr> <td><code>hi_IN</code></td> <td>Hindi - Índia</td> </tr><tr> <td><code>hr_HR</code></td> <td>Croata - Croácia</td> </tr><tr> <td><code>hu_HU</code></td> <td>Húngaro - Hungria</td> </tr><tr> <td><code>id_ID</code></td> <td>Indonésio - Indonésia</td> </tr><tr> <td><code>is_IS</code></td> <td>Islandês - Islândia</td> </tr><tr> <td><code>it_CH</code></td> <td>Italiano - Suíça</td> </tr><tr> <td><code>it_IT</code></td> <td>Italiano - Itália</td> </tr><tr> <td><code>ja_JP</code></td> <td>Japonês - Japão</td> </tr><tr> <td><code>ko_KR</code></td> <td>Coreano - República da Coreia</td> </tr><tr> <td><code>lt_LT</code></td> <td>Lituano - Lituânia</td> </tr><tr> <td><code>lv_LV</code></td> <td>Letão - Letônia</td> </tr><tr> <td><code>mk_MK</code></td> <td>Makedônico - Macedônia do Norte</td> </tr><tr> <td><code>mn_MN</code></td> <td>Mongólia - Mongoló</td> </tr><tr> <td><code>ms_MY</code></td> <td>Malayo - Malásia</td> </tr><tr> <td><code>nb_NO</code></td> <td>Norueguês (Bokmål) - Noruega</td> </tr><tr> <td><code>nl_BE</code></td> <td>Holanda - Bélgica</td> </tr><tr> <td><code>nl_NL</code></td> <td>Holanda - Países Baixos</td> </tr><tr> <td><code>no_NO</code></td> <td>Norueguês - Noruega</td> </tr><tr> <td><code>pl_PL</code></td> <td>Polonês - Polônia</td> </tr><tr> <td><code>pt_BR</code></td> <td>Português (Brasil) - Brasil</td> </tr><tr> <td><code>pt_PT</code></td> <td>Português (Brasil) - Portugal</td> </tr><tr> <td><code>rm_CH</code></td> <td>Romansh - Suíça</td> </tr><tr> <td><code>ro_RO</code></td> <td>Român - România</td> </tr><tr> <td><code>ru_RU</code></td> <td>Russo - Rússia</td> </tr><tr> <td><code>ru_UA</code></td> <td>Russo - Ucrânia</td> </tr><tr> <td><code>sk_SK</code></td> <td>Eslovaco - Eslováquia</td> </tr><tr> <td><code>sl_SI</code></td> <td>Esloveno - Eslovênia</td> </tr><tr> <td><code>sq_AL</code></td> <td>Albanês - Albânia</td> </tr><tr> <td><code>sr_RS</code></td> <td>Sérvio - Sérvia</td> </tr><tr> <td><code>sv_FI</code></td> <td>Suécia - Finlândia</td> </tr><tr> <td><code>sv_SE</code></td> <td>Suécia - Suécia</td> </tr><tr> <td><code>ta_IN</code></td> <td>Tamil - Índia</td> </tr><tr> <td><code>te_IN</code></td> <td>Telugu - Índia</td> </tr><tr> <td><code>th_TH</code></td> <td>Tailandês - Tailândia</td> </tr><tr> <td><code>tr_TR</code></td> <td>Turco - Turquia</td> </tr><tr> <td><code>uk_UA</code></td> <td>Ucraniano - Ucrânia</td> </tr><tr> <td><code>ur_PK</code></td> <td>Urdu - Paquistão</td> </tr><tr> <td><code>vi_VN</code></td> <td>Vietnamita - Vietnã</td> </tr><tr> <td><code>zh_CN</code></td> <td>Chinês - China</td> </tr><tr> <td><code>zh_HK</code></td> <td>Chinês - Hong Kong</td> </tr><tr> <td><code>zh_TW</code></td> <td>Chinês - Taiwan</td> </tr></tbody></table>