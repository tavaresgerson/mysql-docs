#### 8.5.2.4 Descrições das funções do componente de mascaramento e desidentificação de dados da MySQL Enterprise

Os componentes de Máscara de Dados e Desidentificação Empresarial do MySQL incluem várias funções, que podem ser agrupadas nessas categorias:

- Funções do componente de mascaramento de dados
- Funções do componente de geração de dados aleatórios
- Funções do componente de administração de mascaramento do dicionário
- Componentes de Gerenciamento de Funções de Gerador de Dicionário

##### Funções do componente de mascaramento de dados

Cada função de componente nesta seção realiza uma operação de mascaramento em seu argumento de string e retorna o resultado mascarado.

- `mask_canada_sin(str [, mask_char])`

  Masca o Número de Seguro Social do Canadá (SIN) e retorna o número com todos os dígitos significativos substituídos por caracteres `'X'`. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string para mascarar. Os formatos aceitos são:

    - Nove dígitos não separados.
    - Nove dígitos agrupados em padrão: `xxx-xxx-xxx` (`-` é qualquer caractere de separador).

    Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se `mask_char` não for fornecido.

  Valor de retorno:

  O Canadá SIN mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

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

- `mask_iban(str [, mask_char])`

  Masca um Número Internacional de Conta Bancária (IBAN) e retorna o número com todos os caracteres, exceto as duas primeiras letras (que indicam o país), substituídas por `'*'` caracteres. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string para mascarar. Cada país pode ter um sistema de roteamento ou numeração de contas nacional diferente, com um mínimo de 13 e um máximo de 34 caracteres alfanuméricos ASCII. Os formatos aceitos são:

    - Caracteres não separados.
    - Caracteres agrupados por quatro, exceto o último grupo, e separados por espaço ou qualquer outro caractere de separador (por exemplo: `xxxx-xxxx-xxxx-xx`).

    Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se `mask_char` não for fornecido.

  Valor de retorno:

  O número da conta bancária internacional mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

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
  ```

- `mask_inner(str, margin1, margin2 [, mask_char])`

  Masca a parte interna de uma string, deixando as extremidades intocadas, e retorna o resultado. Um caractere de mascaramento opcional pode ser especificado.

  `mask_inner` suporta todos os conjuntos de caracteres.

  Argumentos:

  - `str`: A string para mascarar. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `margin1`: Um inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string que permanecerão não mascarados. Se o valor for 0, nenhum caractere do extremo esquerdo permanecerá não mascarado.

  - `margin2`: Um inteiro não negativo que especifica o número de caracteres no final da string que permanecerão não mascarados. Se o valor for 0, nenhum caractere do final da string permanecerá não mascarado.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se `mask_char` não for fornecido.

  Valor de retorno:

  A string mascarada codificada no mesmo conjunto de caracteres usado para `str`, ou um erro se qualquer margem for negativa.

  Se a soma dos valores de margem for maior que o comprimento do argumento, não ocorre mascaramento e o argumento é retornado inalterado.

  Nota

  A função é otimizada para funcionar mais rápido para strings de único byte (com comprimento de byte e comprimento de caractere iguais). Por exemplo, o conjunto de caracteres `utf8mb4` usa apenas um byte para caracteres ASCII, então a função processa strings que contêm apenas caracteres ASCII como strings de caracteres de único byte.

  Exemplo:

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

- `mask_outer(str, margin1, margin2 [, mask_char])`

  Masca as extremidades esquerda e direita de uma string, deixando o interior não mascarado e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

  `mask_outer` suporta todos os conjuntos de caracteres.

  Argumentos:

  - `str`: A string para mascarar. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `margin1`: Um inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string a ser mascarado. Se o valor for 0, os caracteres do extremo esquerdo não serão mascarados.

  - `margin2`: Um inteiro não negativo que especifica o número de caracteres no final da string a ser mascarado. Se o valor for 0, os caracteres do final da string não serão mascarados.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se `mask_char` não for fornecido.

  Valor de retorno:

  A string mascarada codificada no mesmo conjunto de caracteres usado para `str`, ou um erro se qualquer margem for negativa.

  Se a soma dos valores da margem for maior que o comprimento do argumento, todo o argumento será mascarado.

  Nota

  A função é otimizada para funcionar mais rápido para strings de único byte (com comprimento de byte e comprimento de caractere iguais). Por exemplo, o conjunto de caracteres `utf8mb4` usa apenas um byte para caracteres ASCII, então a função processa strings que contêm apenas caracteres ASCII como strings de caracteres de único byte.

  Exemplo:

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
  ```

