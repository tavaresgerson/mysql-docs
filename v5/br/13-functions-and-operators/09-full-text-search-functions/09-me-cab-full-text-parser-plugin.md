### 12.9.9 Plugin do Analizador de Texto Completo MeCab

O analisador de texto completo MySQL integrado usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não usam delimitadores de palavras. Para resolver essa limitação para o japonês, o MySQL fornece um plugin de analisador de texto completo MeCab. O plugin de analisador de texto completo MeCab é suportado para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um plugin de analisador de texto completo ngram que suporta o japonês. Para mais informações, consulte a Seção 12.9.8, “Analisador de Texto Completo ngram”.

O plugin de analisador de texto completo MeCab é um plugin de analisador de texto completo para japonês que tokeniza uma sequência de texto em palavras significativas. Por exemplo, o MeCab tokeniza “データベース管理” (“Gestão de Bancos de Dados”) em “データベース” (“Banco de Dados”) e “管理” (“Gestão”). Em comparação, o analisador de texto completo ngram tokeniza o texto em uma sequência contínua de *`n`* caracteres, onde *`n`* representa um número entre 1 e 10.

Além de tokenizar o texto em palavras significativas, os índices do MeCab são geralmente menores que os índices de ngram, e as pesquisas de texto completo do MeCab são geralmente mais rápidas. Uma desvantagem é que pode levar mais tempo para o analisador de texto completo do MeCab tokenizar documentos, em comparação com o analisador de texto completo de ngram.

A sintaxe de pesquisa de texto completo descrita na Seção 12.9, “Funções de Pesquisa de Texto Completo”, aplica-se ao plugin de analisador MeCab. As diferenças no comportamento de análise são descritas nesta seção. As opções de configuração relacionadas ao texto completo também são aplicáveis.

Para obter informações adicionais sobre o analisador MeCab, consulte o projeto MeCab: Yet Another Part-of-Speech and Morphological Analyzer no Github.

#### Instalando o Plugin do Parser MeCab

O plugin de analisador MeCab requer `mecab` e `mecab-ipadic`.

Nas plataformas Fedora, Debian e Ubuntu suportadas (exceto o Ubuntu 12.04, onde a versão do sistema `mecab` é muito antiga), o MySQL vincula dinamicamente à instalação do sistema `mecab` se ela estiver instalada no local padrão. Em outras plataformas Unix-like suportadas, o `libmecab.so` é vinculado staticamente no `libpluginmecab.so`, que está localizado no diretório do plugin MySQL. O `mecab-ipadic` está incluído nos binários do MySQL e está localizado em `MYSQL_HOME\lib\mecab`.

Você pode instalar `mecab` e `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo (no Fedora, Debian e Ubuntu), ou você pode construir `mecab` e `mecab-ipadic` a partir da fonte. Para obter informações sobre como instalar `mecab` e `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo, consulte "Instalando MeCab a partir de uma distribuição binária (opcional)"). Se você quiser construir `mecab` e `mecab-ipadic` a partir da fonte, consulte "Construindo MeCab a partir da fonte (opcional)").

No Windows, o `libmecab.dll` está localizado no diretório `bin` do MySQL. O `mecab-ipadic` está localizado em `MYSQL_HOME/lib/mecab`.

Para instalar e configurar o plugin do analisador MeCab, siga os passos abaixo:

1. No arquivo de configuração do MySQL, defina a opção de configuração `mecab_rc_file` para o local do arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. Se você estiver usando o pacote MeCab distribuído com o MySQL, o arquivo `mecabrc` está localizado em `MYSQL_HOME/lib/mecab/etc/`.

   ```sql
   [mysqld]
   loose-mecab-rc-file=MYSQL_HOME/lib/mecab/etc/mecabrc
   ```

   O prefixo `loose` é um modificador de opção. A opção `mecab_rc_file` não é reconhecida pelo MySQL até que o plugin do analisador MeCaB seja instalado, mas ele deve ser definido antes de tentar instalar o plugin do analisador MeCaB. O prefixo `loose` permite que você reinicie o MySQL sem encontrar um erro devido a uma variável não reconhecida.

   Se você usa sua própria instalação do MeCab ou compila o MeCab a partir da fonte, o local do arquivo de configuração `mecabrc` pode ser diferente.

   Para obter informações sobre o arquivo de configuração do MySQL e sua localização, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

2. Além disso, no arquivo de configuração do MySQL, defina o tamanho mínimo do token para 1 ou 2, que são os valores recomendados para uso com o analisador MeCab. Para as tabelas `InnoDB`, o tamanho mínimo do token é definido pela opção de configuração `innodb_ft_min_token_size`, que tem um valor padrão de 3. Para as tabelas `MyISAM`, o tamanho mínimo do token é definido por `ft_min_word_len`, que tem um valor padrão de 4.

   ```sql
   [mysqld]
   innodb_ft_min_token_size=1
   ```

