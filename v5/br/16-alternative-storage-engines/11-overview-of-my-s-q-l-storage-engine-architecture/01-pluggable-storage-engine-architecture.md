### 15.11.1 Arquitetura de Motor de Armazenamento Desmontável

O MySQL Server utiliza uma arquitetura de mecanismo de armazenamento plugável que permite que os mecanismos de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

**Conectando um Motor de Armazenamento**

Antes que um mecanismo de armazenamento possa ser usado, a biblioteca de plug-in do mecanismo de armazenamento deve ser carregada no MySQL usando a instrução `INSTALL PLUGIN`. Por exemplo, se o plug-in do mecanismo `EXAMPLE` for chamado de `example` e a biblioteca compartilhada for chamada de `ha_example.so`, você carregá-la-á com a seguinte instrução:

```sql
INSTALL PLUGIN example SONAME 'ha_example.so';
```

Para instalar um motor de armazenamento plugável, o arquivo do plugin deve estar localizado no diretório do plugin MySQL e o usuário que emite a instrução `INSTALL PLUGIN` deve ter privilégio de `INSERT` para a tabela `mysql.plugin`.

A biblioteca compartilhada deve estar localizada no diretório do plugin do servidor MySQL, cujo local é fornecido pela variável de sistema `plugin_dir`.

**Desconectar um Motor de Armazenamento**

Para desativar um motor de armazenamento, use a instrução `UNINSTALL PLUGIN`:

```sql
UNINSTALL PLUGIN example;
```

Se você desconectar um mecanismo de armazenamento necessário para tabelas existentes, essas tabelas se tornam inacessíveis, mas ainda estão presentes no disco (se aplicável). Certifique-se de que não há tabelas usando um mecanismo de armazenamento antes de desconectar o mecanismo de armazenamento.
