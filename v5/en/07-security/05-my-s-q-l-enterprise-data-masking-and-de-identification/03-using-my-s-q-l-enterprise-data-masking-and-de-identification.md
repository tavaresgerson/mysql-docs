### 6.5.3 Utilizando MySQL Enterprise Data Masking and De-Identification

Antes de utilizar o MySQL Enterprise Data Masking and De-Identification, instale-o de acordo com as instruções fornecidas na [Seção 6.5.2, “Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification”](data-masking-installation.html "6.5.2 Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification").

Para usar o MySQL Enterprise Data Masking and De-Identification em aplicações, invoque as funções apropriadas para as operações que você deseja realizar. Para descrições detalhadas das funções, consulte a [Seção 6.5.5, “MySQL Enterprise Data Masking and De-Identification Function Descriptions”](data-masking-functions.html "6.5.5 MySQL Enterprise Data Masking and De-Identification Function Descriptions"). Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Primeiro, ela apresenta uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contextos do mundo real:

* [Mascarando Dados para Remover Características de Identificação](data-masking-usage.html#data-masking-usage-masking-functions "Mascarando Dados para Remover Características de Identificação")
* [Gerando Dados Aleatórios com Características Específicas](data-masking-usage.html#data-masking-usage-generation-functions "Gerando Dados Aleatórios com Características Específicas")
* [Gerando Dados Aleatórios Usando Dicionários](data-masking-usage.html#data-masking-usage-dictionary-functions "Gerando Dados Aleatórios Usando Dicionários")
* [Usando Dados Mascarados para Identificação de Clientes](data-masking-usage.html#data-masking-usage-customer-identification "Usando Dados Mascarados para Identificação de Clientes")
* [Criando Views que Exibem Dados Mascarados](data-masking-usage.html#data-masking-usage-views "Criando Views que Exibem Dados Mascarados")

#### Mascarando Dados para Remover Características de Identificação

O MySQL fornece funções de *masking* de propósito geral que mascaram strings arbitrárias e funções de *masking* de propósito especial que mascaram tipos de valores específicos.

##### Funções de Masking de Propósito Geral

[`mask_inner()`](data-masking-functions.html#function_mask-inner) e [`mask_outer()`](data-masking-functions.html#function_mask-outer) são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string:

* [`mask_inner()`](data-masking-functions.html#function_mask-inner) mascara o interior do seu argumento de string, deixando as extremidades sem máscara (*unmasked*). Outros argumentos especificam os tamanhos das extremidades sem máscara.

  ```sql
  mysql> SELECT mask_inner('This is a string', 5, 1);
  +--------------------------------------+
  | mask_inner('This is a string', 5, 1) |
  +--------------------------------------+
  | This XXXXXXXXXXg                     |
  +--------------------------------------+
  mysql> SELECT mask_inner('This is a string', 1, 5);
  +--------------------------------------+
  | mask_inner('This is a string', 1, 5) |
  +--------------------------------------+
  | TXXXXXXXXXXtring                     |
  +--------------------------------------+
  ```

* [`mask_outer()`](data-masking-functions.html#function_mask-outer) faz o inverso, mascarando as extremidades do seu argumento de string, deixando o interior sem máscara. Outros argumentos especificam os tamanhos das extremidades mascaradas.

  ```sql
  mysql> SELECT mask_outer('This is a string', 5, 1);
  +--------------------------------------+
  | mask_outer('This is a string', 5, 1) |
  +--------------------------------------+
  | XXXXXis a strinX                     |
  +--------------------------------------+
  mysql> SELECT mask_outer('This is a string', 1, 5);
  +--------------------------------------+
  | mask_outer('This is a string', 1, 5) |
  +--------------------------------------+
  | Xhis is a sXXXXX                     |
  +--------------------------------------+
  ```

Por padrão, [`mask_inner()`](data-masking-functions.html#function_mask-inner) e [`mask_outer()`](data-masking-functions.html#function_mask-outer) usam `'X'` como caractere de *masking*, mas permitem um argumento opcional para o caractere de *masking*:

```sql
mysql> SELECT mask_inner('This is a string', 5, 1, '*');
+-------------------------------------------+
| mask_inner('This is a string', 5, 1, '*') |
+-------------------------------------------+
| This **********g                          |
+-------------------------------------------+
mysql> SELECT mask_outer('This is a string', 5, 1, '#');
+-------------------------------------------+
| mask_outer('This is a string', 5, 1, '#') |
+-------------------------------------------+
| #####is a strin#                          |
+-------------------------------------------+
```

##### Funções de Masking de Propósito Especial

Outras funções de *masking* esperam um argumento de string representando um tipo específico de valor e o mascaram para remover características de identificação.

Nota

Os exemplos aqui fornecem argumentos de função usando as funções de geração de valor aleatório que retornam o tipo de valor apropriado. Para mais informações sobre funções de geração, consulte [Gerando Dados Aleatórios com Características Específicas](data-masking-usage.html#data-masking-usage-generation-functions "Gerando Dados Aleatórios com Características Específicas").

**Masking de Primary Account Number (Número de Conta Principal) de cartões de pagamento.** As funções de *masking* fornecem mascaramento estrito e relaxado de Primary Account Numbers.

* [`mask_pan()`](data-masking-functions.html#function_mask-pan) mascara todos exceto os últimos quatro dígitos do número:

  ```sql
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

* [`mask_pan_relaxed()`](data-masking-functions.html#function_mask-pan-relaxed) é semelhante, mas não mascara os primeiros seis dígitos que indicam o emissor do cartão de pagamento sem máscara:

  ```sql
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**Masking de número de US Social Security (SSN).** [`mask_ssn()`](data-masking-functions.html#function_mask-ssn) mascara todos exceto os últimos quatro dígitos do número:

```sql
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

#### Gerando Dados Aleatórios com Características Específicas

Várias funções geram valores aleatórios. Esses valores podem ser usados para testes, simulações e assim por diante.

[`gen_range()`](data-masking-functions.html#function_gen-range) retorna um inteiro aleatório selecionado de um determinado range:

```sql
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

[`gen_rnd_email()`](data-masking-functions.html#function_gen-rnd-email) retorna um endereço de email aleatório no domínio `example.com`:

```sql
mysql> SELECT gen_rnd_email();
+---------------------------+
| gen_rnd_email()           |
+---------------------------+
| ayxnq.xmkpvvy@example.com |
+---------------------------+
```

[`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan) retorna um Primary Account Number (PAN) aleatório de cartão de pagamento.

Como não pode ser garantido que o número gerado não esteja atribuído a uma conta de pagamento legítima, o resultado de [`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan) nunca deve ser exibido, exceto para fins de teste. Para exibição em aplicações, sempre utilize uma função de *masking* como [`mask_pan()`](data-masking-functions.html#function_mask-pan) ou [`mask_pan_relaxed()`](data-masking-functions.html#function_mask-pan-relaxed). Demonstramos o uso desta última função com [`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan) aqui:

```sql
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

[`gen_rnd_ssn()`](data-masking-functions.html#function_gen-rnd-ssn) retorna um número de US Social Security aleatório cujas primeira e segunda partes são escolhidas em um range não utilizado para números legítimos:

```sql
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

[`gen_rnd_us_phone()`](data-masking-functions.html#function_gen-rnd-us-phone) retorna um número de telefone US aleatório no código de área 555 não utilizado para números legítimos:

```sql
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

#### Gerando Dados Aleatórios Usando Dicionários

O MySQL Enterprise Data Masking and De-Identification permite que dicionários sejam usados como fontes de valores aleatórios. Para usar um dicionário, ele deve primeiro ser carregado de um arquivo e receber um nome. Cada dicionário carregado se torna parte do registro de dicionários (*dictionary registry*). Itens podem então ser selecionados de dicionários registrados e usados como valores aleatórios ou como substituições para outros valores.

Um arquivo de dicionário válido possui estas características:

* O conteúdo do arquivo é texto simples, um termo por linha.
* Linhas vazias são ignoradas.
* O arquivo deve conter pelo menos um termo.

Suponha que um arquivo chamado `de_cities.txt` contenha estes nomes de cidades na Alemanha:

```sql
Berlin
Munich
Bremen
```

Suponha também que um arquivo chamado `us_cities.txt` contenha estes nomes de cidades nos Estados Unidos:

```sql
Chicago
Houston
Phoenix
El Paso
Detroit
```

Assuma que a variável de sistema [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) esteja definida como `/usr/local/mysql/mysql-files`. Nesse caso, copie os arquivos de dicionário para esse diretório para que o MySQL server possa acessá-los. Em seguida, use [`gen_dictionary_load()`](data-masking-functions.html#function_gen-dictionary-load) para carregar os dicionários no registro de dicionários e atribuir-lhes nomes:

```sql
mysql> SELECT gen_dictionary_load('/usr/local/mysql/mysql-files/de_cities.txt', 'DE_Cities');
+--------------------------------------------------------------------------------+
| gen_dictionary_load('/usr/local/mysql/mysql-files/de_cities.txt', 'DE_Cities') |
+--------------------------------------------------------------------------------+
| Dictionary load success                                                        |
+--------------------------------------------------------------------------------+
mysql> SELECT gen_dictionary_load('/usr/local/mysql/mysql-files/us_cities.txt', 'US_Cities');
+--------------------------------------------------------------------------------+
| gen_dictionary_load('/usr/local/mysql/mysql-files/us_cities.txt', 'US_Cities') |
+--------------------------------------------------------------------------------+
| Dictionary load success                                                        |
+--------------------------------------------------------------------------------+
```

Para selecionar um termo aleatório de um dicionário, use [`gen_dictionary()`](data-masking-functions.html#function_gen-dictionary):

```sql
mysql> SELECT gen_dictionary('DE_Cities');
+-----------------------------+
| gen_dictionary('DE_Cities') |
+-----------------------------+
| Berlin                      |
+-----------------------------+
mysql> SELECT gen_dictionary('US_Cities');
+-----------------------------+
| gen_dictionary('US_Cities') |
+-----------------------------+
| Phoenix                     |
+-----------------------------+
```

Para selecionar um termo aleatório de múltiplos dicionários, selecione um dos dicionários aleatoriamente e, em seguida, selecione um termo dele:

```sql
mysql> SELECT gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities'));
+---------------------------------------------------------------+
| gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities')) |
+---------------------------------------------------------------+
| Detroit                                                       |
+---------------------------------------------------------------+
mysql> SELECT gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities'));
+---------------------------------------------------------------+
| gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities')) |
+---------------------------------------------------------------+
| Bremen                                                        |
+---------------------------------------------------------------+
```

A função [`gen_blacklist()`](data-masking-functions.html#function_gen-blacklist) permite que um termo de um dicionário seja substituído por um termo de outro dicionário, o que efetua *masking* por substituição. Seus argumentos são o termo a ser substituído, o dicionário em que o termo aparece e o dicionário de onde escolher uma substituição. Por exemplo, para substituir uma cidade US por uma cidade alemã, ou vice-versa, use [`gen_blacklist()`](data-masking-functions.html#function_gen-blacklist) desta forma:

```sql
mysql> SELECT gen_blacklist('Munich', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blacklist('Munich', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Houston                                           |
+---------------------------------------------------+
mysql> SELECT gen_blacklist('El Paso', 'US_Cities', 'DE_Cities');
+----------------------------------------------------+
| gen_blacklist('El Paso', 'US_Cities', 'DE_Cities') |
+----------------------------------------------------+
| Bremen                                             |
+----------------------------------------------------+
```

Se o termo a ser substituído não estiver no primeiro dicionário, [`gen_blacklist()`](data-masking-functions.html#function_gen-blacklist) o retorna inalterado:

```sql
mysql> SELECT gen_blacklist('Moscow', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blacklist('Moscow', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Moscow                                            |
+---------------------------------------------------+
```

#### Usando Dados Mascarados para Identificação de Clientes

Em *call centers* de atendimento ao cliente, uma técnica comum de verificação de identidade é solicitar aos clientes que forneçam os últimos quatro dígitos do seu número de Social Security (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

Suponha que uma tabela `customer` contendo registros de clientes tenha estas colunas:

* `id`: Número de ID do Cliente.
* `first_name`: Primeiro nome do Cliente.
* `last_name`: Sobrenome do Cliente.
* `ssn`: Número de Social Security do Cliente.

Por exemplo, a tabela pode ser definida da seguinte forma:

```sql
CREATE TABLE customer
(
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(40),
  last_name  VARCHAR(40),
  ssn        VARCHAR(11)
);
```

A aplicação usada pelos representantes de atendimento ao cliente para verificar o SSN do cliente pode executar uma Query como esta:

```sql
mysql> SELECT id, ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | ssn         |
+-----+-------------+
| 786 | 906-39-0007 |
+-----+-------------+
```

No entanto, isso expõe o SSN ao representante de atendimento ao cliente, que não precisa ver nada além dos últimos quatro dígitos. Em vez disso, a aplicação pode usar esta Query para exibir apenas o SSN mascarado:

```sql
mysql> SELECT id, mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | XXX-XX-0007 |
+-----+-------------+
```

Agora o representante vê apenas o que é necessário, e a privacidade do cliente é preservada.

Por que a função [`CONVERT()`](cast-functions.html#function_convert) foi usada para o argumento de [`mask_ssn()`](data-masking-functions.html#function_mask-ssn)? Porque [`mask_ssn()`](data-masking-functions.html#function_mask-ssn) exige um argumento de comprimento 11. Assim, embora `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer ter mais de 11 bytes quando passada para uma função carregável, e um erro pode ocorrer. Converter o valor para uma string binária garante que a função veja um argumento de comprimento 11.

Uma técnica semelhante pode ser necessária para outras funções de *data masking* quando argumentos de string não têm um conjunto de caracteres single-byte.

#### Criando Views que Exibem Dados Mascarados

Se dados mascarados de uma tabela forem usados para múltiplas Queries, pode ser conveniente definir uma View que produza dados mascarados. Dessa forma, as aplicações podem selecionar a partir da View sem precisar realizar o *masking* em Queries individuais.

Por exemplo, uma View de *masking* na tabela `customer` da seção anterior pode ser definida desta forma:

```sql
CREATE VIEW masked_customer AS
SELECT id, first_name, last_name,
mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
FROM customer;
```

Então a Query para procurar um cliente se torna mais simples, mas ainda retorna dados mascarados:

```sql
mysql> SELECT id, masked_ssn
mysql> FROM masked_customer
mysql> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | XXX-XX-0007 |
+-----+-------------+
```
