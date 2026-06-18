### 6.5.3 Uso da Mascagem e Desidentificação de Dados do MySQL Enterprise

Antes de usar o MySQL Enterprise Data Masking and De-Identification, instale-o de acordo com as instruções fornecidas na Seção 6.5.2, “Instalando ou Desinstalando o MySQL Enterprise Data Masking and De-Identification”.

Para usar o MySQL Enterprise Data Masking e De-Identification em aplicativos, invocando as funções apropriadas para as operações que você deseja realizar. Para descrições detalhadas das funções, consulte Seção 6.5.5, “Descrição das Funções de MySQL Enterprise Data Masking e De-Identification”. Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Ela apresenta primeiro uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contextos reais:

- Mascar Dados para Remover Características Identificadoras
- Gerando Dados Aleatórios com Características Específicas
- Gerando Dados Aleatórios Usando Dicionários
- Uso de dados mascarados para identificação do cliente
- Criando visualizações que exibem dados mascarados

#### Mascarar dados para remover características identificáveis

O MySQL oferece funções de mascaramento de propósito geral que mascaram strings arbitrárias e funções de mascaramento de propósito específico que mascaram tipos específicos de valores.

##### Funções de Máscara para Uso Geral

`mask_inner()` e `mask_outer()` são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string:

- `mask_inner()` mascara o interior do seu argumento de string, deixando as extremidades não mascaradas. Outros argumentos especificam os tamanhos das extremidades não mascaradas.

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

- `mask_outer()` faz o contrário, mascarando as extremidades do argumento de string, deixando o interior não mascarado. Outros argumentos especificam os tamanhos das extremidades mascaradas.

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

Por padrão, `mask_inner()` e `mask_outer()` usam `'X'` como o caractere de mascaramento, mas permitem um argumento opcional para o caractere de mascaramento:

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

##### Funções de Máscara para Finalidades Específicas

Outras funções de mascaramento esperam um argumento de string que representa um tipo específico de valor e o mascara para remover características identificáveis.

Nota

Os exemplos aqui fornecem argumentos de função usando as funções de geração de valores aleatórios que retornam o tipo apropriado de valor. Para mais informações sobre as funções de geração, consulte Gerando Dados Aleatórios com Características Específicas.

**Mascagem do Número Principal da Conta do Cartão de Pagamento.** As funções de mascaramento oferecem uma mascaragem rigorosa e relaxada dos Números Principais das Contas.

- `mask_pan()` mascara todos os dígitos, exceto os últimos quatro do número:

  ```sql
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

- `mask_pan_relaxed()` é semelhante, mas não mascara os primeiros seis dígitos que indicam o emissor do cartão de pagamento não mascarado:

  ```sql
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**Mascaramento do número do Seguro Social dos EUA.** `mask_ssn()` mascara todos os dígitos, exceto os últimos quatro do número:

```sql
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

#### Gerando Dados Aleatórios com Características Específicas

Várias funções geram valores aleatórios. Esses valores podem ser usados para testes, simulação e assim por diante.

`gen_range()` retorna um número inteiro aleatório selecionado de um intervalo dado:

```sql
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

`gen_rnd_email()` retorna um endereço de e-mail aleatório no domínio `example.com`:

```sql
mysql> SELECT gen_rnd_email();
+---------------------------+
| gen_rnd_email()           |
+---------------------------+
| ayxnq.xmkpvvy@example.com |
+---------------------------+
```

`gen_rnd_pan()` retorna um Número Principal da Conta (PAN) aleatório de um cartão de pagamento.

Como não pode ser garantido que o número gerado não seja atribuído a uma conta de pagamento legítima, o resultado de `gen_rnd_pan()` nunca deve ser exibido, exceto para fins de teste. Para exibição em aplicações, sempre utilize uma função de mascaramento, como `mask_pan()` ou `mask_pan_relaxed()`. Mostramos o uso dessa última função com `gen_rnd_pan()` aqui:

```sql
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

`gen_rnd_ssn()` retorna um número de segurança social dos EUA aleatório, cujas primeiras e segundas partes são escolhidas de um intervalo não utilizado para números legítimos:

```sql
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

`gen_rnd_us_phone()` retorna um número de telefone aleatório dos EUA no código de área 555 que não é usado para números legítimos:

```sql
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

#### Gerando Dados Aleatórios Usando Dicionários

O MySQL Enterprise Data Masking and De-Identification permite que os dicionários sejam usados como fontes de valores aleatórios. Para usar um dicionário, ele deve ser carregado primeiro de um arquivo e receber um nome. Cada dicionário carregado se torna parte do registro do dicionário. Os itens podem então ser selecionados dos dicionários registrados e usados como valores aleatórios ou como substituições para outros valores.

Um arquivo de dicionário válido tem essas características:

- O conteúdo do arquivo é texto simples, um termo por linha.
- Linhas vazias são ignoradas.
- O arquivo deve conter pelo menos um termo.

Suponha que um arquivo chamado `de_cities.txt` contenha esses nomes de cidades na Alemanha:

```sql
Berlin
Munich
Bremen
```

Suponha também que um arquivo chamado `us_cities.txt` contenha esses nomes de cidades nos Estados Unidos:

```sql
Chicago
Houston
Phoenix
El Paso
Detroit
```

Suponha que a variável de sistema `secure_file_priv` esteja definida como `/usr/local/mysql/mysql-files`. Nesse caso, copie os arquivos do dicionário para esse diretório para que o servidor MySQL possa acessá-los. Em seguida, use `gen_dictionary_load()` para carregar os dicionários no registro do dicionário e atribuir-lhes nomes:

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

Para selecionar um termo aleatório de um dicionário, use [`gen_dictionary()`](https://docs.python.org/3/library/functions.html#gen-dictionary):

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

Para selecionar um termo aleatório de vários dicionários, selecione aleatoriamente um dos dicionários e, em seguida, selecione um termo dele:

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

A função `gen_blacklist()` permite que um termo de um dicionário seja substituído por um termo de outro dicionário, o que resulta em mascaramento por substituição. Seus argumentos são o termo a ser substituído, o dicionário no qual o termo aparece e o dicionário a partir do qual será escolhido um substituto. Por exemplo, para substituir uma cidade dos EUA por uma cidade alemã, ou vice-versa, use `gen_blacklist()` da seguinte forma:

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

Se o termo a ser substituído não estiver no primeiro dicionário, `gen_blacklist()` o retorna inalterado:

```sql
mysql> SELECT gen_blacklist('Moscow', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blacklist('Moscow', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Moscow                                            |
+---------------------------------------------------+
```

#### Uso de Dados Mascados para Identificação do Cliente

Nos centros de atendimento ao cliente, uma técnica comum de verificação de identidade é pedir aos clientes que forneçam seus últimos quatro dígitos do número de Seguro Social (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

Suponha que uma tabela `cliente` contendo registros de clientes tenha essas colunas:

- `id`: Número do ID do cliente.
- `primeiro_nome`: Nome do cliente.
- `ultimo_nome`: Sobrenome do cliente.
- `ssn`: Número de Segurança Social do cliente.

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

O aplicativo usado pelos representantes do atendimento ao cliente para verificar o SSN do cliente pode executar uma consulta como esta:

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

No entanto, isso expõe o SSN ao representante do serviço ao cliente, que não precisa ver nada além dos últimos quatro dígitos. Em vez disso, o aplicativo pode usar essa consulta para exibir apenas o SSN mascarado:

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

Agora, o representante vê apenas o que é necessário, e a privacidade do cliente é preservada.

Por que a função `CONVERT()` foi usada para o argumento da função `mask_ssn()`? Porque a função `mask_ssn()` requer um argumento de comprimento 11. Assim, mesmo que `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer mais longa que 11 bytes quando passada para uma função carregável, e um erro ocorre. Converter o valor para uma string binária garante que a função veja um argumento de comprimento 11.

Uma técnica semelhante pode ser necessária para outras funções de mascaramento de dados quando os argumentos de string não têm um conjunto de caracteres de um único byte.

#### Criando visualizações que exibem dados mascarados

Se dados mascarados de uma tabela forem usados em várias consultas, pode ser conveniente definir uma visualização que produza dados mascarados. Dessa forma, as aplicações podem selecionar a partir da visualização sem realizar o mascaramento em consultas individuais.

Por exemplo, uma visualização de mascaramento na tabela `customer` da seção anterior pode ser definida da seguinte forma:

```sql
CREATE VIEW masked_customer AS
SELECT id, first_name, last_name,
mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
FROM customer;
```

Então, a consulta para buscar um cliente se torna mais simples, mas ainda retorna dados mascarados:

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
