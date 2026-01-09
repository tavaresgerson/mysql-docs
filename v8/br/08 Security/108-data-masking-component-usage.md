#### 8.5.2.2 Uso dos Componentes de Máscara e Desidentificação de Dados do MySQL Enterprise

Antes de usar os Componentes de Máscara e Desidentificação de Dados do MySQL Enterprise, instale-os de acordo com as instruções fornecidas na Seção 8.5.2.1, “Instalação dos Componentes de Máscara e Desidentificação de Dados do MySQL Enterprise”.

Para usar os Componentes de Máscara e Desidentificação de Dados do MySQL Enterprise em aplicativos, invocando as funções apropriadas para as operações que deseja realizar. Para descrições detalhadas das funções, consulte a Seção 8.5.2.4, “Descrições das Funções dos Componentes de Máscara e Desidentificação de Dados do MySQL Enterprise”. Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Ela apresenta primeiro uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contextos reais:

*  Mascar Dados para Remover Características Identificadoras
*  Gerar Dados Aleatórios com Características Específicas
*  Gerar Dados Aleatórios Usando Dicionários
*  Usar Dados Mascados para Identificação de Clientes
*  Criar Visualizações que Exibem Dados Mascados

##### Mascar Dados para Remover Características Identificadoras

O MySQL fornece funções de componentes de máscara de propósito geral que mascaram strings arbitrárias, e funções de máscara de propósito específico que mascaram tipos específicos de valores.

###### Funções de Componentes de Máscara de Propósito Geral

 `mask_inner()` e `mask_outer()` são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string. Ambas as funções suportam uma string de entrada que é codificada em qualquer conjunto de caracteres:

*  `mask_inner()` mascara o interior de seu argumento de string, deixando as extremidades não mascaradas. Outros argumentos especificam os tamanhos das extremidades não mascaradas.

  ```
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
  mysql> SELECT mask_inner("かすみがうら市", 3, 1);
  +----------------------------------+
  | mask_inner("かすみがうら市", 3, 1) |
  +----------------------------------+
  | かすみXXX市                       |
  +----------------------------------+
  mysql> SELECT mask_inner("かすみがうら市", 1, 3);
  +----------------------------------+
  | mask_inner("かすみがうら市", 1, 3) |
  +----------------------------------+
  | かXXXうら市                       |
  +----------------------------------+
  ```
*  `mask_outer()` faz o inverso, mascarando as extremidades de seu argumento de string, deixando o interior não mascarado. Outros argumentos especificam os tamanhos das extremidades mascaradas.

  ```
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

```
mysql> SELECT mask_inner('This is a string', 5, 1, '*');
+-------------------------------------------+
| mask_inner('This is a string', 5, 1, '*') |
+-------------------------------------------+
| This **********g                          |
+-------------------------------------------+
mysql> SELECT mask_inner("かすみがうら市", 2, 2, "#");
+---------------------------------------+
| mask_inner("かすみがうら市", 2, 2, "#") |
+---------------------------------------+
| かす###ら市                            |
+---------------------------------------+
```

###### Funções de Componentes de Mascaramento de Propósito Específico

Outras funções de mascaramento esperam um argumento de string representando um tipo específico de valor e o mascaram para remover características identificáveis.

::: info Nota

Os exemplos aqui fornecem argumentos de função usando as funções de geração de valores aleatórios que retornam o tipo apropriado de valor. Para mais informações sobre funções de geração, consulte Gerando Dados Aleatórios com Características Específicas.

:::

**Mascaramento do Número da Conta Primária do Cartão de Pagamento.** As funções de mascaramento fornecem mascaramento estrito e relaxado dos números da conta primária.

* `mask_pan()` mascara todos, exceto os últimos quatro dígitos do número:

  ```
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```
* `mask_pan_relaxed()` é semelhante, mas não mascara os primeiros seis dígitos que indicam o emissor do cartão de pagamento não desmascarado:

  ```
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**Mascaramento do Número de Conta Bancária Internacional.** `mask_iban()` mascara todos, exceto as primeiras duas letras (indicando o país) do número:

