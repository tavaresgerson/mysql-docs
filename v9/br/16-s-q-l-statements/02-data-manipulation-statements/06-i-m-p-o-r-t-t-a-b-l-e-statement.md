### 15.2.6 Declaração de IMPOR TABLE

```
IMPORT TABLE FROM sdi_file [, sdi_file] ...
```

A declaração `IMPORT TABLE` importa tabelas `MyISAM` com base nas informações contidas nos arquivos de metadados `.sdi` (informações de dicionário serializado). A `IMPORT TABLE` requer o privilégio `FILE` para ler os arquivos de conteúdo `.sdi` e de tabela, e o privilégio `CREATE` para que a tabela seja criada.

As tabelas podem ser exportadas de um servidor usando **mysqldump** para escrever um arquivo de declarações SQL e importadas em outro servidor usando **mysql** para processar o arquivo de dump. A `IMPORT TABLE` oferece uma alternativa mais rápida usando os arquivos de tabela "brutos".

Antes da importação, os arquivos que fornecem o conteúdo da tabela devem ser colocados no diretório apropriado do esquema para o servidor de importação, e o arquivo `.sdi` deve estar localizado em um diretório acessível ao servidor. Por exemplo, o arquivo `.sdi` pode ser colocado no diretório nomeado pela variável de sistema `secure_file_priv`, ou (se `secure_file_priv` estiver vazio) em um diretório sob o diretório de dados do servidor.

O exemplo a seguir descreve como exportar tabelas `MyISAM` chamadas `employees` e `managers` do esquema `hr` de um servidor e importá-las no esquema `hr` de outro servidor. O exemplo usa essas suposições (para realizar uma operação semelhante no seu próprio sistema, modifique os nomes de caminho conforme apropriado):

* Para o servidor de exportação, *`export_basedir`* representa seu diretório base, e seu diretório de dados é `export_basedir/data`.

* Para o servidor de importação, *`import_basedir`* representa seu diretório base, e seu diretório de dados é `import_basedir/data`.

* Os arquivos de tabela são exportados do servidor de exportação para o diretório `/tmp/export` e este diretório é seguro (não acessível a outros usuários).

* O servidor de importação usa `/tmp/mysql-files` como o diretório nomeado por sua variável de sistema `secure_file_priv`.

Para exportar tabelas do servidor de exportação, use este procedimento:

1. Garanta uma instantânea consistente executando esta declaração para bloquear as tabelas para que não possam ser modificadas durante a exportação:

   ```
   mysql> FLUSH TABLES hr.employees, hr.managers WITH READ LOCK;
   ```

   Enquanto o bloqueio estiver em vigor, as tabelas ainda podem ser usadas, mas apenas para acesso de leitura.

2. No nível do sistema de arquivos, copie os arquivos `.sdi` e de conteúdo da tabela do diretório do esquema `hr` para o diretório de exportação seguro:

   * O arquivo `.sdi` está localizado no diretório do esquema `hr`, mas pode não ter exatamente o mesmo nome de base que o nome da tabela. Por exemplo, os arquivos `.sdi` para as tabelas `employees` e `managers` podem ser chamados de `employees_125.sdi` e `managers_238.sdi`.

   * Para uma tabela `MyISAM`, os arquivos de conteúdo são seu arquivo de dados `.MYD` e arquivo de índice `.MYI`.

Dadas esses nomes de arquivos, os comandos de cópia são assim:

```
   $> cd export_basedir/data/hr
   $> cp employees_125.sdi /tmp/export
   $> cp managers_238.sdi /tmp/export
   $> cp employees.{MYD,MYI} /tmp/export
   $> cp managers.{MYD,MYI} /tmp/export
   ```

3. Desbloqueie as tabelas:

```
   mysql> UNLOCK TABLES;
   ```

Para importar tabelas no servidor de importação, use este procedimento:

1. O esquema de importação deve existir. Se necessário, execute esta declaração para criá-lo:

   ```
   mysql> CREATE SCHEMA hr;
   ```

2. No nível do sistema de arquivos, copie os arquivos `.sdi` para o diretório `secure_file_priv` do servidor de importação, `/tmp/mysql-files`. Além disso, copie os arquivos de conteúdo da tabela para o diretório do esquema `hr`:

```
   $> cd /tmp/export
   $> cp employees_125.sdi /tmp/mysql-files
   $> cp managers_238.sdi /tmp/mysql-files
   $> cp employees.{MYD,MYI} import_basedir/data/hr
   $> cp managers.{MYD,MYI} import_basedir/data/hr
   ```

3. Importe as tabelas executando uma declaração `IMPORT TABLE` que nomeia os arquivos `.sdi`:

```
   mysql> IMPORT TABLE FROM
          '/tmp/mysql-files/employees.sdi',
          '/tmp/mysql-files/managers.sdi';
   ```

