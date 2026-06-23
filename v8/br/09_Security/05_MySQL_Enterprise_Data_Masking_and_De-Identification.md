## 8.5 Mascagem de dados e desidentificação da Enterprise MySQL

Nota

A Máscara de Dados e Desidentificação Empresarial do MySQL é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL oferece capacidades de mascaramento e desidentificação de dados:

* Transformação dos dados existentes para mascará-los e removê-los características identificáveis, como alterar todos os dígitos de um número de cartão de crédito, mas os últimos quatro para `'X'` caracteres.

* Geração de dados aleatórios, como endereços de e-mail e números de cartões de pagamento.

* Substituição de dados por dados de dicionários armazenados no banco de dados. Os dicionários são facilmente replicados de uma maneira padrão. A administração é restrita a usuários autorizados que recebem privilégios especiais para que apenas eles possam criar e modificar os dicionários.

Nota

A Máscara de dados e desidentificação empresarial do MySQL foi implementada originalmente no MySQL 8.0.13 como uma biblioteca de plugins. A partir do MySQL 8.0.33, a Edição Empresarial do MySQL também oferece componentes para acessar as capacidades de mascaramento de dados e desidentificação. Para informações sobre as semelhanças e diferenças, consulte a Tabela 8.45, “Comparação entre componentes de mascaramento de dados e elementos de plugins”.

Se você estiver usando o MySQL Enterprise Data Masking e De-Identification pela primeira vez, considere instalar os componentes para acesso aos aprimoramentos contínuos, que estão disponíveis apenas com a infraestrutura de componentes.

A forma como as aplicações utilizam essas capacidades depende do propósito para o qual os dados são utilizados e quem os acessa:

* Aplicações que utilizam dados sensíveis podem protegê-los realizando o mascaramento de dados e permitindo o uso de dados parcialmente mascarados para identificação do cliente. Exemplo: Um centro de atendimento pode solicitar que os clientes forneçam seus últimos quatro dígitos do Número de Seguro Social.

* Aplicativos que exigem dados formatados corretamente, mas não necessariamente os dados originais, podem sintetizar dados de amostra. Exemplo: um desenvolvedor de aplicativos que está testando validadores de dados, mas não tem acesso aos dados originais, pode sintetizar dados aleatórios com o mesmo formato.

* Aplicações que devem substituir um nome real por um termo de dicionário para proteger informações sensíveis, mas ainda fornecer conteúdo realista para os usuários da aplicação. Exemplo: Um usuário em treinamento que está restrito a visualizar endereços recebe um termo aleatório do dicionário `city names` em vez do nome real da cidade. Uma variante deste cenário pode ser que o nome real da cidade seja substituído apenas se ele existir em `usa_city_names`.

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

### 8.5.1 Componentes de mascaramento de dados versus o plugin de mascaramento de dados

Antes da versão 8.0.33, o MySQL habilitava capacidades de mascaramento e desidentificação usando um plugin do lado do servidor, mas passou a usar a infraestrutura do componente no MySQL 8.0.33. O quadro a seguir compara brevemente os componentes de Mascaramento de Dados e Desidentificação do MySQL Enterprise e a biblioteca de plugins para fornecer uma visão geral de suas diferenças. Isso pode ajudá-lo a fazer a transição do plugin para os componentes.

Nota

Apenas os componentes de mascaramento de dados ou o plugin devem ser habilitados de cada vez. Habilitar ambos os componentes e o plugin não é suportado e os resultados podem não ser os esperados.

**Tabela 8.45 Comparação entre componentes de mascaramento de dados e elementos de plugin**

<table><col width="50%"/><col width="25%"/><col width="25%"/><thead><tr> <th scope="col">Category</th> <th scope="col">Components</th> <th scope="col">Plugin</th> </tr></thead><tbody><tr> <th scope="row">Interface</th> <td>Service functions, loadable functions</td> <td>Loadable functions</td> </tr><tr> <th scope="row">Suporte para conjuntos de caracteres multibyte</th> <td>Sim, para funções de mascaramento de uso geral</td> <td>Não</td> </tr><tr> <th scope="row">Funções de mascaramento para uso geral</th> <td><code>mask_inner()</code>,<code>mask_outer()</code></td> <td><code>mask_inner()</code>,<code>mask_outer()</code></td> </tr><tr> <th scope="row">Mascaramento de tipos específicos</th> <td>PAN, SSN, IBAN, UUID, SIN do Canadá, NIN do Reino Unido</td> <td>PAN, SSN</td> </tr><tr> <th scope="row">Geração aleatória, tipos específicos</th> <td>e-mail, telefone dos EUA, PAN, CPF, IBAN, UUID, SIN do Canadá, NIN do Reino Unido</td> <td>e-mail, telefone dos EUA, PAN, SSN</td> </tr><tr> <th scope="row">Geração aleatória de número inteiro dentro de um intervalo dado</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Persisting substitution dictionaries</th> <td>Database</td> <td>File</td> </tr><tr> <th scope="row">Privilege to manage dictionaries</th> <td>Dedicated privilege</td> <td>FILE</td> </tr><tr> <th scope="row">Automated loadable-function registration/deregistration during installation/uninstallation</th> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Melhorias nas funções existentes</th> <td>Mais argumentos adicionados ao<code>gen_rnd_email()</code>função</td> <td>N/A</td> </tr></tbody></table>

### 8.5.2 Componentes de Máscara de Dados e Desidentificação Empresarial do MySQL

A Máscara de Dados e Desidentificação Empresarial do MySQL implementa esses elementos:

* Uma tabela no banco de dados do sistema `mysql` para armazenamento persistente de dicionários e termos.

* Um componente chamado `component_masking` que implementa a funcionalidade de mascaramento e expõe-a como uma interface de serviço para os desenvolvedores.

Os desenvolvedores que desejam incorporar as mesmas funções de serviço usadas pelo `component_masking` devem consultar o arquivo `internal\components\masking\component_masking.h` em uma distribuição de fonte MySQL ou https://dev.mysql.com/doc/dev/mysql-server/latest.

* Um componente chamado `component_masking_functions` que fornece funções carregáveis.

O conjunto de funções carregáveis permite uma API em nível de SQL para realizar operações de mascaramento e desidentificação. Algumas das funções exigem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.

#### 8.5.2.1 Instalação do componente de mascaramento e desidentificação de dados da MySQL Enterprise

A partir do MySQL 8.0.33, os componentes fornecem acesso à funcionalidade de Máscara de Dados e Desidentificação da MySQL Enterprise. Anteriormente, o MySQL implementou as capacidades de mascaramento e desidentificação como um arquivo de biblioteca de plugins que contém um plugin e várias funções carregáveis. Antes de começar a instalação do componente, remova o plugin `data_masking` e todas as suas funções carregáveis para evitar conflitos. Para obter instruções, consulte a Seção 8.5.3.1, “Instalação do Plugin de Máscara de Dados e Desidentificação da MySQL Enterprise”.

As tabelas e componentes de banco de dados de MySQL Enterprise Data Masking e De-Identification são:

* tabela `masking_dictionaries`

Propósito: Uma tabela no esquema do sistema `mysql` que fornece armazenamento persistente de dicionários e termos.

* componente `component_masking`

Propósito: O componente implementa o núcleo da funcionalidade de mascaramento e o expõe como serviços.

URN: `file://component_masking`

* componente `component_masking_functions`

