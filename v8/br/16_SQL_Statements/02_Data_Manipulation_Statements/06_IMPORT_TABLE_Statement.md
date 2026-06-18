### 15.2.6 Declaração da Tabela de Importação

```
IMPORT TABLE FROM sdi_file [, sdi_file] ...
```

A declaração `IMPORT TABLE` importa as tabelas `MyISAM` com base nas informações contidas nos arquivos de metadados `.sdi` (informações em dicionário serializadas). `IMPORT TABLE` requer o privilégio `FILE` para ler os arquivos de conteúdo da `.sdi` e das tabelas, e o privilégio `CREATE` para que a tabela seja criada.

As tabelas podem ser exportadas de um servidor usando o **mysqldump** para criar um arquivo de instruções SQL e importadas em outro servidor usando o **mysql** para processar o arquivo de dump. O `IMPORT TABLE` oferece uma alternativa mais rápida usando os arquivos de tabela "raw".

Antes da importação, os arquivos que fornecem o conteúdo da tabela devem ser colocados no diretório do esquema apropriado para o servidor de importação, e o arquivo `.sdi` deve estar localizado em um diretório acessível ao servidor. Por exemplo, o arquivo `.sdi` pode ser colocado no diretório nomeado pela variável de sistema `secure_file_priv`, ou (se `secure_file_priv` estiver vazio) em um diretório sob o diretório de dados do servidor.

O exemplo a seguir descreve como exportar as tabelas `MyISAM` chamadas `employees` e `managers` do esquema `hr` de um servidor e importá-las no esquema `hr` de outro servidor. O exemplo utiliza essas suposições (para realizar uma operação semelhante no seu próprio sistema, modifique os nomes dos caminhos conforme apropriado):

- Para o servidor de exportação, `export_basedir` representa seu diretório base, e seu diretório de dados é `export_basedir/data`.

- Para o servidor de importação, `import_basedir` representa seu diretório base, e seu diretório de dados é `import_basedir/data`.

- Os arquivos de tabela são exportados do servidor de exportação para o diretório `/tmp/export` e este diretório é seguro (não acessível a outros usuários).

- O servidor de importação usa `/tmp/mysql-files` como o diretório nomeado por sua variável de sistema `secure_file_priv`.

Para exportar tabelas do servidor de exportação, use este procedimento:

1. Garanta uma captura de tela consistente executando esta instrução para bloquear as tabelas, para que não possam ser modificadas durante a exportação:

   ```
   mysql> FLUSH TABLES hr.employees, hr.managers WITH READ LOCK;
   ```

   Enquanto o bloqueio estiver em vigor, as tabelas ainda podem ser usadas, mas apenas para acesso de leitura.

2. No nível do sistema de arquivos, copie os arquivos de conteúdo da tabela `.sdi` e do esquema `hr` do diretório do esquema `hr` para o diretório de exportação seguro:

   - O arquivo `.sdi` está localizado no diretório do esquema `hr`, mas pode não ter exatamente o mesmo nome de base que o nome da tabela. Por exemplo, os arquivos `.sdi` para as tabelas `employees` e `managers` podem ser nomeados `employees_125.sdi` e `managers_238.sdi`.

   - Para uma tabela `MyISAM`, os arquivos de conteúdo são o arquivo de dados `.MYD` e o arquivo de índice `.MYI`.

   Dadas essas nomes de arquivos, os comandos de cópia são os seguintes:

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

1. O esquema de importação deve existir. Se necessário, execute esta instrução para criá-lo:

   ```
   mysql> CREATE SCHEMA hr;
   ```

2. No nível do sistema de arquivos, copie os arquivos `.sdi` para o diretório do servidor de importação `secure_file_priv` `/tmp/mysql-files`. Além disso, copie os arquivos de conteúdo da tabela para o diretório do esquema `hr`:

   ```
   $> cd /tmp/export
   $> cp employees_125.sdi /tmp/mysql-files
   $> cp managers_238.sdi /tmp/mysql-files
   $> cp employees.{MYD,MYI} import_basedir/data/hr
   $> cp managers.{MYD,MYI} import_basedir/data/hr
   ```

3. Importe as tabelas executando uma instrução `IMPORT TABLE` que nomeia os arquivos `.sdi`:

   ```
   mysql> IMPORT TABLE FROM
          '/tmp/mysql-files/employees.sdi',
          '/tmp/mysql-files/managers.sdi';
   ```

O arquivo `.sdi` não precisa ser colocado no diretório do servidor de importação nomeado pela variável de sistema `secure_file_priv`, se essa variável estiver vazia; ele pode estar em qualquer diretório acessível ao servidor, incluindo o diretório do esquema da tabela importada. No entanto, se o arquivo `.sdi` for colocado nesse diretório, ele pode ser sobrescrito; a operação de importação cria um novo arquivo `.sdi` para a tabela, que sobrescreve o antigo arquivo `.sdi` se a operação usar o mesmo nome de arquivo para o novo arquivo.

