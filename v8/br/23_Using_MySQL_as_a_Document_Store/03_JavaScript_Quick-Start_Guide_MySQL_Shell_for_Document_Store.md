## Guia Rápido de Início com JavaScript: Shell MySQL para Armazenamento de Documentos

Este guia de início rápido fornece instruções para começar a prototipar aplicações de armazenamento de documentos interativamente com o MySQL Shell. O guia inclui os seguintes tópicos:

* Introdução à funcionalidade do MySQL, ao Shell MySQL e ao esquema de exemplo `world_x`.

* Operações para gerenciar coleções e documentos. * Operações para gerenciar tabelas relacionais. * Operações que se aplicam a documentos dentro das tabelas.

Para seguir este guia de início rápido, você precisa de um servidor MySQL com o Plugin X instalado, o padrão no 8.0, e o MySQL Shell para usar como cliente. O MySQL Shell 8.0 fornece informações mais detalhadas sobre o MySQL Shell. O Document Store é acessado usando o X DevAPI, e o MySQL Shell fornece essa API tanto em JavaScript quanto em Python.

### Informações Relacionadas

* O MySQL Shell 8.0 oferece informações mais detalhadas sobre o MySQL Shell.

* Veja Instalar o MySQL Shell e Seção 22.5, “X Plugin” para mais informações sobre as ferramentas usadas neste guia de início rápido.

* O Guia do Usuário X DevAPI oferece mais exemplos de uso do X DevAPI para desenvolver aplicativos que utilizam o Document Store.

* Um guia rápido do Python também está disponível.

### 22.3.1 MySQL Shell

Este guia de início rápido assume um certo nível de familiaridade com o MySQL Shell. A seção a seguir é uma visão geral de alto nível, consulte a documentação do MySQL Shell para mais informações. O MySQL Shell é uma interface unificada de script para o MySQL Server. Ele suporta script em JavaScript e Python. JavaScript é o modo de processamento padrão.

#### Inicie o MySQL Shell

Depois de instalar e iniciar o servidor MySQL, conecte o MySQL Shell à instância do servidor. Você precisa saber o endereço da instância do servidor MySQL a que planeja se conectar. Para poder usar a instância como um Armazenamento de Documentos, a instância do servidor deve ter o X Plugin instalado e você deve se conectar ao servidor usando o X Protocol. Por exemplo, para se conectar à instância `ds1.example.com` na porta padrão do X Protocol de 33000, use a string de rede `user@ds1.example.com:33060`.

Dica

Se você se conectar à instância usando o protocolo MySQL clássico, por exemplo, usando o valor padrão `port` de 3306 em vez do `mysqlx_port`, você *não* pode usar a funcionalidade do Document Store mostrada neste tutorial. Por exemplo, o objeto global `db` não é preenchido. Para usar o Document Store, sempre conecte-se usando o Protocolo X.

Se o MySQL Shell ainda não estiver em execução, abra uma janela do terminal e execute:

```
mysqlsh user@ds1.example.com:33060/world_x
```

Como alternativa, se o MySQL Shell já estiver em execução, use o comando `\connect` emitindo:

```
\connect user@ds1.example.com:33060/world_x
```

Você precisa especificar o endereço da instância do servidor MySQL a que você deseja conectar o MySQL Shell. Por exemplo, no exemplo anterior:

* *`user`* representa o nome do usuário da sua conta MySQL.

* `ds1.example.com` é o nome de host da instância do servidor que executa o MySQL. Substitua isso pelo nome de host da instância do servidor MySQL que você está usando como um Armazenamento de Documentos.

* O esquema padrão para esta sessão é `world_x`. Para instruções sobre a configuração do esquema `world_x`, consulte a Seção 22.3.2, “Baixar e importar o banco de dados world_x”.

Para mais informações, consulte a Seção 6.2.5, “Conectar ao servidor usando strings semelhantes a URI ou pares chave-valor”.

Depois que o MySQL Shell abrir, o prompt `mysql-js>` indica que o idioma ativo para esta sessão é JavaScript.

```
mysql-js>
```

O MySQL Shell suporta edição de linha de entrada da seguinte forma:

As teclas **seta para a esquerda** e **seta para a direita** movem-se horizontalmente na linha de entrada atual.

As teclas **seta para cima** e **seta para baixo** movem-se para cima e para baixo através do conjunto de linhas previamente inseridas.

* **Backspace** apaga o caractere antes do cursor e, ao digitar novos caracteres, eles são inseridos na posição do cursor.

* **Enter** envia a linha de entrada atual para o servidor.

#### Obtenha ajuda para o MySQL Shell

Digite **mysqlsh --help** no prompt do seu interpretador de comandos para obter uma lista de opções de linha de comando.

```
mysqlsh --help
```

Digite [[`\help`] ] no prompt do MySQL Shell para obter uma lista de comandos disponíveis e suas descrições.

```
mysql-js> \help
```

Digite `\help` seguido do nome de um comando para obter ajuda detalhada sobre um comando individual do MySQL Shell. Por exemplo, para visualizar ajuda sobre o comando `\connect`, execute:

```
mysql-js> \help \connect
```

#### Saia do Shell do MySQL

Para sair do MySQL Shell, execute o seguinte comando:

```
mysql-js> \quit
```

#### Informações Relacionadas

* Veja a Execução Interativa de Código para uma explicação sobre como a execução de código interativa funciona no MySQL Shell.

* Veja Começando com o MySQL Shell para aprender sobre as alternativas de sessão e conexão.

### 22.3.2 Baixar e importar o banco de dados world_x

Como parte deste guia rápido, é fornecido um esquema de exemplo que é referido como o esquema `world_x`. Muitos dos exemplos demonstram a funcionalidade do Armazenamento de Documentos usando este esquema. Inicie o servidor MySQL para que você possa carregar o esquema `world_x`, em seguida, siga estes passos:

1. Baixe world_x-db.zip.

2. Extraia o arquivo de instalação para um local temporário, como `/tmp/`. A descompressão do arquivo resulta em um único arquivo chamado `world_x.sql`.

3. Importe o arquivo `world_x.sql` no seu servidor. Você pode:

* Inicie o MySQL Shell no modo SQL e importe o arquivo emitindo:

     ```
     mysqlsh -u root --sql --file /tmp/world_x-db/world_x.sql
     Enter password: ****
     ```

