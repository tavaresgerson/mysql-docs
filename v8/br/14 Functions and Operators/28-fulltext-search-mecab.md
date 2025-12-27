### 14.9.9 Plugin do Analizador de Texto Completo MeCab

O analisador de texto completo integrado do MySQL usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não usam delimitadores de palavras. Para atender a essa limitação para o japonês, o MySQL fornece um plugin de analisador de texto completo MeCab. O plugin de analisador de texto completo MeCab é suportado para uso com `InnoDB` e `MyISAM`.

::: info Nota

O MySQL também fornece um plugin de analisador de texto completo ngram que suporta o japonês. Para mais informações, consulte a Seção 14.9.8, “Analisador de Texto Completo ngram”.


:::

O plugin de analisador de texto completo MeCab é um plugin de analisador de texto completo para japonês que tokeniza uma sequência de texto em palavras significativas. Por exemplo, o MeCab tokeniza “データベース管理” (“Gestão de Bancos de Dados”) em “データベース” (“Banco de Dados”) e “管理” (“Gestão”). Em comparação, o analisador de texto completo ngram tokeniza o texto em uma sequência contínua de *`n`* caracteres, onde *`n`* representa um número entre 1 e 10.

Além de tokenizar o texto em palavras significativas, os índices do MeCab são tipicamente menores que os índices ngram, e as pesquisas de texto completo do MeCab são geralmente mais rápidas. Uma desvantagem é que pode levar mais tempo para o analisador de texto completo do MeCab tokenizar documentos, em comparação com o analisador de texto completo ngram.

A sintaxe de pesquisa de texto completo descrita na Seção 14.9, “Funções de Pesquisa de Texto Completo”, se aplica ao plugin do analisador MeCab. As diferenças no comportamento de análise são descritas nesta seção. As opções de configuração relacionadas à pesquisa de texto completo também são aplicáveis.

Para obter informações adicionais sobre o analisador MeCab, consulte o projeto MeCab: Yet Another Part-of-Speech and Morphological Analyzer no Github.

#### Instalando o Plugin do Analizador MeCab

O plugin do analisador MeCab requer `mecab` e `mecab-ipadic`.

Em plataformas suportadas pelo Fedora, Debian e Ubuntu (exceto o Ubuntu 12.04, onde a versão do sistema `mecab` é muito antiga), o MySQL vincula dinamicamente à instalação do sistema `mecab` se ela estiver instalada no local padrão. Em outras plataformas Unix-like suportadas, o `libmecab.so` é vinculado staticamente no `libpluginmecab.so`, que está localizado no diretório do plugin MySQL. O `mecab-ipadic` está incluído nos binários do MySQL e está localizado em `MYSQL_HOME\lib\mecab`.

Você pode instalar o `mecab` e o `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo (no Fedora, Debian e Ubuntu) ou você pode compilar o `mecab` e o `mecab-ipadic` a partir da fonte. Para obter informações sobre como instalar o `mecab` e o `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo, consulte "Instalando MeCab a partir de uma distribuição binária (opcional)"). Se você quiser compilar o `mecab` e o `mecab-ipadic` a partir da fonte, consulte "Compilando MeCab a partir da fonte (opcional)").

No Windows, o `libmecab.dll` está localizado no diretório `bin` do MySQL. O `mecab-ipadic` está localizado em `MYSQL_HOME/lib/mecab`.

Para instalar e configurar o plugin do analisador MeCab, siga os seguintes passos:

1. No arquivo de configuração do MySQL, defina a opção de configuração `mecab_rc_file` para o local do arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. Se você estiver usando o pacote MeCab distribuído com o MySQL, o arquivo `mecabrc` está localizado em `MYSQL_HOME/lib/mecab/etc/`.

```
   [mysqld]
   loose-mecab-rc-file=MYSQL_HOME/lib/mecab/etc/mecabrc
   ```

O prefixo `loose` é um modificador de opção. A opção `mecab_rc_file` não é reconhecida pelo MySQL até que o plugin do analisador MeCab seja instalado, mas deve ser definida antes de tentar instalar o plugin do analisador MeCab. O prefixo `loose` permite que você reinicie o MySQL sem encontrar um erro devido a uma variável não reconhecida.

