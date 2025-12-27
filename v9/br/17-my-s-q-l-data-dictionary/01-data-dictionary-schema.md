## 16.1 Schema do Dicionário de Dados

As tabelas do dicionário de dados são protegidas e só podem ser acessadas em compilações de depuração do MySQL. No entanto, o MySQL suporta o acesso aos dados armazenados nas tabelas do dicionário de dados por meio das tabelas `INFORMATION_SCHEMA` e das instruções `SHOW`. Para uma visão geral das tabelas que compõem o dicionário de dados, consulte Tabelas do Dicionário de Dados.

As tabelas do sistema MySQL ainda existem no MySQL 9.5 e podem ser visualizadas executando a instrução `SHOW TABLES` no banco de dados do sistema `mysql`. Geralmente, a diferença entre as tabelas do dicionário de dados do MySQL e as tabelas do sistema é que as tabelas do dicionário de dados contêm metadados necessários para executar consultas SQL, enquanto as tabelas do sistema contêm dados auxiliares, como fuso horário e informações de ajuda. As tabelas do sistema MySQL e as tabelas do dicionário de dados também diferem na forma como são atualizadas. O servidor MySQL gerencia as atualizações do dicionário de dados. Veja Como o Dicionário de Dados é Atualizado. A atualização das tabelas do sistema MySQL requer a execução do procedimento de atualização completo do MySQL. Veja Seção 3.4, “O que o Processo de Atualização do MySQL Atualiza”.

### Como o Dicionário de Dados é Atualizado

Novas versões do MySQL podem incluir alterações nas definições das tabelas do dicionário de dados. Essas alterações estão presentes em versões recém-instaladas do MySQL, mas, ao realizar uma atualização local dos binários do MySQL, as alterações são aplicadas quando o servidor MySQL é reiniciado usando os novos binários. Ao inicializar, a versão do dicionário de dados do servidor é comparada às informações de versão armazenadas no dicionário de dados para determinar se as tabelas do dicionário de dados devem ser atualizadas. Se uma atualização for necessária e suportada, o servidor cria tabelas do dicionário de dados com definições atualizadas, copia metadados persistentes para as novas tabelas, substitui atomicamente as tabelas antigas pelas novas e reinicia o dicionário de dados. Se uma atualização não for necessária, a inicialização continua sem atualizar as tabelas do dicionário de dados.

A atualização das tabelas do dicionário de dados é uma operação atômica, o que significa que todas as tabelas do dicionário de dados são atualizadas conforme necessário ou a operação falha. Se a operação de atualização falhar, a inicialização do servidor falha com um erro. Nesse caso, os binários do servidor antigo podem ser usados com o diretório de dados antigo para iniciar o servidor. Quando os novos binários do servidor são usados novamente para iniciar o servidor, a atualização do dicionário de dados é realizada novamente.

Geralmente, após as tabelas do dicionário de dados serem atualizadas com sucesso, não é possível reiniciar o servidor usando os binários do servidor antigo. Como resultado, a desatualização dos binários do servidor MySQL para uma versão anterior do MySQL não é suportada após as tabelas do dicionário de dados serem atualizadas.

### Visualização das Tabelas do Dicionário de Dados Usando uma Versão de Depuração do MySQL

As tabelas do dicionário de dados são protegidas por padrão, mas podem ser acessadas compilando o MySQL com suporte de depuração (usando a opção `-DWITH_DEBUG=1` do **CMake**) e especificando a opção e modificador `+d,skip_dd_table_access_check` de depuração. Para obter informações sobre a compilação de builds de depuração, consulte a Seção 7.9.1.1, “Compilação do MySQL para Depuração”.

Aviso

Não é recomendado modificar ou escrever diretamente em tabelas do dicionário de dados e isso pode tornar sua instância do MySQL inoperável.

Após compilar o MySQL com suporte de depuração, use esta instrução `SET` para tornar as tabelas do dicionário de dados visíveis para a sessão do cliente **mysql**:

```
mysql> SET SESSION debug='+d,skip_dd_table_access_check';
```

Use esta consulta para recuperar uma lista das tabelas do dicionário de dados:

```
mysql> SELECT name, schema_id, hidden, type FROM mysql.tables where schema_id=1 AND hidden='System';
```

Use `SHOW CREATE TABLE` para visualizar as definições das tabelas do dicionário de dados. Por exemplo:

```
mysql> SHOW CREATE TABLE mysql.catalogs\G
```