* Configure o MySQL Shell para o modo SQL enquanto ele está em execução e obtenha o arquivo do esquema emitindo:

     ```
     \sql
     Switching to SQL mode... Commands end with ;
     \source /tmp/world_x-db/world_x.sql
     ```

Substitua `/tmp/` pelo caminho do arquivo `world_x.sql` no seu sistema. Digite sua senha, se solicitado. Uma conta que não seja de administrador pode ser usada, desde que a conta tenha privilégios para criar novos esquemas.

#### O esquema world_x

O esquema de exemplo `world_x` contém a seguinte coleção de JSON e tabelas relacionais:

* Coleção

+ `countryinfo`: Informações sobre países do mundo.

* Tabelas

+ `country`: Informações mínimas sobre os países do mundo.

+ `city`: Informações sobre algumas das cidades desses países.

+ `countrylanguage`: Idiomas falados em cada país.

#### Informações Relacionadas

* Sessões do MySQL Shell explica os tipos de sessão.

### 22.3.3 Documentos e Coleções

Quando você está usando o MySQL como uma Armazenamento de Documentos, as coleções são contêineres dentro de um esquema que você pode criar, listar e descartar. As coleções contêm documentos JSON que você pode adicionar, encontrar, atualizar e remover.

Os exemplos desta seção utilizam a coleção `countryinfo` no esquema `world_x`. Para instruções sobre a configuração do esquema `world_x`, consulte a Seção 22.3.2, “Baixar e importar o banco de dados world_x”.

#### Documentos

Em MySQL, os documentos são representados como objetos JSON. Internamente, eles são armazenados em um formato binário eficiente que permite pesquisas e atualizações rápidas.

* Formato de documento simples para JavaScript:

  ```
  {field1: "value", field2 : 10, "field 3": null}
  ```

Uma série de documentos consiste em um conjunto de documentos separados por vírgulas e encerrados entre os caracteres `[` e `]`.

* Conjunto simples de documentos para JavaScript:

  ```
  [{"Name": "Aruba", "Code:": "ABW"}, {"Name": "Angola", "Code:": "AGO"}]
  ```

O MySQL suporta os seguintes tipos de valores JavaScript em documentos JSON:

* números (inteiros e ponto flutuante)
* strings
* boolean (Falso e Verdadeiro)
* nulo
* arrays de mais valores JSON
* objetos aninhados (ou embutidos) de mais valores JSON

#### Coleções

As coleções são recipientes para documentos que compartilham um propósito e, possivelmente, compartilham um ou mais índices. Cada coleção tem um nome único e existe dentro de um único esquema.

O termo esquema é equivalente a um banco de dados, o que significa um grupo de objetos de banco de dados, em oposição a um esquema relacional, usado para impor estrutura e restrições sobre os dados. Um esquema não impõe conformidade nos documentos de uma coleção.

Neste guia de início rápido:

* Objetos básicos incluem:

  <table summary="Objects to use interactively in MySQL Shell"><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Object form</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>db</code></td> <td><code>db</code>é uma variável global atribuída ao esquema ativo atual. Quando você deseja executar operações contra o esquema, por exemplo, para recuperar uma coleção, você usa métodos disponíveis para o<code>db</code> variable.</td> </tr><tr> <td><code>db.getCollections()</code></td> <td>db.getCollections() retorna uma lista de coleções no esquema. Use a lista para obter referências a objetos de coleção, iterar sobre eles, e assim por diante.</td> </tr></tbody></table>

* As operações básicas definidas por coleções incluem:

  <table summary="CRUD operations available in X DevAPI"><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Formulário de operação</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.add()</code></td> <td>O método add() insere um documento ou uma lista de documentos na coleção nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.find()</code></td> <td>O método find() retorna alguns ou todos os documentos na coleção nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.modify()</code></td> <td>O método modify() atualiza documentos na coleção nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.remove()</code></td> <td>O método remove() exclui um documento ou uma lista de documentos da coleção nomeada.</td> </tr></tbody></table>

#### Informações Relacionadas

* Veja Trabalhando com Coleções para uma visão geral geral.

* CRUD EBNF Definições oferece uma lista completa de operações.

#### 22.3.3.1 Criar, listar e descartar coleções

No MySQL Shell, você pode criar novas coleções, obter uma lista das coleções existentes em um esquema e remover uma coleção existente de um esquema. Os nomes das coleções são sensíveis ao caso e cada nome de coleção deve ser único.

Confirme o Esquema

Para mostrar o valor que é atribuído à variável do esquema, execute:

```
mysql-js> db
```

Se o valor do esquema não for `Schema:world_x`, defina a variável `db` emitindo:

```
mysql-js> \use world_x
```

##### Crie uma Coleção

