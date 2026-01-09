### 6.5.5 Descrições das funções de mascaramento e desidentificação de dados da MySQL Enterprise

A biblioteca de plugins de mascaramento e desidentificação de dados do MySQL Enterprise inclui várias funções, que podem ser agrupadas nessas categorias:

- Funções de Máscara de Dados
- Funções de Geração de Dados Aleatórios
- Funções baseadas em dicionário de dados aleatórios

Essas funções tratam argumentos de string como strings binárias (o que significa que não distinguem maiúsculas e minúsculas), e os valores de retorno de string são strings binárias. Se um valor de retorno de string deve estar em um conjunto de caracteres diferente, converta-o. O exemplo seguinte mostra como converter o resultado de `gen_rnd_email()` para o conjunto de caracteres `utf8mb4`:

```sql
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

Também pode ser necessário converter argumentos de string, conforme ilustrado em Usando mascaramento de dados para identificação de clientes.

Se uma função de Máscara e Desidentificação de Dados do MySQL Enterprise for invocada dentro do cliente **mysql**, os resultados em string binária são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

#### Funções de Máscara de Dados

Cada função nesta seção realiza uma operação de mascaramento em seu argumento de string e retorna o resultado mascarado.

- `mask_inner(str, margin1, margin2 [, mask_char])`

  Masca a parte interna de uma string, deixando as extremidades intocadas, e retorna o resultado. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - *`str`*: A string para mascarar.

  - *`margin1`*: Um inteiro não negativo que especifica o número de caracteres no final à esquerda da string que permanecerão não mascarados. Se o valor for 0, nenhum caractere do final à esquerda permanecerá não mascarado.

  - *`margin2`*: Um inteiro não negativo que especifica o número de caracteres no final da string que permanecerão não mascarados. Se o valor for 0, nenhum caractere do final da string permanecerá não mascarado.

  - *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

    O caractere de mascaramento deve ser um caractere de um único byte. Tentativas de usar um caractere multibyte produzem um erro.

  Valor de retorno:

  A string mascarada ou `NULL` se qualquer margem for negativa.

  Se a soma dos valores de margem for maior que o comprimento do argumento, não ocorre mascaramento e o argumento é retornado inalterado.

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

- `mask_outer(str, margin1, margin2 [, mask_char])`

  Masca as extremidades esquerda e direita de uma string, deixando o interior não mascarado e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - *`str`*: A string para mascarar.

  - *`margin1`*: Um inteiro não negativo que especifica o número de caracteres no final à esquerda da string a ser mascarada. Se o valor for 0, os caracteres do final à esquerda não serão mascarados.

  - *`margin2`*: Um inteiro não negativo que especifica o número de caracteres no final da string a ser mascarado. Se o valor for 0, os caracteres do final da string não serão mascarados.

  - *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

    O caractere de mascaramento deve ser um caractere de um único byte. Tentativas de usar um caractere multibyte produzem um erro.

  Valor de retorno:

  A string mascarada ou `NULL` se qualquer margem for negativa.

  Se a soma dos valores da margem for maior que o comprimento do argumento, todo o argumento será mascarado.

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

- `mask_pan(str)`

  Masca o Número Principal da Conta do cartão de pagamento e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`.

  Argumentos:

  - *`str`*: A string para mascarar. A string deve ter o tamanho adequado para o Número da Conta Principal, mas não é verificada de outra forma.

  Valor de retorno:

  O número de pagamento mascarado como uma string. Se o argumento for menor que o necessário, ele será retornado inalterado.

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

- `mask_pan_relaxed(str)`

  Masca o Número Principal da Conta do cartão de pagamento e retorna o número com todos os dígitos, exceto os seis primeiros e os quatro últimos, substituídos por caracteres `'X'`. Os seis primeiros dígitos indicam o emissor do cartão de pagamento.

  Argumentos:

  - *`str`*: A string para mascarar. A string deve ter o tamanho adequado para o Número da Conta Principal, mas não é verificada de outra forma.

  Valor de retorno:

  O número de pagamento mascarado como uma string. Se o argumento for menor que o necessário, ele será retornado inalterado.

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

- `mask_ssn(str)`

  Masca um número de Segurança Social dos EUA e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`.

  Argumentos:

  - *`str`*: A string para mascarar. A string deve ter 11 caracteres, mas não é verificada de outra forma.

  Valor de retorno:

  O número da Seguridade Social mascarado como uma string, ou `NULL` se o argumento não tiver o comprimento correto.

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

As funções desta seção geram valores aleatórios para diferentes tipos de dados. Quando possível, os valores gerados têm características reservadas para valores de demonstração ou teste, para evitar que sejam confundidos com dados legítimos. Por exemplo, `gen_rnd_us_phone()` retorna um número de telefone dos EUA que usa o código de área 555, que não é atribuído a números de telefone em uso real. As descrições individuais das funções descrevem quaisquer exceções a este princípio.

- `gen_range(inferior, superior)`

  Gera um número aleatório escolhido de um intervalo especificado.

  Argumentos:

  - *`lower`*: Um inteiro que especifica o limite inferior da faixa.

  - *`upper`*: Um inteiro que especifica o limite superior do intervalo, que não pode ser menor que o limite inferior.

  Valor de retorno:

  Um número inteiro aleatório no intervalo de *`lower`* a *`upper`*, inclusive, ou `NULL` se o argumento *`upper`* for menor que *`lower`*.

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

- `gen_rnd_email()`

  Gera um endereço de e-mail aleatório no domínio `example.com`.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Um endereço de e-mail aleatório como uma string.

  Exemplo:

  ```sql
  mysql> SELECT gen_rnd_email();
  +---------------------------+
  | gen_rnd_email()           |
  +---------------------------+
  | ijocv.mwvhhuf@example.com |
  +---------------------------+
  ```

- `gen_rnd_pan([size])`

  Gera um Número Principal de Conta aleatório de um cartão de pagamento. O número passa na verificação Luhn (um algoritmo que realiza uma verificação de controle de soma contra um dígito de verificação).

  Aviso

  Os valores retornados por `gen_rnd_pan()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não há como garantir que um determinado valor de retorno não seja atribuído a uma conta de pagamento legítima. Se for necessário publicar um resultado de `gen_rnd_pan()`, considere mascará-lo com `mask_pan()` ou `mask_pan_relaxed()`.

  Argumentos:

  - *`size`*: (Opcional) Um número inteiro que especifica o tamanho do resultado. O padrão é 16 se *`size`* não for fornecido. Se fornecido, *`size`* deve ser um número inteiro no intervalo de 12 a 19.

  Valor de retorno:

  Um número de pagamento aleatório como uma string, ou `NULL` se um argumento de *`size`* fora do intervalo permitido for fornecido.

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

