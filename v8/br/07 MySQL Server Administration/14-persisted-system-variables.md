#### 7.1.9.3 Variáveis de Sistema Persistentes

O servidor MySQL mantém variáveis de sistema que configuram sua operação. Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual ou ambos. Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a instrução `SET` para afetar a operação da instância atual do servidor. `SET` também pode ser usado para persistir certas variáveis de sistema globais no arquivo `mysqld-auto.cnf` no diretório de dados, para afetar a operação do servidor em inicializações subsequentes. `RESET PERSIST` remove as configurações persistentes do `mysqld-auto.cnf`.

A discussão a seguir descreve aspectos da persistência de variáveis de sistema:

*  Visão geral das Variáveis de Sistema Persistentes
*  Sintaxe para Persistência de Variáveis de Sistema
*  Obtenção de Informações Sobre Variáveis de Sistema Persistentes
*  Formato e Manipulação do Arquivo mysqld-auto.cnf pelo Servidor
*  Persistência de Variáveis de Sistema Sensíveis

##### Visão Geral das Variáveis de Sistema Persistentes

A capacidade de persistir variáveis de sistema globais em tempo de execução permite uma configuração do servidor que persiste em todas as inicializações do servidor. Embora muitas variáveis de sistema possam ser definidas em inicialização a partir de um arquivo de opção `my.cnf`, ou em tempo de execução usando a instrução `SET`, esses métodos de configuração do servidor requerem acesso de login ao host do servidor, ou não oferecem a capacidade de configurar o servidor persistentemente em tempo de execução ou remotamente:

* Modificar um arquivo de opção requer acesso direto a esse arquivo, o que requer acesso de login ao host do servidor MySQL. Isso nem sempre é conveniente.
* Modificar variáveis de sistema com `SET GLOBAL` é uma capacidade de tempo de execução que pode ser feita a partir de clientes executados localmente ou de hosts remotos, mas as alterações afetam apenas a instância do servidor atualmente em execução. As configurações não são persistentes e não são transferidas para inicializações subsequentes do servidor.

Para aumentar as capacidades administrativas para a configuração do servidor além do que é possível editando arquivos de opções ou usando `SET GLOBAL`, o MySQL fornece variantes da sintaxe `SET` que persistem as configurações de variáveis de sistema em um arquivo chamado `mysqld-auto.cnf` no diretório de dados. Exemplos:

```
SET PERSIST max_connections = 1000;
SET @@PERSIST.max_connections = 1000;

SET PERSIST_ONLY back_log = 100;
SET @@PERSIST_ONLY.back_log = 100;
```

O MySQL também fornece uma declaração `RESET PERSIST` para remover variáveis de sistema persistidas do `mysqld-auto.cnf`.

A configuração do servidor realizada através da persistência de variáveis de sistema tem essas características:

* As configurações persistidas são feitas em tempo de execução.
* As configurações persistidas são permanentes. Elas se aplicam em todos os reinicializações do servidor.
* As configurações persistidas podem ser feitas a partir de clientes locais ou clientes que se conectam de um host remoto. Isso proporciona a conveniência de configurar remotamente vários servidores MySQL a partir de um host cliente central.
* Para persistir variáveis de sistema, você não precisa ter acesso de login ao host do servidor MySQL ou acesso ao sistema de arquivos aos arquivos de opções. A capacidade de persistir configurações é controlada usando o sistema de privilégios do MySQL. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.
* Um administrador com privilégios suficientes pode reconfigurar um servidor ao persistir variáveis de sistema, e então fazer com que o servidor use as configurações alteradas imediatamente executando uma declaração `RESTART`.
* As configurações persistidas fornecem feedback imediato sobre erros. Um erro em uma configuração inserida manualmente pode não ser descoberto até muito mais tarde. As declarações `SET` que persistem variáveis de sistema evitam a possibilidade de configurações malformadas porque as configurações com erros sintáticos não têm sucesso e não alteram a configuração do servidor.

##### Sintaxe para Persistir Variáveis de Sistema

Estas opções de sintaxe `SET` estão disponíveis para persistir variáveis de sistema:

* Para persistir uma variável de sistema global no arquivo de opção `mysqld-auto.cnf` no diretório de dados, antecipe o nome da variável com a palavra-chave `PERSIST` ou o qualificador `@@PERSIST.`:

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