3. Modifique o arquivo de configuração `mecabrc` para especificar o dicionário que você deseja usar. O pacote `mecab-ipadic` distribuído com os binários do MySQL inclui três dicionários (`ipadic_euc-jp`, `ipadic_sjis` e `ipadic_utf-8`). O arquivo de configuração `mecabrc` incluído com o MySQL contém uma entrada semelhante à seguinte:

   ```sql
   dicdir =  /path/to/mysql/lib/mecab/lib/mecab/dic/ipadic_euc-jp
   ```

   Para usar o dicionário `ipadic_utf-8`, por exemplo, modifique a entrada da seguinte forma:

   ```sql
   dicdir=MYSQL_HOME/lib/mecab/dic/ipadic_utf-8
   ```

   Se você estiver usando sua própria instalação do MeCab ou construiu o MeCab a partir do código-fonte, a entrada padrão `dicdir` no arquivo `mecabrc` difere, assim como os dicionários e sua localização.

   Nota

   Depois que o plugin do analisador MeCab é instalado, você pode usar a variável de status `mecab_charset` para visualizar o conjunto de caracteres usado com o MeCab. Os três dicionários do MeCab fornecidos com o suporte binário do MySQL suportam os seguintes conjuntos de caracteres.

   - O dicionário `ipadic_euc-jp` suporta os conjuntos de caracteres `ujis` e `eucjpms`.

   - O dicionário `ipadic_sjis` suporta os conjuntos de caracteres `sjis` e `cp932`.

   - O dicionário `ipadic_utf-8` suporta os conjuntos de caracteres `utf8` e `utf8mb4`.

   `mecab_charset` apenas relata o primeiro conjunto de caracteres suportado. Por exemplo, o dicionário `ipadic_utf-8` suporta tanto `utf8` quanto `utf8mb4`. `mecab_charset` sempre relata `utf8` quando este dicionário está em uso.

4. Reinicie o MySQL.

5. Instale o plugin do analisador MeCab:

   O plugin analisador MeCab é instalado usando `INSTALL PLUGIN`. O nome do plugin é `mecab` e o nome da biblioteca compartilhada é `libpluginmecab.so`. Para obter informações adicionais sobre a instalação de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

   ```sql
   INSTALL PLUGIN mecab SONAME 'libpluginmecab.so';
   ```

   Uma vez instalado, o plugin de analisador MeCab é carregado a cada reinício normal do MySQL.

6. Verifique se o plugin do analisador MeCab está carregado usando a instrução `SHOW PLUGINS`.

   ```sql
   mysql> SHOW PLUGINS;
   ```

   Um plugin `mecab` deve aparecer na lista de plugins.

#### Criando um índice FULLTEXT que usa o Parser MeCab

Para criar um índice `FULLTEXT` que use o analisador mecab, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

Este exemplo demonstra como criar uma tabela com um índice `FULLTEXT` do `mecab`, inserir dados de exemplo e visualizar dados tokenizados na tabela do esquema de informações `INNODB_FT_INDEX_CACHE`:

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

Para adicionar um índice `FULLTEXT` a uma tabela existente, você pode usar `ALTER TABLE` ou `CREATE INDEX`. Por exemplo:

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

#### Manipulação de Espaço do Parser MeCab

O analisador MeCab usa espaços como separadores nas cadeias de caracteres de consulta. Por exemplo, o analisador MeCab tokeniza データベース管理 como データベース e 管理.

#### Tratamento de palavras-chave de parada do MeCab Parser

Por padrão, o analisador MeCab usa a lista de palavras-chave padrão, que contém uma lista curta de palavras-chave em inglês. Para uma lista de palavras-chave aplicável ao japonês, você deve criar a sua própria. Para obter informações sobre como criar listas de palavras-chave, consulte a Seção 12.9.4, “Palavras-chave de Texto Completo”.

#### Busca de termos pelo Parser MeCab

Para a pesquisa no modo de linguagem natural, o termo de busca é convertido em uma união de tokens. Por exemplo, データベース管理 é convertido em データベース 管理.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース管理' IN NATURAL LANGUAGE MODE);
```

Para a pesquisa no modo booleano, o termo de pesquisa é convertido em uma frase de pesquisa. Por exemplo, データベース管理 é convertido em データベース 管理.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース管理' IN BOOLEAN MODE);
```

#### Pesquisas com caracteres especiais no Parser MeCab

Os termos de pesquisa com asterisco não são tokenizados. Uma pesquisa em "banco de dados gerenciamento\*" é realizada no prefixo, "banco de dados gerenciamento".

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース*' IN BOOLEAN MODE);
```

#### Pesquisador de frases do MeCab Parser

As frases são tokenizadas. Por exemplo, "データベース管理" é tokenizado como "GESTÃO DE BANCO DE DADOS".

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('"データベース管理"' IN BOOLEAN MODE);
```

#### Instalando o MeCab a partir de uma distribuição binária (opcional)

Esta seção descreve como instalar o `mecab` e o `mecab-ipadic` a partir de uma distribuição binária usando um utilitário de gerenciamento de pacotes nativo. Por exemplo, no Fedora, você pode usar o Yum para realizar a instalação:

```sql
yum mecab-devel
```

No Debian ou Ubuntu, você pode realizar uma instalação do APT:

```sql
apt-get install mecab
apt-get install mecab-ipadic
```

#### Instalando o MeCab a partir da fonte (opcional)

Se você quiser construir `mecab` e `mecab-ipadic` a partir do código-fonte, as etapas básicas de instalação estão fornecidas abaixo. Para obter informações adicionais, consulte a documentação do MeCab.

1. Baixe os pacotes tar.gz para `mecab` e `mecab-ipadic` a partir de <http://taku910.github.io/mecab/#download>. Em fevereiro de 2016, os pacotes mais recentes disponíveis são `mecab-0.996.tar.gz` e `mecab-ipadic-2.7.0-20070801.tar.gz`.

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

4. Compile o MySQL usando a opção `WITH_MECAB` do CMake. Defina a opção `WITH_MECAB` para `system` se você instalou `mecab` e `mecab-ipadic` no local padrão.

   ```sql
   -DWITH_MECAB=system
   ```

   Se você definiu um diretório de instalação personalizado, defina `WITH_MECAB` para o diretório personalizado. Por exemplo:

   ```sql
   -DWITH_MECAB=/path/to/mecab
   ```
