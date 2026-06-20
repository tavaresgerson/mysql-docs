## 6.5 Mascagem e desidentificação de dados da MySQL Enterprise

Nota

A Máscara de Dados e Desidentificação Empresarial do MySQL é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A partir do MySQL 5.7.24, a Edição Empresarial do MySQL oferece capacidades de mascaramento e desidentificação de dados:

* Transformação dos dados existentes para mascará-los e removê-los características identificáveis, como alterar todos os dígitos de um número de cartão de crédito, mas os últimos quatro para `'X'` caracteres.

* Geração de dados aleatórios, como endereços de e-mail e números de cartões de pagamento.

A forma como as aplicações utilizam essas capacidades depende do propósito para o qual os dados são utilizados e quem os acessa:

* Aplicações que utilizam dados sensíveis podem protegê-los realizando o mascaramento de dados e permitindo o uso de dados parcialmente mascarados para identificação do cliente. Exemplo: Um centro de atendimento pode solicitar que os clientes forneçam seus últimos quatro dígitos do número do Cartão de Identidade Social.

* Aplicativos que exigem dados formatados corretamente, mas não necessariamente os dados originais, podem sintetizar dados de amostra. Exemplo: um desenvolvedor de aplicativos que está testando validadores de dados, mas não tem acesso aos dados originais, pode sintetizar dados aleatórios com o mesmo formato.

Exemplo 1:

As instalações de pesquisa médica podem conter dados de pacientes que compreendem uma mistura de dados pessoais e médicos. Isso pode incluir sequências genéticas (longas cadeias), resultados de testes armazenados em formato JSON e outros tipos de dados. Embora os dados possam ser usados principalmente por software de análise automatizada, o acesso a dados genômicos ou resultados de testes de pacientes específicos ainda é possível. Nesses casos, o mascaramento de dados deve ser usado para tornar essas informações não identificáveis pessoalmente.

Exemplo 2:

Uma empresa de processamento de cartão de crédito oferece um conjunto de serviços que utilizam dados sensíveis, como:

* Processar um grande número de transações financeiras por segundo. * Armazenar uma grande quantidade de dados relacionados às transações. * Proteger os dados relacionados às transações com requisitos rigorosos para dados pessoais.

* Tratamento de reclamações de clientes sobre transações que utilizam dados reversíveis ou parcialmente mascarados.

Uma transação típica pode incluir muitos tipos de informações sensíveis, incluindo:

* Número do cartão de crédito. * Tipo e valor da transação. * Tipo de comerciante. * criptograma da transação (para confirmar a legitimidade da transação). * Geolocalização do terminal equipado com GPS (para detecção de fraude).

Esses tipos de informações podem, então, ser agregados dentro de um banco ou outra instituição financeira que emite cartões com dados pessoais do cliente, como:

* Nome completo do cliente (pessoa ou empresa). * Endereço. * Data de nascimento. * Número da Segurança Social. * Endereço de e-mail. * Número de telefone.

Vários papéis de funcionários, tanto na empresa de processamento de cartões quanto na instituição financeira, exigem acesso a esses dados. Alguns desses papéis podem exigir acesso apenas a dados mascarados. Outros papéis podem exigir acesso aos dados originais, caso a caso, que são registrados em registros de auditoria.

O mascaramento e a desidentificação são essenciais para o cumprimento regulatório, portanto, o MySQL Enterprise Data Masking e De-Identification pode ajudar os desenvolvedores de aplicativos a atender aos requisitos de privacidade:

* PCI – DSS: Dados de cartões de pagamento. * HIPAA: Privacidade de dados de saúde, Lei de Tecnologia de Informação de Saúde para Saúde Econômica e Clínica (HITECH).

* Diretiva Geral de Proteção de Dados da UE (GDPR): Proteção de Dados Pessoais.

* Lei de Proteção de Dados (Reino Unido): Proteção de Dados Pessoais. * Sarbanes Oxley, GLBA, A Lei Patriota dos EUA, Lei de Detenção de Identidade e Detenção de Assumção de 1998.

* FERPA – Dados de estudantes, NASD, CA SB1386 e AB 1950, leis estaduais de proteção de dados, Basel II.

