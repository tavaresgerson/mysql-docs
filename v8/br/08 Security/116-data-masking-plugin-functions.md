#### 8.5.3.4 Descrições das Funções do Plugin de Máscara e Desidentificação de Dados do MySQL Enterprise

A biblioteca de funções do plugin de Máscara e Desidentificação de Dados do MySQL Enterprise inclui várias funções, que podem ser agrupadas nessas categorias:

*  Funções do Plugin de Máscara de Dados
*  Funções do Plugin de Geração de Dados Aleatórios
*  Funções do Plugin Baseadas em Dicionário de Dados Aleatórios

Essas funções suportam o conjunto de caracteres `latin1` de um byte para argumentos de string e valores de retorno. Se um valor de retorno de string deve estar em um conjunto de caracteres diferente, converta-o. O exemplo a seguir mostra como converter o resultado de `gen_rnd_email()` para o conjunto de caracteres `utf8mb4`:

```
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

Também pode ser necessário converter argumentos de string, como ilustrado em Usando Dados Mascados para Identificação de Clientes.

Se uma função de Máscara e Desidentificação de Dados do MySQL Enterprise for invocada dentro do cliente `mysql`, os resultados de string binários são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

##### Funções do Plugin de Máscara de Dados

Cada função do plugin nesta seção realiza uma operação de máscara em seu argumento de string e retorna o resultado mascarado.

* `mask_inner(str, margin1, margin2 [, mask_char])`

  Masca a parte interior de uma string, deixando as extremidades intocadas, e retorna o resultado. Um caractere de máscara opcional pode ser especificado.

  Argumentos:
```
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
  ```

  * `str`: O argumento de string a ser mascarado.
  * `margin1`: O espaço inicial da máscara.
  * `margin2`: O espaço final da máscara.
  * `mask_char`: O caractere de máscara (opcional).
```
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
  ```python
mask_inner("Olá, mundo!", 2, 5, '|')
```
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
  +-----------------+
  | mask_pan('a*Z') |
  +-----------------+
  | a*Z             |
  +-----------------+
  ```562TxwkLPU```
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
  +-------------------------+
  | mask_pan_relaxed('a*Z') |
  +-------------------------+
  | a*Z                     |
  +-------------------------+
  ```IFGCWA3KQb```
  mysql> SELECT mask_ssn('909-63-6922'), mask_ssn('abcdefghijk');
  +-------------------------+-------------------------+
  | mask_ssn('909-63-6922') | mask_ssn('abcdefghijk') |
  +-------------------------+-------------------------+
  | XXX-XX-6922             | XXX-XX-hijk             |
  +-------------------------+-------------------------+
  mysql> SELECT mask_ssn('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; MASK_SSN: Error:
  String argument width too small
  mysql> SELECT mask_ssn('123456789123456789');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; MASK_SSN: Error:
  String argument width too large
  ```DLr0sEVbRh```
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
  ```HjgzmLFl3T```
  mysql> SELECT gen_rnd_email();
  +---------------------------+
  | gen_rnd_email()           |
  +---------------------------+
  | ijocv.mwvhhuf@example.com |
  +---------------------------+
  ```dY9b10ofuH```
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
  mysql> SELECT gen_rnd_pan(11), gen_rnd_pan(20);
  +-----------------+-----------------+
  | gen_rnd_pan(11) | gen_rnd_pan(20) |
  +-----------------+-----------------+
  | NULL            | NULL            |
  +-----------------+-----------------+
  ```Vw2q5IE5FY```
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```IkWewUsopO```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```rlyHsA1mmb```
  mysql> SELECT gen_blocklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blocklist('Berlin', 'DE_Cities', 'US_Cities') |
  +---------------------------------------------------+
  | Phoenix                                           |
  +---------------------------------------------------+
  ```46GnmKzmMN```
  mysql> SELECT gen_dictionary('mydict');
  +--------------------------+
  | gen_dictionary('mydict') |
  +--------------------------+
  | My term                  |
  +--------------------------+
  mysql> SELECT gen_dictionary('no-such-dict');
  +--------------------------------+
  | gen_dictionary('no-such-dict') |
  +--------------------------------+
  | NULL                           |
  +--------------------------------+
  ```bZ4lxzkoKm```
  mysql> SELECT gen_dictionary_drop('mydict');
  +-------------------------------+
  | gen_dictionary_drop('mydict') |
  +-------------------------------+
  | Dictionary removed            |
  +-------------------------------+
  mysql> SELECT gen_dictionary_drop('no-such-dict');
  +-------------------------------------+
  | gen_dictionary_drop('no-such-dict') |
  +-------------------------------------+
  | Dictionary removal error            |
  +-------------------------------------+
  ```irYMCUwqu8```
  mysql> SELECT gen_dictionary_load('/usr/local/mysql/mysql-files/mydict','mydict');
  +---------------------------------------------------------------------+
  | gen_dictionary_load('/usr/local/mysql/mysql-files/mydict','mydict') |
  +---------------------------------------------------------------------+
  | Dictionary load success                                             |
  +---------------------------------------------------------------------+
  mysql> SELECT gen_dictionary_load('/dev/null','null');
  +-----------------------------------------+
  | gen_dictionary_load('/dev/null','null') |
  +-----------------------------------------+
  | Dictionary load error                   |
  +-----------------------------------------+
  ```pyZerAW74o```
* `gen_dictionary_drop(dictionary_name)`

Remove um dicionário do registro do dicionário.

Esta função requer o privilégio `SUPER`.

Argumentos:

+ `dictionary_name`: Uma string que nomeia o dicionário a ser removido do registro do dicionário.

Valor de retorno:

Uma string que indica se a operação de remoção teve sucesso. `Dicionário removido` indica sucesso. `Erro de remoção do dicionário` indica falha. A falha na carga do dicionário pode ocorrer por várias razões, incluindo:

+ Um dicionário com o nome fornecido já está carregado.
+ O arquivo do dicionário não foi encontrado.
+ O arquivo do dicionário não contém termos.
+ A variável de sistema `secure_file_priv` está definida e o arquivo do dicionário não está localizado no diretório nomeado pela variável.