#### 8.5.2.4 Descrições das Funções do Componente de Máscara e Desidentificação de Dados do MySQL Enterprise

Os componentes de Máscara e Desidentificação de Dados do MySQL Enterprise incluem várias funções, que podem ser agrupadas nessas categorias:

* Funções do Componente de Máscara de Dados
* Funções do Componente de Geração de Dados Aleatórios
* Funções do Componente de Administração de Máscara de Dicionário
* Funções do Componente de Geração de Dicionário

##### Funções do Componente de Máscara de Dados

Cada função do componente nesta seção realiza uma operação de máscara em seu argumento de string e retorna o resultado mascarado.

* `mask_canada_sin(str [, mask_char])`

  Mascara um Número de Seguro Social do Canadá (SIN) e retorna o número com todos os dígitos significativos substituídos por caracteres `'X'`. Um caractere de máscara opcional pode ser especificado.

  Argumentos:

  + *`str`*: A string a ser mascarada. Os formatos aceitos são:

    - Nove dígitos não separados.
    - Nove dígitos agrupados no padrão: `xxx-xxx-xxx` ('`-`' é qualquer caractere de separador).

    Este argumento é convertido para o conjunto de caracteres `utf8mb4`.
  + *`mask_char`*: (Opcional) O único caractere a ser usado para a máscara. O padrão é `'X'` se *`mask_char`* não for fornecido.

  Valor de retorno:

  O SIN mascarado do Canadá como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto ou `NULL` se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

  ```
  mysql> SELECT mask_canada_sin('046-454-286'), mask_canada_sin('abcdefijk');
  +--------------------------------+------------------------------+
  | mask_canada_sin('046-454-286') | mask_canada_sin('abcdefijk') |
  +--------------------------------+------------------------------+
  | XXX-XXX-XXX                    | XXXXXXXXX                    |
  +--------------------------------+------------------------------+
  mysql> SELECT mask_canada_sin('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_canada_sin'; Argument 0 is too short.
  mysql> SELECT mask_canada_sin('046-454-286-909');
  ERROR 1123 (HY000): Can't initialize function 'mask_canada_sin'; Argument 0 is too long.
  ```
* `mask_iban(str [, mask_char])`

  Mascara um Número de Conta Bancária Internacional (IBAN) e retorna o número com todas as letras, exceto as duas primeiras (que indicam o país), substituídas por caracteres `'*'` . Um caractere de máscara opcional pode ser especificado.

  Argumentos:

  + *`str`*: A string a ser mascarada. Cada país pode ter um sistema de numeração ou roteamento nacional diferente, com um mínimo de 13 e um máximo de 34 caracteres ASCII alfanuméricos. Os formatos aceitos são:
```
  mysql> SELECT mask_iban('IE12 BOFI 9000 0112 3456 78'), mask_iban('abcdefghijk');
  +------------------------------------------+--------------------------+
  | mask_iban('IE12 BOFI 9000 0112 3456 78') | mask_iban('abcdefghijk') |
  +------------------------------------------+--------------------------+
  | IE** **** **** **** **** **              | ab*********              |
  +------------------------------------------+--------------------------+
  mysql> SELECT mask_iban('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_iban'; Argument 0 is too short.
  mysql> SELECT mask_iban('IE12 BOFI 9000 0112 3456 78 IE12 BOFI 9000 0112 3456 78');
  ERROR 1123 (HY000): Can't initialize function 'mask_iban'; Argument 0 is too long.
  ```Ry0DPrFFvV```
  mysql> SELECT mask_inner('abcdef', 1, 2), mask_inner('abcdef',0, 5);
  +----------------------------+---------------------------+
  | mask_inner('abcdef', 1, 2) | mask_inner('abcdef',0, 5) |
  +----------------------------+---------------------------+
  | aXXXef                     | Xbcdef                    |
  +----------------------------+---------------------------+
  mysql> SELECT mask_inner('abcdef', 1, 2, '*'), mask_inner('abcdef',0, 5, '#');
  +---------------------------------+--------------------------------+
  | mask_inner('abcdef', 1, 2, '*') | mask_inner('abcdef',0, 5, '#') |
  +---------------------------------+--------------------------------+
  | a***ef                          | #bcdef                         |
  +---------------------------------+--------------------------------+
  ```lGUoGNP4t9```
  mysql> SELECT mask_outer('abcdef', 1, 2), mask_outer('abcdef',0, 5);
  +----------------------------+---------------------------+
  | mask_outer('abcdef', 1, 2) | mask_outer('abcdef',0, 5) |
  +----------------------------+---------------------------+
  | XbcdXX                     | aXXXXX                    |
  +----------------------------+---------------------------+
  mysql> SELECT mask_outer('abcdef', 1, 2, '*'), mask_outer('abcdef',0, 5, '#');
  +---------------------------------+--------------------------------+
  | mask_outer('abcdef', 1, 2, '*') | mask_outer('abcdef',0, 5, '#') |
  +---------------------------------+--------------------------------+
  | *bcd**                          | a#####                         |
  +---------------------------------+--------------------------------+
  ```54UlA3qLCX```
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX9102        |
  +-------------------------+
  mysql> SELECT mask_pan(gen_rnd_pan(19));
  +---------------------------+
  | mask_pan(gen_rnd_pan(19)) |
  +---------------------------+
  | XXXXXXXXXXXXXXX8268       |
  +---------------------------+
  mysql> SELECT mask_pan('a*Z');
  ERROR 1123 (HY000): Can't initialize function 'mask_pan'; Argument 0 is too short.
  ```ewp1vYMuny```
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 551279XXXXXX3108                |
  +---------------------------------+
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan(19));
  +-----------------------------------+
  | mask_pan_relaxed(gen_rnd_pan(19)) |
  +-----------------------------------+
  | 462634XXXXXXXXX6739               |
  +-----------------------------------+
  mysql> SELECT mask_pan_relaxed('a*Z');
  ERROR 1123 (HY000): Can't initialize function 'mask_pan_relaxed'; Argument 0 is too short.
  ```pSlDlQQyEq```
  mysql> SELECT mask_ssn('909-63-6922'), mask_ssn('cdefghijk');
  +-------------------------+-------------------------+
  | mask_ssn('909-63-6922') | mask_ssn('cdefghijk')   |
  +-------------------------+-------------------------+
  | ***-**-6922             | *******hijk             |
  +-------------------------+-------------------------+
  mysql> SELECT mask_ssn('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; Argument 0 is too short.
  mysql> SELECT mask_ssn('123456789123456789');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; Argument 0 is too long.
  ```rgmj8ooLL4```
  mysql> SELECT mask_uk_nin('QQ 12 34 56 C'), mask_uk_nin('abcdefghi');
  +------------------------------+--------------------------+
  | mask_uk_nin('QQ 12 34 56 C') | mask_uk_nin('abcdefghi') |
  +------------------------------+--------------------------+
  | QQ ** ** ** *                | ab*******                |
  +------------------------------+--------------------------+
  mysql> SELECT mask_uk_nin('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_uk_nin'; Argument 0 is too short.
  mysql> SELECT mask_uk_nin('abcdefghijk');
  ERROR 1123 (HY000): Can't initialize function 'mask_uk_nin'; Argument 0 is too long.
  ```4wHSEvwwKq```
  mysql> SELECT mask_uuid(gen_rnd_uuid());
  +--------------------------------------+
  | mask_uuid(gen_rnd_uuid())            |
  +--------------------------------------+
  | ********-****-****-****-************ |
  +--------------------------------------+
  mysql> SELECT mask_uuid('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_uuid'; Argument 0 is too short.
  mysql> SELECT mask_uuid('123e4567-e89b-12d3-a456-426614174000-123e4567-e89b-12d3');
  ERROR 1123 (HY000): Can't initialize function 'mask_uuid'; Argument 0 is too long.
  ```Dbo0cWCZS3```
  mysql> SELECT gen_range(100, 200), gen_range(-1000, -800);
  +---------------------+------------------------+
  | gen_range(100, 200) | gen_range(-1000, -800) |
  +---------------------+------------------------+
  |                 177 |                   -917 |
  +---------------------+------------------------+
  mysql> SELECT gen_range(1, 0);
  +-----------------+
  | gen_range(1, 0) |
  +-----------------+
  |            NULL |
  +-----------------+
  ```NxgIx7fKHc```
  mysql> SELECT mask_canada_sin( gen_rnd_canada_sin() );
  +-----------------------------------------+
  | mask_canada_sin( gen_rnd_canada_sin() ) |
  +-----------------------------------------+
  | xxx-xxx-xxx                             |
  +-----------------------------------------+
  ```IicNazxbxG```
  mysql> SELECT gen_rnd_email(name_size = 4, surname_size = 5, domain = 'mynet.com');
  +----------------------------------------------------------------------+
  | gen_rnd_email(name_size = 4, surname_size = 5, domain = 'mynet.com') |
  +----------------------------------------------------------------------+
  | lsoy.qwupp@mynet.com                                                 |
  +----------------------------------------------------------------------+
  mysql> SELECT gen_rnd_email();
  +---------------------------+
  | gen_rnd_email()           |
  +---------------------------+
  | ijocv.mwvhhuf@example.com |
  +---------------------------+
  ```4WEAx52nxr```
  mysql> SELECT gen_rnd_iban();
  +-----------------------------+
  | gen_rnd_iban()              |
  +-----------------------------+
  | ZZ79 3K2J WNH9 1V0DI        |
  +-----------------------------+
  ```zm5yOWrCaK```
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX5805        |
  +-------------------------+
  mysql> SELECT mask_pan(gen_rnd_pan(19));
  +---------------------------+
  | mask_pan(gen_rnd_pan(19)) |
  +---------------------------+
  | XXXXXXXXXXXXXXX5067       |
  +---------------------------+
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 398403XXXXXX9547                |
  +---------------------------------+
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan(19));
  +-----------------------------------+
  | mask_pan_relaxed(gen_rnd_pan(19)) |
  +-----------------------------------+
  | 578416XXXXXXXXX6509               |
  +-----------------------------------+
  mysql> SELECT gen_rnd_pan(20);
  ERROR 1123 (HY000): Can't initialize function 'gen_rnd_pan'; Maximal value of
  argument 0 is 20.
  ```SKA2I1DCeJ```
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```x6tVz8Uqlx```
  mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
  +---------------------------------+
  | mask_uk_nin( gen_rnd_uk_nin() ) |
  +---------------------------------+
  | JE*******                       |
  +---------------------------------+
  ```f7Z5L9uApC```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```2lp0eoYK0k```
  mysql> SELECT gen_rnd_uuid();
  +--------------------------------------+
  | gen_rnd_uuid()                       |
  +--------------------------------------+
  | 123e4567-e89b-12d3-a456-426614174000 |
  +--------------------------------------+
  ```NJrLZWMHOk```
  mysql> SELECT masking_dictionary_remove('mydict');
  +-------------------------------------+
  | masking_dictionary_remove('mydict') |
  +-------------------------------------+
  |                                   1 |
  +-------------------------------------+
  mysql> SELECT masking_dictionary_remove('no-such-dict');
  +-------------------------------------------+
  | masking_dictionary_remove('no-such-dict') |
  +-------------------------------------------+
  |                                      NULL |
  +-------------------------------------------+
  ```aRGM6qZmMy```
  mysql> SELECT masking_dictionary_term_add('mydict','newterm');
  +-------------------------------------------------+
  | masking_dictionary_term_add('mydict','newterm') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT masking_dictionary_term_add('mydict','');
  +------------------------------------------+
  | masking_dictionary_term_add('mydict','') |
  +------------------------------------------+
  |                                     NULL |
  +------------------------------------------+
  ```t38NEqCeOe```
  mysql> SELECT masking_dictionary_term_add('mydict','newterm');
  +-------------------------------------------------+
  | masking_dictionary_term_add('mydict','newterm') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT masking_dictionary_term_remove('mydict','');
  +---------------------------------------------+
  | masking_dictionary_term_remove('mydict','') |
  +---------------------------------------------+
  |                                        NULL |
  +---------------------------------------------+
  ```V78bhQANQ6```
  mysql> SELECT gen_blocklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blocklist('Berlin', 'DE_Cities', 'US_Cities') |
  +---------------------------------------------------+
  | Phoenix                                           |
  +---------------------------------------------------+
  ```hSHtg3XtDt```
  mysql> SELECT gen_dictionary('mydict');
  +--------------------------+
  | gen_dictionary('mydict') |
  +--------------------------+
  | My term                  |
  +--------------------------+
  mysql> SELECT gen_dictionary('no-such-dict');
  ERROR 1123 (HY000): Can't initialize function 'gen_dictionary'; Cannot access
  dictionary, check if dictionary name is valid.
  ```XTOzVEYCAc```