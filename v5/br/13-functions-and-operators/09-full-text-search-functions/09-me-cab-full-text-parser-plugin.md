### 12.9.9 Plugin Parser FULLTEXT MeCab

O Parser FULLTEXT integrado do MySQL usa o espaço em branco entre palavras como um delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com linguagens ideográficas que não usam delimitadores de palavras. Para abordar essa limitação para o Japonês, o MySQL fornece um Plugin Parser FULLTEXT MeCab. O Plugin Parser FULLTEXT MeCab é suportado para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um Plugin Parser FULLTEXT ngram que suporta Japonês. Para mais informações, consulte a Seção 12.9.8, “Parser FULLTEXT ngram”.

O Plugin Parser FULLTEXT MeCab é um Plugin Parser FULLTEXT para Japonês que tokeniza uma sequência de texto em palavras significativas. Por exemplo, o MeCab tokeniza “データベース管理” (“Gerenciamento de Database”) em “データベース” (“Database”) e “管理” (“Gerenciamento”). Em comparação, o Parser FULLTEXT ngram tokeniza o texto em uma sequência contígua de *`n`* caracteres, onde *`n`* representa um número entre 1 e 10.

Além de tokenizar o texto em palavras significativas, os Indexes MeCab são tipicamente menores que os Indexes ngram, e as buscas FULLTEXT MeCab são geralmente mais rápidas. Uma desvantagem é que pode levar mais tempo para o Parser FULLTEXT MeCab tokenizar documentos, comparado ao Parser FULLTEXT ngram.

A sintaxe de busca FULLTEXT descrita na Seção 12.9, “Funções de Busca FULLTEXT” se aplica ao Plugin Parser MeCab. As diferenças no comportamento do parsing são descritas nesta seção. Opções de configuração relacionadas a FULLTEXT também são aplicáveis.

Para informações adicionais sobre o Parser MeCab, consulte o projeto MeCab: Yet Another Part-of-Speech and Morphological Analyzer no Github.

#### Instalando o Plugin Parser MeCab

O Plugin Parser MeCab requer `mecab` e `mecab-ipadic`.

Em plataformas Fedora, Debian e Ubuntu suportadas (exceto Ubuntu 12.04, onde a versão `mecab` do sistema é muito antiga), o MySQL se vincula dinamicamente à instalação `mecab` do sistema se ela estiver instalada no local padrão. Em outras plataformas Unix-like suportadas, `libmecab.so` é vinculado estaticamente em `libpluginmecab.so`, que está localizado no diretório de Plugin do MySQL. O `mecab-ipadic` está incluído nos binários do MySQL e está localizado em `MYSQL_HOME\lib\mecab`.

Você pode instalar `mecab` e `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo (no Fedora, Debian e Ubuntu), ou você pode compilar `mecab` e `mecab-ipadic` a partir do código-fonte (source). Para informações sobre como instalar `mecab` e `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo, consulte Instalando MeCab a Partir de uma Distribuição Binária (Opcional)"). Se você deseja compilar `mecab` e `mecab-ipadic` a partir do código-fonte, consulte Compilando MeCab a Partir do Código-Fonte (Opcional)").

No Windows, `libmecab.dll` é encontrado no diretório `bin` do MySQL. O `mecab-ipadic` está localizado em `MYSQL_HOME/lib/mecab`.

Para instalar e configurar o Plugin Parser MeCab, execute os seguintes passos:

1. No arquivo de configuração do MySQL, defina a opção de configuração `mecab_rc_file` para o local do arquivo de configuração `mecabrc`, que é o arquivo de configuração para o MeCab. Se você estiver usando o pacote MeCab distribuído com o MySQL, o arquivo `mecabrc` estará localizado em `MYSQL_HOME/lib/mecab/etc/`.

   ```sql
   [mysqld]
   loose-mecab-rc-file=MYSQL_HOME/lib/mecab/etc/mecabrc
   ```

   O prefixo `loose` é um modificador de opção. A opção `mecab_rc_file` não é reconhecida pelo MySQL até que o Plugin Parser MeCab seja instalado, mas deve ser definida antes de tentar instalar o Plugin Parser MeCab. O prefixo `loose` permite que você reinicie o MySQL sem encontrar um erro devido a uma variável não reconhecida.

   Se você usar sua própria instalação MeCab, ou compilar MeCab a partir do código-fonte (source), a localização do arquivo de configuração `mecabrc` pode ser diferente.

   Para informações sobre o arquivo de configuração do MySQL e sua localização, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