```
mysql> SELECT mask_iban(gen_rnd_iban());
+---------------------------+
| mask_iban(gen_rnd_iban()) |
+---------------------------+
| ZZ** **** **** ****       |
+---------------------------+
```

**Mascaramento de Identificador Único Universal.** `mask_uuid()` mascara todos os caracteres significativos:

```
mysql> SELECT mask_uuid(gen_rnd_uuid());
+--------------------------------------+
| mask_uuid(gen_rnd_uuid())            |
+--------------------------------------+
| ********-****-****-****-************ |
+--------------------------------------+
```

**Mascaramento do Número de Seguro Social dos EUA.** `mask_ssn()` mascara todos, exceto os últimos quatro dígitos do número:

```
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| ***-**-1723             |
+-------------------------+
```

**Mascaramento do Número de Seguro Social do Canadá.** `mask_canada_sin()` mascara dígitos significativos do número:

```
mysql> SELECT mask_canada_sin(gen_rnd_canada_sin());
+---------------------------------------+
| mask_canada_sin(gen_rnd_canada_sin()) |
+---------------------------------------+
| XXX-XXX-XXX                           |
+---------------------------------------+
```

**Mascaramento do Número de Seguro Social do Reino Unido.** `mask_uk_nin()` mascara todos, exceto os primeiros dois dígitos do número:

```
mysql> SELECT mask_uk_nin(gen_rnd_uk_nin());
+-------------------------------+
| mask_uk_nin(gen_rnd_uk_nin()) |
+-------------------------------+
| ZH*******                     |
+-------------------------------+
```

##### Gerando Dados Aleatórios com Características Específicas

Várias funções de componentes geram valores aleatórios. Esses valores podem ser usados para testes, simulação e assim por diante.

 `gen_range()` retorna um inteiro aleatório selecionado de um intervalo dado:

```
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

 `gen_rnd_canada_sin()` retorna um número de seguro social canadense (SIN) aleatório.

Como não é possível garantir que o número gerado não tenha sido atribuído, o resultado de `gen_rnd_canada_sin()` nunca deve ser exibido (exceto possivelmente para testes). Para exibição em aplicativos voltados para o usuário, sempre utilize uma função de mascaramento, como `mask_canada_sin()`, conforme mostrado aqui:

```
mysql> SELECT mask_canada_sin( gen_rnd_canada_sin() );
+-----------------------------------------+
| mask_canada_sin( gen_rnd_canada_sin() ) |
+-----------------------------------------+
| xxx-xxx-xxx                             |
+-----------------------------------------+
```

`gen_rnd_email()` retorna um endereço de e-mail aleatório com um número especificado de dígitos para as partes de nome e sobrenome no domínio especificado, `mynet.com`, no exemplo a seguir:

```
mysql> SELECT gen_rnd_email(6, 8, 'mynet.com');
+----------------------------------+
| gen_rnd_email(6, 8, 'mynet.com') |
+----------------------------------+
| txdona.uamdqvum@mynet.com        |
+----------------------------------+
```

`gen_rnd_iban()` retorna um número escolhido de uma faixa não utilizada para contas de pagamento legítimas:

```
mysql> SELECT gen_rnd_iban('XO', 24);
+-------------------------------+
| gen_rnd_iban('XO', 24)        |
+-------------------------------+
| XO25 SL7A PGQR B9NN 6IVB RFE8 |
+-------------------------------+
```

`gen_rnd_pan()` retorna um Número Principal da Conta (PAN) de cartão de pagamento aleatório.

Como não é possível garantir que o número gerado não tenha sido atribuído a uma conta de pagamento legítima, o resultado de `gen_rnd_pan()` nunca deve ser exibido, exceto para fins de teste. Para exibição em aplicativos, sempre utilize uma função de mascaramento, como `mask_pan()` ou `mask_pan_relaxed()`. Mostramos o uso dessa última função com `gen_rnd_pan()` aqui:

```
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

`gen_rnd_ssn()` retorna um Número de Segurança Social dos EUA aleatório, cuja primeira parte é escolhida de uma faixa não utilizada para números legítimos:

```
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

`gen_rnd_uk_nin()` retorna um Número de Seguro Nacional (NIN) do Reino Unido aleatório.

Como não é possível garantir que o número gerado não tenha sido atribuído, o resultado de `gen_rnd_uk_nin()` nunca deve ser exibido (exceto possivelmente em testes). Para exibição em aplicativos voltados para o usuário, sempre utilize uma função de mascaramento, como `mask_uk_nin()`, conforme mostrado aqui:

```
mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
+---------------------------------+
| mask_uk_nin( gen_rnd_uk_nin() ) |
+---------------------------------+
| OE*******                       |
+---------------------------------+
```

`gen_rnd_us_phone()` retorna um número de telefone dos EUA aleatório no código de área 555 não utilizado para números legítimos:

```
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

`gen_rnd_uuid()` retorna um número escolhido de uma faixa não utilizada para identificadores legítimos:

```
mysql> SELECT gen_rnd_uuid();
+--------------------------------------+
| gen_rnd_uuid()                       |
+--------------------------------------+
| 68946384-6880-3150-6889-928076732539 |
+--------------------------------------+
```

##### Gerando Dados Aleatórios Usando Dicionários

O Máscara de Dados e Desidentificação Empresarial do MySQL permite que dicionários sejam usados como fontes de valores aleatórios chamados *termos*. Para usar um dicionário, ele deve primeiro ser adicionado à tabela `masking_dictionaries` do sistema e receber um nome. Os dicionários são lidos da tabela e carregados no cache durante a inicialização dos componentes (ao iniciar o servidor). Os termos podem então ser adicionados, removidos e selecionados de dicionários e usados como valores aleatórios ou como substituições para outros valores.

::: info Nota

Sempre edite dicionários usando funções de administração de dicionários em vez de modificar a tabela diretamente. Se você manipular a tabela manualmente, o cache do dicionário se torna inconsistente com a tabela.

:::

Uma tabela `masking_dictionaries` válida tem essas características:

* Um administrador criou a tabela `masking_dictionaries` do sistema no esquema `mysql` da seguinte forma:

  ```
  CREATE TABLE IF NOT EXISTS
  masking_dictionaries(
      Dictionary VARCHAR(256) NOT NULL,
      Term VARCHAR(256) NOT NULL,
      UNIQUE INDEX dictionary_term_idx (Dictionary, Term),
      INDEX dictionary_idx (Dictionary)
  ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
  ```
* O privilégio `MASKING_DICTIONARY_ADMIN` é necessário para adicionar e remover termos ou para remover um dicionário inteiro.
* A tabela pode conter vários dicionários e seus termos.
* Qualquer conta de usuário pode visualizar os dicionários. Com muitas consultas, todos os termos dos dicionários podem ser recuperados. Evite adicionar dados sensíveis à tabela do dicionário.

Suponha que um dicionário chamado `DE_cities` inclua esses nomes de cidades na Alemanha:

```
Berlin
Munich
Bremen
```

Use `masking_dictionary_term_add()` para atribuir um nome de dicionário e um termo:

```
mysql> SELECT masking_dictionary_term_add('DE_Cities', 'Berlin');
+----------------------------------------------------+
| masking_dictionary_term_add('DE_Cities', 'Berlin') |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('DE_Cities', 'Munich');
+----------------------------------------------------+
| masking_dictionary_term_add('DE_Cities', 'Munich') |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('DE_Cities', 'Bremen');
+----------------------------------------------------+
| masking_dictionary_term_add('DE_Cities', 'Bremen') |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
```

Suponha também que um dicionário chamado `US_Cities` contenha esses nomes de cidades nos Estados Unidos:

```
Houston
Phoenix
Detroit
```

```
mysql> SELECT masking_dictionary_term_add('US_Cities', 'Houston');
+-----------------------------------------------------+
| masking_dictionary_term_add('US_Cities', 'Houston') |
+-----------------------------------------------------+
|                                                   1 |
+-----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('US_Cities', 'Phoenix');
+-----------------------------------------------------+
| masking_dictionary_term_add('US_Cities', 'Phoenix') |
+-----------------------------------------------------+
|                                                   1 |
+-----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('US_Cities', 'Detroit');
+-----------------------------------------------------+
| masking_dictionary_term_add('US_Cities', 'Detroit') |
+-----------------------------------------------------+
|                                                   1 |
+-----------------------------------------------------+
```

