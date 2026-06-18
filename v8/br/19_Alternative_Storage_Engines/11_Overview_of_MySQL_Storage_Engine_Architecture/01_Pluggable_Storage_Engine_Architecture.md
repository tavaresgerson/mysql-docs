### 18.11.1 Arquitetura de Motor de Armazenamento Desmontável

O MySQL Server utiliza uma arquitetura de mecanismo de armazenamento plugável que permite que os mecanismos de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

**Conectando um Motor de Armazenamento**

Antes que um mecanismo de armazenamento possa ser usado, a biblioteca de plug-in do mecanismo de armazenamento deve ser carregada no MySQL usando a instrução `INSTALL PLUGIN`. Por exemplo, se o plugin do mecanismo `EXAMPLE` é chamado de `example` e a biblioteca compartilhada é chamada de `ha_example.so`, você carrega-a com a seguinte instrução:

```
INSTALL PLUGIN example SONAME 'ha_example.so';
```

Para instalar um motor de armazenamento plugável, o arquivo do plugin deve estar localizado no diretório do plugin MySQL, e o usuário que emite a instrução `INSTALL PLUGIN` deve ter o privilégio `INSERT` para a tabela `mysql.plugin`.

A biblioteca compartilhada deve estar localizada no diretório do plugin do servidor MySQL, cujo local é fornecido pela variável de sistema `plugin_dir`.

**Desconectar um Motor de Armazenamento**

Para desconectar um motor de armazenamento, use a instrução `UNINSTALL PLUGIN`:

```
UNINSTALL PLUGIN example;
```

Se você desconectar um mecanismo de armazenamento necessário para tabelas existentes, essas tabelas se tornam inacessíveis, mas ainda estão presentes no disco (se aplicável). Certifique-se de que não há tabelas usando um mecanismo de armazenamento antes de desconectar o mecanismo de armazenamento.
