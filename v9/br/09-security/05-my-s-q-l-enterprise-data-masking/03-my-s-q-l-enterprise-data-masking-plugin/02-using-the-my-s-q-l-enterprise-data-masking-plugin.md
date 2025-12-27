#### 8.5.3.2 Usando o Plugin de Máscara de Dados do MySQL Enterprise

Antes de usar o MySQL Enterprise Data Masking, instale-o de acordo com as instruções fornecidas na Seção 8.5.3.1, “Instalação do Plugin de Máscara de Dados do MySQL Enterprise”.

Para usar o MySQL Enterprise Data Masking em aplicativos, invocando as funções apropriadas para as operações que deseja realizar. Para descrições detalhadas das funções, consulte a Seção 8.5.3.4, “Descrições das Funções do Plugin de Máscara de Dados do MySQL Enterprise”. Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Ela apresenta primeiro uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contextos reais:

* Máscara de Dados para Remover Características Identificadoras
* Gerar Dados Aleatórios com Características Específicas
* Gerar Dados Aleatórios Usando Dicionários
* Usar Dados Mascados para Identificação de Clientes
* Criar Visualizações que Exibem Dados Mascados

##### Máscara de Dados para Remover Características Identificadoras

O MySQL fornece funções de máscara de propósito geral que mascaram strings arbitrárias, e funções de máscara de propósito específico que mascaram tipos específicos de valores.

###### Funções de Máscara de Propósito Geral

`mask_inner()` e `mask_outer()` são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string:

* `mask_inner()` mascara o interior de seu argumento de string, deixando as extremidades não mascaradas. Outros argumentos especificam os tamanhos das extremidades não mascaradas.

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
  ```

* `mask_outer()` faz o inverso, mascarando as extremidades de seu argumento de string, deixando o interior não mascarado. Outros argumentos especificam os tamanhos das extremidades mascaradas.

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
mysql> SELECT mask_outer('This is a string', 5, 1, '#');
+-------------------------------------------+
| mask_outer('This is a string', 5, 1, '#') |
+-------------------------------------------+
| #####is a strin#                          |
+-------------------------------------------+
```

###### Funções de Mascaramento de Propósito Específico

Outras funções de mascaramento esperam um argumento de string representando um tipo específico de valor e o mascaram para remover características identificadoras.

Nota

Os exemplos fornecem argumentos de função usando as funções de geração de valores aleatórios que retornam o tipo apropriado de valor. Para mais informações sobre funções de geração, consulte Gerando Dados Aleatórios com Características Específicas.

**Mascaramento do Número da Conta Principal do Cartão de Pagamento.** As funções de mascaramento fornecem mascaramento estrito e relaxado dos números da conta principal do cartão de pagamento.

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

**Mascaramento do Número de Seguro Social dos EUA.** `mask_ssn()` mascara todos, exceto os últimos quatro dígitos do número:

```
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

##### Gerando Dados Aleatórios com Características Específicas

Várias funções geram valores aleatórios. Esses valores podem ser usados para testes, simulação e assim por diante.

`gen_range()` retorna um inteiro aleatório selecionado de um intervalo dado:

```
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

`gen_rnd_email()` retorna um endereço de e-mail aleatório no domínio `example.com`:

```
mysql> SELECT gen_rnd_email();
+---------------------------+
| gen_rnd_email()           |
+---------------------------+
| ayxnq.xmkpvvy@example.com |
+---------------------------+
```

`gen_rnd_pan()` retorna um número de Primary Account Number de cartão de pagamento aleatório:

```
mysql> SELECT gen_rnd_pan();
```

(O resultado da função `gen_rnd_pan()` não é mostrado porque seus valores de retorno devem ser usados apenas para fins de teste e não para publicação. Não pode ser garantido que o número não seja atribuído a uma conta de pagamento legítima.)

`gen_rnd_ssn()` retorna um número de segurança social aleatório dos EUA com as primeiras e segundas partes escolhidas de um intervalo não utilizado para números legítimos:

```
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
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

##### Gerando Dados Aleatórios Usando Dicionários

O MySQL Enterprise Data Masking permite que dicionários sejam usados como fontes de valores aleatórios. Para usar um dicionário, ele deve primeiro ser carregado de um arquivo e dado um nome. Cada dicionário carregado torna-se parte do registro de dicionários. Os itens podem então ser selecionados de dicionários registrados e usados como valores aleatórios ou como substituições para outros valores.

Um arquivo de dicionário válido tem essas características:

* O conteúdo do arquivo é texto simples, um termo por linha.
* Linhas vazias são ignoradas.
* O arquivo deve conter pelo menos um termo.

Suponha que um arquivo chamado `de_cities.txt` contenha esses nomes de cidades na Alemanha:

```
Berlin
Munich
Bremen
```

Suponha também que um arquivo chamado `us_cities.txt` contenha esses nomes de cidades nos Estados Unidos:

```
Chicago
Houston
Phoenix
El Paso
Detroit
```

Assuma que a variável de sistema `secure_file_priv` esteja definida como `/usr/local/mysql/mysql-files`. Nesse caso, copie os arquivos de dicionário para esse diretório para que o servidor MySQL possa acessá-los. Em seguida, use `gen_dictionary_load()` para carregar os dicionários no registro de dicionários e atribuir-lhes nomes:

```
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

##### Usando Dados Mascados para Identificação do Cliente

Em centros de atendimento ao cliente, uma técnica comum de verificação de identidade é pedir aos clientes que forneçam seus últimos quatro dígitos do número de Seguro Social (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

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
| 786 | XXX-XX-0007 |
+-----+-------------+
```

Agora, o representante vê apenas o necessário, e a privacidade do cliente é preservada.

Por que a função `CONVERT()` foi usada para o argumento de `mask_ssn()`? Porque `mask_ssn()` requer um argumento de comprimento 11. Assim, mesmo que `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer mais longa que 11 bytes quando passada para uma função carregável, e um erro ocorre. Converter o valor para uma string binária garante que a função veja um argumento de comprimento 11.

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
| 786 | XXX-XX-0007 |
+-----+-------------+
```