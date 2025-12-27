### 9.5.1 Recuperação em Ponto no Tempo Usando o Log Binário

Esta seção explica a ideia geral de usar o log binário para realizar uma recuperação em ponto no tempo. A seção seguinte, Seção 9.5.2, “Recuperação em Ponto no Tempo Usando Posições de Eventos”, explica a operação em detalhes com um exemplo.

::: info Nota

Muitos dos exemplos nesta e na próxima seção usam o cliente `mysql` para processar a saída do log binário produzida pelo   `mysqlbinlog`. Se o seu log binário contiver caracteres `\0` (nulos), essa saída não pode ser analisada pelo `mysql` a menos que você invoque-o com a opção  `--binary-mode`.

:::

A fonte de informações para a recuperação em ponto no tempo é o conjunto de arquivos de log binário gerados após a operação de backup completo. Portanto, para permitir que um servidor seja restaurado a um ponto no tempo, o registro binário deve estar habilitado nele, o que é o ajuste padrão para o MySQL 8.4 (veja  Seção 7.4.4, “O Log Binário”).

Para restaurar dados do log binário, você deve conhecer o nome e a localização dos arquivos de log binário atuais. Por padrão, o servidor cria arquivos de log binário no diretório de dados, mas um nome de caminho pode ser especificado com a opção `--log-bin` para colocar os arquivos em um local diferente. Para ver uma lista de todos os arquivos de log binário, use esta declaração:

```
mysql> SHOW BINARY LOGS;
```

Para determinar o nome do arquivo de log binário atual, execute a seguinte declaração:

```
mysql> SHOW BINARY LOG STATUS;
```

O utilitário   `mysqlbinlog` converte os eventos nos arquivos de log binário do formato binário para texto para que possam ser visualizados ou aplicados. O   `mysqlbinlog` tem opções para selecionar seções do log binário com base nos tempos dos eventos ou na posição dos eventos dentro do log. Veja Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.

Aplicar eventos do log binário faz com que as modificações de dados que eles representam sejam reexecutadas. Isso permite a recuperação de alterações de dados para um determinado período de tempo. Para aplicar eventos do log binário, processe a saída do   `mysqlbinlog` usando o cliente `mysql`:

```
$> mysqlbinlog binlog_files | mysql -u root -p
```

Se os arquivos de log binários tiverem sido criptografados, o `mysqlbinlog` não poderá lê-los diretamente, como no exemplo anterior, mas poderá lê-los do servidor usando a opção `--read-from-remote-server` (`-R`). Por exemplo:

```
$> mysqlbinlog --read-from-remote-server --host=host_name --port=3306  --user=root --password --ssl-mode=required  binlog_files | mysql -u root -p
```

Aqui, a opção `--ssl-mode=required` foi usada para garantir que os dados dos arquivos de log binários sejam protegidos durante a transmissão, pois são enviados ao `mysqlbinlog` em um formato não criptografado.

Importante

`VERIFY_CA` e `VERIFY_IDENTITY` são melhores escolhas do que `REQUIRED` para o modo SSL, pois ajudam a prevenir ataques de intermediário. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Consulte Opções de Comando para Conexões Encriptadas.

Ver os conteúdos do log pode ser útil quando você precisa determinar os tempos ou posições dos eventos para selecionar conteúdos de log parciais antes de executar eventos. Para visualizar os eventos do log, envie a saída do `mysqlbinlog` para um programa de navegação:

```
$> mysqlbinlog binlog_files | more
```

Alternativamente, salve a saída em um arquivo e visualize o arquivo em um editor de texto:

```
$> mysqlbinlog binlog_files > tmpfile
$> ... edit tmpfile ...
```

Após editar o arquivo, aplique o conteúdo da seguinte forma:

```
$> mysql -u root -p < tmpfile
```

Se você tiver mais de um log binário para aplicar no servidor MySQL, use uma única conexão para aplicar o conteúdo de todos os arquivos de log binários que deseja processar. Aqui está uma maneira de fazer isso:

```
$> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todo o log em um único arquivo e, em seguida, processar o arquivo:

```
$> mysqlbinlog binlog.000001 >  /tmp/statements.sql
$> mysqlbinlog binlog.000002 >> /tmp/statements.sql
$> mysql -u root -p -e "source /tmp/statements.sql"
```