Para criar uma nova coleção em um esquema existente, use o método `createCollection()` do objeto `db`. O exemplo a seguir cria uma coleção chamada `flags` no esquema [[`world_x`].

```
mysql-js> db.createCollection("flags")
```

O método retorna um objeto de coleção.

```
<Collection:flags>
```

##### Lista de Coleções

Para exibir todas as coleções no esquema `world_x`, use o método `getCollections()` do objeto `db`. As coleções retornadas pelo servidor ao qual você está conectado aparecem entre parênteses.

```
mysql-js> db.getCollections()
[
    <Collection:countryinfo>,
    <Collection:flags>
]
```

##### Deixar uma Coleção

Para descartar uma coleção existente de um esquema, use o método `dropCollection()` do objeto `db`. Por exemplo, para descartar a coleção `flags` do esquema atual, execute:

```
mysql-js> db.dropCollection("flags")
```

O método `dropCollection()` também é usado no MySQL Shell para descartar uma tabela relacional de um esquema.

##### Informações Relacionadas

* Veja os objetos da coleção para mais exemplos.

#### 22.3.3.2 Trabalhando com Coleções

Para trabalhar com as coleções em um esquema, use o objeto global `db` para acessar o esquema atual. Neste exemplo, estamos usando o esquema `world_x` importado anteriormente e a coleção `countryinfo`. Portanto, o formato das operações que você emite é `db.collection_name.operation`, onde *`collection_name`* é o nome da coleção contra a qual a operação é executada. Nos exemplos seguintes, as operações são executadas contra a coleção `countryinfo`.

##### Adicionar um documento

Utilize o método `add()` para inserir um documento ou uma lista de documentos em uma coleção existente. Insira o seguinte documento na coleção [[`countryinfo`]. Como este é um conteúdo de várias linhas, pressione **Enter** duas vezes para inserir o documento.

```
mysql-js> db.countryinfo.add(
 {
    GNP: .6,
    IndepYear: 1967,
    Name: "Sealand",
    Code: "SEA",
    demographics: {
        LifeExpectancy: 79,
        Population: 27
    },
    geography: {
        Continent: "Europe",
        Region: "British Islands",
        SurfaceArea: 193
    },
    government: {
        GovernmentForm: "Monarchy",
        HeadOfState: "Michael Bates"
    }
  }
)
```

O método retorna o status da operação. Você pode verificar a operação procurando pelo documento. Por exemplo:

```
mysql-js> db.countryinfo.find("Name = 'Sealand'")
{
    "GNP": 0.6,
    "_id": "00005e2ff4af00000000000000f4",
    "Name": "Sealand",
    "Code:": "SEA",
    "IndepYear": 1967,
    "geography": {
        "Region": "British Islands",
        "Continent": "Europe",
        "SurfaceArea": 193
    },
    "government": {
        "HeadOfState": "Michael Bates",
        "GovernmentForm": "Monarchy"
    },
    "demographics": {
        "Population": 27,
        "LifeExpectancy": 79
    }
}
```

Observe que, além dos campos especificados quando o documento foi adicionado, há mais um campo, o `_id`. Cada documento requer um campo de identificador chamado `_id`. O valor do campo `_id` deve ser único entre todos os documentos da mesma coleção. No MySQL 8.0.11 e superior, os IDs dos documentos são gerados pelo servidor, não pelo cliente, então o MySQL Shell não define automaticamente um valor de `_id`. Um servidor MySQL 8.0.11 ou superior define um valor de `_id` se o documento não contiver o campo [[`_id`]. Um servidor MySQL de uma versão anterior 8.0 ou 5.7 não define um valor de `_id` nesta situação, então você deve especificá-lo explicitamente. Se não o fizer, o MySQL Shell retorna o erro 5115 Documento está faltando um campo necessário. Para mais informações, consulte Entendendo IDs de Documento.

##### Informações Relacionadas

* Veja CollectionAddFunction para a definição completa da sintaxe.

* Veja o documento sobre IDs de documentos.

#### 22.3.3.3 Encontrar documentos

Você pode usar o método `find()` para consultar e retornar documentos de uma coleção em um esquema. O MySQL Shell fornece métodos adicionais para usar com o método `find()` para filtrar e ordenar os documentos retornados.

O MySQL fornece os seguintes operadores para especificar condições de pesquisa: `OR` (`||`), `AND` (`&&`), `XOR`, `IS`, `NOT`, `BETWEEN`, `IN`, `LIKE`, `!=`, `<>`, `>`, `>=`, `<`, `<=`, `&`, `|`, `<<`, `>>`, `+`, `-`, `*`, `/`, `~`, e `%`.

##### Encontrar todos os documentos em uma coleção

Para retornar todos os documentos em uma coleção, use o método `find()` sem especificar condições de pesquisa. Por exemplo, a operação a seguir retorna todos os documentos na coleção `countryinfo`.

```
mysql-js> db.countryinfo.find()
[
     {
          "GNP": 828,
          "Code:": "ABW",
          "Name": "Aruba",
          "IndepYear": null,
          "geography": {
              "Continent": "North America",
              "Region": "Caribbean",
              "SurfaceArea": 193
          },
          "government": {
              "GovernmentForm": "Nonmetropolitan Territory of The Netherlands",
              "HeadOfState": "Beatrix"
          }
          "demographics": {
              "LifeExpectancy": 78.4000015258789,
              "Population": 103000
          },
          ...
      }
 ]
240 documents in set (0.00 sec)
```

O método produz resultados que contêm informações operacionais, além de todos os documentos da coleção.

Um conjunto vazio (sem documentos correspondentes) retorna as seguintes informações:

```
Empty set (0.00 sec)
```

##### Filtrar Pesquisas

Você pode incluir condições de pesquisa com o método `find()`. A sintaxe para expressões que formam uma condição de pesquisa é a mesma da do Capítulo 14 tradicional do MySQL, *Funções e Operadores*. Você deve encerrar todas as expressões entre aspas. Por falta de brevidade, alguns dos exemplos não exibem saída.

Uma condição de busca simples poderia consistir no campo `Name` e um valor que sabemos estar em um documento. O exemplo a seguir retorna um único documento:

```
mysql-js> db.countryinfo.find("Name = 'Australia'")
[
    {
        "GNP": 351182,
        "Code:": "AUS",
        "Name": "Australia",
        "IndepYear": 1901,
        "geography": {
            "Continent": "Oceania",
            "Region": "Australia and New Zealand",
            "SurfaceArea": 7741220
        },
        "government": {
            "GovernmentForm": "Constitutional Monarchy, Federation",
            "HeadOfState": "Elisabeth II"
        }
        "demographics": {
            "LifeExpectancy": 79.80000305175781,
            "Population": 18886000
        },
    }
]
```

O exemplo a seguir procura todos os países que têm um PIB superior a US$ 500 bilhões. A coleção `countryinfo` mede o PIB em milhões.

```
mysql-js> db.countryinfo.find("GNP > 500000")
...[output removed]
10 documents in set (0.00 sec)
```

O campo População na seguinte consulta está embutido no objeto demográfico. Para acessar o campo embutido, use um período entre demografia e População para identificar a relação. Os nomes do documento e do campo são sensíveis a maiúsculas e minúsculas.

```
mysql-js> db.countryinfo.find("GNP > 500000 and demographics.Population < 100000000")
...[output removed]
6 documents in set (0.00 sec)
```

Os operadores aritméticos na expressão a seguir são usados para pesquisar países com um PIB per capita superior a US$ 30.000. As condições de pesquisa podem incluir operadores aritméticos e a maioria das funções do MySQL.

Nota

Sete documentos na coleção `countryinfo` têm um valor de população de zero. Portanto, mensagens de alerta aparecem no final do resultado.

```
mysql-js> db.countryinfo.find("GNP*1000000/demographics.Population > 30000")
...[output removed]
9 documents in set, 7 warnings (0.00 sec)
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
```

Você pode separar um valor da condição de pesquisa usando o método `bind()`. Por exemplo, em vez de especificar um nome de país codificado como condição, substitua um localizador nomeado que consiste em um colon seguido por um nome que começa com uma letra, como *country*. Em seguida, use o método `bind(placeholder, value)` da seguinte forma:

```
mysql-js> db.countryinfo.find("Name = :country").bind("country", "Italy")
{
    "GNP": 1161755,
    "_id": "00005de917d8000000000000006a",
    "Code": "ITA",
    "Name": "Italy",
    "Airports": [],
    "IndepYear": 1861,
    "geography": {
        "Region": "Southern Europe",
        "Continent": "Europe",
        "SurfaceArea": 301316
    },
    "government": {
        "HeadOfState": "Carlo Azeglio Ciampi",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 57680000,
        "LifeExpectancy": 79
    }
}
1 document in set (0.01 sec)
```

Dica

Dentro de um programa, a vinculação permite que você especifique marcadores em suas expressões, que são preenchidos com valores antes da execução e podem se beneficiar da escapamento automático, conforme apropriado.

Sempre use a vinculação para higienizar a entrada. Evite introduzir valores em consultas usando concatenação de strings, pois isso pode gerar uma entrada inválida e, em alguns casos, causar problemas de segurança.

Você pode usar marcadores e o método `bind()` para criar pesquisas salvas que você pode chamar com diferentes valores. Por exemplo, para criar uma pesquisa salva para um país:

```
mysql-js> var myFind = db.countryinfo.find("Name = :country")
mysql-js> myFind.bind('country', 'France')
{
    "GNP": 1424285,
    "_id": "00005de917d80000000000000048",
    "Code": "FRA",
    "Name": "France",
    "IndepYear": 843,
    "geography": {
        "Region": "Western Europe",
        "Continent": "Europe",
        "SurfaceArea": 551500
    },
    "government": {
        "HeadOfState": "Jacques Chirac",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 59225700,
        "LifeExpectancy": 78.80000305175781
    }
}
1 document in set (0.0028 sec)

mysql-js> myFind.bind('country', 'Germany')
{
    "GNP": 2133367,
    "_id": "00005de917d80000000000000038",
    "Code": "DEU",
    "Name": "Germany",
    "IndepYear": 1955,
    "geography": {
        "Region": "Western Europe",
        "Continent": "Europe",
        "SurfaceArea": 357022
    },
    "government": {
        "HeadOfState": "Johannes Rau",
        "GovernmentForm": "Federal Republic"
    },
    "demographics": {
        "Population": 82164700,
        "LifeExpectancy": 77.4000015258789
    }
}

1 document in set (0.0026 sec)
```

##### Resultados do Projeto

Você pode retornar campos específicos de um documento, em vez de retornar todos os campos. O exemplo a seguir retorna os campos RNP e Nome de todos os documentos na coleção `countryinfo` que correspondem às condições de pesquisa.

Utilize o método `fields()` para passar a lista de campos a serem retornados.

```
mysql-js> db.countryinfo.find("GNP > 5000000").fields(["GNP", "Name"])
[
    {
        "GNP": 8510700,
        "Name": "United States"
    }
]
1 document in set (0.00 sec)
```

Além disso, você pode alterar os documentos retornados — adicionando, renomeando, aninhado e até mesmo calculando novos valores de campo — com uma expressão que descreva o documento a ser retornado. Por exemplo, altere os nomes dos campos com a seguinte expressão para retornar apenas dois documentos.

```
mysql-js> db.countryinfo.find().fields(
mysqlx.expr('{"Name": upper(Name), "GNPPerCapita": GNP*1000000/demographics.Population}')).limit(2)
{
    "Name": "ARUBA",
    "GNPPerCapita": 8038.834951456311
}
{
    "Name": "AFGHANISTAN",
    "GNPPerCapita": 263.0281690140845
}
```

Limitar, classificar e ignorar resultados

Você pode aplicar os métodos `limit()`, `sort()` e `skip()` para gerenciar o número e a ordem dos documentos retornados pelo método `find()`.

Para especificar o número de documentos incluídos em um conjunto de resultados, adicione o método `limit()` com um valor ao método `find()`. A seguinte consulta retorna os primeiros cinco documentos na coleção `countryinfo`.

```
mysql-js> db.countryinfo.find().limit(5)
... [output removed]
5 documents in set (0.00 sec)
```

Para especificar uma ordem para os resultados, adicione o método `sort()` ao método `find()`. Passe para o método `sort()` uma lista de um ou mais campos para ordenar e, opcionalmente, o atributo descendente (`desc`) ou ascendente (`asc`) conforme apropriado. A ordem ascendente é o tipo de ordem padrão.

Por exemplo, a seguinte consulta ordena todos os documentos pelo campo IndepYear e, em seguida, retorna os primeiros oito documentos em ordem decrescente.

```
mysql-js> db.countryinfo.find().sort(["IndepYear desc"]).limit(8)
... [output removed]
8 documents in set (0.00 sec)
```

Por padrão, o método `limit()` começa pelo primeiro documento da coleção. Você pode usar o método `skip()` para alterar o documento inicial. Por exemplo, para ignorar o primeiro documento e retornar os próximos oito documentos que correspondem à condição, passe ao método `skip()` um valor de 1.

```
mysql-js> db.countryinfo.find().sort(["IndepYear desc"]).limit(8).skip(1)
... [output removed]
8 documents in set (0.00 sec)
```

##### Informações Relacionadas

* O [Manual de Referência do MySQL][(functions.html "Chapter 14 Functions and Operators")] fornece documentação detalhada sobre funções e operadores.

* Veja CollectionFindFunction para a definição completa da sintaxe.

#### 22.3.3.4 Modificar documentos

Você pode usar o método `modify()` para atualizar um ou mais documentos em uma coleção. O X DevAPI oferece métodos adicionais para uso com o método `modify()` para:

* Definir e definir campos dentro dos documentos. * Adicionar, inserir e excluir matrizes. * Vincular, limitar e classificar os documentos a serem modificados.

##### Definir e definir campos de documento

O método `modify()` funciona filtrando uma coleção para incluir apenas os documentos que serão modificados e, em seguida, aplicando as operações que você especificar a esses documentos.

No exemplo a seguir, o método `modify()` usa a condição de busca para identificar o documento a ser alterado e, em seguida, o método `set()` substitui dois valores dentro do objeto de demografia aninhado.

```
mysql-js> db.countryinfo.modify("Code = 'SEA'").set(
"demographics", {"LifeExpectancy": 78, "Population": 28})
```

Depois de modificar um documento, use o método `find()` para verificar a alteração.

Para remover conteúdo de um documento, use os métodos `modify()` e `unset()`. Por exemplo, a seguinte consulta remove o PIB de um documento que corresponde à condição de pesquisa.

```
mysql-js> db.countryinfo.modify("Name = 'Sealand'").unset("GNP")
```

Utilize o método `find()` para verificar a alteração.

```
mysql-js> db.countryinfo.find("Name = 'Sealand'")
{
    "_id": "00005e2ff4af00000000000000f4",
    "Name": "Sealand",
    "Code:": "SEA",
    "IndepYear": 1967,
    "geography": {
        "Region": "British Islands",
        "Continent": "Europe",
        "SurfaceArea": 193
    },
    "government": {
        "HeadOfState": "Michael Bates",
        "GovernmentForm": "Monarchy"
    },
    "demographics": {
        "Population": 27,
        "LifeExpectancy": 79
    }
}
```

##### Aplicar, inserir e excluir arrays

Para adicionar um elemento a um campo de matriz, ou inserir ou excluir elementos em uma matriz, use os métodos `arrayAppend()`, `arrayInsert()` ou `arrayDelete()`. Os exemplos a seguir modificam a coleção `countryinfo` para permitir o rastreamento de aeroportos internacionais.

O primeiro exemplo utiliza os métodos `modify()` e `set()` para criar um novo campo de Aeroportos em todos os documentos.

Cuidado

Tenha cuidado ao modificar documentos sem especificar uma condição de pesquisa; isso modifica todos os documentos da coleção.

```
mysql-js> db.countryinfo.modify("true").set("Airports", [])
```

Com o campo Aeroportos adicionado, o próximo exemplo usa o método `arrayAppend()` para adicionar um novo aeroporto a um dos documentos. *$.Airports* no exemplo a seguir representa o campo Aeroportos do documento atual.

```
mysql-js> db.countryinfo.modify("Name = 'France'").arrayAppend("$.Airports", "ORY")
```

Use `find()` para ver a mudança.

```
mysql-js> db.countryinfo.find("Name = 'France'")
{
    "GNP": 1424285,
    "_id": "00005de917d80000000000000048",
    "Code": "FRA",
    "Name": "France",
    "Airports": [
        "ORY"
    ],
    "IndepYear": 843,
    "geography": {
        "Region": "Western Europe",
        "Continent": "Europe",
        "SurfaceArea": 551500
    },
    "government": {
        "HeadOfState": "Jacques Chirac",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 59225700,
        "LifeExpectancy": 78.80000305175781
    }
}
```

Para inserir um elemento em uma posição diferente na matriz, use o método `arrayInsert()` para especificar qual índice inserir na expressão do caminho. Neste caso, o índice é 0, ou seja, o primeiro elemento na matriz.

```
mysql-js> db.countryinfo.modify("Name = 'France'").arrayInsert("$.Airports[0]", "CDG")
```

Para excluir um elemento da matriz, você deve passar ao método `arrayDelete()` o índice do elemento que será excluído.

```
mysql-js> db.countryinfo.modify("Name = 'France'").arrayDelete("$.Airports[1]")
```

##### Informações Relacionadas

* O [Manual de Referência do MySQL][(json.html#json-paths "Searching and Modifying JSON Values")] fornece instruções para ajudá-lo a pesquisar e modificar valores JSON.

* Veja CollectionModifyFunction para a definição completa da sintaxe.

#### 22.3.3.5 Remover documentos

Você pode usar o método `remove()` para excluir alguns ou todos os documentos de uma coleção em um esquema. O X DevAPI oferece métodos adicionais para uso com o método `remove()` para filtrar e ordenar os documentos a serem removidos.

##### Remover documentos usando condições

O exemplo a seguir passa uma condição de busca para o método `remove()`. Todos os documentos que correspondem à condição são removidos da coleção `countryinfo`. Neste exemplo, um documento corresponde à condição.

```
mysql-js> db.countryinfo.remove("Code = 'SEA'")
```

##### Remova o Primeiro Documento

Para remover o primeiro documento na coleção `countryinfo`, use o método `limit()` com um valor de 1.

```
mysql-js> db.countryinfo.remove("true").limit(1)
```

##### Remova o último documento em uma ordem

O exemplo a seguir remove o último documento da coleção `countryinfo` por nome de país.

```
mysql-js> db.countryinfo.remove("true").sort(["Name desc"]).limit(1)
```

##### Remova todos os documentos em uma coleção

Você pode remover todos os documentos em uma coleção. Para fazer isso, use o método `remove("true")` sem especificar uma condição de pesquisa.

Cuidado

Use cuidado ao remover documentos sem especificar uma condição de pesquisa. Essa ação exclui todos os documentos da coleção.

Como alternativa, use a operação `db.drop_collection('countryinfo')` para excluir a coleção `countryinfo`.

##### Informações Relacionadas

* Veja ColeçãoRemoveFunction para a definição completa da sintaxe.

* Veja a Seção 22.3.2, “Baixar e importar o banco de dados world_x”, para obter instruções para recriar o esquema `world_x`.

#### 22.3.3.6 Criar e descartar índices

Os índices são usados para encontrar documentos com valores específicos de campo rapidamente. Sem um índice, o MySQL deve começar com o primeiro documento e, em seguida, ler todo o conjunto para encontrar os campos relevantes. Quanto maior a coleção, mais isso custa. Se uma coleção for grande e as consultas em um campo específico forem comuns, então considere criar um índice em um campo específico dentro de um documento.

Por exemplo, a seguinte consulta se sai melhor com um índice no campo População:

```
mysql-js> db.countryinfo.find("demographics.Population < 100")
...[output removed]
8 documents in set (0.00 sec)
```

O método `createIndex()` cria um índice que você pode definir com um documento JSON que especifica quais campos devem ser usados. Esta seção é uma visão geral de alto nível sobre indexação. Para mais informações, consulte Coleções de indexação.

##### Adicionar um índice não único

Para criar um índice não único, passe o nome do índice e as informações do índice ao método `createIndex()`. Nomes de índice duplicados são proibidos.

O exemplo a seguir especifica um índice denominado `popul`, definido contra o campo `Population` do objeto `demographics`, indexado como um valor numérico `Integer`. O parâmetro final indica se o campo deve exigir a restrição `NOT NULL`. Se o valor for `false`, o campo pode conter valores `NULL`. As informações do índice são um documento JSON com detalhes de um ou mais campos a serem incluídos no índice. Cada definição de campo deve incluir o caminho completo do documento para o campo e especificar o tipo do campo.

```
mysql-js> db.countryinfo.createIndex("popul", {fields:
[{field: '$.demographics.Population', type: 'INTEGER'}]})
```

Aqui, o índice é criado usando um valor numérico inteiro. Existem outras opções disponíveis, incluindo opções para uso com dados GeoJSON. Você também pode especificar o tipo de índice, que foi omitido aqui porque o tipo padrão “index” é apropriado.

##### Adicione um índice único

Para criar um índice único, passe um nome de índice, a definição do índice e o tipo de índice “único” ao método `createIndex()`. Este exemplo mostra um índice único criado no nome do país (`"Name"`), que é outro campo comum na coleção `countryinfo` para indexar. Na descrição do campo do índice, `"TEXT(40)"` representa o número de caracteres a serem indexados e `"required": True` especifica que o campo é necessário existir no documento.

```
mysql-js> db.countryinfo.createIndex("name",
{"fields": [{"field": "$.Name", "type": "TEXT(40)", "required": true}], "unique": true})
```

##### Deixar um Índice

Para descartar um índice, passe o nome do índice que você deseja descartar para o método `dropIndex()`. Por exemplo, você pode descartar o índice “popul” da seguinte forma:

```
mysql-js> db.countryinfo.dropIndex("popul")
```

##### Informações Relacionadas

* Veja Coleções de indexação para mais informações.

* Veja Definindo um índice para obter mais informações sobre o documento JSON que define um índice.

* Veja as funções de gerenciamento do índice de coleção para a definição completa da sintaxe.

### 22.3.4 Tabelas Relacionais

Você também pode usar o X DevAPI para trabalhar com tabelas relacionais. Em MySQL, cada tabela relacional está associada a um motor de armazenamento específico. Os exemplos nesta seção usam tabelas `InnoDB` no esquema `world_x`.

#### Confirme o Esquema

Para mostrar o esquema que está atribuído à variável global `db`, emita `db`.

```
mysql-js> db
<Schema:world_x>
```

Se o valor retornado não for `Schema:world_x`, defina a variável `db` da seguinte forma:

```
mysql-js> \use world_x
Schema `world_x` accessible through db.
```

#### Mostrar todas as tabelas

Para exibir todas as tabelas relacionais no esquema `world_x`, use o método `getTables()` no objeto `db`.

```
mysql-js> db.getTables()
{
    "city": <Table:city>,
    "country": <Table:country>,
    "countrylanguage": <Table:countrylanguage>
}
```

#### Operações básicas com tabelas

As operações básicas definidas por tabelas incluem:

<table summary="CRUD operations to use interactively on tables within MySQL Shell"><col style="width: 32%"/><col style="width: 68%"/><thead><tr> <th>Formulário de operação</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.insert()</code></td> <td>O método insert() insere um ou mais registros na tabela nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.select()</code></td> <td>O método select() retorna alguns ou todos os registros na tabela nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.update()</code></td> <td>O método update() atualiza os registros na tabela nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.delete()</code></td> <td>O método delete() exclui um ou mais registros da tabela designada.</td> </tr></tbody></table>

#### Informações Relacionadas

* Veja Trabalhando com Tabelas Relacionais para mais informações.

* CRUD EBNF Definições oferece uma lista completa de operações.

* Veja a Seção 22.3.2, “Baixar e importar o banco de dados world_x”, para obter instruções sobre a configuração da amostra do esquema `world_x`.

#### 22.3.4.1 Inserir registros em tabelas

Você pode usar o método `insert()` com o método `values()` para inserir registros em uma tabela relacional existente. O método `insert()` aceita colunas individuais ou todas as colunas da tabela. Use um ou mais métodos `values()` para especificar os valores a serem inseridos.

##### Inserir um Registro Completo

Para inserir um registro completo, passe para o método `insert()` todas as colunas da tabela. Em seguida, passe para o método `values()` um valor para cada coluna da tabela. Por exemplo, para adicionar um novo registro à tabela de cidade no esquema `world_x`, insira o seguinte registro e pressione **Enter** duas vezes.

```
mysql-js> db.city.insert("ID", "Name", "CountryCode", "District", "Info").values(
None, "Olympia", "USA", "Washington", '{"Population": 5000}')
```

A tabela da cidade tem cinco colunas: ID, Nome, CountryCode, Distrito e Info. Cada valor deve corresponder ao tipo de dados da coluna que representa.

##### Inserir um Registro Parcial

O exemplo a seguir insere valores nas colunas ID, Nome e CountryCode da tabela cidade.

```
mysql-js> db.city.insert("ID", "Name", "CountryCode").values(
None, "Little Falls", "USA").values(None, "Happy Valley", "USA")
```

Quando você especifica colunas usando o método `insert()`, o número de valores deve corresponder ao número de colunas. No exemplo anterior, você deve fornecer três valores para corresponder às três colunas especificadas.

##### Informações Relacionadas

* Veja a TabelaInsertFunction para a definição completa da sintaxe.

#### 22.3.4.2 Selecionar tabelas

Você pode usar o método `select()` para consultar e retornar registros de uma tabela em um banco de dados. O X DevAPI fornece métodos adicionais para usar com o método `select()` para filtrar e ordenar os registros retornados.

O MySQL fornece os seguintes operadores para especificar condições de pesquisa: `OR` (`||`), `AND` (`&&`), `XOR`, `IS`, `NOT`, `BETWEEN`, `IN`, `LIKE`, `!=`, `<>`, `>`, `>=`, `<`, `<=`, `&`, `|`, `<<`, `>>`, `+`, `-`, `*`, `/`, `~`, e `%`.

##### Selecionar todos os registros

Para emitir uma consulta que retorne todos os registros de uma tabela existente, use o método `select()` sem especificar condições de pesquisa. O exemplo a seguir seleciona todos os registros da tabela de cidade no banco de dados `world_x`.

Nota

Limite o uso do método vazio `select()` para declarações interativas. Sempre use seleções explícitas de nome de coluna em seu código de aplicativo.

```
mysql-js> db.city.select()
+------+------------+-------------+------------+-------------------------+
| ID   | Name       | CountryCode | District   | Info                    |
+------+------------+-------------+------------+-------------------------+
|    1 | Kabul      | AFG         | Kabol      |{"Population": 1780000}  |
|    2 | Qandahar   | AFG         | Qandahar   |{"Population": 237500}   |
|    3 | Herat      | AFG         | Herat      |{"Population": 186800}   |
...    ...          ...           ...          ...
| 4079 | Rafah      | PSE         | Rafah      |{"Population": 92020}    |
+------+------- ----+-------------+------------+-------------------------+
4082 rows in set (0.01 sec)
```

Um conjunto vazio (sem registros correspondentes) retorna as seguintes informações:

```
Empty set (0.00 sec)
```

##### Filtrar Pesquisas

Para emitir uma consulta que retorne um conjunto de colunas da tabela, use o método `select()` e especifique as colunas a serem retornadas entre colchetes. Essa consulta retorna as colunas Nome e CountryCode da tabela cidade.

```
mysql-js> db.city.select(["Name", "CountryCode"])
+-------------------+-------------+
| Name              | CountryCode |
+-------------------+-------------+
| Kabul             | AFG         |
| Qandahar          | AFG         |
| Herat             | AFG         |
| Mazar-e-Sharif    | AFG         |
| Amsterdam         | NLD         |
...                 ...
| Rafah             | PSE         |
| Olympia           | USA         |
| Little Falls      | USA         |
| Happy Valley      | USA         |
+-------------------+-------------+
4082 rows in set (0.00 sec)
```

Para emitir uma consulta que retorne linhas que correspondam a condições de pesquisa específicas, use o método `where()` para incluir essas condições. Por exemplo, o seguinte exemplo retorna os nomes e códigos de país das cidades que começam com a letra Z.

```
mysql-js> db.city.select(["Name", "CountryCode"]).where("Name like 'Z%'")
+-------------------+-------------+
| Name              | CountryCode |
+-------------------+-------------+
| Zaanstad          | NLD         |
| Zoetermeer        | NLD         |
| Zwolle            | NLD         |
| Zenica            | BIH         |
| Zagazig           | EGY         |
| Zaragoza          | ESP         |
| Zamboanga         | PHL         |
| Zahedan           | IRN         |
| Zanjan            | IRN         |
| Zabol             | IRN         |
| Zama              | JPN         |
| Zhezqazghan       | KAZ         |
| Zhengzhou         | CHN         |
...                 ...
| Zeleznogorsk      | RUS         |
+-------------------+-------------+
59 rows in set (0.00 sec)
```

Você pode separar um valor da condição de pesquisa usando o método `bind()`. Por exemplo, em vez de usar "Nome = 'Z%' " como a condição, substitua um localizador nomeado que consiste em um colon seguido por um nome que começa com uma letra, como *nome*. Em seguida, inclua o localizador e o valor no método `bind()` da seguinte forma:

```
mysql-js> db.city.select(["Name", "CountryCode"]).
              where("Name like :name").bind("name", "Z%")
```

Dica

Dentro de um programa, a vinculação permite que você especifique marcadores em suas expressões, que são preenchidos com valores antes da execução e podem se beneficiar da escapamento automático, conforme apropriado.

Sempre use a vinculação para higienizar a entrada. Evite introduzir valores em consultas usando concatenação de strings, pois isso pode gerar uma entrada inválida e, em alguns casos, causar problemas de segurança.

##### Resultados do Projeto

Para emitir uma consulta usando o operador `AND`, adicione o operador entre as condições de pesquisa no método `where()`.

```
mysql-js> db.city.select(["Name", "CountryCode"]).where(
"Name like 'Z%' and CountryCode = 'CHN'")
+----------------+-------------+
| Name           | CountryCode |
+----------------+-------------+
| Zhengzhou      | CHN         |
| Zibo           | CHN         |
| Zhangjiakou    | CHN         |
| Zhuzhou        | CHN         |
| Zhangjiang     | CHN         |
| Zigong         | CHN         |
| Zaozhuang      | CHN         |
...              ...
| Zhangjiagang   | CHN         |
+----------------+-------------+
22 rows in set (0.01 sec)
```

Para especificar vários operadores condicionais, você pode encerrar as condições de busca entre parênteses para alterar a precedência do operador. O exemplo a seguir demonstra a colocação dos operadores `AND` e `OR`.

```
mysql-js> db.city.select(["Name", "CountryCode"]).
where("Name like 'Z%' and (CountryCode = 'CHN' or CountryCode = 'RUS')")
+-------------------+-------------+
| Name              | CountryCode |
+-------------------+-------------+
| Zhengzhou         | CHN         |
| Zibo              | CHN         |
| Zhangjiakou       | CHN         |
| Zhuzhou           | CHN         |
...                 ...
| Zeleznogorsk      | RUS         |
+-------------------+-------------+
29 rows in set (0.01 sec)
```

Limitar, Ordenar e Deslocar Resultados

Você pode aplicar os métodos `limit()`, `orderBy()` e `offSet()` para gerenciar o número e a ordem dos registros retornados pelo método `select()`.

Para especificar o número de registros incluídos em um conjunto de resultados, adicione o método `limit()` com um valor ao método `select()`. Por exemplo, a seguinte consulta retorna os cinco primeiros registros na tabela de país.

```
mysql-js> db.country.select(["Code", "Name"]).limit(5)
+------+-------------+
| Code | Name        |
+------+-------------+
| ABW  | Aruba       |
| AFG  | Afghanistan |
| AGO  | Angola      |
| AIA  | Anguilla    |
| ALB  | Albania     |
+------+-------------+
5 rows in set (0.00 sec)
```

Para especificar uma ordem para os resultados, adicione o método `orderBy()` ao método `select()`. Passe para o método `orderBy()` uma lista de uma ou mais colunas para ordenar e, opcionalmente, o atributo descendente (`desc`) ou ascendente (`asc`) conforme apropriado. A ordem ascendente é o tipo de ordem padrão.

Por exemplo, a seguinte consulta ordena todos os registros pelo campo Nome e, em seguida, retorna os três primeiros registros em ordem decrescente.

```
mysql-js> db.country.select(["Code", "Name"]).orderBy(["Name desc"]).limit(3)
+------+------------+
| Code | Name       |
+------+------------+
| ZWE  | Zimbabwe   |
| ZMB  | Zambia     |
| YUG  | Yugoslavia |
+------+------------+
3 rows in set (0.00 sec)
```

Por padrão, o método `limit()` começa pelo primeiro registro da tabela. Você pode usar o método `offset()` para alterar o registro inicial. Por exemplo, para ignorar o primeiro registro e retornar os próximos três registros que correspondem à condição, passe ao método `offset()` um valor de 1.

```
mysql-js> db.country.select(["Code", "Name"]).orderBy(["Name desc"]).limit(3).offset(1)
+------+------------+
| Code | Name       |
+------+------------+
| ZMB  | Zambia     |
| YUG  | Yugoslavia |
| YEM  | Yemen      |
+------+------------+
3 rows in set (0.00 sec)
```

##### Informações Relacionadas

* O [Manual de Referência do MySQL][(functions.html "Chapter 14 Functions and Operators")] fornece documentação detalhada sobre funções e operadores.

* Veja a Tabela SelectFunction para a definição completa da sintaxe.

#### 22.3.4.3 Atualizar tabelas

Você pode usar o método `update()` para modificar um ou mais registros em uma tabela. O método `update()` funciona filtrando uma consulta para incluir apenas os registros que serão atualizados e, em seguida, aplicando as operações que você especificar a esses registros.

Para substituir o nome de uma cidade na tabela de cidades, passe para o método `set()` o novo nome da cidade. Em seguida, passe para o método `where()` o nome da cidade que você deseja localizar e substituir. O exemplo a seguir substitui a cidade Peking por Beijing.

```
mysql-js> db.city.update().set("Name", "Beijing").where("Name = 'Peking'")
```

Utilize o método `select()` para verificar a alteração.

```
mysql-js> db.city.select(["ID", "Name", "CountryCode", "District", "Info"]).where("Name = 'Beijing'")
+------+-----------+-------------+----------+-----------------------------+
| ID   | Name      | CountryCode | District | Info                        |
+------+-----------+-------------+----------+-----------------------------+
| 1891 | Beijing   | CHN         | Peking   | {"Population": 7472000}     |
+------+-----------+-------------+----------+-----------------------------+
1 row in set (0.00 sec)
```

##### Informações Relacionadas

* Veja TableUpdateFunction para a definição completa da sintaxe.

#### 22.3.4.4 Excluir tabelas

Você pode usar o método `delete()` para remover alguns ou todos os registros de uma tabela em um banco de dados. O X DevAPI fornece métodos adicionais para usar com o método `delete()` para filtrar e ordenar os registros a serem excluídos.

##### Eliminar registros usando condições

O exemplo a seguir passa as condições de busca para o método `delete()`. Todos os registros que correspondem à condição são excluídos da tabela de cidade. Neste exemplo, um registro corresponde à condição.

```
mysql-js> db.city.delete().where("Name = 'Olympia'")
```

##### Exclua o Primeiro Registro

Para excluir o primeiro registro na tabela da cidade, use o método `limit()` com um valor de 1.

```
mysql-js> db.city.delete().limit(1)
```

##### Exclua todos os registros em uma tabela

Você pode excluir todos os registros em uma tabela. Para fazer isso, use o método `delete()` sem especificar uma condição de pesquisa.

Cuidado

Use cuidado ao excluir registros sem especificar uma condição de pesquisa; isso exclui todos os registros da tabela.

##### Deixar uma tabela

O método `dropCollection()` também é usado no MySQL Shell para descartar uma tabela relacional de um banco de dados. Por exemplo, para descartar a tabela `citytest` do banco de dados `world_x`, execute:

```
mysql-js> session.dropCollection("world_x", "citytest")
```

##### Informações Relacionadas

* Veja a TabelaDeleteFunction para a definição completa da sintaxe.

* Veja a Seção 22.3.2, “Baixar e importar o banco de dados world_x”, para obter instruções para recriar o banco de dados `world_x`.

### 22.3.5 Documentos em Tabelas

Em MySQL, uma tabela pode conter dados relacionais tradicionais, valores JSON ou ambos. Você pode combinar dados tradicionais com documentos JSON armazenando os documentos em colunas com o tipo de dados nativo `JSON`.

Os exemplos nesta seção utilizam a tabela de cidade no esquema `world_x`.

#### cidade Descrição da tabela

A tabela da cidade tem cinco colunas (ou campos).

```
+---------------+------------+-------+-------+---------+------------------+
| Field         | Type       | Null  | Key   | Default | Extra            |
+---------------+------------+-------+-------+---------+------------------+
| ID            | int(11)    | NO    | PRI   | null    | auto_increment   |
| Name          | char(35)   | NO    |       |         |                  |
| CountryCode   | char(3)    | NO    |       |         |                  |
| District      | char(20)   | NO    |       |         |                  |
| Info          | json       | YES   |       | null    |                  |
+---------------+------------+-------+-------+---------+------------------+
```

#### Inserir um registro

Para inserir um documento na coluna de uma tabela, passe para o método `values()` um documento JSON bem formado na ordem correta. No exemplo a seguir, um documento é passado como o valor final a ser inserido na coluna de Info.

```
mysql-js> db.city.insert().values(
None, "San Francisco", "USA", "California", '{"Population":830000}')
```

#### Selecionar um registro

Você pode emitir uma consulta com uma condição de pesquisa que avalia os valores dos documentos na expressão.

```
mysql-js> db.city.select(["ID", "Name", "CountryCode", "District", "Info"]).where(
"CountryCode = :country and Info->'$.Population' > 1000000").bind(
'country', 'USA')
+------+----------------+-------------+----------------+-----------------------------+
| ID   | Name           | CountryCode | District       | Info                        |
+------+----------------+-------------+----------------+-----------------------------+
| 3793 | New York       | USA         | New York       | {"Population": 8008278}     |
| 3794 | Los Angeles    | USA         | California     | {"Population": 3694820}     |
| 3795 | Chicago        | USA         | Illinois       | {"Population": 2896016}     |
| 3796 | Houston        | USA         | Texas          | {"Population": 1953631}     |
| 3797 | Philadelphia   | USA         | Pennsylvania   | {"Population": 1517550}     |
| 3798 | Phoenix        | USA         | Arizona        | {"Population": 1321045}     |
| 3799 | San Diego      | USA         | California     | {"Population": 1223400}     |
| 3800 | Dallas         | USA         | Texas          | {"Population": 1188580}     |
| 3801 | San Antonio    | USA         | Texas          | {"Population": 1144646}     |
+------+----------------+-------------+----------------+-----------------------------+
9 rows in set (0.01 sec)
```

#### Informações Relacionadas

* Veja Trabalhando com Tabelas e Documentos Relacionais para mais informações.

* Veja a Seção 13.5, “O Tipo de Dados JSON”, para uma descrição detalhada do tipo de dados.