Se você usar sua própria instalação do MeCab ou compilar o MeCab a partir da fonte, o local do arquivo de configuração `mecabrc` pode diferir.

Para obter informações sobre o arquivo de configuração do MySQL e sua localização, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.
2. Também no arquivo de configuração do MySQL, defina o tamanho mínimo do token para 1 ou 2, que são os valores recomendados para uso com o analisador MeCab. Para tabelas `InnoDB`, o tamanho mínimo do token é definido pela opção de configuração `innodb_ft_min_token_size`, que tem um valor padrão de 3. Para tabelas `MyISAM`, o tamanho mínimo do token é definido por `ft_min_word_len`, que tem um valor padrão de 4.

```
   [mysqld]
   innodb_ft_min_token_size=1
   ```
3. Modifique o arquivo de configuração `mecabrc` para especificar o dicionário que você deseja usar. O pacote `mecab-ipadic` distribuído com os binários do MySQL inclui três dicionários (`ipadic_euc-jp`, `ipadic_sjis` e `ipadic_utf-8`). O arquivo de configuração `mecabrc` embalado com o MySQL contém uma entrada semelhante à seguinte:

```
   dicdir =  /path/to/mysql/lib/mecab/lib/mecab/dic/ipadic_euc-jp
   ```

Para usar o dicionário `ipadic_utf-8`, por exemplo, modifique a entrada da seguinte forma:

```
   dicdir=MYSQL_HOME/lib/mecab/dic/ipadic_utf-8
   ```

Se você estiver usando sua própria instalação do MeCab ou construiu o MeCab a partir do código-fonte, a entrada `dicdir` padrão no arquivo `mecabrc` provavelmente será diferente, assim como os dicionários e sua localização.

::: info Nota

Após o plugin do analisador MeCab ser instalado, você pode usar a variável de status `mecab_charset` para visualizar o conjunto de caracteres usado com o MeCab. Os três dicionários do MeCab fornecidos com o binário do MySQL suportam os seguintes conjuntos de caracteres.

* O dicionário `ipadic_euc-jp` suporta os conjuntos de caracteres `ujis` e `eucjpms`.
* O dicionário `ipadic_sjis` suporta os conjuntos de caracteres `sjis` e `cp932`.
* O dicionário `ipadic_utf-8` suporta os conjuntos de caracteres `utf8mb3` e `utf8mb4`.

O `mecab_charset` apenas relata o primeiro conjunto de caracteres suportado. Por exemplo, o dicionário `ipadic_utf-8` suporta tanto `utf8mb3` quanto `utf8mb4`. O `mecab_charset` sempre relata `utf8` quando este dicionário está em uso.

O plugin analisador MeCab é instalado usando `INSTALL PLUGIN`. O nome do plugin é `mecab`, e o nome da biblioteca compartilhada é `libpluginmecab.so`. Para obter informações adicionais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

```
   INSTALL PLUGIN mecab SONAME 'libpluginmecab.so';
   ```

Uma vez instalado, o plugin analisador MeCab é carregado em cada reinício normal do MySQL.
6. Verifique se o plugin analisador MeCab está carregado usando a instrução `SHOW PLUGINS`.

```
   mysql> SHOW PLUGINS;
   ```

Um plugin `mecab` deve aparecer na lista de plugins.

#### Criando um Índex FULLTEXT que usa o Analisador MeCab

Para criar um índice `FULLTEXT` que usa o analisador mecab, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

Este exemplo demonstra a criação de uma tabela com um índice `mecab` `FULLTEXT`, inserindo dados de amostra e visualizando dados tokenizados na tabela do Schema de Informações `INNODB_FT_INDEX_CACHE`:

```
mysql> USE test;

mysql> CREATE TABLE articles (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(200),
    body TEXT,
    FULLTEXT (title,body) WITH PARSER mecab
    ) ENGINE=InnoDB CHARACTER SET utf8mb4;

mysql> SET NAMES utf8mb4;

mysql> INSERT INTO articles (title,body) VALUES
    ('データベース管理','このチュートリアルでは、私はどのようにデータベースを管理する方法を紹介します'),
    ('データベースアプリケーション開発','データベースアプリケーションを開発することを学ぶ');

mysql> SET GLOBAL innodb_ft_aux_table="test/articles";

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE ORDER BY doc_id, position;
```