2. Também no arquivo de configuração do MySQL, defina o tamanho mínimo do Token para 1 ou 2, que são os valores recomendados para uso com o Parser MeCab. Para tabelas `InnoDB`, o tamanho mínimo do Token é definido pela opção de configuração `innodb_ft_min_token_size`, que tem um valor padrão de 3. Para tabelas `MyISAM`, o tamanho mínimo do Token é definido por `ft_min_word_len`, que tem um valor padrão de 4.

   ```sql
   [mysqld]
   innodb_ft_min_token_size=1
   ```

3. Modifique o arquivo de configuração `mecabrc` para especificar o dicionário que você deseja usar. O pacote `mecab-ipadic` distribuído com os binários do MySQL inclui três dicionários (`ipadic_euc-jp`, `ipadic_sjis` e `ipadic_utf-8`). O arquivo de configuração `mecabrc` empacotado com o MySQL contém uma entrada semelhante à seguinte:

   ```sql
   dicdir =  /path/to/mysql/lib/mecab/lib/mecab/dic/ipadic_euc-jp
   ```

   Para usar o dicionário `ipadic_utf-8`, por exemplo, modifique a entrada da seguinte forma:

   ```sql
   dicdir=MYSQL_HOME/lib/mecab/dic/ipadic_utf-8
   ```

   Se você estiver usando sua própria instalação MeCab ou tiver compilado MeCab a partir do código-fonte, a entrada `dicdir` padrão no arquivo `mecabrc` será diferente, assim como os dicionários e sua localização.

   Nota

   Depois que o Plugin Parser MeCab é instalado, você pode usar a variável de status `mecab_charset` para visualizar o conjunto de caracteres (character set) usado com o MeCab. Os três dicionários MeCab fornecidos com o binário do MySQL suportam os seguintes conjuntos de caracteres.

   * O dicionário `ipadic_euc-jp` suporta os conjuntos de caracteres `ujis` e `eucjpms`.

   * O dicionário `ipadic_sjis` suporta os conjuntos de caracteres `sjis` e `cp932`.

   * O dicionário `ipadic_utf-8` suporta os conjuntos de caracteres `utf8` e `utf8mb4`.

   `mecab_charset` reporta apenas o primeiro conjunto de caracteres suportado. Por exemplo, o dicionário `ipadic_utf-8` suporta tanto `utf8` quanto `utf8mb4`. `mecab_charset` sempre reporta `utf8` quando este dicionário está em uso.

4. Reinicie o MySQL.
5. Instale o Plugin Parser MeCab:

   O Plugin Parser MeCab é instalado usando `INSTALL PLUGIN`. O nome do Plugin é `mecab`, e o nome da biblioteca compartilhada é `libpluginmecab.so`. Para informações adicionais sobre a instalação de Plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

   ```sql
   INSTALL PLUGIN mecab SONAME 'libpluginmecab.so';
   ```

   Uma vez instalado, o Plugin Parser MeCab é carregado em cada reinicialização normal do MySQL.

6. Verifique se o Plugin Parser MeCab está carregado usando o comando `SHOW PLUGINS`.

   ```sql
   mysql> SHOW PLUGINS;
   ```

   Um Plugin `mecab` deve aparecer na lista de Plugins.

#### Criando um Index FULLTEXT que usa o Parser MeCab

Para criar um Index `FULLTEXT` que usa o Parser mecab, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

Este exemplo demonstra a criação de uma tabela com um Index `FULLTEXT` `mecab`, a inserção de dados de amostra e a visualização dos dados tokenizados na tabela `INNODB_FT_INDEX_CACHE` do Information Schema:

```sql
mysql> USE test;

mysql> CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT,
      FULLTEXT (title,body) WITH PARSER mecab
    ) ENGINE=InnoDB CHARACTER SET utf8;

mysql> SET NAMES utf8;

mysql> INSERT INTO articles (title,body) VALUES
    ('データベース管理','このチュートリアルでは、私はどのようにデータベースを管理する方法を紹介します'),
    ('データベースアプリケーション開発','データベースアプリケーションを開発することを学ぶ');

mysql> SET GLOBAL innodb_ft_aux_table="test/articles";

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE ORDER BY doc_id, position;
```

Para adicionar um Index `FULLTEXT` a uma tabela existente, você pode usar `ALTER TABLE` ou `CREATE INDEX`. Por exemplo:

```sql
CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT
     ) ENGINE=InnoDB CHARACTER SET utf8;

ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER mecab;

# Or:

CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER mecab;
```

#### Manipulação de Espaços pelo Parser MeCab

O Parser MeCab usa espaços como separadores em Query Strings. Por exemplo, o Parser MeCab tokeniza データベース管理 como データベース e 管理.

#### Manipulação de Stopwords pelo Parser MeCab

Por padrão, o Parser MeCab usa a lista de Stopwords padrão, que contém uma pequena lista de Stopwords em Inglês. Para uma lista de Stopwords aplicável ao Japonês, você deve criar a sua própria. Para informações sobre a criação de listas de Stopwords, consulte a Seção 12.9.4, “Stopwords FULLTEXT”.

#### Busca de Termos pelo Parser MeCab

Para a busca em modo de linguagem natural (natural language mode search), o termo de busca é convertido em uma união de Tokens. Por exemplo, データベース管理 é convertido para データベース 管理.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース管理' IN NATURAL LANGUAGE MODE);
```

Para a busca em modo booleano (boolean mode search), o termo de busca é convertido em uma search phrase. Por exemplo, データベース管理 é convertido para データベース 管理.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース管理' IN BOOLEAN MODE);
```

#### Busca com Wildcard pelo Parser MeCab

Termos de busca com Wildcard não são tokenizados. Uma busca em データベース管理\* é executada no prefixo, データベース管理.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース*' IN BOOLEAN MODE);
```

#### Busca de Frase pelo Parser MeCab

Frases são tokenizadas. Por exemplo, データベース管理 é tokenizado como データベース 管理.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('"データベース管理"' IN BOOLEAN MODE);
```

#### Instalando MeCab a Partir de uma Distribuição Binária (Opcional)

Esta seção descreve como instalar `mecab` e `mecab-ipadic` a partir de uma distribuição binária usando um utilitário de gerenciamento de pacotes nativo. Por exemplo, no Fedora, você pode usar o Yum para executar a instalação:

```sql
yum mecab-devel
```

No Debian ou Ubuntu, você pode realizar uma instalação APT:

```sql
apt-get install mecab
apt-get install mecab-ipadic
```

#### Instalando MeCab a Partir do Código-Fonte (Opcional)

Se você deseja compilar `mecab` e `mecab-ipadic` a partir do código-fonte (source), os passos básicos de instalação são fornecidos abaixo. Para informações adicionais, consulte a documentação do MeCab.

1. Faça o Download dos pacotes tar.gz para `mecab` e `mecab-ipadic` em <http://taku910.github.io/mecab/#download>. Em fevereiro de 2016, os pacotes mais recentes disponíveis são `mecab-0.996.tar.gz` e `mecab-ipadic-2.7.0-20070801.tar.gz`.

2. Instale `mecab`:

   ```sql
   tar zxfv mecab-0.996.tar
   cd mecab-0.996
   ./configure
   make
   make check
   su
   make install
   ```

3. Instale `mecab-ipadic`:

   ```sql
   tar zxfv mecab-ipadic-2.7.0-20070801.tar
   cd mecab-ipadic-2.7.0-20070801
   ./configure
   make
   su
   make install
   ```

4. Compile o MySQL usando a opção CMake `WITH_MECAB`. Defina a opção `WITH_MECAB` como `system` se você instalou `mecab` e `mecab-ipadic` no local padrão.

   ```sql
   -DWITH_MECAB=system
   ```

   Se você definiu um diretório de instalação customizado, defina `WITH_MECAB` para o diretório customizado. Por exemplo:

   ```sql
   -DWITH_MECAB=/path/to/mecab
   ```
