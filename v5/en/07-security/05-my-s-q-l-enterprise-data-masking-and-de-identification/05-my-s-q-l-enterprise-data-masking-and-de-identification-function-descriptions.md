### 6.5.5 Descrições das Funções de MySQL Enterprise Data Masking and De-Identification

A library de plugin MySQL Enterprise Data Masking and De-Identification inclui várias funções, que podem ser agrupadas nestas categorias:

* [Funções de Data Masking](data-masking-functions.html#data-masking-masking-functions "Funções de Data Masking")
* [Funções de Geração de Dados Aleatórios](data-masking-functions.html#data-masking-generation-functions "Funções de Geração de Dados Aleatórios")
* [Funções Baseadas em Dicionário de Dados Aleatórios](data-masking-functions.html#data-masking-dictionary-functions "Funções Baseadas em Dicionário de Dados Aleatórios")

Essas funções tratam argumentos string como strings binárias (o que significa que não diferenciam maiúsculas de minúsculas), e os valores de retorno string são strings binárias. Se um valor de retorno string precisar estar em um conjunto de caracteres diferente, converta-o. O exemplo a seguir mostra como converter o resultado de [`gen_rnd_email()`](data-masking-functions.html#function_gen-rnd-email) para o conjunto de caracteres `utf8mb4`:

```sql
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

Também pode ser necessário converter argumentos string, conforme ilustrado em [Usando Dados Mascarados para Identificação de Cliente](data-masking-usage.html#data-masking-usage-customer-identification "Usando Dados Mascarados para Identificação de Cliente").

Se uma função MySQL Enterprise Data Masking and De-Identification for invocada a partir do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), os resultados de strings binárias serão exibidos usando notação hexadecimal, dependendo do valor da opção [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). Para mais informações sobre essa opção, consulte [Seção 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

#### Funções de Data Masking

Cada função nesta seção executa uma operação de masking (mascaramento) no seu argumento string e retorna o resultado mascarado.

* [`mask_inner(str, margin1, margin2 [, mask_char])`](data-masking-functions.html#function_mask-inner)

  Mascarara a parte interior de uma string, deixando as extremidades intocadas, e retorna o resultado. Um caractere de masking opcional pode ser especificado.

  Argumentos:

  + *`str`*: A string a ser mascarada.
  + *`margin1`*: Um inteiro não negativo que especifica o número de caracteres na extremidade esquerda da string que devem permanecer sem masking. Se o valor for 0, nenhum caractere da extremidade esquerda permanece sem masking.

  + *`margin2`*: Um inteiro não negativo que especifica o número de caracteres na extremidade direita da string que devem permanecer sem masking. Se o valor for 0, nenhum caractere da extremidade direita permanece sem masking.

  + *`mask_char`*: (Opcional) O caractere único a ser usado para o masking. O padrão é `'X'` se *`mask_char`* não for fornecido.

    O caractere de masking deve ser um caractere de byte único (single-byte). Tentativas de usar um caractere multibyte produzirão um erro.

  Valor de retorno:

  A string mascarada, ou `NULL` se qualquer uma das margens for negativa.

  Se a soma dos valores das margens for maior que o comprimento do argumento, nenhum masking ocorrerá e o argumento será retornado inalterado.

  Exemplo:

  ```sql
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

* [`mask_outer(str, margin1, margin2 [, mask_char])`](data-masking-functions.html#function_mask-outer)

  Mascarara as extremidades esquerda e direita de uma string, deixando o interior sem masking, e retorna o resultado. Um caractere de masking opcional pode ser especificado.

  Argumentos:

  + *`str`*: A string a ser mascarada.
  + *`margin1`*: Um inteiro não negativo que especifica o número de caracteres na extremidade esquerda da string a serem mascarados. Se o valor for 0, nenhum caractere da extremidade esquerda é mascarado.

  + *`margin2`*: Um inteiro não negativo que especifica o número de caracteres na extremidade direita da string a serem mascarados. Se o valor for 0, nenhum caractere da extremidade direita é mascarado.

  + *`mask_char`*: (Opcional) O caractere único a ser usado para o masking. O padrão é `'X'` se *`mask_char`* não for fornecido.

    O caractere de masking deve ser um caractere de byte único (single-byte). Tentativas de usar um caractere multibyte produzirão um erro.

  Valor de retorno:

  A string mascarada, ou `NULL` se qualquer uma das margens for negativa.

  Se a soma dos valores das margens for maior que o comprimento do argumento, o argumento inteiro é mascarado.

  Exemplo:

  ```sql
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
  ```

* [`mask_pan(str)`](data-masking-functions.html#function_mask-pan)

  Mascarara um Primary Account Number (PAN) de cartão de pagamento e retorna o número com todos, exceto os últimos quatro dígitos, substituídos por caracteres `'X'`.

  Argumentos:

  + *`str`*: A string a ser mascarada. A string deve ter um comprimento adequado para o Primary Account Number, mas não é verificada de outra forma.

  Valor de retorno:

  O número de pagamento mascarado como uma string. Se o argumento for mais curto do que o necessário, ele é retornado inalterado.

  Exemplo:

  ```sql
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
  ```

* [`mask_pan_relaxed(str)`](data-masking-functions.html#function_mask-pan-relaxed)

  Mascarara um Primary Account Number (PAN) de cartão de pagamento e retorna o número com todos, exceto os primeiros seis e os últimos quatro dígitos, substituídos por caracteres `'X'`. Os primeiros seis dígitos indicam o emissor do cartão de pagamento.

  Argumentos:

  + *`str`*: A string a ser mascarada. A string deve ter um comprimento adequado para o Primary Account Number, mas não é verificada de outra forma.

  Valor de retorno:

  O número de pagamento mascarado como uma string. Se o argumento for mais curto do que o necessário, ele é retornado inalterado.

  Exemplo:

  ```sql
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
  ```

* [`mask_ssn(str)`](data-masking-functions.html#function_mask-ssn)

  Mascarara um número de Social Security (SSN) dos EUA e retorna o número com todos, exceto os últimos quatro dígitos, substituídos por caracteres `'X'`.

  Argumentos:

  + *`str`*: A string a ser mascarada. A string deve ter 11 caracteres de comprimento, mas não é verificada de outra forma.

  Valor de retorno:

  O número de Social Security mascarado como uma string, ou `NULL` se o argumento não tiver o comprimento correto.

  Exemplo:

  ```sql
  mysql> SELECT mask_ssn('909-63-6922'), mask_ssn('abcdefghijk');
  +-------------------------+-------------------------+
  | mask_ssn('909-63-6922') | mask_ssn('abcdefghijk') |
  +-------------------------+-------------------------+
  | XXX-XX-6922             | XXX-XX-hijk             |
  +-------------------------+-------------------------+
  mysql> SELECT mask_ssn('909');
  +-----------------+
  | mask_ssn('909') |
  +-----------------+
  | NULL            |
  +-----------------+
  ```

#### Funções de Geração de Dados Aleatórios

As funções nesta seção geram valores aleatórios para diferentes tipos de dados. Sempre que possível, os valores gerados têm características reservadas para demonstração ou valores de teste, para evitar que sejam confundidos com dados legítimos. Por exemplo, [`gen_rnd_us_phone()`](data-masking-functions.html#function_gen-rnd-us-phone) retorna um número de telefone dos EUA que usa o código de área 555, que não é atribuído a números de telefone em uso real. As descrições individuais das funções descrevem quaisquer exceções a este princípio.

* [`gen_range(lower, upper)`](data-masking-functions.html#function_gen-range)

  Gera um número aleatório escolhido a partir de um intervalo especificado.

  Argumentos:

  + *`lower`*: Um inteiro que especifica o limite inferior do range (intervalo).

  + *`upper`*: Um inteiro que especifica o limite superior do range, que não deve ser menor que o limite inferior.

  Valor de retorno:

  Um inteiro aleatório no range de *`lower`* a *`upper`*, inclusive, ou `NULL` se o argumento *`upper`* for menor que *`lower`*.

  Exemplo:

  ```sql
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
  ```

* [`gen_rnd_email()`](data-masking-functions.html#function_gen-rnd-email)

  Gera um endereço de email aleatório no domínio `example.com`.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Um endereço de email aleatório como uma string.

  Exemplo:

  ```sql
  mysql> SELECT gen_rnd_email();
  +---------------------------+
  | gen_rnd_email()           |
  +---------------------------+
  | ijocv.mwvhhuf@example.com |
  +---------------------------+
  ```

* [`gen_rnd_pan([size])`](data-masking-functions.html#function_gen-rnd-pan)

  Gera um Primary Account Number (PAN) de cartão de pagamento aleatório. O número passa na Luhn check (um algoritmo que realiza uma verificação de checksum contra um dígito de verificação).

  Aviso

  Os valores retornados de [`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan) devem ser usados apenas para fins de teste e não são adequados para publicação. Não há como garantir que um determinado valor de retorno não esteja atribuído a uma conta de pagamento legítima. Caso seja necessário publicar um resultado de [`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan), considere mascará-lo com [`mask_pan()`](data-masking-functions.html#function_mask-pan) ou [`mask_pan_relaxed()`](data-masking-functions.html#function_mask-pan-relaxed).

  Argumentos:

  + *`size`*: (Opcional) Um inteiro que especifica o tamanho do resultado. O padrão é 16 se *`size`* não for fornecido. Se fornecido, *`size`* deve ser um inteiro no range de 12 a 19.

  Valor de retorno:

  Um número de pagamento aleatório como uma string, ou `NULL` se for fornecido um argumento *`size`* fora do range permitido.

  Exemplo:

  ```sql
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
  ```

* [`gen_rnd_ssn()`](data-masking-functions.html#function_gen-rnd-ssn)

  Gera um número de Social Security (SSN) dos EUA aleatório no formato `AAA-BB-CCCC`. A parte *`AAA`* é maior que 900 e a parte *`BB`* é menor que 70; esses valores estão fora dos ranges usados para números de Social Security legítimos.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Um número de Social Security aleatório como uma string.

  Exemplo:

  ```sql
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

* [`gen_rnd_us_phone()`](data-masking-functions.html#function_gen-rnd-us-phone)

  Gera um número de telefone dos EUA aleatório no formato `1-555-AAA-BBBB`. O código de área 555 não é usado para números de telefone legítimos.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Um número de telefone dos EUA aleatório como uma string.

  Exemplo:

  ```sql
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

#### Funções Baseadas em Dicionário de Dados Aleatórios

As funções nesta seção manipulam dicionários de termos e executam operações de geração e masking baseadas neles. Algumas dessas funções exigem o privilégio [`SUPER`](privileges-provided.html#priv_super).

Quando um dicionário é carregado, ele se torna parte do registry de dicionários e recebe um nome a ser usado por outras funções de dicionário. Os dicionários são carregados a partir de arquivos de texto simples contendo um termo por linha. Linhas vazias são ignoradas. Para ser válido, um arquivo de dicionário deve conter pelo menos uma linha não vazia.

* [`gen_blacklist(str, dictionary_name, replacement_dictionary_name)`](data-masking-functions.html#function_gen-blacklist)

  Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição.

  Argumentos:

  + *`str`*: Uma string que indica o termo a ser substituído.

  + *`dictionary_name`*: Uma string que nomeia o dicionário que contém o termo a ser substituído.

  + *`replacement_dictionary_name`*: Uma string que nomeia o dicionário do qual escolher o termo de substituição.

  Valor de retorno:

  Uma string escolhida aleatoriamente de *`replacement_dictionary_name`* como substituição para *`str`*, ou *`str`* se ele não aparecer em *`dictionary_name`*, ou `NULL` se qualquer um dos nomes de dicionário não estiver no registry de dicionários.

  Se o termo a ser substituído aparecer em ambos os dicionários, é possível que o valor de retorno seja o mesmo termo.

  Exemplo:

  ```sql
  mysql> SELECT gen_blacklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blacklist('Berlin', 'DE_Cities', 'US_Cities') |
  +---------------------------------------------------+
  | Phoenix                                           |
  +---------------------------------------------------+
  ```

* [`gen_dictionary(dictionary_name)`](data-masking-functions.html#function_gen-dictionary)

  Retorna um termo aleatório de um dicionário.

  Argumentos:

  + *`dictionary_name`*: Uma string que nomeia o dicionário do qual escolher o termo.

  Valor de retorno:

  Um termo aleatório do dicionário como uma string, ou `NULL` se o nome do dicionário não estiver no registry de dicionários.

  Exemplo:

  ```sql
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
  ```

* [`gen_dictionary_drop(dictionary_name)`](data-masking-functions.html#function_gen-dictionary-drop)

  Remove um dicionário do registry de dicionários.

  Esta função requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

  Argumentos:

  + *`dictionary_name`*: Uma string que nomeia o dicionário a ser removido do registry de dicionários.

  Valor de retorno:

  Uma string que indica se a operação de drop (remoção) foi bem-sucedida. `Dictionary removed` indica sucesso. `Dictionary removal error` indica falha.

  Exemplo:

  ```sql
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
  ```

* [`gen_dictionary_load(dictionary_path, dictionary_name)`](data-masking-functions.html#function_gen-dictionary-load)

  Carrega um arquivo no registry de dicionários e atribui ao dicionário um nome a ser usado com outras funções que requerem um argumento de nome de dicionário.

  Esta função requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

  Importante

  Dicionários não são persistentes. Qualquer dicionário usado por aplicações deve ser carregado a cada inicialização do servidor.

  Uma vez carregado no registry, um dicionário é usado como está, mesmo que o arquivo de dicionário subjacente mude. Para recarregar um dicionário, primeiro remova-o com [`gen_dictionary_drop()`](data-masking-functions.html#function_gen-dictionary-drop) e, em seguida, carregue-o novamente com [`gen_dictionary_load()`](data-masking-functions.html#function_gen-dictionary-load).

  Argumentos:

  + *`dictionary_path`*: Uma string que especifica o path name (caminho) do arquivo de dicionário.

  + *`dictionary_name`*: Uma string que fornece um nome para o dicionário.

  Valor de retorno:

  Uma string que indica se a operação de load (carregamento) foi bem-sucedida. `Dictionary load success` indica sucesso. `Dictionary load error` indica falha. A falha no carregamento do dicionário pode ocorrer por várias razões, incluindo:

  + Um dicionário com o nome fornecido já está carregado.
  + O arquivo de dicionário não foi encontrado.
  + O arquivo de dicionário não contém termos.
  + A variável de sistema [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) está definida e o arquivo de dicionário não está localizado no diretório nomeado pela variável.

  Exemplo:

  ```sql
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
  ```