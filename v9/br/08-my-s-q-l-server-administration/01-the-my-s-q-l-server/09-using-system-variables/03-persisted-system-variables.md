#### 7.1.9.3 Variáveis de Sistema Persistentes

O servidor MySQL mantém variáveis de sistema que configuram sua operação. Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual ou ambos. Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a instrução `SET` para afetar a operação da instância atual do servidor. `SET` também pode ser usado para persistir certas variáveis de sistema globais no arquivo `mysqld-auto.cnf` no diretório de dados, para afetar a operação do servidor em inicializações subsequentes. `RESET PERSIST` remove as configurações persistentes do `mysqld-auto.cnf`.

A discussão a seguir descreve aspectos da persistência de variáveis de sistema:

* Visão geral das Variáveis de Sistema Persistentes
* Sintaxe para Persistência de Variáveis de Sistema
* Obtenção de Informações Sobre Variáveis de Sistema Persistentes
* Formato e Manipulação do Arquivo mysqld-auto.cnf pelo Servidor
* Persistência de Variáveis de Sistema Sensíveis

##### Visão Geral das Variáveis de Sistema Persistentes

A capacidade de persistir variáveis de sistema globais em tempo de execução permite uma configuração do servidor que persiste em todas as inicializações do servidor. Embora muitas variáveis de sistema possam ser definidas em inicialização a partir de um arquivo de opção `my.cnf`, ou em tempo de execução usando a instrução `SET`, esses métodos de configuração do servidor requerem acesso de login ao host do servidor MySQL, ou não fornecem a capacidade de configurar o servidor persistentemente em tempo de execução ou remotamente:

* Modificar um arquivo de opção requer acesso direto a esse arquivo, o que requer acesso de login ao host do servidor MySQL. Isso nem sempre é conveniente.

* A modificação de variáveis de sistema com `SET GLOBAL` é uma funcionalidade de tempo de execução que pode ser realizada a partir de clientes executados localmente ou de hosts remotos, mas as alterações afetam apenas a instância do servidor que está sendo executada atualmente. As configurações não são persistentes e não são transferidas para as próximas inicializações do servidor.

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
* As configurações persistidas são permanentes. Elas se aplicam em todas as reinicializações do servidor.

* As configurações persistidas podem ser feitas a partir de clientes locais ou clientes que se conectam de um host remoto. Isso proporciona a conveniência de configurar remotamente vários servidores MySQL a partir de um host cliente central.

* Para persistir variáveis de sistema, você não precisa ter acesso de login ao host do servidor MySQL ou acesso ao sistema de arquivos aos arquivos de opções. A capacidade de persistir configurações é controlada usando o sistema de privilégios do MySQL. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

* Um administrador com privilégios suficientes pode reconfigurar um servidor ao persistir variáveis de sistema, e então fazer com que o servidor use as configurações alteradas imediatamente executando uma declaração `RESTART`.

* As configurações persistentes fornecem feedback imediato sobre erros. Um erro em uma configuração inserida manualmente pode não ser descoberto até muito mais tarde. As instruções `SET` que persistem variáveis do sistema evitam a possibilidade de configurações malformadas porque as configurações com erros sintáticos não têm sucesso e não alteram a configuração do servidor.

##### Sintaxe para Persistência de Variáveis do Sistema

Estas opções de sintaxe `SET` estão disponíveis para a persistência de variáveis do sistema:

* Para persistir uma variável do sistema global no arquivo de opção `mysqld-auto.cnf` no diretório de dados, preceda o nome da variável com a palavra-chave `PERSIST` ou o qualificador `@@PERSIST.`:

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

  Assim como `SET GLOBAL`, `SET PERSIST` define o valor de execução da variável global, mas também escreve a configuração da variável no arquivo `mysqld-auto.cnf` (substituindo qualquer configuração de variável existente, se houver).

* Para persistir uma variável do sistema global no arquivo `mysqld-auto.cnf` sem definir o valor de execução da variável global, preceda o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`:

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```

  Assim como `PERSIST`, `PERSIST_ONLY` escreve a configuração da variável no `mysqld-auto.cnf`. No entanto, ao contrário de `PERSIST`, `PERSIST_ONLY` não modifica o valor de execução da variável global. Isso torna `PERSIST_ONLY` adequado para configurar variáveis do sistema de leitura apenas que podem ser definidas apenas no início do servidor.

Para mais informações sobre `SET`, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Estas opções de sintaxe `RESET PERSIST` estão disponíveis para a remoção de variáveis do sistema persistentes:

* Para remover todas as variáveis persistentes do `mysqld-auto.cnf`, use `RESET PERSIST` sem nomear nenhuma variável do sistema:

  ```
  RESET PERSIST;
  ```

* Para remover uma variável persistente específica do `mysqld-auto.cnf`, nomeie-a na instrução:

Isso inclui variáveis do sistema de plugins, mesmo que o plugin não esteja instalado atualmente. Se a variável não estiver presente no arquivo, ocorrerá um erro.

* Para remover uma variável persistente específica do `mysqld-auto.cnf`, mas gerar uma mensagem de aviso em vez de um erro se a variável não estiver presente no arquivo, adicione uma cláusula `IF EXISTS` à sintaxe anterior:

  ```
  RESET PERSIST system_var_name;
  ```

Para obter mais informações sobre `RESET PERSIST`, consulte a Seção 15.7.8.7, “Instrução RESET PERSIST”.

Usar `SET` para persistir uma variável global do sistema para um valor de `DEFAULT` ou para seu valor padrão literal atribui a variável seu valor padrão e adiciona uma configuração para a variável no `mysqld-auto.cnf`. Para remover a variável do arquivo, use `RESET PERSIST`.

Algumas variáveis do sistema não podem ser persistidas. Consulte a Seção 7.1.9.4, “Variáveis do sistema não persistidas e com restrição de persistência”.

Uma variável do sistema implementada por um plugin pode ser persistida se o plugin estiver instalado quando a instrução `SET` for executada. A atribuição da variável persistente do plugin entra em vigor para reinicializações subsequentes do servidor se o plugin ainda estiver instalado. Se o plugin não estiver mais instalado, a variável do plugin não existirá quando o servidor ler o arquivo `mysqld-auto.cnf`. Nesse caso, o servidor escreve um aviso no log de erro e continua:

```
  RESET PERSIST IF EXISTS system_var_name;
  ```

##### Obtendo Informações Sobre Variáveis do Sistema Persistidas

A tabela `persisted_variables` do Schema de Desempenho fornece uma interface SQL para o arquivo `mysqld-auto.cnf`, permitindo que seu conteúdo seja inspecionado em tempo de execução usando instruções `SELECT`. Consulte a Seção 29.12.14.2, “Tabela Persistidas de variáveis do Schema de Desempenho”.

A tabela `variables_info` do Schema de Desempenho contém informações sobre quando e por qual usuário cada variável do sistema foi definida pela última vez. Veja a Seção 29.12.14.3, “Tabela de variáveis_info do Schema de Desempenho”.

O comando `RESET PERSIST` afeta o conteúdo da tabela `persisted_variables` porque o conteúdo da tabela corresponde ao conteúdo do arquivo `mysqld-auto.cnf`. Por outro lado, como o `RESET PERSIST` não altera os valores das variáveis, ele não tem efeito no conteúdo da tabela `variables_info` até que o servidor seja reiniciado.

##### Formato e Gerenciamento do Arquivo `mysqld-auto.cnf`

O arquivo `mysqld-auto.cnf` usa um formato `JSON` assim (reformateado ligeiramente para melhor legibilidade):

```
currently unknown variable 'var_name'
was read from the persisted config file
```

Ao inicializar, o servidor processa o arquivo `mysqld-auto.cnf` após todos os outros arquivos de opção (veja a Seção 6.2.2.2, “Uso de Arquivos de Opção”). O servidor lida com o conteúdo do arquivo da seguinte forma:

* Se a variável de sistema `persisted_globals_load` estiver desativada, o servidor ignora o arquivo `mysqld-auto.cnf`.

* A seção `"mysql_server_static_options"` contém variáveis de leitura somente persistidas usando `SET PERSIST_ONLY`. A seção também pode (apesar do nome) conter certas variáveis dinâmicas que não são de leitura somente. Todas as variáveis presentes nesta seção são anexadas à linha de comando e processadas com outras opções de linha de comando.

* Todas as variáveis persistidas restantes são definidas executando o equivalente a uma declaração `SET GLOBAL` mais tarde, logo antes do servidor começar a ouvir conexões de clientes. Esses ajustes, portanto, não entram em vigor até o final do processo de inicialização, o que pode não ser adequado para certas variáveis de sistema. Pode ser preferível definir tais variáveis em `my.cnf` em vez de em `mysqld-auto.cnf`.