Assim como `SET GLOBAL`, `SET PERSIST` define o valor de execução da variável global, mas também escreve a configuração da variável no arquivo `mysqld-auto.cnf` (substituindo qualquer configuração de variável existente, se houver).
* Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` sem definir o valor de execução da variável global, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY`:

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```

  Assim como `PERSIST`, `PERSIST_ONLY` escreve a configuração da variável no `mysqld-auto.cnf`. No entanto, diferentemente de `PERSIST`, `PERSIST_ONLY` não modifica o valor de execução da variável global. Isso torna `PERSIST_ONLY` adequado para configurar variáveis de sistema de leitura apenas que podem ser definidas apenas no início do servidor.

Para obter mais informações sobre `SET`, consulte  Seção 15.7.6.1, “Sintaxe de SET para atribuição de variáveis”.

Essas opções de sintaxe `RESET PERSIST` estão disponíveis para remover variáveis de sistema persistidas:

* Para remover todas as variáveis persistidas do `mysqld-auto.cnf`, use `RESET PERSIST` sem nomear nenhuma variável de sistema:

  ```
  RESET PERSIST;
  ```
* Para remover uma variável persistida específica do `mysqld-auto.cnf`, nomeie-a na declaração:

  ```
  RESET PERSIST system_var_name;
  ```

Isso inclui variáveis de sistema de plugins, mesmo que o plugin não esteja instalado atualmente. Se a variável não estiver presente no arquivo, ocorrerá um erro.
* Para remover uma variável persistida específica do `mysqld-auto.cnf`, mas produzir uma mensagem de aviso em vez de um erro se a variável não estiver presente no arquivo, adicione uma cláusula `IF EXISTS` à sintaxe anterior:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

Para obter mais informações sobre `RESET PERSIST`, consulte  Seção 15.7.8.7, “Instrução RESET PERSIST”.

Usar `SET` para persistir uma variável de sistema global a um valor de `DEFAULT` ou ao seu valor padrão literal atribui a variável seu valor padrão e adiciona uma configuração para a variável no `mysqld-auto.cnf`. Para remover a variável do arquivo, use `RESET PERSIST`.

Algumas variáveis de sistema não podem ser persistidas. Veja a Seção 7.1.9.4, “Variáveis de sistema não persistíveis e variáveis de sistema com restrição de persistência”.

Uma variável de sistema implementada por um plugin pode ser persistida se o plugin for instalado quando a instrução `SET` for executada. A atribuição da variável de plugin persistida entra em vigor para reinicializações subsequentes do servidor se o plugin ainda estiver instalado. Se o plugin não estiver mais instalado, a variável do plugin não existirá quando o servidor ler o arquivo `mysqld-auto.cnf`. Nesse caso, o servidor escreve uma mensagem de aviso no log de erro e continua:

```
currently unknown variable 'var_name'
was read from the persisted config file
```

##### Obtendo Informações Sobre Variáveis de Sistema Persistidas

A tabela `persisted_variables` do Schema de Desempenho fornece uma interface SQL para o arquivo `mysqld-auto.cnf`, permitindo que seu conteúdo seja inspecionado em tempo de execução usando instruções `SELECT`. Veja a Seção 29.12.14.1, “Tabela Performance Schema persisted\_variables”.

A tabela `variables_info` do Schema de Desempenho contém informações que mostram quando e por qual usuário cada variável de sistema foi definida mais recentemente. Veja a Seção 29.12.14.2, “Tabela Performance Schema variables\_info”.

 `RESET PERSIST` afeta o conteúdo da tabela `persisted_variables` porque o conteúdo da tabela corresponde ao conteúdo do arquivo `mysqld-auto.cnf`. Por outro lado, como `RESET PERSIST` não altera os valores das variáveis, ele não tem efeito no conteúdo da tabela `variables_info` até que o servidor seja reiniciado.

##### Formato e Manipulação do Arquivo mysqld-auto.cnf pelo Servidor

O arquivo `mysqld-auto.cnf` usa um formato `JSON` como este (reformateado ligeiramente para melhor legibilidade):

```
{
  "Version": 1,
  "mysql_server": {
    "max_connections": {
      "Value": "152",
      "Metadata": {
        "Timestamp": 1519921341372531,
        "User": "root",
        "Host": "localhost"
      }
    },
    "transaction_isolation": {
      "Value": "READ-COMMITTED",
      "Metadata": {
        "Timestamp": 1519921553880520,
        "User": "root",
        "Host": "localhost"
      }
    },
    "mysql_server_static_options": {
      "innodb_api_enable_mdl": {
        "Value": "0",
        "Metadata": {
          "Timestamp": 1519922873467872,
          "User": "root",
          "Host": "localhost"
        }
      },
      "log_replica_updates": {
        "Value": "1",
        "Metadata": {
          "Timestamp": 1519925628441588,
          "User": "root",
          "Host": "localhost"
        }
      }
    }
  }
}
```

No momento do inicialização, o servidor processa o arquivo `mysqld-auto.cnf` após todos os outros arquivos de opção (veja a Seção 6.2.2.2, “Usando arquivos de opção”). O servidor lida com o conteúdo do arquivo da seguinte forma:

* Se a variável de sistema `persisted_globals_load` estiver desativada, o servidor ignora o arquivo `mysqld-auto.cnf`.
* A seção `"mysql_server_static_options"` contém variáveis de leitura somente que são persistidas usando `SET PERSIST_ONLY`. A seção também pode (apesar do nome) conter certas variáveis dinâmicas que não são de leitura somente. Todas as variáveis presentes dentro desta seção são anexadas à linha de comando e processadas com outras opções de linha de comando.
* Todas as variáveis persistentes restantes são definidas executando o equivalente a uma declaração `SET GLOBAL` mais tarde, logo antes do servidor começar a ouvir conexões de clientes. Essas configurações, portanto, não entram em vigor até o final do processo de inicialização, o que pode não ser adequado para certas variáveis de sistema. Pode ser preferível definir tais variáveis em `my.cnf` em vez de em `mysqld-auto.cnf`.

A gestão do arquivo `mysqld-auto.cnf` deve ser deixada ao servidor. A manipulação do arquivo deve ser realizada apenas usando as declarações `SET` e `RESET PERSIST`, e não manualmente:

* A remoção do arquivo resulta na perda de todas as configurações persistentes na próxima inicialização do servidor. (Isso é permitido se sua intenção for reconfigurar o servidor sem essas configurações.) Para remover todas as configurações no arquivo sem remover o próprio arquivo, use esta declaração:

  ```
  RESET PERSIST;
  ```
* Alterações manuais no arquivo podem resultar em um erro de parse na inicialização do servidor. Nesse caso, o servidor relata um erro e sai. Se esse problema ocorrer, inicie o servidor com a variável de sistema `persisted_globals_load` desativada ou com a opção `--no-defaults`. Alternativamente, remova o arquivo `mysqld-auto.cnf`. No entanto, como mencionado anteriormente, a remoção desse arquivo resulta na perda de todas as configurações persistentes.

##### Persistência de Variáveis de Sistema Sensíveis


O MySQL 8.4 tem a capacidade de armazenar valores persistentes de variáveis de sistema que contenham dados sensíveis, como chaves privadas ou senhas, de forma segura, e restringir a visualização desses valores. No momento, nenhuma variável de sistema do MySQL Server é marcada como sensível, mas essa capacidade permite que variáveis de sistema que contenham dados sensíveis sejam armazenadas de forma segura no futuro. Um arquivo de opção `mysqld-auto.cnf` criado pelo MySQL 8.4 não pode ser lido por versões mais antigas do MySQL Server.

::: info Nota

O componente keyring deve ser habilitado na instância do MySQL Server para suportar o armazenamento seguro de valores persistentes de variáveis de sistema, em vez de um plugin keyring, que não suportam essa função. Consulte a Seção 8.4.4, “O Keyring MySQL”.

:::

No arquivo de opção `mysqld-auto.cnf`, os nomes e valores das variáveis de sistema sensíveis são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para descriptografá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestre (`persisted_variables_key`) que é armazenada em um keyring. Quando o servidor é iniciado, os valores sensíveis de variáveis de sistema persistentes são descriptografados e usados. Por padrão, se valores criptografados estiverem presentes no arquivo de opção, mas não puderem ser descriptografados com sucesso no momento do início, suas configurações padrão são usadas. A configuração mais segura opcional faz com que o servidor pare o início se os valores criptografados não puderem ser descriptografados.

A variável de sistema `persist_sensitive_variables_in_plaintext` controla se o servidor é permitido armazenar os valores de variáveis de sistema sensíveis em um formato não criptografado, se o suporte ao componente keyring não estiver disponível no momento em que o valor é definido usando `SET PERSIST`. Também controla se o servidor pode ser iniciado se os valores criptografados não puderem ser descriptografados.

* A configuração padrão, `ON`, criptografa os valores se o suporte ao componente do chaveiro estiver disponível e os persistirá não criptografados (com um aviso) se não estiver. Na próxima vez que uma variável de sistema persistente for definida, se o suporte ao chaveiro estiver disponível naquela época, o servidor criptografa os valores de quaisquer variáveis de sistema sensíveis não criptografadas. A configuração `ON` também permite que o servidor seja iniciado se os valores das variáveis de sistema não criptografadas não puderem ser descriptografados, caso em que um aviso é emitido e os valores padrão para as variáveis de sistema são usados. Nessa situação, seus valores não podem ser alterados até que possam ser descriptografados.
* A configuração mais segura, `OFF`, significa que os valores das variáveis de sistema sensíveis não podem ser persistidos se o suporte ao componente do chaveiro estiver indisponível. A configuração `OFF` também significa que o servidor não será iniciado se os valores das variáveis de sistema não puderem ser descriptografados.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` permite que um titular visualize os valores das variáveis de sistema sensíveis nas tabelas do Schema de Desempenho `global_variables`, `session_variables`, `variables_by_thread` e `persisted_variables`, para emitir instruções `SELECT` para retornar seus valores e para rastrear alterações neles nos rastreadores de sessão para conexões. Usuários sem esse privilégio não podem visualizar ou rastrear esses valores de variáveis de sistema.

Se uma instrução `SET` for emitida para uma variável de sistema sensível, a consulta é reescrita para substituir o valor por “`<redacted>`” antes de ser registrada no log geral e no log de auditoria. Isso ocorre mesmo se o armazenamento seguro por meio de um componente do chaveiro não estiver disponível na instância do servidor.