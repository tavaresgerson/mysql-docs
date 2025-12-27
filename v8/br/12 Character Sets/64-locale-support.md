## Suporte ao Local do Servidor MySQL

O local indicado pela variável de sistema `lc_time_names` controla o idioma usado para exibir os nomes e abreviações de dia e mês. Essa variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`.

O valor de `lc_time_names` não afeta a função `STR_TO_DATE()` ou `GET_FORMAT()`.

O valor de `lc_time_names` não afeta o resultado da função `FORMAT()`, mas essa função aceita um terceiro parâmetro opcional que permite especificar um local a ser usado para o ponto decimal do número de resultado, o separador de milhares e a separação entre os separadores. Os valores de local permitidos são os mesmos dos valores legais para a variável de sistema `lc_time_names`.

Os nomes de local têm subtags de idioma e região listadas pela IANA (<http://www.iana.org/assignments/language-subtag-registry>), como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'` independentemente da configuração do local do sistema, mas você pode definir o valor na inicialização do servidor ou definir o valor `GLOBAL` no tempo de execução, se tiver privilégios suficientes para definir variáveis de sistema globais; consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Qualquer cliente pode examinar o valor de `lc_time_names` ou definir seu valor `SESSION` para afetar o local para sua própria conexão.

(A primeira instrução `SET NAMES` no exemplo a seguir pode não ser necessária se nenhuma configuração relacionada ao conjunto de caracteres e cotação tiver sido alterada dos seus valores padrão; incluímos-a para a completude.)

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

O nome do dia ou mês para cada uma das funções afetadas é convertido do `utf8mb4` para o conjunto de caracteres indicado pela variável de sistema `character_set_connection`.

`lc_time_names` pode ser definido para qualquer um dos seguintes valores de local. O conjunto de locais suportado pelo MySQL pode diferir dos suportados pelo seu sistema operacional.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Valor Local</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>ar_AE</code></td> <td>Árabe - Emirados Árabes Unidos</td> </tr><tr> <td><code>ar_BH</code></td> <td>Árabe - Bahrein</td> </tr><tr> <td><code>ar_DZ</code></td> <td>Árabe - Argélia</td> </tr><tr> <td><code>ar_EG</code></td> <td>Árabe - Egito</td> </tr><tr> <td><code>ar_IN</code></td> <td>Árabe - Índia</td> </tr><tr> <td><code>ar_IQ</code></td> <td>Árabe - Iraque</td> </tr><tr> <td><code>ar_JO</code></td> <td>Árabe - Jordânia</td> </tr><tr> <td><code>ar_KW</code></td> <td>Árabe - Kuwait</td> </tr><tr> <td><code>ar_LB</code></td> <td>Árabe - Líbano</td> </tr><tr> <td><code>ar_LY</code></td> <td>Árabe - Líbia</td> </tr><tr> <td><code>ar_MA</code></td> <td>Árabe - Marrocos</td> </tr><tr> <td><code>ar_OM</code></td> <td>Árabe - Omã</td> </tr><tr> <td><code>ar_QA</code></td> <td>Árabe - Catar</td> </tr><tr> <td><code>ar_SA</code></td> <td>Árabe - Arábia Saudita</td> </tr><tr> <td><code>ar_SD</code></td> <td>Árabe - Sudão</td> </tr><tr> <td><code>ar_SY</code></td> <td>Árabe - Síria</td> </tr><tr> <td><code>ar_TN</code></td> <td>Árabe - Tunísia</td> </tr><tr> <td><code>ar_YE</code></td> <td>Árabe - Iêmen</td> </tr><tr> <td><code>be_BY</code></td> <td>Bielorrusso - Bielorrússia</td> </tr><tr> <td><code>bg_BG</code></td> <td>Búlgaro - Bulgária</td> </tr><tr> <td><code>ca_ES</code></td> <td>Catalão - Espanha</td> </tr><tr> <td><code>cs_CZ</code></td> <td>Tcheco - República Tcheca</td> </tr><tr> <td><code>da_DK</code></td> <td>Dinamarquês - Dinamarca</td> </tr><tr> <td><code>de_AT</code></td> <td>Alemão - Áustria</td> </tr><tr> <td><code>de_BE</code></td> <td>Alemão - Bélgica</td> </tr><tr> <td><code>de_CH</code></td> <td>Alemão - Suíça</td> </tr><tr> <td><code>de_DE</code></td> <td>Alemão - Alemanha</td> </tr><tr> <td><code>de_LU</code></td> <td>Alemão - Luxemburgo</td> </tr><tr> <td><code>el_GR</code></td> <td>Grego - Grécia</td> </tr><tr> <td><code>en_AU</code></td> <td>Inglês - Austrália</td> </tr><tr> <td><code>en_CA</code></td> <td>Inglês - Canadá</td> </tr><tr> <td><code>en_GB</code></td> <td>Inglês - Reino Unido</td> </tr><tr> <td><code>en_IN</code></td> <td>Inglês - Índia</td> </tr><tr> <td><code>en_NZ</code></td> <td>Inglês - Nova Zelândia</td> </tr><tr> <td><code>en_PH</code></td> <td>Inglês - Filipinas</td> </tr><tr> <td><code>en_US</code></td> <td>Inglês - Estados Unidos</td> </tr><tr> <td><code>en_ZA</code></td> <td>Inglês - África do Sul</td> </tr><tr> <td><code>en_ZW</code></td> <td>Inglês - Zimbábue</td> </tr><tr> <td><code>es_AR</code></td> <td>Espanhol - Argentina</td> </tr><tr> <td><code>es_BO</code></td> <td>Espanhol - Bolívia</td> </tr><tr> <td><code>es_CL</code></td> <td>Espanhol - Chile</td> </tr><tr> <td><code>es_CO</code></td> <td>Espanhol - Colômbia</td> </tr><tr> <td><code>es_CR</code></td> <td>Espanhol - Costa Rica</td> </tr><tr> <td><code>es_DO</code></td> <td>Espanhol - República Dominicana</td> </tr><tr> <td><code>es_EC</code></td> <td>Espanhol - Equador</td> </tr><tr> <td><code>es_ES</code></td> <td>Espanhol - Espanha</td> </tr><tr> <td><code>es_GT</code></td> <td>Espanhol - Guatemala</td> </tr><tr> <td><code>es_HN</code></td> <td>Espanhol - Honduras</td> </tr><tr> <td><code>es_MX</code></td> <td>Espanhol - México</td> </tr><tr> <td><code>es_NI</code></td> <td>Espanhol - Nic