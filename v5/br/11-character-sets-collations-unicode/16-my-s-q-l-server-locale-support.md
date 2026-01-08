## 10.16 Suporte ao Local do MySQL Server

O local indicado pela variável de sistema `lc_time_names` controla o idioma usado para exibir os nomes e abreviações de dia e mês. Essa variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`.

`lc_time_names` não afeta as funções `STR_TO_DATE()` ou `GET_FORMAT()`.

O valor `lc_time_names` não afeta o resultado da função `FORMAT()`, mas essa função aceita um terceiro parâmetro opcional que permite especificar uma região para ser usada no ponto decimal do número do resultado, separador de milhares e agrupamento entre separadores. Os valores de região permitidos são os mesmos dos valores legais para a variável de sistema `lc_time_names`.

Os nomes do local têm subtags de idioma e região listadas pela IANA (<http://www.iana.org/assignments/language-subtag-registry>), como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'` independentemente da configuração do idioma do sistema, mas você pode definir o valor na inicialização do servidor ou definir o valor `GLOBAL` no tempo de execução, se você tiver privilégios suficientes para definir variáveis de sistema globais; consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. Qualquer cliente pode examinar o valor de `lc_time_names` ou definir seu valor `SESSION` para afetar o idioma de sua própria conexão.

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

O nome do dia ou do mês de cada uma das funções afetadas é convertido de `utf8` para o conjunto de caracteres indicado pela variável de sistema `character_set_connection`.

`lc_time_names` pode ser definido para qualquer um dos seguintes valores de idioma. O conjunto de idiomas suportados pelo MySQL pode diferir dos suportados pelo seu sistema operacional.

