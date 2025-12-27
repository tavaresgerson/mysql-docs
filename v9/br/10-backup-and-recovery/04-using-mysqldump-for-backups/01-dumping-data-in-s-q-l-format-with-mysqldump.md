### 9.4.1 Exportação de Dados no Formato SQL com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de exportação no formato SQL. Para obter informações sobre a recarga desses arquivos de exportação, consulte a Seção 9.4.2, “Recarga de Backup no Formato SQL”.

Por padrão, o **mysqldump** escreve informações como instruções SQL no saída padrão. Você pode salvar a saída em um arquivo:

```
$> mysqldump [arguments] > file_name
```

Para exportar todas as bases de dados, invocando o **mysqldump** com a opção `--all-databases`:

```
$> mysqldump --all-databases > dump.sql
```

Para exportar apenas bases de dados específicas, nomeie-as na linha de comando e use a opção `--databases`:

```
$> mysqldump --databases db1 db2 db3 > dump.sql
```

A opção `--databases` faz com que todos os nomes na linha de comando sejam tratados como nomes de base de dados. Sem essa opção, o **mysqldump** trata o primeiro nome como um nome de base de dados e os seguintes como nomes de tabelas.

Com `--all-databases` ou `--databases`, o **mysqldump** escreve as instruções `CREATE DATABASE` e `USE` antes da saída de exportação para cada base de dados. Isso garante que, quando o arquivo de exportação é carregado novamente, ele cria cada base de dados se ela não existir e a torna a base de dados padrão, para que o conteúdo da base de dados seja carregado na mesma base de dados de onde veio. Se você quiser fazer com que o arquivo de exportação force a eliminação de cada base de dados antes de recriá-la, use também a opção `--add-drop-database`. Nesse caso, o **mysqldump** escreve uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`.

Para exportar uma única base de dados, nomeie-a na linha de comando:

```
$> mysqldump --databases test > dump.sql
```

No caso de uma única base de dados, é permitido omitir a opção `--databases`:

```
$> mysqldump test > dump.sql
```

A diferença entre os dois comandos anteriores é que, sem `--databases`, a saída de exportação não contém instruções `CREATE DATABASE` ou `USE`. Isso tem várias implicações:

* Ao recarregar o arquivo de dump, você deve especificar um nome de banco de dados padrão para que o servidor saiba qual banco de dados recarregar.

* Para recarregar, você pode especificar um nome de banco de dados diferente do nome original, o que permite recarregar os dados em um banco de dados diferente.

* Se o banco de dados a ser recarregado não existir, você deve criá-lo primeiro.

* Como a saída não contém a instrução `CREATE DATABASE`, a opção `--add-drop-database` não tem efeito. Se você a usar, ela não produz a instrução `DROP DATABASE`.

Para drenar apenas tabelas específicas de um banco de dados, nomeie-as na linha de comando após o nome do banco de dados:

```
$> mysqldump test t1 t3 t7 > dump.sql
```

Por padrão, se os GTIDs estiverem em uso no servidor onde você cria o arquivo de dump (`gtid_mode=ON`), o **mysqldump** inclui uma declaração `SET @@GLOBAL.gtid_purged` no resultado para adicionar os GTIDs do conjunto `gtid_executed` no servidor de origem ao conjunto `gtid_purged` no servidor de destino. Se você está fazendo o dump apenas de bancos de dados ou tabelas específicos, é importante notar que o valor incluído pelo **mysqldump** inclui os GTIDs de todas as transações no conjunto `gtid_executed` no servidor de origem, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos no dump parcial. Se você apenas reproduzir um arquivo de dump parcial no servidor de destino, os GTIDs extras não causam problemas com o funcionamento futuro desse servidor. No entanto, se você reproduzir um segundo arquivo de dump no servidor de destino que contém os mesmos GTIDs (por exemplo, outro dump parcial do mesmo servidor de origem), qualquer declaração `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falha. Para evitar esse problema, configure a opção **mysqldump** `--set-gtid-purged` para `OFF` ou `COMMENTED` para emitir o segundo arquivo de dump sem uma declaração ativa `SET @@GLOBAL.gtid_purged`, ou remova a declaração manualmente antes de reproduzir o arquivo de dump.