A gestão do arquivo `mysqld-auto.cnf` deve ser deixada para o servidor. A manipulação do arquivo deve ser realizada apenas com as instruções `SET` e `RESET PERSIST`, e não manualmente:

* A remoção do arquivo resulta na perda de todos os ajustes persistentes na próxima inicialização do servidor. Isso é permitido se a intenção for reconfigurar o servidor sem esses ajustes. Para remover todos os ajustes no arquivo sem remover o próprio arquivo, use esta instrução:

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

* Alterações manuais no arquivo podem resultar em um erro de análise na inicialização do servidor. Nesse caso, o servidor relata um erro e sai. Se esse problema ocorrer, inicie o servidor com a variável de sistema `persisted_globals_load` desabilitada ou com a opção `--no-defaults`. Alternativamente, remova o arquivo `mysqld-auto.cnf`. No entanto, como mencionado anteriormente, a remoção desse arquivo resulta na perda de todos os ajustes persistentes.

##### Persistindo Variáveis de Sistema Sensíveis

O MySQL 9.5 tem a capacidade de armazenar valores de variáveis de sistema persistentes que contenham dados sensíveis, como chaves privadas ou senhas, de forma segura, e de restringir a visualização dos valores. Nenhuma variável de sistema do MySQL Server atualmente é marcada como sensível, mas essa capacidade permite que as variáveis de sistema que contenham dados sensíveis sejam persistidas de forma segura no futuro. Um arquivo de opção `mysqld-auto.cnf` criado pelo MySQL 9.5 não pode ser lido por versões mais antigas do MySQL Server.

Nota

Um componente de chaveira deve ser habilitado na instância do MySQL Server para suportar o armazenamento seguro de valores de variáveis de sistema persistentes, em vez de um plugin de chaveira, que não suportam a função. Consulte a Seção 8.4.5, “A Chaveira MySQL”.

No arquivo de opção `mysqld-auto.cnf`, os nomes e valores das variáveis de sistema sensíveis são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para descriptografá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestre (`persisted_variables_key`) que é armazenada em um chaveiro. Quando o servidor é iniciado, as variáveis de sistema sensíveis persistentes são descriptografadas e usadas. Por padrão, se os valores criptografados estiverem presentes no arquivo de opção, mas não puderem ser descriptografados com sucesso durante o inicialização, suas configurações padrão são usadas. A configuração opcional mais segura faz com que o servidor pare o inicialização se os valores criptografados não puderem ser descriptografados.

A variável de sistema `persist_sensitive_variables_in_plaintext` controla se o servidor é permitido armazenar os valores das variáveis de sistema sensíveis em um formato não criptografado, se o suporte ao componente chaveiro não estiver disponível no momento em que o `SET PERSIST` é usado para definir o valor. Também controla se o servidor pode ser iniciado se os valores criptografados não puderem ser descriptografados.

* A configuração padrão, `ON`, criptografa os valores se o suporte ao componente chaveiro estiver disponível, e os persiste não criptografados (com um aviso) se não estiver. Na próxima vez que qualquer variável de sistema persistente for definida, se o suporte ao chaveiro estiver disponível naquela época, o servidor criptografa os valores de quaisquer variáveis de sistema sensíveis não criptografadas. A configuração `ON` também permite que o servidor seja iniciado se os valores das variáveis de sistema criptografadas não puderem ser descriptografados, caso em que um aviso é emitido e as configurações padrão para as variáveis de sistema são usadas. Nessa situação, seus valores não podem ser alterados até que possam ser descriptografados.

* O nível de segurança mais alto, `OFF`, significa que os valores das variáveis de sistema sensíveis não podem ser persistidos se o suporte ao componente do chaveiro estiver indisponível. O nível `OFF` também significa que o servidor não será iniciado se os valores criptografados das variáveis de sistema não puderem ser descriptografados.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` permite que o titular visualize os valores das variáveis de sistema sensíveis nas tabelas do Schema de Desempenho `global_variables`, `session_variables`, `variables_by_thread` e `persisted_variables`, para emitir instruções `SELECT` para retornar seus valores e para rastrear alterações neles nos rastreadores de sessão para conexões. Os usuários sem esse privilégio não podem visualizar ou rastrear esses valores das variáveis de sistema.

Se uma instrução `SET` for emitida para uma variável de sistema sensível, a consulta é reescrita para substituir o valor por `<redacted>` antes de ser registrada no log geral e no log de auditoria. Isso ocorre mesmo se o armazenamento seguro por meio de um componente do chaveiro não estiver disponível na instância do servidor.