<table summary="Valores de localização para os quais o lc_time_names pode ser definido. Os valores de localização são apresentados em uma tabela de duas colunas e em ordem alfabética de cima para baixo."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Valor do local</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>sv_SE</code>]</td> <td>Árabe - Emirados Árabes Unidos</td> </tr><tr> <td>[[PH_HTML_CODE_<code>sv_SE</code>]</td> <td>Árabe - Bahrein</td> </tr><tr> <td>[[PH_HTML_CODE_<code>te_IN</code>]</td> <td>Árabe - Argélia</td> </tr><tr> <td>[[PH_HTML_CODE_<code>th_TH</code>]</td> <td>Árabe - Egito</td> </tr><tr> <td>[[PH_HTML_CODE_<code>tr_TR</code>]</td> <td>Árabe - Índia</td> </tr><tr> <td>[[PH_HTML_CODE_<code>uk_UA</code>]</td> <td>Árabe - Iraque</td> </tr><tr> <td>[[PH_HTML_CODE_<code>ur_PK</code>]</td> <td>Árabe - Jordânia</td> </tr><tr> <td>[[PH_HTML_CODE_<code>vi_VN</code>]</td> <td>Árabe - Kuwait</td> </tr><tr> <td>[[PH_HTML_CODE_<code>zh_CN</code>]</td> <td>Árabe - Líbano</td> </tr><tr> <td>[[PH_HTML_CODE_<code>zh_HK</code>]</td> <td>Árabe - Líbia</td> </tr><tr> <td>[[<code>ar_BH</code><code>sv_SE</code>]</td> <td>Árabe - Marrocos</td> </tr><tr> <td>[[<code>ar_BH</code><code>sv_SE</code>]</td> <td>Árabe - Omã</td> </tr><tr> <td>[[<code>ar_BH</code><code>te_IN</code>]</td> <td>Árabe - Catar</td> </tr><tr> <td>[[<code>ar_BH</code><code>th_TH</code>]</td> <td>Árabe - Arábia Saudita</td> </tr><tr> <td>[[<code>ar_BH</code><code>tr_TR</code>]</td> <td>Árabe - Sudão</td> </tr><tr> <td>[[<code>ar_BH</code><code>uk_UA</code>]</td> <td>Árabe - Síria</td> </tr><tr> <td>[[<code>ar_BH</code><code>ur_PK</code>]</td> <td>Árabe - Tunísia</td> </tr><tr> <td>[[<code>ar_BH</code><code>vi_VN</code>]</td> <td>Árabe - Iêmen</td> </tr><tr> <td>[[<code>ar_BH</code><code>zh_CN</code>]</td> <td>Bielorrusso - Bielorrússia</td> </tr><tr> <td>[[<code>ar_BH</code><code>zh_HK</code>]</td> <td>Búlgaro - Bulgária</td> </tr><tr> <td>[[<code>ar_DZ</code><code>sv_SE</code>]</td> <td>Catalão - Espanha</td> </tr><tr> <td>[[<code>ar_DZ</code><code>sv_SE</code>]</td> <td>Checo - República Checa</td> </tr><tr> <td>[[<code>ar_DZ</code><code>te_IN</code>]</td> <td>Dinamarquês - Dinamarca</td> </tr><tr> <td>[[<code>ar_DZ</code><code>th_TH</code>]</td> <td>Alemão - Áustria</td> </tr><tr> <td>[[<code>ar_DZ</code><code>tr_TR</code>]</td> <td>Alemão - Bélgica</td> </tr><tr> <td>[[<code>ar_DZ</code><code>uk_UA</code>]</td> <td>alemão - Suíça</td> </tr><tr> <td>[[<code>ar_DZ</code><code>ur_PK</code>]</td> <td>Alemão - Alemanha</td> </tr><tr> <td>[[<code>ar_DZ</code><code>vi_VN</code>]</td> <td>Alemão - Luxemburgo</td> </tr><tr> <td>[[<code>ar_DZ</code><code>zh_CN</code>]</td> <td>Grego - Grécia</td> </tr><tr> <td>[[<code>ar_DZ</code><code>zh_HK</code>]</td> <td>Inglês - Austrália</td> </tr><tr> <td>[[<code>ar_EG</code><code>sv_SE</code>]</td> <td>Inglês - Canadá</td> </tr><tr> <td>[[<code>ar_EG</code><code>sv_SE</code>]</td> <td>Inglês - Reino Unido</td> </tr><tr> <td>[[<code>ar_EG</code><code>te_IN</code>]</td> <td>Inglês - Índia</td> </tr><tr> <td>[[<code>ar_EG</code><code>th_TH</code>]</td> <td>Inglês - Nova Zelândia</td> </tr><tr> <td>[[<code>ar_EG</code><code>tr_TR</code>]</td> <td>Inglês - Filipinas</td> </tr><tr> <td>[[<code>ar_EG</code><code>uk_UA</code>]</td> <td>Inglês - Estados Unidos</td> </tr><tr> <td>[[<code>ar_EG</code><code>ur_PK</code>]</td> <td>Inglês - África do Sul</td> </tr><tr> <td>[[<code>ar_EG</code><code>vi_VN</code>]</td> <td>Inglês - Zimbábue</td> </tr><tr> <td>[[<code>ar_EG</code><code>zh_CN</code>]</td> <td>Espanhol - Argentina</td> </tr><tr> <td>[[<code>ar_EG</code><code>zh_HK</code>]</td> <td>Espanhol - Bolívia</td> </tr><tr> <td>[[<code>ar_IN</code><code>sv_SE</code>]</td> <td>Espanhol - Chile</td> </tr><tr> <td>[[<code>ar_IN</code><code>sv_SE</code>]</td> <td>Espanhol - Colômbia</td> </tr><tr> <td>[[<code>ar_IN</code><code>te_IN</code>]</td> <td>Espanhol - Costa Rica</td> </tr><tr> <td>[[<code>ar_IN</code><code>th_TH</code>]</td> <td>Espanhol - República Dominicana</td> </tr><tr> <td>[[<code>ar_IN</code><code>tr_TR</code>]</td> <td>Espanhol - Equador</td> </tr><tr> <td>[[<code>ar_IN</code><code>uk_UA</code>]</td> <td>Espanhol - Espanha</td> </tr><tr> <td>[[<code>ar_IN</code><code>ur_PK</code>]</td> <td>Espanhol - Guatemala</td> </tr><tr> <td>[[<code>ar_IN</code><code>vi_VN</code>]</td> <td>Espanhol - Honduras</td> </tr><tr> <td>[[<code>ar_IN</code><code>zh_CN</code>]</td> <td>Espanhol - México</td> </tr><tr> <td>[[<code>ar_IN</code><code>zh_HK</code>]</td> <td>Espanhol - Nicarágua</td> </tr><tr> <td>[[<code>ar_IQ</code><code>sv_SE</code>]</td> <td>Espanhol - Panamá</td> </tr><tr> <td>[[<code>ar_IQ</code><code>sv_SE</code>]</td> <td>Espanhol - Peru</td> </tr><tr> <td>[[<code>ar_IQ</code><code>te_IN</code>]</td> <td>Espanhol - Porto Rico</td> </tr><tr> <td>[[<code>ar_IQ</code><code>th_TH</code>]</td> <td>Espanhol - Paraguai</td> </tr><tr> <td>[[<code>ar_IQ</code><code>tr_TR</code>]</td> <td>Espanhol - El Salvador</td> </tr><tr> <td>[[<code>ar_IQ</code><code>uk_UA</code>]</td> <td>Espanhol - Estados Unidos</td> </tr><tr> <td>[[<code>ar_IQ</code><code>ur_PK</code>]</td> <td>Espanhol - Uruguai</td> </tr><tr> <td>[[<code>ar_IQ</code><code>vi_VN</code>]</td> <td>Espanhol - Venezuela</td> </tr><tr> <td>[[<code>ar_IQ</code><code>zh_CN</code>]</td> <td>Estoniano - Estônia</td> </tr><tr> <td>[[<code>ar_IQ</code><code>zh_HK</code>]</td> <td>Basco - Espanha</td> </tr><tr> <td>[[<code>ar_JO</code><code>sv_SE</code>]</td> <td>Finlandês - Finlândia</td> </tr><tr> <td>[[<code>ar_JO</code><code>sv_SE</code>]</td> <td>Faroês - Ilhas Faroé</td> </tr><tr> <td>[[<code>ar_JO</code><code>te_IN</code>]</td> <td>Francês - Bélgica</td> </tr><tr> <td>[[<code>ar_JO</code><code>th_TH</code>]</td> <td>Francês - Canadá</td> </tr><tr> <td>[[<code>ar_JO</code><code>tr_TR</code>]</td> <td>Francês - Suíça</td> </tr><tr> <td>[[<code>ar_JO</code><code>uk_UA</code>]</td> <td>Francês - França</td> </tr><tr> <td>[[<code>ar_JO</code><code>ur_PK</code>]</td> <td>Francês - Luxemburgo</td> </tr><tr> <td>[[<code>ar_JO</code><code>vi_VN</code>]</td> <td>Galego - Espanha</td> </tr><tr> <td>[[<code>ar_JO</code><code>zh_CN</code>]</td> <td>Gujarati - Índia</td> </tr><tr> <td>[[<code>ar_JO</code><code>zh_HK</code>]</td> <td>Hebreu - Israel</td> </tr><tr> <td>[[<code>ar_KW</code><code>sv_SE</code>]</td> <td>Hindi - Índia</td> </tr><tr> <td>[[<code>ar_KW</code><code>sv_SE</code>]</td> <td>Croata - Croácia</td> </tr><tr> <td>[[<code>ar_KW</code><code>te_IN</code>]</td> <td>Húngaro - Hungria</td> </tr><tr> <td>[[<code>ar_KW</code><code>th_TH</code>]</td> <td>Indonésio - Indonésia</td> </tr><tr> <td>[[<code>ar_KW</code><code>tr_TR</code>]</td> <td>Islandês - Islândia</td> </tr><tr> <td>[[<code>ar_KW</code><code>uk_UA</code>]</td> <td>Italiano - Suíça</td> </tr><tr> <td>[[<code>ar_KW</code><code>ur_PK</code>]</td> <td>Italiano - Itália</td> </tr><tr> <td>[[<code>ar_KW</code><code>vi_VN</code>]</td> <td>Japonês - Japão</td> </tr><tr> <td>[[<code>ar_KW</code><code>zh_CN</code>]</td> <td>Coreano - República da Coreia</td> </tr><tr> <td>[[<code>ar_KW</code><code>zh_HK</code>]</td> <td>Lituano - Lituânia</td> </tr><tr> <td>[[<code>ar_LB</code><code>sv_SE</code>]</td> <td>Letão - Letônia</td> </tr><tr> <td>[[<code>ar_LB</code><code>sv_SE</code>]</td> <td>Macedônio - Macedônia do Norte</td> </tr><tr> <td>[[<code>ar_LB</code><code>te_IN</code>]</td> <td>Mongólia - Mongolês</td> </tr><tr> <td>[[<code>ar_LB</code><code>th_TH</code>]</td> <td>Malásia - Malásia</td> </tr><tr> <td>[[<code>ar_LB</code><code>tr_TR</code>]</td> <td>Norueguês (Bokmål) - Noruega</td> </tr><tr> <td>[[<code>ar_LB</code><code>uk_UA</code>]</td> <td>Holanda - Bélgica</td> </tr><tr> <td>[[<code>ar_LB</code><code>ur_PK</code>]</td> <td>Holanda - Países Baixos</td> </tr><tr> <td>[[<code>ar_LB</code><code>vi_VN</code>]</td> <td>Norueguês - Noruega</td> </tr><tr> <td>[[<code>ar_LB</code><code>zh_CN</code>]</td> <td>Pólska - Polônia</td> </tr><tr> <td>[[<code>ar_LB</code><code>zh_HK</code>]</td> <td>Português - Brasil</td> </tr><tr> <td>[[<code>ar_LY</code><code>sv_SE</code>]</td> <td>Português - Portugal</td> </tr><tr> <td>[[<code>ar_LY</code><code>sv_SE</code>]</td> <td>Romansh - Suíça</td> </tr><tr> <td>[[<code>ar_LY</code><code>te_IN</code>]</td> <td>Român - Romênia</td> </tr><tr> <td>[[<code>ar_LY</code><code>th_TH</code>]</td> <td>Russo - Rússia</td> </tr><tr> <td>[[<code>ar_LY</code><code>tr_TR</code>]</td> <td>Russo - Ucrânia</td> </tr><tr> <td>[[<code>ar_LY</code><code>uk_UA</code>]</td> <td>Eslovaco - Eslováquia</td> </tr><tr> <td>[[<code>ar_LY</code><code>ur_PK</code>]</td> <td>Esloveno - Eslovênia</td> </tr><tr> <td>[[<code>ar_LY</code><code>vi_VN</code>]</td> <td>Albanês - Albânia</td> </tr><tr> <td>[[<code>ar_LY</code><code>zh_CN</code>]</td> <td>Sérvio - Sérvia</td> </tr><tr> <td>[[<code>ar_LY</code><code>zh_HK</code>]</td> <td>Suécia - Finlândia</td> </tr><tr> <td>[[<code>sv_SE</code>]]</td> <td>Suécia - Suécia</td> </tr><tr> <td>[[<code>ar_MA</code><code>sv_SE</code>]</td> <td>Tamil - Índia</td> </tr><tr> <td>[[<code>te_IN</code>]]</td> <td>Telugu - Índia</td> </tr><tr> <td>[[<code>th_TH</code>]]</td> <td>Tailandês - Tailândia</td> </tr><tr> <td>[[<code>tr_TR</code>]]</td> <td>Turco - Turquia</td> </tr><tr> <td>[[<code>uk_UA</code>]]</td> <td>Ucraniano - Ucrânia</td> </tr><tr> <td>[[<code>ur_PK</code>]]</td> <td>Urdu - Paquistão</td> </tr><tr> <td>[[<code>vi_VN</code>]]</td> <td>Vietnamita - Vietnã</td> </tr><tr> <td>[[<code>zh_CN</code>]]</td> <td>Chinês - China</td> </tr><tr> <td>[[<code>zh_HK</code>]]</td> <td>Chinês - Hong Kong</td> </tr><tr> <td>[[<code>ar_OM</code><code>sv_SE</code>]</td> <td>Chinês - Taiwan</td> </tr></tbody></table>