- `mask_pan(str [, mask_char])`

  Masca o Número Principal da Conta (PAN) do cartão de pagamento e retorna o número, substituindo todos os dígitos, exceto os últimos quatro, por caracteres `'X'`. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string para mascarar. A string deve conter um mínimo de 14 e um máximo de 19 caracteres alfanuméricos. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se `mask_char` não for fornecido.

  Valor de retorno:

  O número de pagamento mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

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
  ERROR 1123 (HY000): Can't initialize function 'mask_pan'; Argument 0 is too short.
  ```

- `mask_pan_relaxed(str)`

  Masca o Número Principal da Conta do Cartão de Pagamento e retorna o número com todos os dígitos, exceto os seis primeiros e os quatro últimos, substituídos por caracteres `'X'`. Os seis primeiros dígitos indicam o emissor do cartão de pagamento. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string para mascarar. A string deve ter um comprimento adequado para o Número da Conta Primária, mas não é verificada de outra forma. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se `mask_char` não for fornecido.

  Valor de retorno:

  O número de pagamento mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

  ```
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
  ```

- `mask_ssn(str [, mask_char])`

  Masca um Número de Segurança Social dos EUA (SSN) e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'*'`. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string para mascarar. Os formatos aceitos são:

    - Nove dígitos não separados.
    - Nove dígitos agrupados em padrão: `xxx-xx-xxxx` (`-` é qualquer caractere de separador).

    Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se `mask_char` não for fornecido.

  Valor de retorno:

  O Número de Segurança Social mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

  ```
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
  ```

- `mask_uk_nin(str [, mask_char])`

  Masca um Número de Seguro Nacional do Reino Unido (UK NIN) e retorna o número com todos os dígitos, exceto os dois primeiros, substituídos por caracteres `'*'`. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string para mascarar. Os formatos aceitos são:

    - Nove dígitos não separados.

    - Nove dígitos agrupados em padrão: `xxx-xx-xxxx` (`-` é qualquer caractere de separador).

    - Nove dígitos agrupados em padrão: `xx-xxxxxx-x` (`-` é qualquer caractere de separador).

    Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se `mask_char` não for fornecido.

  Valor de retorno:

  O NIN mascarado do Reino Unido como uma cadeia codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

  ```
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
  ```

- `mask_uuid(str [, mask_char])`

  Masca um Identificador Único Universal (UUID) e retorna o número com todos os caracteres significativos substituídos por caracteres `'*'`. Um caractere de mascaramento opcional pode ser especificado.

  Argumentos:

  - `str`: A string a ser mascarada. O formato aceito é `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, onde '`X`' é qualquer dígito e '`-`' é qualquer caractere de separador. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `mask_char`: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se `mask_char` não for fornecido.

  Valor de retorno:

  O UUID mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se `str` estiver no formato incorreto ou contiver um caractere multibyte.

  Exemplo:

  ```
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
  ```

##### Funções do componente de geração de dados aleatórios

Os componentes desta seção geram valores aleatórios para diferentes tipos de dados. Quando possível, os valores gerados têm características reservadas para valores de demonstração ou teste, para evitar que sejam confundidos com dados legítimos. Por exemplo, `gen_rnd_us_phone()` retorna um número de telefone dos EUA que usa o código de área 555, que não é atribuído a números de telefone em uso real. As descrições individuais das funções descrevem quaisquer exceções a este princípio.

- `gen_range(lower, upper)`

  Gera um número aleatório escolhido de um intervalo especificado.

  Argumentos:

  - `lower`: Um número inteiro que especifica o limite inferior da faixa.

  - `upper`: Um número inteiro que especifica o limite superior da faixa, que não deve ser menor que o limite inferior.

  Valor de retorno:

  Um número inteiro aleatório (codificado no conjunto de caracteres `utf8mb4`), no intervalo de `lower` a `upper`, inclusive, ou `NULL` se o argumento `upper` for menor que `lower`.

  Nota

  Para obter uma melhor qualidade dos valores aleatórios, use `RAND()` em vez desta função.

  Exemplo:

  ```
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

