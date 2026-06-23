## 16.1 Esquema do Dicionário de Dados

As tabelas do dicionário de dados são protegidas e só podem ser acessadas em edições de depuração do MySQL. No entanto, o MySQL suporta o acesso aos dados armazenados em tabelas do dicionário de dados através das tabelas `INFORMATION_SCHEMA` e das instruções `SHOW`. Para uma visão geral das tabelas que compõem o dicionário de dados, consulte Tabelas do Dicionário de Dados.

As tabelas do sistema do MySQL ainda existem no MySQL 8.0 e podem ser visualizadas emitindo uma declaração `SHOW TABLES` no banco de dados do sistema `mysql`. Geralmente, a diferença entre as tabelas do dicionário de dados do MySQL e as tabelas do sistema é que as tabelas do dicionário de dados contêm metadados necessários para executar consultas SQL, enquanto as tabelas do sistema contêm dados auxiliares, como fuso horário e informações de ajuda. As tabelas do sistema do MySQL e as tabelas do dicionário de dados também diferem em como são atualizadas. O servidor MySQL gerencia as atualizações do dicionário de dados. Veja Como o Dicionário de Dados é Atualizado. A atualização das tabelas do sistema do MySQL requer a execução do procedimento completo de atualização do MySQL. Veja Seção 3.4, “O que o Processo de Atualização do MySQL Atualiza”.

### Como o Dicionário de Dados é Atualizado

Novas versões do MySQL podem incluir alterações nas definições das tabelas do dicionário de dados. Essas alterações estão presentes em versões recém-instaladas do MySQL, mas, ao realizar uma atualização local dos binários do MySQL, as alterações são aplicadas quando o servidor MySQL é reiniciado usando os novos binários. No início, a versão do dicionário de dados do servidor é comparada às informações de versão armazenadas no dicionário de dados para determinar se as tabelas do dicionário de dados devem ser atualizadas. Se uma atualização for necessária e suportada, o servidor cria tabelas do dicionário de dados com definições atualizadas, copia metadados persistentes para as novas tabelas, substitui atômica e reiniicia as tabelas antigas pelas novas e reiniicia o dicionário de dados. Se uma atualização não for necessária, a inicialização continua sem atualizar as tabelas do dicionário de dados.

A atualização das tabelas do dicionário de dados é uma operação atômica, o que significa que todas as tabelas do dicionário de dados são atualizadas conforme necessário ou a operação falha. Se a operação de atualização falhar, o início do servidor falha com um erro. Neste caso, os binários do servidor antigo podem ser usados com o diretório de dados antigo para iniciar o servidor. Quando os novos binários do servidor são usados novamente para iniciar o servidor, a atualização do dicionário de dados é repetida.

Geralmente, após as tabelas do dicionário de dados terem sido atualizadas com sucesso, não é possível reiniciar o servidor usando os binários do servidor antigo. Como resultado, a desvantagem dos binários do servidor MySQL para uma versão anterior do MySQL não é suportada após as tabelas do dicionário de dados terem sido atualizadas.

A opção **mysqld** `--no-dd-upgrade` pode ser usada para impedir a atualização automática das tabelas do dicionário de dados no início. Quando `--no-dd-upgrade` é especificado e o servidor descobre que a versão do dicionário de dados do servidor é diferente da versão armazenada no dicionário de dados, a inicialização falha com um erro que afirma que a atualização do dicionário de dados é proibida.

### Visualizando tabelas do dicionário de dados usando uma compilação de depuração do MySQL

As tabelas do dicionário de dados são protegidas por padrão, mas podem ser acessadas compilando o MySQL com suporte de depuração (usando a opção `-DWITH_DEBUG=1` **CMake**) e especificando a opção e o modificador `+d,skip_dd_table_access_check` `debug`. Para informações sobre a compilação de builds de depuração, consulte a Seção 7.9.1.1, “Compilando MySQL para Depuração”.

Aviso

Não é recomendado modificar ou escrever diretamente em tabelas de dicionário de dados e isso pode tornar sua instância MySQL inoperável.

Após compilar o MySQL com suporte de depuração, use esta declaração `SET` para tornar as tabelas do dicionário de dados visíveis para a sessão do cliente **mysql**:

```
mysql> SET SESSION debug='+d,skip_dd_table_access_check';
```

Use esta consulta para recuperar uma lista de tabelas do dicionário de dados:

```
mysql> SELECT name, schema_id, hidden, type FROM mysql.tables where schema_id=1 AND hidden='System';
```

Use `SHOW CREATE TABLE` para visualizar as definições das tabelas do dicionário de dados. Por exemplo:

```
mysql> SHOW CREATE TABLE mysql.catalogs\G
```