Para adicionar um índice `FULLTEXT` a uma tabela existente, você pode usar `ALTER TABLE` ou `CREATE INDEX`. Por exemplo:

```
CREATE TABLE articles (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(200),
    body TEXT
    ) ENGINE=InnoDB CHARACTER SET utf8mb4;

ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER mecab;

# Or:

CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER mecab;
```

#### Gerenciamento de Espaço do Analisador MeCab

O analisador MeCab usa espaços como separadores em strings de consulta. Por exemplo, o analisador MeCab tokeniza データベース管理 como データベース e 管理.

#### Gerenciamento de Palavras-chave do Analisador MeCab

Por padrão, o analisador MeCab usa a lista de palavras-chave padrão, que contém uma lista curta de palavras-chave em inglês. Para uma lista de palavras-chave aplicável ao japonês, você deve criar a sua própria. Para obter informações sobre a criação de listas de palavras-chave, consulte a Seção 14.9.4, “Palavras-chave de Texto Completo”.

#### Busca de Termos do Analisador MeCab

Para a busca no modo de linguagem natural, o termo de busca é convertido em uma união de tokens. Por exemplo, データベース管理 é convertido em データベース 管理.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース管理' IN NATURAL LANGUAGE MODE);
```

Para a busca no modo booleano, o termo de busca é convertido em uma frase de busca. Por exemplo, データベース管理 é convertido em データベース 管理.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース管理' IN BOOLEAN MODE);
```

#### Busca com Caracteres Mistas do Analisador MeCab

Os termos de busca com caracteres mistos não são tokenizados. Uma busca em データベース管理\* é realizada no prefixo, データベース管理.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース*' IN BOOLEAN MODE);
```

#### Busca de Frases pelo Parser MeCab

As frases são tokenizadas. Por exemplo, `データベース管理` é tokenizado como `データベース 管理`.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('"データベース管理"' IN BOOLEAN MODE);
```

#### Instalando o MeCab a partir de uma Distribuição Binária (Opcional)

Esta seção descreve como instalar o `mecab` e o `mecab-ipadic` a partir de uma distribuição binária usando uma ferramenta de gerenciamento de pacotes nativa. Por exemplo, no Fedora, você pode usar o Yum para realizar a instalação:

```
$> yum mecab-devel
```

No Debian ou Ubuntu, você pode realizar uma instalação APT:

```
$> apt-get install mecab
$> apt-get install mecab-ipadic
```

#### Instalando o MeCab a partir de Código-Fonte (Opcional)

Se você quiser construir o `mecab` e o `mecab-ipadic` a partir do código-fonte, as etapas básicas de instalação estão fornecidas abaixo. Para informações adicionais, consulte a documentação do MeCab.

1. Baixe os pacotes tar.gz para `mecab` e `mecab-ipadic` a partir de <http://taku910.github.io/mecab/#download>. Até fevereiro de 2016, os pacotes mais recentes disponíveis são `mecab-0.996.tar.gz` e `mecab-ipadic-2.7.0-20070801.tar.gz`.
2. Instale o `mecab`:

   ```
   $> tar zxfv mecab-0.996.tar
   $> cd mecab-0.996
   $> ./configure
   $> make
   $> make check
   $> su
   $> make install
   ```
3. Instale o `mecab-ipadic`:

   ```
   $> tar zxfv mecab-ipadic-2.7.0-20070801.tar
   $> cd mecab-ipadic-2.7.0-20070801
   $> ./configure
   $> make
   $> su
   $> make install
   ```
4. Compile o MySQL usando a opção `WITH_MECAB` do CMake. Defina a opção `WITH_MECAB` para `system` se você instalou `mecab` e `mecab-ipadic` no local padrão.

   ```
   -DWITH_MECAB=system
   ```

   Se você definiu um diretório de instalação personalizado, defina `WITH_MECAB` para o diretório personalizado. Por exemplo:

   ```
   -DWITH_MECAB=/path/to/mecab
   ```