- `gen_rnd_canada_sin()`

  Gera um Número de Seguro Social do Canadá (SIN) aleatório no formato `AAA-BBB-CCC`. O número gerado passa pelo algoritmo de verificação Luhn, que garante a consistência desse número.

  Aviso

  Os valores retornados a partir de `gen_rnd_canada_sin()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não há como garantir que um determinado valor de retorno não seja atribuído a um SIN canadense legítimo. Se for necessário publicar um resultado de `gen_rnd_canada_sin()`, considere mascará-lo com `mask_canada_sin()`.

  Argumentos:

  None.

  Valor de retorno:

  Um número de inscrição do Canadá aleatório como uma string codificada no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
  mysql> SELECT mask_canada_sin( gen_rnd_canada_sin() );
  +-----------------------------------------+
  | mask_canada_sin( gen_rnd_canada_sin() ) |
  +-----------------------------------------+
  | xxx-xxx-xxx                             |
  +-----------------------------------------+
  ```

- `gen_rnd_email(name_size, surname_size, domain)`

  Gera um endereço de e-mail aleatório na forma de `random_name`.`random_surname`@`domain`.

  Argumentos:

  - `name_size`: (Opcional) Um número inteiro que especifica o número de caracteres na parte do nome de um endereço. O padrão é cinco se `name_size` não for fornecido.

  - `surname_size`: (Opcional) Um número inteiro que especifica o número de caracteres na parte do sobrenome de um endereço. O padrão é sete se `surname_size` não for fornecido.

  - `domain`: (Opcional) Uma string que especifica a parte de domínio do endereço. O padrão é `example.com` se `domain` não for fornecido.

  Valor de retorno:

  Um endereço de e-mail aleatório como uma string codificada no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
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
  ```

- `gen_rnd_iban([country, size])`

  Gera um número de conta bancária internacional aleatório (IBAN) no formato `AAAA BBBB CCCC DDDD`. A string gerada começa com um código de país de dois caracteres, dois dígitos de verificação calculados de acordo com a especificação do IBAN e caracteres alfanuméricos aleatórios até o tamanho necessário.

  Aviso

  Os valores retornados a partir de `gen_rnd_iban()` devem ser usados apenas para fins de teste e não são adequados para publicação se forem usados com um código de país válido. Não há como garantir que um determinado valor de retorno não seja atribuído a uma conta bancária legítima. Se for necessário publicar um resultado de `gen_rnd_iban()`, considere mascará-lo com `mask_iban()`.

  Argumentos:

  - `country`: (Opcional) Código de país de dois caracteres; o valor padrão é `ZZ`

  - `size`: (Opcional) Número de caracteres significativos; padrão 16, mínimo 15, máximo 34

  Valor de retorno:

  Um IBAN aleatório como uma string codificada no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
  mysql> SELECT gen_rnd_iban();
  +-----------------------------+
  | gen_rnd_iban()              |
  +-----------------------------+
  | ZZ79 3K2J WNH9 1V0DI        |
  +-----------------------------+
  ```