As seções a seguir descrevem os elementos da Mascaramento de Dados e Desidentificação Empresarial do MySQL, discutem como instalá-los e usá-los, e fornecem informações de referência sobre seus elementos.

### 6.5.1 Elementos de Máscara de Dados e Desidentificação da Empresa MySQL

A Máscara de Dados e Desidentificação Empresarial do MySQL é baseada em uma biblioteca de plugins que implementa esses elementos:

* Um plugin do lado do servidor chamado `data_masking`.
* Um conjunto de funções carregáveis oferece uma API em nível de SQL para realizar operações de mascaramento e desidentificação. Algumas dessas funções exigem o privilégio `SUPER`.

### 6.5.2 Instalar ou Desinstalar Máscara de Dados e Desidentificação Empresarial do MySQL

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Data Masking e De-Identification, que é implementado como um arquivo de biblioteca de plugins que contém um plugin e várias funções carregáveis. Para informações gerais sobre a instalação ou desinstalação de plugins e funções carregáveis, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”, e Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `data_masking`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin e as funções de mascaramento e desidentificação de dados da MySQL Enterprise, use as declarações `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
INSTALL PLUGIN data_masking SONAME 'data_masking.so';
CREATE FUNCTION gen_blacklist RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary_drop RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary_load RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_range RETURNS INTEGER
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_email RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_pan RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_ssn RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_us_phone RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_inner RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_outer RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_pan RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_pan_relaxed RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_ssn RETURNS STRING
  SONAME 'data_masking.so';
```

Se o plugin e as funções forem usadas em um servidor de fonte de replicação, instale-os em todos os servidores replicados também, para evitar problemas de replicação.

Uma vez instalado, conforme descrito anteriormente, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as declarações `UNINSTALL PLUGIN` e `DROP FUNCTION`:

```sql
UNINSTALL PLUGIN data_masking;
DROP FUNCTION gen_blacklist;
DROP FUNCTION gen_dictionary;
DROP FUNCTION gen_dictionary_drop;
DROP FUNCTION gen_dictionary_load;
DROP FUNCTION gen_range;
DROP FUNCTION gen_rnd_email;
DROP FUNCTION gen_rnd_pan;
DROP FUNCTION gen_rnd_ssn;
DROP FUNCTION gen_rnd_us_phone;
DROP FUNCTION mask_inner;
DROP FUNCTION mask_outer;
DROP FUNCTION mask_pan;
DROP FUNCTION mask_pan_relaxed;
DROP FUNCTION mask_ssn;
```

### 6.5.3 Uso do Mascamento de Dados e Desidentificação do MySQL Enterprise

Antes de usar o MySQL Enterprise Data Masking e De-Identification, instale-o de acordo com as instruções fornecidas na Seção 6.5.2, “Instalando ou Desinstalando o MySQL Enterprise Data Masking e De-Identification”.

Para usar o MySQL Enterprise Data Masking e De-Identification em aplicativos, invoque as funções apropriadas para as operações que deseja realizar. Para descrições detalhadas das funções, consulte a Seção 6.5.5, “Descrições das funções de MySQL Enterprise Data Masking e De-Identification”. Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Ela apresenta primeiro uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contexto real:

* Mascarar dados para remover características identificáveis
* Gerar dados aleatórios com características específicas
* Gerar dados aleatórios usando dicionários
* Usar dados mascarados para identificação de clientes
* Criar visualizações que exibam dados mascarados

#### Mascarar dados para remover características identificáveis

O MySQL oferece funções de mascaramento de propósito geral que mascaram strings arbitrárias, e funções de mascaramento de propósito específico que mascaram tipos específicos de valores.

Funções de Máscara para Uso Geral

`mask_inner()` e `mask_outer()` são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string:

* `mask_inner()` mascara o interior do seu argumento de string, deixando as extremidades não mascaradas. Outros argumentos especificam os tamanhos das extremidades não mascaradas.

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

* `mask_outer()` faz o contrário, ocultando as extremidades do seu argumento de string, deixando o interior não ocultado. Outros argumentos especificam os tamanhos das extremidades ocultas.

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

Por padrão, `mask_inner()` e `mask_outer()` usam `'X'` como caractere de mascaramento, mas permitem um argumento opcional de caractere de mascaramento:

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

