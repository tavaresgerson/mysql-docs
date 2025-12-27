### 14.9.9 Plugin do Analizador de Texto Completo MeCab

O analisador de texto completo integrado do MySQL usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com línguas ideográficas que não usam delimitadores de palavras. Para atender a essa limitação para o japonês, o MySQL fornece um plugin de analisador de texto completo MeCab. O plugin de analisador de texto completo MeCab é suportado para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um plugin de analisador de texto completo ngram que suporta o japonês. Para mais informações, consulte a Seção 14.9.8, “Analisador de Texto Completo ngram”.

O plugin de analisador de texto completo MeCab é um plugin de analisador de texto completo para japonês que tokeniza uma sequência de texto em palavras significativas. Por exemplo, o MeCab tokeniza “データベース管理” (“Gestão de Bancos de Dados”) em “データベース” (“Banco de Dados”) e “管理” (“Gestão”). Em comparação, o analisador de texto completo ngram tokeniza o texto em uma sequência contínua de *`n`* caracteres, onde *`n`* representa um número entre 1 e 10.

Além de tokenizar o texto em palavras significativas, os índices do MeCab são tipicamente menores que os índices ngram, e as pesquisas de texto completo do MeCab são geralmente mais rápidas. Uma desvantagem é que pode levar mais tempo para o analisador de texto completo MeCab tokenizar documentos, em comparação com o analisador de texto completo ngram.

A sintaxe de pesquisa de texto completo descrita na Seção 14.9, “Funções de Pesquisa de Texto Completo”, se aplica ao plugin do analisador MeCab. As diferenças no comportamento de análise são descritas nesta seção. As opções de configuração relacionadas à pesquisa de texto completo também são aplicáveis.

Para obter informações adicionais sobre o analisador MeCab, consulte o projeto MeCab: Yet Another Part-of-Speech and Morphological Analyzer no Github.

#### Instalando o Plugin do Analizador MeCab

O plugin do analisador MeCab requer `mecab` e `mecab-ipadic`.

Em plataformas suportadas pelo Fedora, Debian e Ubuntu (exceto o Ubuntu 12.04, onde a versão do sistema `mecab` é muito antiga), o MySQL vincula dinamicamente à instalação do sistema `mecab` se ela estiver instalada no local padrão. Em outras plataformas Unix-like suportadas, o `libmecab.so` é vinculado estática e no `libpluginmecab.so`, que está localizado no diretório do plugin MySQL. O `mecab-ipadic` está incluído nos binários do MySQL e está localizado em `MYSQL_HOME\lib\mecab`.

Você pode instalar o `mecab` e o `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo (no Fedora, Debian e Ubuntu) ou você pode compilar o `mecab` e o `mecab-ipadic` a partir da fonte. Para obter informações sobre como instalar o `mecab` e o `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo, consulte "Instalando MeCab a partir de uma distribuição binária (opcional)"). Se você quiser compilar o `mecab` e o `mecab-ipadic` a partir da fonte, consulte "Compilando MeCab a partir da fonte (opcional)").

No Windows, o `libmecab.dll` está localizado no diretório `bin` do MySQL. O `mecab-ipadic` está localizado em `MYSQL_HOME/lib/mecab`.

Para instalar e configurar o plugin do analisador MeCab, siga os seguintes passos:

1. No arquivo de configuração do MySQL, defina a opção de configuração `mecab_rc_file` para o local do arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. Se você estiver usando o pacote MeCab distribuído com o MySQL, o arquivo `mecabrc` está localizado em `MYSQL_HOME/lib/mecab/etc/`.

```
   [mysqld]
   loose-mecab-rc-file=MYSQL_HOME/lib/mecab/etc/mecabrc
   ```aICIFO0XVw```
   [mysqld]
   innodb_ft_min_token_size=1
   ```0fcEDJXd7j```
   dicdir =  /path/to/mysql/lib/mecab/lib/mecab/dic/ipadic_euc-jp
   ```JjxTv9cDlt```
   dicdir=MYSQL_HOME/lib/mecab/dic/ipadic_utf-8
   ```Zf0SCrJkG8```
   INSTALL PLUGIN mecab SONAME 'libpluginmecab.so';
   ```qAKIYCjhB0```
   mysql> SHOW PLUGINS;
   ```3nEUaHRlBm```
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
```p5mRn3mwwj```
CREATE TABLE articles (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(200),
    body TEXT
    ) ENGINE=InnoDB CHARACTER SET utf8mb4;

ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER mecab;

# Or:

CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER mecab;
```FPpaTr3yCo```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース管理' IN NATURAL LANGUAGE MODE);
```XXxfVBjsHt```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース管理' IN BOOLEAN MODE);
```XyOnQEzkq9```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース*' IN BOOLEAN MODE);
```JZcQVDbg9X```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('"データベース管理"' IN BOOLEAN MODE);
```vqVZQttUau```
$> yum mecab-devel
```bnYtQiAU1H```
$> apt-get install mecab
$> apt-get install mecab-ipadic
```bV3GJN3DVH```
   $> tar zxfv mecab-0.996.tar
   $> cd mecab-0.996
   $> ./configure
   $> make
   $> make check
   $> su
   $> make install
   ```SzP2AoQ52M```
   $> tar zxfv mecab-ipadic-2.7.0-20070801.tar
   $> cd mecab-ipadic-2.7.0-20070801
   $> ./configure
   $> make
   $> su
   $> make install
   ```HUpqv1qr9a```
   -DWITH_MECAB=system
   ```qYiYgxWzel```