- `gen_rnd_pan([size])`

  Gera um Número Principal de Conta aleatório de um cartão de pagamento. O número passa na verificação Luhn (um algoritmo que realiza uma verificação de controle de soma contra um dígito de verificação).

  Aviso

  Os valores retornados a partir de `gen_rnd_pan()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não há como garantir que um determinado valor de retorno não seja atribuído a uma conta de pagamento legítima. Se for necessário publicar um resultado de `gen_rnd_pan()`, considere mascará-lo com `mask_pan()` ou `mask_pan_relaxed()`.

  Argumentos:

  - `size`: (Opcional) Um número inteiro que especifica o tamanho do resultado. O padrão é 16 se `size` não for fornecido. Se fornecido, `size` deve ser um número inteiro no intervalo de 12 a 19.

  Valor de retorno:

  Um número de pagamento aleatório como uma string, ou um erro se um argumento `size` fora do intervalo permitido for fornecido.

  Exemplo:

  ```
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
  ```

- `gen_rnd_ssn()`

  Gera um número de segurança social dos EUA aleatório no formato `AAA-BB-CCCC`. A parte `AAA` é maior que 900, o que está fora da faixa usada para números de segurança social legítimos.

  Argumentos:

  None.

  Valor de retorno:

  Um Número de Seguridade Social aleatório, codificado como uma string no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

- `gen_rnd_uk_nin()`

  Gera um Número de Seguro Nacional do Reino Unido (UK NIN) aleatório no formato de nove caracteres. O NIN começa com um prefixo de dois caracteres selecionado aleatoriamente do conjunto de prefixos válidos, seis números aleatórios e um sufixo de um caractere selecionado aleatoriamente do conjunto de sufixos válidos.

  Aviso

  Os valores retornados a partir de `gen_rnd_uk_nin()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não há como garantir que um determinado valor de retorno não seja atribuído a um NIN legítimo. Se for necessário publicar um resultado de `gen_rnd_uk_nin()`, considere mascará-lo com `mask_uk_nin()`.

  Argumentos:

  None.

  Valor de retorno:

  Um NIN aleatório do Reino Unido como uma string codificada no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
  mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
  +---------------------------------+
  | mask_uk_nin( gen_rnd_uk_nin() ) |
  +---------------------------------+
  | JE*******                       |
  +---------------------------------+
  ```

- `gen_rnd_us_phone()`

  Gera um número de telefone aleatório nos Estados Unidos no formato `1-555-AAA-BBBB`. O código de área 555 não é usado para números de telefone legítimos.

  Argumentos:

  None.

  Valor de retorno:

  Um número de telefone aleatório dos EUA como uma string codificada no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

- `gen_rnd_uuid()`

  Gera um identificador único universal (UUID) aleatório, segmentado com traços.

  Argumentos:

  None.

  Valor de retorno:

  Um UUID aleatório como uma string codificada no conjunto de caracteres `utf8mb4`.

  Exemplo:

  ```
  mysql> SELECT gen_rnd_uuid();
  +--------------------------------------+
  | gen_rnd_uuid()                       |
  +--------------------------------------+
  | 123e4567-e89b-12d3-a456-426614174000 |
  +--------------------------------------+
  ```

##### Funções do componente de administração de mascaramento do dicionário

Os componentes desta seção manipulam dicionários de termos e realizam operações de mascaramento administrativo com base neles. Todas essas funções exigem o privilégio `MASKING_DICTIONARIES_ADMIN`.

Quando um dicionário de termos é criado, ele se torna parte do registro do dicionário e recebe um nome para ser usado por outras funções do dicionário.

- `masking_dictionary_remove(dictionary_name)`

  Remove um dicionário e todos os seus termos do registro do dicionário. Esta função requer o privilégio `MASKING_DICTIONARIES_ADMIN`.

  Argumentos:

  - `dictionary_name`: Uma string que nomeia o dicionário a ser removido da tabela de dicionários. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  Valor de retorno:

  Uma cadeia que indica se a operação de remoção foi bem-sucedida. `1` indica sucesso. `NULL` indica que o nome do dicionário não foi encontrado.

  Exemplo:

  ```
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
  ```

- `masking_dictionary_term_add(dictionary_name, term_name)`

  Adiciona um termo ao dicionário nomeado. Esta função requer o privilégio `MASKING_DICTIONARIES_ADMIN`.

  Importante

  As palavras-chave e seus termos são armazenados em uma tabela no esquema `mysql`. Todos os termos de um dicionário são acessíveis a qualquer conta de usuário se esse usuário executar `gen_dictionary()` repetidamente. Evite adicionar informações sensíveis aos dicionários.

  Cada termo é definido por um dicionário nomeado. `masking_dictionary_term_add()` permite que você adicione um termo de dicionário de cada vez.

  Argumentos:

  - `dictionary_name`: Uma string que fornece um nome para o dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `term_name`: Uma string que especifica o nome do termo na tabela de dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  Valor de retorno:

  Uma cadeia que indica se a operação de adição de termos foi bem-sucedida. `1` indica sucesso. `NULL` indica falha. A falha na adição de termos pode ocorrer por várias razões, incluindo:

  - Um termo com o nome dado já foi adicionado.
  - O nome do dicionário não foi encontrado.

  Exemplo:

  ```
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
  ```

- `masking_dictionary_term_remove(dictionary_name, term_name)`

  Remove um termo do dicionário nomeado. Esta função requer o privilégio `MASKING_DICTIONARIES_ADMIN`.

  Argumentos:

  - `dictionary_name`: Uma string que fornece um nome para o dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `term_name`: Uma string que especifica o nome do termo na tabela de dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  Valor de retorno:

  Uma cadeia que indica se a operação de remoção do termo foi bem-sucedida. `1` indica sucesso. `NULL` indica falha. A falha na remoção do termo pode ocorrer por várias razões, incluindo:

  - Um termo com o nome dado não foi encontrado.
  - O nome do dicionário não foi encontrado.

  Exemplo:

  ```
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
  ```

##### Componentes de Gerenciamento de Funções de Gerador de Dicionário

Os componentes desta seção manipulam dicionários de termos e realizam operações de geração com base neles.

Quando um dicionário de termos é criado, ele se torna parte do registro do dicionário e recebe um nome para ser usado por outras funções do dicionário.

- `gen_blocklist(str, from_dictionary_name, to_dictionary_name)`

  Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição.

  Argumentos:

  - `term`: Uma string que indica o termo a ser substituído. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `from_dictionary_name`: Uma string que nomeia o dicionário que contém o termo a ser substituído. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  - `to_dictionary_name`: Uma string que nomeia o dicionário a partir do qual escolher o termo de substituição. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

  Valor de retorno:

  Uma cadeia codificada no conjunto de caracteres `utf8mb4` escolhida aleatoriamente entre `to_dictionary_name` como substituição para `term`, ou `term` se não aparecer em `from_dictionary_name`, ou um erro se o nome do dicionário não estiver no registro do dicionário.

  Nota

  Se o termo a ser substituído aparecer em ambos os dicionários, é possível que o valor de retorno seja o mesmo termo.

  Exemplo:

  ```
  mysql> SELECT gen_blocklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blocklist('Berlin', 'DE_Cities', 'US_Cities') |
  +---------------------------------------------------+
  | Phoenix                                           |
  +---------------------------------------------------+
  ```

- `gen_dictionary(dictionary_name)`

  Retorna um termo aleatório de um dicionário.

  Argumentos:

  - `dictionary_name`: Uma string que nomeia o dicionário a partir do qual se escolhe o termo. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

  Valor de retorno:

  Um termo aleatório do dicionário como uma string codificada no conjunto de caracteres `utf8mb4` ou `NULL`, se o nome do dicionário não estiver no registro do dicionário.

  Exemplo:

  ```
  mysql> SELECT gen_dictionary('mydict');
  +--------------------------+
  | gen_dictionary('mydict') |
  +--------------------------+
  | My term                  |
  +--------------------------+
  mysql> SELECT gen_dictionary('no-such-dict');
  ERROR 1123 (HY000): Can't initialize function 'gen_dictionary'; Cannot access
  dictionary, check if dictionary name is valid.
  ```