O arquivo `.sdi` não precisa ser colocado no diretório do servidor de importação nomeado pela variável de sistema `secure_file_priv`, se essa variável estiver vazia; ele pode estar em qualquer diretório acessível ao servidor, incluindo o diretório do esquema da tabela importada. No entanto, se o arquivo `.sdi` for colocado nesse diretório, ele pode ser sobrescrito; a operação de importação cria um novo arquivo `.sdi` para a tabela, que sobrescreve o arquivo `.sdi` antigo se a operação usar o mesmo nome de arquivo para o novo arquivo.

Cada valor de *`sdi_file`* deve ser uma literal de string que nomeia o arquivo `.sdi` para uma tabela ou é um padrão que corresponde a arquivos `.sdi`. Se a string for um padrão, qualquer caminho de diretório inicial e o sufixo do nome do arquivo `.sdi` devem ser fornecidos literalmente. Caracteres de padrão são permitidos apenas na parte de nome de base do nome do arquivo:

* `?` corresponde a qualquer único caractere
* `*` corresponde a qualquer sequência de caracteres, incluindo nenhum caractere

Usando um padrão, a declaração anterior `IMPORT TABLE` poderia ter sido escrita assim (assumindo que o diretório `/tmp/mysql-files` não contém outros arquivos `.sdi` que correspondam ao padrão):

```
IMPORT TABLE FROM '/tmp/mysql-files/*.sdi';
```

Para interpretar o caminho do nome do arquivo `.sdi`, o servidor usa as mesmas regras para `IMPORT TABLE` que as regras do lado do servidor para `LOAD DATA` (ou seja, as regras não `LOCAL`). Veja a Seção 15.2.9, “Instrução LOAD DATA”, prestando atenção especial às regras usadas para interpretar nomes de caminhos relativos.

`IMPORT TABLE` falha se os arquivos `.sdi` ou de tabela não puderem ser localizados. Após importar uma tabela, o servidor tenta abri-la e reporta como avisos quaisquer problemas detectados. Para tentar uma reparação para corrigir quaisquer problemas relatados, use `REPAIR TABLE`.

`IMPORT TABLE` não é escrito no log binário.

#### Restrições e Limitações

A opção `IMPORT TABLE` só se aplica a tabelas não `TEMPORARY` de `MyISAM`. Ela não se aplica a tabelas criadas com um motor de armazenamento transacional, tabelas criadas com `CREATE TEMPORARY TABLE` ou views.

Um arquivo `.sdi` usado em uma operação de importação deve ser gerado em um servidor com a mesma versão do dicionário de dados e a mesma versão do sdi do servidor de importação. As informações da versão do servidor gerador estão no arquivo `.sdi`:

```
{
   "mysqld_version_id":80019,
   "dd_version":80017,
   "sdi_version":80016,
   ...
}
```

Para determinar a versão do dicionário de dados e do sdi do servidor de importação, você pode verificar o arquivo `.sdi` de uma tabela criada recentemente no servidor de importação.

Os arquivos de dados e índices da tabela devem ser colocados no diretório do esquema do servidor de importação antes da operação de importação, a menos que a tabela, conforme definida no servidor de exportação, use as opções de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`. Nesse caso, modifique o procedimento de importação usando uma dessas alternativas antes de executar a instrução `IMPORT TABLE`:

* Coloque os arquivos de dados e índices no mesmo diretório no host do servidor de importação que no host do servidor de exportação, e crie links simbólicos no diretório do esquema do servidor de importação para esses arquivos.

* Coloque os arquivos de dados e índices em um diretório de host de servidor de importação diferente do host do servidor de exportação, e crie links simbólicos no diretório do esquema do servidor de importação para esses arquivos. Além disso, modifique o arquivo `.sdi` para refletir as diferentes localizações dos arquivos.

* Coloque os arquivos de dados e índices no diretório do esquema no host do servidor de importação, e modifique o arquivo `.sdi` para remover as opções de diretório de dados e índice.

Quaisquer IDs de codificação de caracteres armazenados no arquivo `.sdi` devem se referir às mesmas codificações de caracteres nos servidores de exportação e importação.

As informações de disparo para uma tabela não são serializadas no arquivo `.sdi` da tabela, portanto, os disparadores não são restaurados pela operação de importação.

Algumas edições em um arquivo `.sdi` são permitidas antes de executar a declaração `IMPORT TABLE`, enquanto outras são problemáticas ou podem até causar o falha da operação de importação:

* É necessário alterar as opções de diretório de dados e diretório de índice se as localizações dos arquivos de dados e de índice diferirem entre os servidores de exportação e importação.

* É necessário alterar o nome do esquema para importar a tabela para um esquema diferente no servidor de importação do que no servidor de exportação.

* Pode ser necessário alterar os nomes do esquema e da tabela para acomodar diferenças entre as semânticas de case-sensitivity do sistema de arquivos nos servidores de exportação e importação ou diferenças nas configurações de `lower_case_table_names`. Alterar os nomes das tabelas no arquivo `.sdi` pode exigir a renomeação dos arquivos da tabela também.

* Em alguns casos, alterações nas definições de colunas são permitidas. Alterar os tipos de dados provavelmente causará problemas.