Funções de Máscara para Finalidades Especiais

Outras funções de mascaramento esperam um argumento de string que representa um tipo específico de valor e o mascara para remover características identificáveis.

Nota

Os exemplos aqui fornecem argumentos de função usando as funções de geração de valores aleatórios que retornam o tipo apropriado de valor. Para mais informações sobre as funções de geração, consulte Gerando dados aleatórios com características específicas.

**Mascamento do número principal da conta do cartão de pagamento.** As funções de mascamento fornecem um mascamento estrito e relaxado dos números principais da conta.

* `mask_pan()` mascara todas as quatro últimas casas do número, exceto as últimas quatro casas:

  ```sql
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

* `mask_pan_relaxed()` é semelhante, mas não mascara os primeiros seis dígitos que indicam o emissor do cartão de pagamento não mascarado:

  ```sql
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**Mascaramento do número de segurança social dos EUA.** `mask_ssn()` mascara todos os dígitos, exceto os últimos quatro do número:

```sql
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

#### Gerando Dados Aleatórios com Características Específicas

Várias funções geram valores aleatórios. Esses valores podem ser usados para testes, simulação, etc.

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

`gen_rnd_pan()` retorna um número de conta principal (PAN) aleatório do cartão de pagamento.

Como não pode ser garantido que o número gerado não esteja atribuído a uma conta de pagamento legítima, o resultado de `gen_rnd_pan()` nunca deve ser exibido, exceto para fins de teste. Para exibição em aplicativos, sempre utilize uma função de mascaramento, como `mask_pan()` ou `mask_pan_relaxed()`. Mostramos esse uso da última função com `gen_rnd_pan()` aqui:

```sql
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

`gen_rnd_ssn()` retorna um número de segurança social dos EUA aleatório, cujas primeiras e segundas partes são escolhidas de cada uma de uma faixa que não é usada para números legítimos:

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

O MySQL Enterprise Data Masking e De-Identification permite que dicionários sejam usados como fontes de valores aleatórios. Para usar um dicionário, ele deve ser carregado primeiro a partir de um arquivo e dado um nome. Cada dicionário carregado se torna parte do registro do dicionário. Os itens podem então ser selecionados de dicionários registrados e usados como valores aleatórios ou como substituições para outros valores.

Um arquivo de dicionário válido tem essas características:

* O conteúdo do arquivo é texto simples, um termo por string.
* Strings vazias são ignoradas.
* O arquivo deve conter pelo menos um termo.

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

Suponha que a variável de sistema `secure_file_priv` esteja definida como `/usr/local/mysql/mysql-files`. Nesse caso, copie os arquivos do dicionário para esse diretório para que o servidor MySQL possa acessá-los. Em seguida, use `gen_dictionary_load()` para carregar os dicionários no registro do dicionário e atribua-lhes nomes:

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

Para selecionar um termo aleatório de um dicionário, use `gen_dictionary()`:

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

Para selecionar um termo aleatório entre vários dicionários, selecione aleatoriamente um dos dicionários e, em seguida, selecione um termo dele:

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

A função `gen_blacklist()` permite que um termo de um dicionário seja substituído por um termo de outro dicionário, o que produz um mascaramento por substituição. Seus argumentos são o termo a ser substituído, o dicionário no qual o termo aparece e o dicionário de onde se escolhe uma substituição. Por exemplo, para substituir uma cidade dos EUA por uma cidade alemã, ou vice-versa, use `gen_blacklist()` da seguinte forma:

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

#### Usando dados mascarados para identificação do cliente

