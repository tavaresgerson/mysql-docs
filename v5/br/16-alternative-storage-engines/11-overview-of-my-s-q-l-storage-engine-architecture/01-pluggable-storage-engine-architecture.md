### 15.11.1 Arquitetura Pluggable de Storage Engine

O MySQL Server utiliza uma arquitetura pluggable de Storage Engine que permite que Storage Engines sejam carregados e descarregados de um servidor MySQL em execução.

**Plugando um Storage Engine**

Antes que um Storage Engine possa ser utilizado, a shared library do plugin do Storage Engine deve ser carregada no MySQL usando a instrução `INSTALL PLUGIN`. Por exemplo, se o plugin do engine `EXAMPLE` for nomeado `example` e a shared library for nomeada `ha_example.so`, você o carrega com a seguinte instrução:

```sql
INSTALL PLUGIN example SONAME 'ha_example.so';
```

Para instalar um Storage Engine pluggable, o arquivo do plugin deve estar localizado no diretório de plugins do MySQL, e o usuário que emite a instrução `INSTALL PLUGIN` deve ter o privilégio `INSERT` para a tabela `mysql.plugin`.

A shared library deve estar localizada no diretório de plugins do MySQL Server, cuja localização é fornecida pela variável de sistema `plugin_dir`.

**Desplugando um Storage Engine**

Para desplugar um Storage Engine, utilize a instrução `UNINSTALL PLUGIN`:

```sql
UNINSTALL PLUGIN example;
```

Se você desplugar um Storage Engine que é necessário por tabelas existentes, essas tabelas se tornam inacessíveis, mas ainda estão presentes no disco (quando aplicável). Certifique-se de que não haja tabelas utilizando um Storage Engine antes de desplugá-lo.