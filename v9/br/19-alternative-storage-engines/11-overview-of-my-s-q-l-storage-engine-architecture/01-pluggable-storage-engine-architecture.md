### 18.11.1 Arquitetura de Motores de Armazenamento Conectables

O MySQL Server utiliza uma arquitetura de motores de armazenamento conectables que permite que os motores de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

**Conectabilizando um Motor de Armazenamento**

Antes que um motor de armazenamento possa ser usado, a biblioteca de plug-in do motor de armazenamento deve ser carregada no MySQL usando a instrução `INSTALL PLUGIN`. Por exemplo, se o plug-in do motor `EXAMPLE` for chamado de `example` e a biblioteca compartilhada for chamada de `ha_example.so`, você a carrega com a seguinte instrução:

```
INSTALL PLUGIN example SONAME 'ha_example.so';
```

Para instalar um motor de armazenamento conectable, o arquivo do plug-in deve estar localizado no diretório de plug-in do MySQL, e o usuário que emite a instrução `INSTALL PLUGIN` deve ter privilégio `INSERT` para a tabela `mysql.plugin`.

A biblioteca compartilhada deve estar localizada no diretório de plug-in do servidor MySQL, cujo local é fornecido pela variável de sistema `plugin_dir`.

**Desconectabilizando um Motor de Armazenamento**

Para desconectar um motor de armazenamento, use a instrução `UNINSTALL PLUGIN`:

```
UNINSTALL PLUGIN example;
```

Se você desconectar um motor de armazenamento que é necessário por tabelas existentes, essas tabelas tornam-se inacessíveis, mas ainda estão presentes no disco (onde aplicável). Certifique-se de que não há tabelas usando um motor de armazenamento antes de desconectar o motor de armazenamento.