Objetivo: O componente expõe todas as funcionalidades do componente `component_masking` como funções carregáveis. Algumas das funções requerem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.

URN: `file://component_masking_functions`

Para configurar o MySQL Enterprise Data Masking e De-Identification, faça o seguinte:

1. Crie a tabela `masking_dictionaries`.

   ```
   CREATE TABLE IF NOT EXISTS
   mysql.masking_dictionaries(
       Dictionary VARCHAR(256) NOT NULL,
       Term VARCHAR(256) NOT NULL,
       UNIQUE INDEX dictionary_term_idx (Dictionary, Term),
       INDEX dictionary_idx (Dictionary)
   ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Use a instrução SQL `INSTALL COMPONENT` para instalar componentes de mascaramento de dados.

   ```
   INSTALL COMPONENT 'file://component_masking';
   INSTALL COMPONENT 'file://component_masking_functions';
   ```

Se os componentes e funções forem usados em um servidor de fonte de replicação, instale-os em todos os servidores replicados também para evitar problemas de replicação. Enquanto os componentes forem carregados, as informações sobre eles estarão disponíveis conforme descrito na Seção 7.5.2, “Obtenção de Informações de Componentes”.

Para remover o mascaramento de dados e a desidentificação do MySQL Enterprise, faça o seguinte:

1. Use a instrução SQL `UNINSTALL COMPONENT` para desinstalar os componentes de mascaramento de dados.

   ```
   UNINSTALL COMPONENT 'file://component_masking_functions';
   UNINSTALL COMPONENT 'file://component_masking';
   ```

2. Descarte a tabela `masking_dictionaries`.

   ```
   DROP TABLE mysql.masking_dictionaries;
   ```

`component_masking_functions` instala todas as funções carregáveis relacionadas automaticamente. Da mesma forma, o componente, quando desinstalado, desinstala automaticamente essas funções. Para informações gerais sobre a instalação ou desinstalação de componentes, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

#### 8.5.2.2 Usando componentes de mascaramento de dados e desidentificação da MySQL Enterprise

Antes de usar o MySQL Enterprise Data Masking e De-Identification, instale-o de acordo com as instruções fornecidas na Seção 8.5.2.1, “Instalação do componente de MySQL Enterprise Data Masking e De-Identification”.

Para usar o MySQL Enterprise Data Masking e De-Identification em aplicativos, invoque as funções apropriadas para as operações que você deseja realizar. Para descrições detalhadas das funções, consulte a Seção 8.5.2.4, “Descritores de Função do Componente de MySQL Enterprise Data Masking e De-Identification”. Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Ela apresenta primeiro uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contexto real:

* Mascarar dados para remover características identificáveis
* Gerar dados aleatórios com características específicas
* Gerar dados aleatórios usando dicionários
* Usar dados mascarados para identificação de clientes
* Criar visualizações que exibam dados mascarados

##### Mascarar dados para remover características identificáveis

O MySQL oferece funções de mascaramento de componentes de propósito geral que mascaram strings arbitrárias, e funções de mascaramento de propósito específico que mascaram tipos específicos de valores.

###### Funções dos componentes de mascaramento para uso geral

`mask_inner()` e `mask_outer()` são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string. Ambas as funções suportam uma string de entrada que é codificada em qualquer conjunto de caracteres:

* `mask_inner()` mascara o interior do seu argumento de string, deixando as extremidades não mascaradas. Outros argumentos especificam os tamanhos das extremidades não mascaradas.

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

* `mask_outer()` faz o contrário, ocultando as extremidades do seu argumento de string, deixando o interior não ocultado. Outros argumentos especificam os tamanhos das extremidades ocultas.

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

Por padrão, `mask_inner()` e `mask_outer()` utilizam `'X'` como caractere de mascaramento, mas permitem um argumento opcional de caractere de mascaramento:

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

###### Funções de Componentes de Máscara para Finalidades Especiais

Outras funções de mascaramento esperam um argumento de string que representa um tipo específico de valor e o mascara para remover características identificáveis.

Nota

Os exemplos aqui fornecem argumentos de função usando as funções de geração de valores aleatórios que retornam o tipo apropriado de valor. Para mais informações sobre as funções de geração, consulte Gerando dados aleatórios com características específicas.

**Mascamento do número principal da conta do cartão de pagamento.** As funções de mascamento fornecem um mascamento estrito e relaxado dos números principais da conta.

* `mask_pan()` mascara todas as quatro últimas casas do número, exceto as últimas quatro casas:

  ```
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

* `mask_pan_relaxed()` é semelhante, mas não mascara os primeiros seis dígitos que indicam o emissor do cartão de pagamento não mascarado:

  ```
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**Mascaramento do número da conta bancária internacional.** `mask_iban()` mascara todas as letras, exceto as duas primeiras (que indicam o país):

```
mysql> SELECT mask_iban(gen_rnd_iban());
+---------------------------+
| mask_iban(gen_rnd_iban()) |
+---------------------------+
| ZZ** **** **** ****       |
+---------------------------+
```

Mascaramento do Identificador Único Universal. `mask_uuid()` mascara todos os caracteres significativos:

```
mysql> SELECT mask_uuid(gen_rnd_uuid());
+--------------------------------------+
| mask_uuid(gen_rnd_uuid())            |
+--------------------------------------+
| ********-****-****-****-************ |
+--------------------------------------+
```

**Mascaramento do número de segurança social dos EUA.** `mask_ssn()` mascara todos os dígitos, exceto os últimos quatro do número:

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

**Mascaramento do Número de Seguro Nacional do Reino Unido.** `mask_uk_nin()` mascara todos os dígitos, exceto os dois primeiros:

```
mysql> SELECT mask_uk_nin(gen_rnd_uk_nin());
+-------------------------------+
| mask_uk_nin(gen_rnd_uk_nin()) |
+-------------------------------+
| ZH*******                     |
+-------------------------------+
```

##### Gerando Dados Aleatórios com Características Específicas

Várias funções de componentes geram valores aleatórios. Esses valores podem ser usados para testes, simulação, etc.

`gen_range()` retorna um número inteiro aleatório selecionado de um intervalo dado:

```
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

`gen_rnd_uk_nin()` retorna um Número de Seguro Nacional (NIN) aleatório do Reino Unido.

Como não pode ser garantido que o número gerado não tenha sido atribuído, o resultado de `gen_rnd_uk_nin()` nunca deve ser exibido (exceto possivelmente em testes). Para exibição em aplicativos voltados para o usuário, sempre utilize uma função de mascaramento, como `mask_uk_nin()`, conforme mostrado aqui:

```
mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
+---------------------------------+
| mask_uk_nin( gen_rnd_uk_nin() ) |
+---------------------------------+
| OE*******                       |
+---------------------------------+
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

`gen_rnd_iban()` retorna um número escolhido de uma faixa que não é usada para números legítimos:

```
mysql> SELECT gen_rnd_iban('XO', 24);
+-------------------------------+
| gen_rnd_iban('XO', 24)        |
+-------------------------------+
| XO25 SL7A PGQR B9NN 6IVB RFE8 |
+-------------------------------+
```

`gen_rnd_pan()` retorna um número de conta primário (PAN) de cartão de pagamento aleatório.

Como não pode ser garantido que o número gerado não esteja atribuído a uma conta de pagamento legítima, o resultado de `gen_rnd_pan()` nunca deve ser exibido, exceto para fins de teste. Para exibição em aplicativos, sempre utilize uma função de mascaramento, como `mask_pan()` ou `mask_pan_relaxed()`. Mostramos esse uso da última função com `gen_rnd_pan()` aqui:

```
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