Nos centros de atendimento ao cliente, uma técnica comum de verificação de identidade é pedir aos clientes que forneçam seus últimos quatro dígitos do número de Segurança Social (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

Suponha que uma tabela `customer` contendo registros de clientes tenha essas colunas:

* `id`: Número de identificação do cliente.
* `first_name`: Nome do cliente.
* `last_name`: Sobrenome do cliente.
* `ssn`: Número do CPF do cliente.

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

O aplicativo utilizado pelos representantes do atendimento ao cliente para verificar o SSN do cliente pode executar uma consulta como esta:

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

No entanto, isso expõe o SSN ao representante de atendimento ao cliente, que não precisa ver nada além dos últimos quatro dígitos. Em vez disso, o aplicativo pode usar essa consulta para exibir apenas o SSN mascarado:

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

Por que a função `CONVERT()` foi usada para o argumento do `mask_ssn()`? Porque o `mask_ssn()` requer um argumento de comprimento 11. Assim, embora o `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer mais longa que 11 bytes quando passada para uma função carregável, e ocorre um erro. Converter o valor em uma string binária garante que a função veja um argumento de comprimento 11.

Uma técnica semelhante pode ser necessária para outras funções de mascaramento de dados quando os argumentos de cadeia não têm um conjunto de caracteres de um único byte.

#### Criando visualizações que exibem dados mascarados

Se os dados mascarados de uma tabela forem usados em várias consultas, pode ser conveniente definir uma visão que produza dados mascarados. Dessa forma, as aplicações podem selecionar a partir da visão sem realizar o mascaramento em consultas individuais.

Por exemplo, uma visão de mascaramento na tabela `customer` da seção anterior pode ser definida da seguinte forma:

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

### 6.5.4 Referência à função de mascaramento e desidentificação de dados da MySQL Enterprise

**Tabela 6.35 Funções de Máscara e Desidentificação de Dados da MySQL Enterprise**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name*</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>gen_blacklist()</code></td> <td>Realizar a substituição de termos do dicionário</td> </tr><tr><td><code>gen_dictionary_drop()</code></td> <td>Remova o dicionário do registro</td> </tr><tr><td><code>gen_dictionary_load()</code></td> <td>Carregar o dicionário no registro</td> </tr><tr><td><code>gen_dictionary()</code></td> <td>Retorne um termo aleatório do dicionário</td> </tr><tr><td><code>gen_range()</code></td> <td>Gerar número aleatório dentro do intervalo</td> </tr><tr><td><code>gen_rnd_email()</code></td> <td>Gerar endereço de e-mail aleatório</td> </tr><tr><td><code>gen_rnd_pan()</code></td> <td>Gerar número de conta principal de cartão de pagamento aleatório</td> </tr><tr><td><code>gen_rnd_ssn()</code></td> <td>Gerar um número de segurança social aleatório dos EUA</td> </tr><tr><td><code>gen_rnd_us_phone()</code></td> <td>Gerar número de telefone aleatório dos EUA</td> </tr><tr><td><code>mask_inner()</code></td> <td>Parte interna da máscara de cordas</td> </tr><tr><td><code>mask_outer()</code></td> <td>Máscara esquerda e direita das partes da corda</td> </tr><tr><td><code>mask_pan()</code></td> <td>Número do cartão de pagamento da máscara, parte da cadeia de caracteres</td> </tr><tr><td><code>mask_pan_relaxed()</code></td> <td>Número do cartão de pagamento da máscara, parte da cadeia de caracteres</td> </tr><tr><td><code>mask_ssn()</code></td> <td>Máscara o Número de Segurança Social dos EUA</td> </tr></tbody></table>

### 6.5.5 Descrição das funções de mascaramento e desidentificação de dados da MySQL Enterprise

A biblioteca de plugins de mascaramento de dados e desidentificação da MySQL Enterprise inclui várias funções, que podem ser agrupadas nessas categorias:

* Funções de Máscara de Dados
* Funções de Geração de Dados Aleatórios
* Funções com Dicionário de Dados Aleatórios

Essas funções tratam argumentos de cadeia como strings binárias (o que significa que elas não distinguem maiúsculas e minúsculas), e os valores de retorno de cadeia são strings binárias. Se um valor de retorno de cadeia deve estar em um conjunto de caracteres diferente, converta-o. O exemplo a seguir mostra como converter o resultado de `gen_rnd_email()` para o conjunto de caracteres `utf8mb4`:

```sql
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

Também pode ser necessário converter argumentos de cadeia, conforme ilustrado em Usar dados mascarados para identificação do cliente.

Se uma função de Máscara de dados empresariais e desidentificação do MySQL for invocada dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando do MySQL”.

#### Funções de Máscara de Dados

Cada função nesta seção realiza uma operação de mascaramento em seu argumento de string e retorna o resultado mascarado.

* `mask_inner(str, margin1, margin2 [, mask_char])`

Mascara a parte interna de uma cadeia, deixando as extremidades intocadas e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar.  
  + *`margin1`*: Um número inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string que devem permanecer não mascarados. Se o valor for 0, nenhum caractere do extremo esquerdo permanecerá não mascarado.

+ *`margin2`*: Um número inteiro não negativo que especifica o número de caracteres no final direito da string que devem permanecer não mascarados. Se o valor for 0, nenhum caractere no final direito permanece não mascarado.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

O caractere de mascaramento deve ser um caractere de um único byte. As tentativas de usar um caractere multibyte produzem um erro.

Valor de retorno:

A string mascarada, ou `NULL`, se qualquer uma das margens for negativa.

Se a soma dos valores da margem for maior que o comprimento do argumento, não ocorre mascaramento e o argumento é devolvido inalterado.

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

* `mask_outer(str, margin1, margin2 [, mask_char])`

Mascara as extremidades esquerda e direita de uma cadeia, deixando o interior não mascarado e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar.  
  + *`margin1`*: Um número inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string a ser mascarada. Se o valor for 0, os caracteres do extremo esquerdo não serão mascarados.

+ *`margin2`*: Um número inteiro não negativo que especifica o número de caracteres no final direito da string a ser mascarado. Se o valor for 0, os caracteres do final direito não serão mascarados.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

O caractere de mascaramento deve ser um caractere de um único byte. As tentativas de usar um caractere multibyte produzem um erro.

Valor de retorno:

A string mascarada, ou `NULL` se qualquer margem for negativa.

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

* `mask_pan(str)`

Coloca em sigilo o número do cartão de pagamento da Conta Principal e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`.

Argumentos:

+ *`str`*: A string para mascarar. A string deve ter um comprimento adequado para o Número de Conta Primária, mas não é verificada de outra forma.

Valor de retorno:

O número de pagamento mascarado como uma string. Se o argumento for menor que o necessário, ele é retornado inalterado.

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

* `mask_pan_relaxed(str)`

Coloca em sigilo o número principal da conta do cartão de pagamento e retorna o número com todos os dígitos, exceto os seis primeiros e os quatro últimos, substituídos por caracteres `'X'`. Os seis primeiros dígitos indicam o emissor do cartão de pagamento.

Argumentos:

+ *`str`*: A string para mascarar. A string deve ter um comprimento adequado para o Número de Conta Primária, mas não é verificada de outra forma.

Valor de retorno:

O número de pagamento mascarado como uma string. Se o argumento for menor que o necessário, ele é retornado inalterado.

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

* `mask_ssn(str)`

Coloca um número de Segurança Social dos EUA em sigilo e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`.

Argumentos:

+ *`str`*: A string para mascarar. A string deve ter 11 caracteres, mas não é verificada de outra forma.

Valor de retorno:

O número da Segurança Social mascarado como uma string, ou `NULL` se o argumento não tiver o comprimento correto.

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

* `gen_range(lower, upper)`

Gera um número aleatório escolhido de um intervalo especificado.

Argumentos:

+ *`lower`*: Um número inteiro que especifica o limite inferior da faixa.

+ *`upper`*: Um número inteiro que especifica o limite superior da faixa, que não deve ser menor que o limite inferior.

Valor de retorno:

Um número inteiro aleatório na faixa de *`lower`* a *`upper`*, inclusive, ou `NULL` se o argumento *`upper`* for menor que *`lower`*.

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

* `gen_rnd_email()`

Gera um endereço de e-mail aleatório no domínio `example.com`.

Argumentos:

  None.

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

* `gen_rnd_pan([size])`

Gera um número de conta principal de cartão de pagamento aleatório. O número passa na verificação Luhn (um algoritmo que realiza uma verificação de controle de checksum contra um dígito de verificação).

Aviso

Os valores retornados de `gen_rnd_pan()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não é possível garantir que um determinado valor de retorno não seja atribuído a uma conta de pagamento legítima. Se for necessário publicar um resultado de `gen_rnd_pan()`, considere mascará-lo com `mask_pan()` ou `mask_pan_relaxed()`.

Argumentos:

+ *`size`*: (Opcional) Um número inteiro que especifica o tamanho do resultado. O padrão é 16 se *`size`* não for fornecido. Se fornecido, *`size`* deve ser um número inteiro no intervalo de 12 a 19.

Valor de retorno:

Um número de pagamento aleatório como uma string, ou `NULL` se um argumento *`size`* fora do intervalo permitido for fornecido.

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

* `gen_rnd_ssn()`

Gera um número aleatório do Seguro Social dos EUA no formato `AAA-BB-CCCC`. A parte *`AAA`* é maior que 900 e a parte *`BB`* é menor que 70; esses valores estão fora das faixas utilizadas para números legítimos do Seguro Social.

Argumentos:

  None.

Valor de retorno:

Um número aleatório da Previdência como uma string.

Exemplo:

  ```sql
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

* `gen_rnd_us_phone()`

Gera um número de telefone aleatório dos EUA no formato `1-555-AAA-BBBB`. O código de área 555 não é usado para números de telefone legítimos.

Argumentos:

  None.

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

#### Funções aleatórias baseadas em dicionário de dados

As funções desta seção manipulam dicionários de termos e realizam operações de geração e mascaramento com base neles. Algumas dessas funções exigem o privilégio `SUPER`.

Quando um dicionário é carregado, ele se torna parte do registro do dicionário e recebe um nome que será usado por outras funções do dicionário. Os dicionários são carregados a partir de arquivos de texto simples que contêm um termo por string. Strings vazias são ignoradas. Para ser válido, um arquivo de dicionário deve conter pelo menos uma string não vazia.

* `gen_blacklist(str, dictionary_name, replacement_dictionary_name)`

Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição.

Argumentos:

+ *`str`*: Uma cadeia de caracteres que indica o termo a ser substituído.

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário que contém o termo a ser substituído.

+ *`replacement_dictionary_name`*: Uma cadeia que nomeia o dicionário a partir do qual se deve escolher o termo de substituição.

Valor de retorno:

Uma cadeia aleatoriamente escolhida de *`replacement_dictionary_name`* como substituição para *`str`*, ou *`str`* se não aparecer em *`dictionary_name`*, ou `NULL` se nenhum dos nomes do dicionário estiver no registro do dicionário.

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

* `gen_dictionary(dictionary_name)`

Retorna um termo aleatório de um dicionário.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário a partir do qual se deve escolher o termo.

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

* `gen_dictionary_drop(dictionary_name)`

Remove um dicionário do registro de dicionários.

Essa função requer o privilégio `SUPER`.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário a ser removido do registro do dicionário.

Valor de retorno:

Uma cadeia que indica se a operação de queda foi bem-sucedida. `Dictionary removed` indica sucesso. `Dictionary removal error` indica falha.

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

* `gen_dictionary_load(dictionary_path, dictionary_name)`

Carrega um arquivo no registro do dicionário e atribui ao dicionário um nome a ser usado com outras funções que exigem um argumento de nome do dicionário.

Essa função requer o privilégio `SUPER`.

Importante

Os dicionários não são persistentes. Qualquer dicionário utilizado por aplicativos deve ser carregado para cada inicialização do servidor.

Uma vez carregado no registro, um dicionário é usado como está, mesmo que o arquivo de dicionário subjacente mude. Para recarregar um dicionário, primeiro descarregue-o com `gen_dictionary_drop()`, em seguida, carregue-o novamente com `gen_dictionary_load()`.

Argumentos:

+ *`dictionary_path`*: Uma cadeia que especifica o nome do caminho do arquivo do dicionário.

+ *`dictionary_name`*: Uma string que fornece um nome para o dicionário.

Valor de retorno:

Uma cadeia que indica se a operação de carregamento foi bem-sucedida. `Dictionary load success` indica sucesso. `Dictionary load error` indica falha. A falha na carga do dicionário pode ocorrer por vários motivos, incluindo:

+ Um dicionário com o nome dado já está carregado.
+ O arquivo do dicionário não foi encontrado.
+ O arquivo do dicionário não contém termos.
+ A variável de sistema `secure_file_priv` está definida e o arquivo do dicionário não está localizado no diretório nomeado pela variável.

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