Para selecionar um termo aleatório de um dicionário, use `gen_dictionary()`:

```
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

```
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

A função `gen_blocklist()` permite que um termo de um dicionário seja substituído por um termo de outro dicionário, o que resulta em uma máscara por substituição. Seus argumentos são o termo a ser substituído, o dicionário no qual o termo aparece e o dicionário a partir do qual será escolhido um substituto. Por exemplo, para substituir uma cidade dos EUA por uma cidade alemã, ou vice-versa, use `gen_blocklist()` da seguinte maneira:

```
mysql> SELECT gen_blocklist('Munich', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blocklist('Munich', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Houston                                           |
+---------------------------------------------------+
mysql> SELECT gen_blocklist('El Paso', 'US_Cities', 'DE_Cities');
+----------------------------------------------------+
| gen_blocklist('El Paso', 'US_Cities', 'DE_Cities') |
+----------------------------------------------------+
| Bremen                                             |
+----------------------------------------------------+
```

Se o termo a ser substituído não estiver no primeiro dicionário, `gen_blocklist()` o retorna inalterado:

```
mysql> SELECT gen_blocklist('Moscow', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blocklist('Moscow', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Moscow                                            |
+---------------------------------------------------+
```

##### Usando Dados Mascados para Identificação de Clientes

Em centros de atendimento ao cliente, uma técnica comum de verificação de identidade é pedir aos clientes que forneçam seus últimos quatro dígitos do Número de Seguro Social (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

Suponha que uma tabela `customer` contendo registros de clientes tenha essas colunas:

* `id`: Número de ID do cliente.
* `first_name`: Nome do cliente.
* `last_name`: Sobrenome do cliente.
* `ssn`: Número de Seguro Social do cliente.

Por exemplo, a tabela pode ser definida da seguinte forma:

```
CREATE TABLE customer
(
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(40),
  last_name  VARCHAR(40),
  ssn        VARCHAR(11)
);
```

O aplicativo usado pelos representantes de atendimento ao cliente para verificar o SSN do cliente pode executar uma consulta como esta:

```
mysql> SELECT id, ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | ssn         |
+-----+-------------+
| 786 | 906-39-0007 |
+-----+-------------+
```

No entanto, isso expõe o SSN ao representante de atendimento ao cliente, que não precisa ver nada além dos últimos quatro dígitos. Em vez disso, o aplicativo pode usar essa consulta para exibir apenas o SSN mascarado:

```
mysql> SELECT id, mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | ***-**-0007 |
+-----+-------------+
```

Agora, o representante vê apenas o necessário, e a privacidade do cliente é preservada.

Por que a função `CONVERT()` foi usada para o argumento de `mask_ssn()»? Porque `mask_ssn()` requer um argumento de comprimento 11. Assim, mesmo que `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer mais longa que 11 bytes quando passada para uma função carregável, e retorna `NULL` ao registrar o erro. Converter o valor para uma string binária garante que a função veja um argumento de comprimento 11.

Uma técnica semelhante pode ser necessária para outras funções de mascaramento de dados quando os argumentos de string não têm um conjunto de caracteres de byte único.

##### Criando Visualizações que Exibem Dados Mascarados

Se os dados mascarados de uma tabela forem usados para múltiplas consultas, pode ser conveniente definir uma visualização que produza dados mascarados. Dessa forma, as aplicações podem selecionar a visualização sem realizar o mascaramento em consultas individuais.

Por exemplo, uma visualização de mascaramento na tabela `customer` da seção anterior pode ser definida da seguinte forma:

```
CREATE VIEW masked_customer AS
SELECT id, first_name, last_name,
mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
FROM customer;
```

Então, a consulta para buscar um cliente se torna mais simples, mas ainda retorna dados mascarados:

```
mysql> SELECT id, masked_ssn
mysql> FROM masked_customer
mysql> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | ***-**-0007 |
+-----+-------------+
```