`gen_rnd_ssn()` retorna um número de segurança social dos EUA aleatório, cuja primeira parte é escolhida de uma faixa não utilizada para números legítimos:

```
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

`gen_rnd_us_phone()` retorna um número de telefone aleatório dos EUA no código de área 555 que não é usado para números legítimos:

```
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

`gen_rnd_uuid()` retorna um número escolhido em um intervalo não utilizado para identificadores legítimos:

```
mysql> SELECT gen_rnd_uuid();
+--------------------------------------+
| gen_rnd_uuid()                       |
+--------------------------------------+
| 68946384-6880-3150-6889-928076732539 |
+--------------------------------------+
```

##### Gerando Dados Aleatórios Usando Dicionários

A Máscara de Dados e a Desidentificação Empresarial do MySQL permitem que dicionários sejam usados como fontes de valores aleatórios chamados *termos*. Para usar um dicionário, ele deve primeiro ser adicionado à tabela do sistema `masking_dictionaries` e receber um nome. Os dicionários são lidos da tabela e carregados na cache durante a inicialização dos componentes (na inicialização do servidor). Os termos podem então ser adicionados, removidos e selecionados dos dicionários e usados como valores aleatórios ou como substituições para outros valores.

Nota

Sempre edite dicionários usando funções de administração de dicionário em vez de modificar a tabela diretamente. Se você manipular a tabela manualmente, o cache do dicionário se torna inconsistente com a tabela.

Uma tabela válida `masking_dictionaries` tem essas características:

* Um administrador criou a tabela do sistema `masking_dictionaries` no esquema `mysql` da seguinte forma:

  ```
  CREATE TABLE IF NOT EXISTS
  masking_dictionaries(
      Dictionary VARCHAR(256) NOT NULL,
      Term VARCHAR(256) NOT NULL,
      UNIQUE INDEX dictionary_term_idx (Dictionary, Term),
      INDEX dictionary_idx (Dictionary)
  ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
  ```

* O privilégio MASKING_DICTIONARY_ADMIN é necessário para adicionar e remover termos ou para remover um dicionário inteiro.

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

Para selecionar um termo aleatório entre vários dicionários, selecione aleatoriamente um dos dicionários e, em seguida, selecione um termo dele:

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

A função `gen_blocklist()` permite que um termo de um dicionário seja substituído por um termo de outro dicionário, o que produz um mascaramento por substituição. Seus argumentos são o termo a ser substituído, o dicionário no qual o termo aparece e o dicionário de onde se escolhe uma substituição. Por exemplo, para substituir uma cidade dos EUA por uma cidade alemã, ou vice-versa, use `gen_blocklist()` da seguinte forma:

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

##### Uso de dados mascarados para identificação do cliente