- [`gen_rnd_ssn()`](https://data-masking-functions.html#function_gen-rnd-ssn)

  Gera um número de segurança social dos EUA aleatório no formato `AAA-BB-CCCC`. A parte *`AAA`* é maior que 900 e a parte *`BB`* é menor que 70; esses valores estão fora das faixas usadas para números de segurança social legítimos.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Um número de segurança social aleatório como uma string.

  Exemplo:

  ```sql
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

- `gen_rnd_us_phone()`

  Gera um número de telefone aleatório dos EUA no formato `1-555-AAA-BBBB`. O código de área 555 não é usado para números de telefone legítimos.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Um número de telefone aleatório dos EUA como uma string.

  Exemplo:

  ```sql
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

#### Funções baseadas em dicionário de dados aleatórios

As funções nesta seção manipulam dicionários de termos e realizam operações de geração e mascaramento com base neles. Algumas dessas funções exigem o privilégio `SUPER`.

Quando um dicionário é carregado, ele se torna parte do registro do dicionário e recebe um nome para ser usado por outras funções do dicionário. Os dicionários são carregados a partir de arquivos de texto simples que contêm um termo por linha. Linhas vazias são ignoradas. Para ser válido, um arquivo de dicionário deve conter pelo menos uma linha não vazia.

- `gen_blacklist(str, nome_dicionario, nome_dicionario_substituicao)`

  Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição.

  Argumentos:

  - *`str`*: Uma string que indica o termo a ser substituído.

  - *`dictionary_name`*: Uma string que nomeia o dicionário que contém o termo a ser substituído.

  - *`replacement_dictionary_name`*: Uma string que nomeia o dicionário a partir do qual será escolhido o termo de substituição.

  Valor de retorno:

  Uma cadeia aleatoriamente escolhida de *`replacement_dictionary_name`* como substituição para *`str`*, ou *`str`* se ele não aparecer em *`dictionary_name`*, ou `NULL` se nenhum dos nomes de dicionário estiver no registro do dicionário.

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

- \`gen_dictionary(nome_dicionário)

  Retorna um termo aleatório de um dicionário.

  Argumentos:

  - *`dictionary_name`*: Uma string que nomeia o dicionário a partir do qual você deseja escolher o termo.

  Valor de retorno:

  Um termo aleatório do dicionário como uma string, ou `NULL` se o nome do dicionário não estiver no registro do dicionário.

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

- \`gen_dictionary_drop(nome_dicionário)

  Remove um dicionário do registro de dicionários.

  Essa função requer o privilégio `SUPER`.

  Argumentos:

  - *`dictionary_name`*: Uma string que nomeia o dicionário a ser removido do registro de dicionários.

  Valor de retorno:

  Uma cadeia que indica se a operação de remoção foi bem-sucedida. `Dictionary removed` indica sucesso. `Dictionary removal error` indica falha.

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

- `gen_dictionary_load(caminho_do_dicionário, nome_do_dicionário)`

  Carrega um arquivo no registro do dicionário e atribui ao dicionário um nome a ser usado com outras funções que exigem um argumento de nome de dicionário.

  Essa função requer o privilégio `SUPER`.

  Importante

  Os dicionários não são persistentes. Qualquer dicionário usado por aplicativos deve ser carregado para cada inicialização do servidor.

  Uma vez carregado no registro, um dicionário é usado como está, mesmo que o arquivo de dicionário subjacente mude. Para recarregar um dicionário, primeiro arraste-o com `gen_dictionary_drop()`, em seguida, carregue-o novamente com `gen_dictionary_load()`.

  Argumentos:

  - *`dictionary_path`*: Uma string que especifica o nome do caminho do arquivo de dicionário.

  - *`dictionary_name`*: Uma string que fornece um nome para o dicionário.

  Valor de retorno:

  Uma cadeia que indica se a operação de carregamento foi bem-sucedida. `Sucesso no carregamento do dicionário` indica sucesso. `Erro no carregamento do dicionário` indica falha. A falha no carregamento do dicionário pode ocorrer por várias razões, incluindo:

  - Um dicionário com o nome dado já está carregado.
  - O arquivo do dicionário não foi encontrado.
  - O arquivo do dicionário não contém termos.
  - A variável de sistema `secure_file_priv` está definida e o arquivo de dicionário não está localizado no diretório nomeado pela variável.

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