Cada valor `sdi_file` deve ser uma literal de string que nomeia o arquivo `.sdi` para uma tabela ou é um padrão que corresponde aos arquivos `.sdi`. Se a string for um padrão, o caminho do diretório inicial e o sufixo do nome do arquivo `.sdi` devem ser fornecidos literalmente. Os caracteres de padrão são permitidos apenas na parte de base do nome do arquivo:

- `?` corresponde a qualquer caractere único
- `*` corresponde a qualquer sequência de caracteres, incluindo nenhum caractere

Usando um padrão, a declaração anterior `IMPORT TABLE` poderia ter sido escrita assim (assumindo que o diretório `/tmp/mysql-files` não contém outros arquivos `.sdi` que correspondam ao padrão):

```
IMPORT TABLE FROM '/tmp/mysql-files/*.sdi';
```

Para interpretar os caminhos de arquivos dos nomes de arquivos `.sdi`, o servidor usa as mesmas regras para `IMPORT TABLE` que as regras do lado do servidor para `LOAD DATA` (ou seja, as regras que não são `LOCAL`). Veja a Seção 15.2.9, “Instrução LOAD DATA”, prestando atenção especial às regras usadas para interpretar nomes de caminhos relativos.

`IMPORT TABLE` falha se os arquivos de tabela `.sdi` ou não puderem ser localizados. Após a importação de uma tabela, o servidor tenta abri-la e reporta como avisos quaisquer problemas detectados. Para tentar uma reparação para corrigir quaisquer problemas relatados, use `REPAIR TABLE`.

`IMPORT TABLE` não é escrito no log binário.

#### Restrições e Limitações

`IMPORT TABLE` aplica-se apenas a tabelas não `TEMPORARY` `MyISAM` de armazenamento. Não se aplica a tabelas criadas com um motor de armazenamento transacional, tabelas criadas com `CREATE TEMPORARY TABLE` ou visualizações.

Um arquivo `.sdi` usado em uma operação de importação deve ser gerado em um servidor com a mesma versão do dicionário de dados e versão do sdi do servidor de importação. As informações da versão do servidor gerador estão no arquivo `.sdi`:

```
{
   "mysqld_version_id":80019,
   "dd_version":80017,
   "sdi_version":80016,
   ...
}
```

Para determinar o dicionário de dados e a versão do servidor de importação, você pode verificar o arquivo `.sdi` de uma tabela criada recentemente no servidor de importação.

Os arquivos de dados da tabela e de índice devem ser colocados no diretório schema do servidor de importação antes da operação de importação, a menos que a tabela, conforme definida no servidor de exportação, utilize as opções de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`. Nesse caso, modifique o procedimento de importação usando uma dessas alternativas antes de executar a instrução `IMPORT TABLE`:

- Coloque os arquivos de dados e índice no mesmo diretório no host do servidor de importação, como no host do servidor de exportação, e crie links simbólicos no diretório do esquema do servidor de importação para esses arquivos.

- Coloque os arquivos de dados e índice em um diretório de servidor de importação diferente do do servidor de exportação, e crie links simbólicos no diretório do esquema do servidor de importação para esses arquivos. Além disso, modifique o arquivo `.sdi` para refletir as diferentes localizações dos arquivos.

- Coloque os arquivos de dados e índice no diretório schema no host do servidor de importação e modifique o arquivo `.sdi` para remover as opções de diretórios de dados e índice.

Quaisquer IDs de collation armazenados no arquivo `.sdi` devem se referir às mesmas collation nos servidores de exportação e importação.

As informações de ativação de uma tabela não são serializadas no arquivo da tabela `.sdi`, portanto, os gatilhos não são restaurados pela operação de importação.

Algumas edições em um arquivo `.sdi` são permitidas antes de executar a instrução `IMPORT TABLE`, enquanto outras são problemáticas ou podem até causar o falhanço da operação de importação:

- É necessário alterar as opções da tabela de diretórios de dados e diretórios de índice se os locais dos arquivos de dados e de índice forem diferentes entre os servidores de exportação e importação.

- É necessário alterar o nome do esquema para importar a tabela em um esquema diferente no servidor de importação em comparação com o servidor de exportação.

- Pode ser necessário alterar o esquema e os nomes das tabelas para acomodar diferenças entre as semânticas de sensibilidade de caso do sistema de arquivos nos servidores de exportação e importação ou diferenças nas configurações do `lower_case_table_names`. Para alterar os nomes das tabelas no arquivo `.sdi`, pode ser necessário renomear os arquivos das tabelas também.

- Em alguns casos, as alterações nas definições das colunas são permitidas. Alterar os tipos de dados provavelmente causará problemas.