Nos centros de atendimento ao cliente, uma técnica comum de verificação de identidade é pedir aos clientes que forneçam seus últimos quatro dígitos do Número de Seguro Social (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

Suponha que uma tabela `customer` contendo registros de clientes tenha essas colunas:

* `id`: Número do CPF do cliente.
* `first_name`: Nome do cliente.
* `last_name`: Sobrenome do cliente.
* `ssn`: Número do CPF do cliente.

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

O aplicativo utilizado pelos representantes do atendimento ao cliente para verificar o SSN do cliente pode executar uma consulta como esta:

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

Agora, o representante vê apenas o que é necessário, e a privacidade do cliente é preservada.

Por que a função `CONVERT()` foi usada para o argumento do `mask_ssn()`? Porque o `mask_ssn()` requer um argumento de comprimento 11. Assim, embora o `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer mais longa do que 11 bytes quando passada para uma função carregável, e retorna `NULL` ao registrar o erro. Converter o valor em uma string binária garante que a função veja um argumento de comprimento 11.

Uma técnica semelhante pode ser necessária para outras funções de mascaramento de dados quando os argumentos de cadeia não têm um conjunto de caracteres de um único byte.

##### Criando visualizações que exibem dados mascarados

Se os dados mascarados de uma tabela forem usados em várias consultas, pode ser conveniente definir uma visão que produza dados mascarados. Dessa forma, as aplicações podem selecionar a partir da visão sem realizar o mascaramento em consultas individuais.

Por exemplo, uma visão de mascaramento na tabela `customer` da seção anterior pode ser definida da seguinte forma:

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

#### 8.5.2.3 Referência ao componente de mascaramento de dados e desidentificação da MySQL Enterprise Data

**Tabela 8.46 Funções dos componentes de mascaramento de dados e desidentificação do MySQL Enterprise**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>gen_blocklist()</code></th> <td> Perform dictionary term replacement </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_dictionary()</code></th> <td> Return random term from dictionary </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_range()</code></th> <td> Generate random number within range </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_canada_sin()</code></th> <td>Gerar um Número de Seguro Social aleatório do Canadá</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_email()</code></th> <td> Generate random email address </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_iban()</code></th> <td>Gerar um Número de Conta Bancária Internacional aleatório</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_pan()</code></th> <td>Gerar número de conta principal de cartão de pagamento aleatório</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_ssn()</code></th> <td>Gerar um número de segurança social aleatório dos EUA</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_uk_nin()</code></th> <td>Gerar um Número de Seguro Nacional do Reino Unido aleatório</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_us_phone()</code></th> <td> Generate random US phone number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_uuid()</code></th> <td> Generate random Universally Unique Identifier </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_canada_sin()</code></th> <td> Mask Canada Social Insurance Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_iban()</code></th> <td> Mask International Bank Account Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_inner()</code></th> <td> Mask interior part of string </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_outer()</code></th> <td>Máscara esquerda e direita das partes da corda</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_pan()</code></th> <td>Número do cartão de pagamento da máscara, parte da cadeia de caracteres</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_pan_relaxed()</code></th> <td>Número do cartão de pagamento da máscara, parte da cadeia de caracteres</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_ssn()</code></th> <td> Mask US Social Security Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_uk_nin()</code></th> <td>Máscara Número de Seguro Nacional do Reino Unido</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_uuid()</code></th> <td>Identificador de Identificador Universal da Máscara parte da cadeia</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>masking_dictionary_remove()</code></th> <td>Remova o dicionário da tabela do banco de dados</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>masking_dictionary_term_add()</code></th> <td>Adicione um novo termo ao dicionário</td> <td>8.0.33</td> </tr><tr><th scope="row"><code>masking_dictionary_term_remove()</code></th> <td>Remova o termo existente do dicionário</td> <td>8.0.33</td> </tr></tbody></table>

#### 8.5.2.4 Descrições das funções do componente de mascaramento e desidentificação de dados da MySQL Enterprise

Os componentes de Máscara de dados empresariais e desidentificação do MySQL Enterprise incluem várias funções, que podem ser agrupadas nessas categorias:

* Funções de Componentes de Mascaramento de Dados * Funções de Componentes de Geração de Dados Aleatórios * Funções de Administração de Componentes de Mascaramento de Dicionário * Funções de Componentes de Geração de Dicionário

##### Funções dos Componentes de Máscara de Dados

Cada função de componente nesta seção realiza uma operação de mascaramento em seu argumento de string e retorna o resultado mascarado.

* `mask_canada_sin(str [, mask_char])`(data-masking-component-functions.html#function_mask-canada-sin)

Mascara um Número de Seguro Social do Canadá (SIN) e retorna o número com todos os dígitos significativos substituídos por caracteres `'X'`. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar. Os formatos aceitos são:

- Nove dígitos não separados.  
- Nove dígitos agrupados em padrão: `xxx-xxx-xxx` (`-` é qualquer caractere de separador).

Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

Valor de retorno:

O Canadá SIN mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL`, se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

* `mask_iban(str [, mask_char])`(data-masking-component-functions.html#function_mask-iban)

Coloca uma máscara em um número de conta bancária internacional (IBAN) e retorna o número com todas as letras, exceto as duas primeiras (que indicam o país), substituídas por caracteres `'*'`. Um caractere de máscara opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar. Cada país pode ter um sistema de numeração nacional de roteamento ou conta diferente, com um mínimo de 13 e um máximo de 34 caracteres alfanuméricos ASCII. Os formatos aceitos são:

- Caracteres não separados.  
- Caracteres agrupados por quatro, exceto o último grupo, e separados por espaço ou qualquer outro caractere de separador (por exemplo: `xxxx-xxxx-xxxx-xx`).

Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se *`mask_char`* não for fornecido.

Valor de retorno:

O número de conta bancária internacional mascarado como uma cadeia codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL`, se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

* `mask_inner(str, margin1, margin2 [, mask_char])`(data-masking-component-functions.html#function_mask-inner)

Mascara a parte interna de uma cadeia, deixando as extremidades intocadas e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

`mask_inner` suporta todos os conjuntos de caracteres.

Argumentos:

+ *`str`*: A string para mascarar. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`margin1`*: Um número inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string que devem permanecer não mascarados. Se o valor for 0, nenhum caractere do extremo esquerdo permanece não mascarado.

+ *`margin2`*: Um número inteiro não negativo que especifica o número de caracteres no final direito da string que devem permanecer não mascarados. Se o valor for 0, nenhum caractere no final direito permanece não mascarado.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

Valor de retorno:

A string mascarada codificada no mesmo conjunto de caracteres utilizado para *`str`*, ou um erro se qualquer uma das margens for negativa.

Se a soma dos valores da margem for maior que o comprimento do argumento, não ocorre mascaramento e o argumento é devolvido inalterado.

Nota

A função é otimizada para funcionar mais rápido para strings de único byte (com comprimento de byte igual ao comprimento do caractere). Por exemplo, o conjunto de caracteres `utf8mb4` usa apenas um byte para caracteres ASCII, então a função processa strings que contêm apenas caracteres ASCII como strings de caracteres de único byte.

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

* `mask_outer(str, margin1, margin2 [, mask_char])`(data-masking-component-functions.html#function_mask-outer)

Mascara as extremidades esquerda e direita de uma cadeia, deixando o interior não mascarado e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

`mask_outer` suporta todos os conjuntos de caracteres.

Argumentos:

+ *`str`*: A string para mascarar. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`margin1`*: Um número inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string a ser mascarado. Se o valor for 0, os caracteres do extremo esquerdo não serão mascarados.

+ *`margin2`*: Um número inteiro não negativo que especifica o número de caracteres no final direito da string a ser mascarado. Se o valor for 0, os caracteres do final direito não serão mascarados.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

Valor de retorno:

A string mascarada codificada no mesmo conjunto de caracteres utilizado para *`str`*, ou um erro se qualquer uma das margens for negativa.

Se a soma dos valores da margem for maior que o comprimento do argumento, todo o argumento será mascarado.

Nota

A função é otimizada para funcionar mais rápido para strings de único byte (com comprimento de byte igual ao comprimento do caractere). Por exemplo, o conjunto de caracteres `utf8mb4` usa apenas um byte para caracteres ASCII, então a função processa strings que contêm apenas caracteres ASCII como strings de caracteres de único byte.

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

* `mask_pan(str [, mask_char])`(data-masking-component-functions.html#function_mask-pan)

Mascara um número de conta de cartão de pagamento (PAN) principal e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar. A string deve conter um mínimo de 14 e um máximo de 19 caracteres alfanuméricos. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

Valor de retorno:

O número de pagamento mascarado como uma cadeia codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

* `mask_pan_relaxed(str)`

Coloca em sigilo o número principal da conta do cartão de pagamento e retorna o número com todos os dígitos, exceto os seis primeiros e os quatro últimos, substituídos por caracteres `'X'`. Os seis primeiros dígitos indicam o emissor do cartão de pagamento. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar. A string deve ter um comprimento adequado para o Número de Conta Primária, mas não é verificada de outra forma. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

Valor de retorno:

O número de pagamento mascarado como uma cadeia codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

* `mask_ssn(str [, mask_char])`(data-masking-component-functions.html#function_mask-ssn)

Mascara um número de segurança social dos EUA (SSN) e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'*'`. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar. Os formatos aceitos são:

- Nove dígitos não separados.  
- Nove dígitos agrupados em padrão: `xxx-xx-xxxx` (`-` é qualquer caractere de separador).

Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se *`mask_char`* não for fornecido.

Valor de retorno:

O Número de Segurança Social mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

* `mask_uk_nin(str [, mask_char])`(data-masking-component-functions.html#function_mask-uk-nin)

Mascara um Número de Seguro do Reino Unido (UK NIN) e retorna o número com todos os dígitos, exceto os dois primeiros, substituídos por caracteres `'*'`. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar. Os formatos aceitos são:

- Nove dígitos não separados.  
- Nove dígitos agrupados em padrão: `xxx-xx-xxxx` (`-` é qualquer caractere de separador).

- Nove dígitos agrupados em padrão: `xx-xxxxxx-x` (`-` é qualquer caractere de separador).

Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se *`mask_char`* não for fornecido.

Valor de retorno:

O NIN mascarado do Reino Unido como uma cadeia codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

* `mask_uuid(str [, mask_char])`(data-masking-component-functions.html#function_mask-uuid)

Coloca uma máscara de Identificador Universalmente Único (UUID) e retorna o número com todos os caracteres significativos substituídos por caracteres `'*'`. Um caractere de máscara opcional pode ser especificado.

Argumentos:

+ *`str`*: A string a ser mascarada. O formato aceito é `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, no qual '`X`' é qualquer dígito e '`-`' é qualquer caractere de separador. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'*'` se *`mask_char`* não for fornecido.

Valor de retorno:

O UUID mascarado como uma string codificada no conjunto de caracteres `utf8mb4`, um erro se o argumento não tiver o comprimento correto, ou `NULL` se *`str`* estiver no formato incorreto ou contiver um caractere multibyte.

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

##### Funções dos Componentes de Geração de Dados Aleatórios

Os componentes desta seção geram valores aleatórios para diferentes tipos de dados. Quando possível, os valores gerados têm características reservadas para valores de demonstração ou teste, para evitar que sejam confundidos com dados legítimos. Por exemplo, `gen_rnd_us_phone()` retorna um número de telefone dos EUA que usa o código de área 555, que não é atribuído a números de telefone em uso real. As descrições individuais das funções descrevem quaisquer exceções a este princípio.

* `gen_range(lower, upper)`(data-masking-component-functions.html#function_gen-range)

Gera um número aleatório escolhido de um intervalo especificado.

Argumentos:

+ *`lower`*: Um número inteiro que especifica o limite inferior da faixa.

+ *`upper`*: Um número inteiro que especifica o limite superior da faixa, que não deve ser menor que o limite inferior.

Valor de retorno:

Um número inteiro aleatório (codificado no conjunto de caracteres `utf8mb4`) na faixa de *`lower`* a *`upper`*, inclusive, ou `NULL` se o argumento *`upper`* for menor que *`lower`*.

Nota

Para uma melhor qualidade de valores aleatórios, use `RAND()` em vez desta função.

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

* `gen_rnd_canada_sin()`

Gera um número aleatório do Seguro Social do Canadá (SIN) no formato `AAA-BBB-CCC`. O número gerado passa pelo algoritmo de verificação Luhn, que garante a consistência desse número.

Aviso

Os valores retornados de `gen_rnd_canada_sin()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não é possível garantir que um determinado valor de retorno não seja atribuído a um SIN legítimo do Canadá. Se for necessário publicar um resultado de `gen_rnd_canada_sin()`, considere mascará-lo com `mask_canada_sin()`.

Argumentos:

  None.

Valor de retorno:

Um SIN aleatório do Canadá como uma cadeia codificada no conjunto de caracteres `utf8mb4`.

Exemplo:

  ```
  mysql> SELECT mask_canada_sin( gen_rnd_canada_sin() );
  +-----------------------------------------+
  | mask_canada_sin( gen_rnd_canada_sin() ) |
  +-----------------------------------------+
  | xxx-xxx-xxx                             |
  +-----------------------------------------+
  ```

* `gen_rnd_email(name_size, surname_size, domain)`(data-masking-component-functions.html#function_gen-rnd-email)

Gera um endereço de e-mail aleatório na forma de *`random_name`*.*`random_surname`*@*`domain`*.

Argumentos:

+ *`name_size`*: (Opcional) Um número inteiro que especifica o número de caracteres na parte do nome de um endereço. O padrão é cinco se *`name_size`* não for fornecido.

+ *`surname_size`*: (Opcional) Um número inteiro que especifica o número de caracteres na parte do sobrenome de um endereço. O padrão é sete se *`surname_size`* não for fornecido.

+ *`domain`*: (Opcional) Uma cadeia que especifica a parte de domínio do endereço. O padrão é `example.com` se *`domain`* não for fornecido.

Valor de retorno:

Um endereço de e-mail aleatório como uma cadeia codificada no conjunto de caracteres `utf8mb4`.

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

* `gen_rnd_iban([country, size])`(data-masking-component-functions.html#function_gen-rnd-iban)

Gera um número de conta bancária internacional aleatório (IBAN) no formato `AAAA BBBB CCCC DDDD`. A string gerada começa com um código de país de dois caracteres, dois dígitos de verificação calculados de acordo com a especificação do IBAN e caracteres alfanuméricos aleatórios até o tamanho necessário.

Aviso

Os valores retornados a partir de `gen_rnd_iban()` devem ser usados apenas para fins de teste e não são adequados para publicação se forem usados com um código de país válido. Não há como garantir que um valor de retorno dado não seja atribuído a uma conta bancária legítima. Se for necessário publicar um resultado de `gen_rnd_iban()`, considere mascará-lo com `mask_iban()`.

Argumentos:

+ *`country`*: (Opcional) Código de país de dois caracteres; o valor padrão é `ZZ`

+ *`size`*: (Opcional) Número de caracteres significativos; padrão 16, mínimo 15, máximo 34

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

* `gen_rnd_pan([size])`

Gera um número de conta principal de cartão de pagamento aleatório. O número passa na verificação Luhn (um algoritmo que realiza uma verificação de controle de checksum contra um dígito de verificação).

Aviso

Os valores retornados de `gen_rnd_pan()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não é possível garantir que um determinado valor de retorno não seja atribuído a uma conta de pagamento legítima. Se for necessário publicar um resultado de `gen_rnd_pan()`, considere mascará-lo com `mask_pan()` ou `mask_pan_relaxed()`.

Argumentos:

+ *`size`*: (Opcional) Um número inteiro que especifica o tamanho do resultado. O padrão é 16 se *`size`* não for fornecido. Se fornecido, *`size`* deve ser um número inteiro no intervalo de 12 a 19.

Valor de retorno:

Um número de pagamento aleatório como uma string, ou um erro se um argumento *`size`* fora do intervalo permitido for fornecido.

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

* `gen_rnd_ssn()`

Gera um número aleatório do Seguro Social dos EUA no formato `AAA-BB-CCCC`. A parte *`AAA`* é maior que 900, o que está fora da faixa usada para números de segurança social legítimos.

Argumentos:

  None.

Valor de retorno:

Um número de segurança social aleatório como uma cadeia codificada no conjunto de caracteres `utf8mb4`.

Exemplo:

  ```
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

* `gen_rnd_uk_nin()`

Gera um Número de Seguro do Reino Unido (UK NIN) aleatório no formato de nove caracteres. O NIN começa com dois caracteres de prefixo selecionados aleatoriamente do conjunto de prefixos válidos, seis números aleatórios e um caractere de sufixo selecionado aleatoriamente do conjunto de sufixos válidos.

Aviso

Os valores retornados de `gen_rnd_uk_nin()` devem ser usados apenas para fins de teste e não são adequados para publicação. Não é possível garantir que um valor de retorno dado não seja atribuído a um NIN legítimo. Se for necessário publicar um resultado de `gen_rnd_uk_nin()`, considere mascará-lo com `mask_uk_nin()`.

Argumentos:

  None.

Valor de retorno:

Um NIN aleatório do Reino Unido como uma cadeia codificada no conjunto de caracteres `utf8mb4`.

Exemplo:

  ```
  mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
  +---------------------------------+
  | mask_uk_nin( gen_rnd_uk_nin() ) |
  +---------------------------------+
  | JE*******                       |
  +---------------------------------+
  ```

* `gen_rnd_us_phone()`

Gera um número de telefone aleatório dos EUA no formato `1-555-AAA-BBBB`. O código de área 555 não é usado para números de telefone legítimos.

Argumentos:

  None.

Valor de retorno:

Um número de telefone aleatório dos EUA como uma cadeia codificada no conjunto de caracteres `utf8mb4`.

Exemplo:

  ```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

* `gen_rnd_uuid()`

Gera um identificador único universal (UUID) aleatório segmentado com traços.

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

##### Funções do componente de administração de mascaramento de dicionário

Os componentes desta seção manipulam dicionários de termos e realizam operações de mascaramento administrativo com base neles. Todas essas funções exigem o privilégio `MASKING_DICTIONARIES_ADMIN`.

Quando um dicionário de termos é criado, ele se torna parte do registro do dicionário e recebe um nome que será usado por outras funções do dicionário.

* `masking_dictionary_remove(dictionary_name)`

Remove um dicionário e todos os seus termos do registro do dicionário. Esta função requer o privilégio `MASKING_DICTIONARIES_ADMIN`.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário a ser removido da tabela de dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

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

* `masking_dictionary_term_add(dictionary_name, term_name)`(data-masking-component-functions.html#function_masking-dictionary-term-add)

Adiciona um termo ao dicionário nomeado. Esta função requer o privilégio `MASKING_DICTIONARIES_ADMIN`.

Importante

Os dicionários e seus termos são persistidos em uma tabela no esquema `mysql`. Todos os termos de um dicionário são acessíveis a qualquer conta de usuário se esse usuário executar `gen_dictionary()` repetidamente. Evite adicionar informações sensíveis aos dicionários.

Cada termo é definido por um dicionário nomeado. `masking_dictionary_term_add()` permite que você adicione um termo de dicionário de cada vez.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que fornece um nome para o dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`term_name`*: Uma cadeia que especifica o nome do termo na tabela do dicionário. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

Valor de retorno:

Uma cadeia que indica se a operação de adição de termos foi bem-sucedida. `1` indica sucesso. `NULL` indica falha. A falha na adição de termos pode ocorrer por vários motivos, incluindo:

+ Um termo com o nome dado já foi adicionado.  
+ O nome do dicionário não foi encontrado.

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

* `masking_dictionary_term_remove(dictionary_name, term_name)`(data-masking-component-functions.html#function_masking-dictionary-term-remove)

Remove um termo do dicionário nomeado. Esta função requer o privilégio `MASKING_DICTIONARIES_ADMIN`.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que fornece um nome para o dicionário. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`term_name`*: Uma cadeia que especifica o nome do termo na tabela do dicionário. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

Valor de retorno:

Uma cadeia que indica se a operação de remoção do termo foi bem-sucedida. `1` indica sucesso. `NULL` indica falha. A falha na remoção do termo pode ocorrer por vários motivos, incluindo:

+ Um termo com o nome dado não foi encontrado.
+ O nome do dicionário não foi encontrado.

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

##### Componentes do dicionário gerando funções

Os componentes desta seção manipulam dicionários de termos e realizam operações de geração com base neles.

Quando um dicionário de termos é criado, ele se torna parte do registro do dicionário e recebe um nome que será usado por outras funções do dicionário.

* `gen_blocklist(str, from_dictionary_name, to_dictionary_name)`(data-masking-component-functions.html#function_gen-blocklist)

Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição.

Argumentos:

+ *`term`*: Uma cadeia que indica o termo a ser substituído. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`from_dictionary_name`*: Uma cadeia que nomeia o dicionário que contém o termo a ser substituído. Esse argumento é convertido para o conjunto de caracteres `utf8mb4`.

+ *`to_dictionary_name`*: Uma cadeia que nomeia o dicionário a partir do qual se deve escolher o termo de substituição. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

Valor de retorno:

Uma cadeia codificada no conjunto de caracteres `utf8mb4` escolhido aleatoriamente de *`to_dictionary_name`* como substituição para *`term`*, ou *`term`* se não aparecer em *`from_dictionary_name`*, ou um erro se o nome do dicionário não estiver no registro do dicionário.

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

* `gen_dictionary(dictionary_name)`

Retorna um termo aleatório de um dicionário.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário a partir do qual se deve escolher o termo. Este argumento é convertido para o conjunto de caracteres `utf8mb4`.

Valor de retorno:

Um termo aleatório do dicionário como uma cadeia codificada no conjunto de caracteres `utf8mb4` ou `NULL`, se o nome do dicionário não estiver no registro do dicionário.

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

### 8.5.3 Plugin de Máscara de Dados e Desidentificação Empresarial do MySQL

A Máscara de Dados e Desidentificação Empresarial do MySQL é baseada em uma biblioteca de plugins que implementa esses elementos:

* Um plugin do lado do servidor chamado `data_masking`.
* Um conjunto de funções carregáveis oferece uma API em nível de SQL para realizar operações de mascaramento e desidentificação. Algumas dessas funções exigem o privilégio `SUPER`.

#### 8.5.3.1 Instalação do Plugin de Máscara de Dados e Desidentificação Empresarial do MySQL

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Data Masking e De-Identification, que é implementado como um arquivo de biblioteca de plugins que contém um plugin e várias funções carregáveis. Para informações gerais sobre a instalação ou desinstalação de plugins e funções carregáveis, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”, e a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `data_masking`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin e as funções de mascaramento e desidentificação de dados do MySQL Enterprise, use as declarações `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```
INSTALL PLUGIN data_masking SONAME 'data_masking.so';
CREATE FUNCTION gen_blocklist RETURNS STRING
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

```
UNINSTALL PLUGIN data_masking;
DROP FUNCTION gen_blocklist;
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

#### 8.5.3.2 Usando o Plugin de Máscara de Dados e Desidentificação Empresarial do MySQL

Antes de usar o MySQL Enterprise Data Masking e De-Identification, instale-o de acordo com as instruções fornecidas na Seção 8.5.3.1, “Instalação do Plugin de Mascaramento e De-Identificação de Dados do MySQL Enterprise”.

Para usar o MySQL Enterprise Data Masking e De-Identification em aplicativos, invoque as funções apropriadas para as operações que você deseja realizar. Para descrições detalhadas das funções, consulte a Seção 8.5.3.4, “Descritores das funções do plugin de MySQL Enterprise Data Masking e De-Identification”. Esta seção demonstra como usar as funções para realizar algumas tarefas representativas. Ela apresenta primeiro uma visão geral das funções disponíveis, seguida por alguns exemplos de como as funções podem ser usadas em contextos do mundo real:

* Mascarar dados para remover características identificáveis
* Gerar dados aleatórios com características específicas
* Gerar dados aleatórios usando dicionários
* Usar dados mascarados para identificação de clientes
* Criar visualizações que exibam dados mascarados

##### Mascarar dados para remover características identificáveis

O MySQL oferece funções de mascaramento de propósito geral que mascaram strings arbitrárias, e funções de mascaramento de propósito específico que mascaram tipos específicos de valores.

###### Funções de Máscara para Uso Geral

`mask_inner()` e `mask_outer()` são funções de propósito geral que mascaram partes de strings arbitrárias com base na posição dentro da string:

* `mask_inner()` mascara o interior do seu argumento de string, deixando as extremidades não mascaradas. Outros argumentos especificam os tamanhos das extremidades não mascaradas.

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

* `mask_outer()` faz o contrário, ocultando as extremidades do seu argumento de string, deixando o interior não ocultado. Outros argumentos especificam os tamanhos das extremidades ocultas.

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

Por padrão, `mask_inner()` e `mask_outer()` usam `'X'` como caractere de mascaramento, mas permitem um argumento opcional de caractere de mascaramento:

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

###### Funções de Máscara para Finalidades Especiais

Outras funções de mascaramento esperam um argumento de string que representa um tipo específico de valor e o mascara para remover características identificáveis.

Nota

Os exemplos aqui fornecem argumentos de função usando as funções de geração de valores aleatórios que retornam o tipo apropriado de valor. Para mais informações sobre as funções de geração, consulte Gerando dados aleatórios com características específicas.

**Mascamento do número principal da conta do cartão de pagamento.** As funções de mascamento fornecem um mascamento estrito e relaxado dos números principais da conta.

* `mask_pan()` mascara todas as quatro últimas casas do número, exceto as últimas quatro casas:

  ```
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

* `mask_pan_relaxed()` é semelhante, mas não mascara os primeiros seis dígitos que indicam o emissor do cartão de pagamento não mascarado:

  ```
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**Mascaramento do número de segurança social dos EUA.** `mask_ssn()` mascara todos os dígitos, exceto os últimos quatro do número:

```
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

##### Gerando Dados Aleatórios com Características Específicas

Várias funções geram valores aleatórios. Esses valores podem ser usados para testes, simulação, etc.

`gen_range()` retorna um número inteiro aleatório selecionado de um intervalo dado:

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

`gen_rnd_pan()` retorna o número de conta primária do cartão de pagamento aleatório:

```
mysql> SELECT gen_rnd_pan();
```

(O resultado da função `gen_rnd_pan()` não é mostrado porque seus valores de retorno devem ser usados apenas para fins de teste, e não para publicação. Não pode ser garantido que o número não esteja atribuído a uma conta de pagamento legítima.)

`gen_rnd_ssn()` retorna um número aleatório do Seguro Social dos EUA, com a primeira e a segunda partes escolhidas de uma faixa que não é usada para números legítimos:

```
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

`gen_rnd_us_phone()` retorna um número de telefone aleatório dos EUA no código de área 555 que não é usado para números legítimos:

```
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

##### Gerando Dados Aleatórios Usando Dicionários

O MySQL Enterprise Data Masking e De-Identification permite que dicionários sejam usados como fontes de valores aleatórios. Para usar um dicionário, ele deve ser carregado primeiro a partir de um arquivo e dado um nome. Cada dicionário carregado se torna parte do registro do dicionário. Os itens podem então ser selecionados de dicionários registrados e usados como valores aleatórios ou como substituições para outros valores.

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

Suponha que a variável de sistema `secure_file_priv` esteja definida como `/usr/local/mysql/mysql-files`. Nesse caso, copie os arquivos do dicionário para esse diretório para que o servidor MySQL possa acessá-los. Em seguida, use `gen_dictionary_load()` para carregar os dicionários no registro do dicionário e atribua-lhes nomes:

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

Para selecionar um termo aleatório entre vários dicionários, selecione aleatoriamente um dos dicionários e, em seguida, selecione um termo dele:

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

A função `gen_blocklist()` permite que um termo de um dicionário seja substituído por um termo de outro dicionário, o que produz um mascaramento por substituição. Seus argumentos são o termo a ser substituído, o dicionário no qual o termo aparece e o dicionário de onde se escolhe uma substituição. Por exemplo, para substituir uma cidade dos EUA por uma cidade alemã, ou vice-versa, use `gen_blocklist()` da seguinte forma:

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

##### Uso de dados mascarados para identificação do cliente

Nos centros de atendimento ao cliente, uma técnica comum de verificação de identidade é pedir aos clientes que forneçam seus últimos quatro dígitos do número de Segurança Social (SSN). Por exemplo, um cliente pode dizer que seu nome é Joanna Bond e que seus últimos quatro dígitos do SSN são `0007`.

Suponha que uma tabela `customer` contendo registros de clientes tenha essas colunas:

* `id`: Número do CPF do cliente.  
* `first_name`: Nome do cliente.  
* `last_name`: Sobrenome do cliente.  
* `ssn`: Número do CPF do cliente.

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

O aplicativo utilizado pelos representantes do atendimento ao cliente para verificar o SSN do cliente pode executar uma consulta como esta:

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
mysql> FROM customer
mysql> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | XXX-XX-0007 |
+-----+-------------+
```

Agora, o representante vê apenas o que é necessário, e a privacidade do cliente é preservada.

Por que a função `CONVERT()` foi usada para o argumento do `mask_ssn()`? Porque o `mask_ssn()` requer um argumento de comprimento 11. Assim, embora o `ssn` seja definido como `VARCHAR(11)`, se a coluna `ssn` tiver um conjunto de caracteres multibyte, ela pode parecer mais longa que 11 bytes quando passada para uma função carregável, e ocorre um erro. Converter o valor em uma string binária garante que a função veja um argumento de comprimento 11.

Uma técnica semelhante pode ser necessária para outras funções de mascaramento de dados quando os argumentos de cadeia não têm um conjunto de caracteres de um único byte.

##### Criando visualizações que exibem dados mascarados

Se os dados mascarados de uma tabela forem usados em várias consultas, pode ser conveniente definir uma visão que produza dados mascarados. Dessa forma, as aplicações podem selecionar a partir da visão sem realizar o mascaramento em consultas individuais.

Por exemplo, uma visão de mascaramento na tabela `customer` da seção anterior pode ser definida da seguinte forma:

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

#### 8.5.3.3 Referência de função do plugin de mascaramento de dados e desidentificação do MySQL Enterprise

**Tabela 8.47 Funções do Plugin de Mascamento e Desidentificação de Dados da MySQL Enterprise**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification plugin functions."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>gen_blacklist()</code></th> <td> Perform dictionary term replacement </td> <td></td> <td>8.0.23</td> </tr><tr><th scope="row"><code>gen_blocklist()</code></th> <td> Perform dictionary term replacement </td> <td>8.0.23</td> <td></td> </tr><tr><th scope="row"><code>gen_dictionary_drop()</code></th> <td>Remova o dicionário do registro</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_dictionary_load()</code></th> <td>Carregar o dicionário no registro</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_dictionary()</code></th> <td>Retorne um termo aleatório do dicionário</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_range()</code></th> <td>Gerar número aleatório dentro do intervalo</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_email()</code></th> <td>Gerar endereço de e-mail aleatório</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_pan()</code></th> <td>Gerar número de conta principal de cartão de pagamento aleatório</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_ssn()</code></th> <td>Gerar um número de segurança social aleatório dos EUA</td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_us_phone()</code></th> <td>Gerar número de telefone aleatório dos EUA</td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_inner()</code></th> <td>Parte interna da máscara de cordas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_outer()</code></th> <td>Máscara esquerda e direita das partes da corda</td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_pan()</code></th> <td>Número do cartão de pagamento da máscara, parte da cadeia de caracteres</td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_pan_relaxed()</code></th> <td>Número do cartão de pagamento da máscara, parte da cadeia de caracteres</td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_ssn()</code></th> <td>Máscara o Número de Segurança Social dos EUA</td> <td></td> <td></td> </tr></tbody></table>

#### 8.5.3.4 Descrições das funções do plugin de mascaramento e desidentificação de dados da MySQL Enterprise

A biblioteca de plugins de mascaramento de dados e desidentificação da MySQL Enterprise inclui várias funções, que podem ser agrupadas nessas categorias:

* Funções do Plugin de Máscara de Dados * Funções do Plugin de Geração de Dados Aleatórios * Funções do Plugin Baseado em Dicionário de Dados Aleatórios

A partir do MySQL 8.0.19, essas funções suportam o conjunto de caracteres de único byte `latin1` para argumentos de string e valores de retorno. Antes do MySQL 8.0.19, as funções tratam argumentos de string como strings binárias (o que significa que elas não distinguem maiúsculas e minúsculas), e os valores de retorno de string são strings binárias. Você pode ver a diferença no conjunto de caracteres do valor de retorno da seguinte forma:

MySQL 8.0.19 e superior:

```
mysql> SELECT CHARSET(gen_rnd_email());
+--------------------------+
| CHARSET(gen_rnd_email()) |
+--------------------------+
| latin1                   |
+--------------------------+
```

Antes do MySQL 8.0.19:

```
mysql> SELECT CHARSET(gen_rnd_email());
+--------------------------+
| CHARSET(gen_rnd_email()) |
+--------------------------+
| binary                   |
+--------------------------+
```

Para qualquer versão, se o valor de retorno de uma string deve estar em um conjunto de caracteres diferente, converta-o. O exemplo a seguir mostra como converter o resultado de `gen_rnd_email()` para o conjunto de caracteres `utf8mb4`:

```
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

Para produzir explicitamente uma string binária (por exemplo, para produzir um resultado como o da versão do MySQL anterior a 8.0.19), faça o seguinte:

```
SET @email = CONVERT(gen_rnd_email() USING binary);
```

Também pode ser necessário converter argumentos de cadeia, conforme ilustrado em Usar dados mascarados para identificação do cliente.

Se uma função de Máscara de dados empresariais e desidentificação do MySQL for invocada dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

Funções do Plugin de Máscara de Dados #####

Cada função de plugin nesta seção realiza uma operação de mascaramento em seu argumento de string e retorna o resultado mascarado.

* `mask_inner(str, margin1, margin2 [, mask_char])`(data-masking-plugin-functions.html#function_mask-inner-plugin)

Mascara a parte interna de uma cadeia, deixando as extremidades intocadas e retornando o resultado. Um caractere de mascaramento opcional pode ser especificado.

Argumentos:

+ *`str`*: A string para mascarar.  
  + *`margin1`*: Um número inteiro não negativo que especifica o número de caracteres no extremo esquerdo da string que devem permanecer não mascarados. Se o valor for 0, nenhum caractere do extremo esquerdo permanecerá não mascarado.

+ *`margin2`*: Um número inteiro não negativo que especifica o número de caracteres no final direito da string que devem permanecer não mascarados. Se o valor for 0, nenhum caractere no final direito permanece não mascarado.

+ *`mask_char`*: (Opcional) O único caractere a ser usado para mascaramento. O padrão é `'X'` se *`mask_char`* não for fornecido.

O caractere de mascaramento deve ser um caractere de um único byte. As tentativas de usar um caractere multibyte produzem um erro.

Valor de retorno:

A string mascarada, ou `NULL` se qualquer margem for negativa.

Se a soma dos valores da margem for maior que o comprimento do argumento, não ocorre mascaramento e o argumento é devolvido inalterado.

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

* `mask_outer(str, margin1, margin2 [, mask_char])`(data-masking-plugin-functions.html#function_mask-outer-plugin)

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

* `mask_pan(str)`

Coloca em sigilo o número do cartão de pagamento da Conta Principal e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`.

Argumentos:

+ *`str`*: A string para mascarar. A string deve ter um comprimento adequado para o Número de Conta Primária, mas não é verificada de outra forma.

Valor de retorno:

O número de pagamento mascarado como uma string. Se o argumento for menor que o necessário, ele é retornado inalterado.

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
  +-------------------------+
  | mask_pan_relaxed('a*Z') |
  +-------------------------+
  | a*Z                     |
  +-------------------------+
  ```

* `mask_ssn(str)`

Coloca um número de Segurança Social dos EUA em sigilo e retorna o número com todos os dígitos, exceto os últimos quatro, substituídos por caracteres `'X'`.

Argumentos:

+ *`str`*: A string para mascarar. A string deve ter 11 caracteres.

Valor de retorno:

O número da Segurança Social mascarado como uma string, ou um erro se o argumento não tiver o comprimento correto.

Exemplo:

  ```
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
  ```

Funções do Plugin de Geração de Dados Aleatórios #####

Os plugins que funcionam nesta seção geram valores aleatórios para diferentes tipos de dados. Quando possível, os valores gerados têm características reservadas para valores de demonstração ou teste, para evitar que sejam confundidos com dados legítimos. Por exemplo, `gen_rnd_us_phone()` retorna um número de telefone dos EUA que usa o código de área 555, que não é atribuído a números de telefone em uso real. As descrições individuais das funções descrevem quaisquer exceções a este princípio.

* `gen_range(lower, upper)`(data-masking-plugin-functions.html#function_gen-range-plugin)

Gera um número aleatório escolhido de um intervalo especificado.

Argumentos:

+ *`lower`*: Um número inteiro que especifica o limite inferior da faixa.

+ *`upper`*: Um número inteiro que especifica o limite superior da faixa, que não deve ser menor que o limite inferior.

Valor de retorno:

Um número inteiro aleatório na faixa de *`lower`* a *`upper`*, inclusive, ou `NULL` se o argumento *`upper`* for menor que *`lower`*.

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

* `gen_rnd_email()`

Gera um endereço de e-mail aleatório no domínio `example.com`.

Argumentos:

  None.

Valor de retorno:

Um endereço de e-mail aleatório como uma string.

Exemplo:

  ```
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
  mysql> SELECT gen_rnd_pan(11), gen_rnd_pan(20);
  +-----------------+-----------------+
  | gen_rnd_pan(11) | gen_rnd_pan(20) |
  +-----------------+-----------------+
  | NULL            | NULL            |
  +-----------------+-----------------+
  ```

* `gen_rnd_ssn()`

Gera um número aleatório do Seguro Social dos EUA no formato `AAA-BB-CCCC`. A parte *`AAA`* é maior que 900 e a parte *`BB`* é menor que 70, que são características que não são usadas para números legítimos do Seguro Social.

Argumentos:

  None.

Valor de retorno:

Um número aleatório da Previdência como uma string.

Exemplo:

  ```
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

  ```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

##### Funções de plugin baseadas em dicionário de dados aleatórios

As funções do plugin nesta seção manipulam dicionários de termos e realizam operações de geração e mascaramento com base neles. Algumas dessas funções exigem o privilégio `SUPER`.

Quando um dicionário é carregado, ele se torna parte do registro do dicionário e recebe um nome que será usado por outras funções do dicionário. Os dicionários são carregados a partir de arquivos de texto simples que contêm um termo por linha. Linhas vazias são ignoradas. Para ser válido, um arquivo de dicionário deve conter pelo menos uma linha não vazia.

* `gen_blacklist(str, dictionary_name, replacement_dictionary_name)`(data-masking-plugin-functions.html#function_gen-blacklist-plugin)

Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição. Esta função é desaconselhada no MySQL 8.0.23; use `gen_blocklist()` em vez disso.

* `gen_blocklist(str, dictionary_name, replacement_dictionary_name)`(data-masking-plugin-functions.html#function_gen-blocklist-plugin)

Substitui um termo presente em um dicionário por um termo de um segundo dicionário e retorna o termo de substituição. Isso mascara o termo original por substituição. Esta função foi adicionada no MySQL 8.0.23; use-a em vez de `gen_blacklist()`.

Argumentos:

+ *`str`*: Uma cadeia de caracteres que indica o termo a ser substituído.

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário que contém o termo a ser substituído.

+ *`replacement_dictionary_name`*: Uma cadeia que nomeia o dicionário a partir do qual se deve escolher o termo de substituição.

Valor de retorno:

Uma cadeia aleatoriamente escolhida de *`replacement_dictionary_name`* como substituição para *`str`*, ou *`str`* se não aparecer em *`dictionary_name`*, ou `NULL` se nenhum dos nomes do dicionário estiver no registro do dicionário.

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

* `gen_dictionary(dictionary_name)`

Retorna um termo aleatório de um dicionário.

Argumentos:

+ *`dictionary_name`*: Uma cadeia que nomeia o dicionário a partir do qual se deve escolher o termo.

Valor de retorno:

Um termo aleatório do dicionário como uma string, ou `NULL` se o nome do dicionário não estiver no registro do dicionário.

Exemplo:

  ```
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

  ```
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

* `gen_dictionary_load(dictionary_path, dictionary_name)`(data-masking-plugin-functions.html#function_gen-dictionary-load-plugin)

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

  ```
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
