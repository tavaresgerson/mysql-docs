#### 7.1.9.3 Variáveis de sistema persistentes

O servidor MySQL mantém variáveis de sistema que configuram sua operação. Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual ou ambos. Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a instrução `SET` para afetar a operação da instância atual do servidor. `SET` também pode ser usado para persistir certas variáveis de sistema globais no arquivo `mysqld-auto.cnf` no diretório de dados, para afetar a operação do servidor em inicializações subsequentes. `RESET PERSIST` remove configurações persistidas de `mysqld-auto.cnf`.

A discussão a seguir descreve aspectos das variáveis de sistema persistentes:

- Visão geral das variáveis de sistema persistentes
- Sintaxe para variáveis de sistema persistentes
- Obter informações sobre variáveis de sistema persistentes
- Formato e Gerenciamento de Servidor do arquivo mysqld-auto.cnf
- Variáveis de sistema sensíveis persistentes

##### Visão geral das variáveis de sistema persistentes

A capacidade de persistir variáveis do sistema global em tempo de execução permite a configuração do servidor que persiste após o início do servidor. Embora muitas variáveis do sistema possam ser definidas no início do servidor a partir de um arquivo de opção `my.cnf` ou em tempo de execução usando a instrução `SET`, esses métodos de configuração do servidor exigem acesso de login ao host do servidor ou não oferecem a capacidade de configurar o servidor persistentemente em tempo de execução ou remotamente:

- Para modificar um arquivo de opção, é necessário ter acesso direto a esse arquivo, o que exige acesso de login ao host do servidor MySQL. Isso nem sempre é conveniente.

- Modificar as variáveis do sistema com `SET GLOBAL` é uma funcionalidade de tempo de execução que pode ser realizada a partir de clientes executados localmente ou de hosts remotos, mas as alterações afetam apenas a instância do servidor que está sendo executada no momento. As configurações não são persistentes e não são transferidas para as próximas inicializações do servidor.

Para aumentar as capacidades administrativas para a configuração do servidor além do que é possível ao editar arquivos de opções ou usar `SET GLOBAL`, o MySQL fornece variantes da sintaxe `SET` que persistem nas configurações de variáveis do sistema em um arquivo chamado arquivo `mysqld-auto.cnf` no diretório de dados. Exemplos:

```
SET PERSIST max_connections = 1000;
SET @@PERSIST.max_connections = 1000;

SET PERSIST_ONLY back_log = 100;
SET @@PERSIST_ONLY.back_log = 100;
```

O MySQL também fornece uma instrução `RESET PERSIST` para remover variáveis de sistema persistentes de `mysqld-auto.cnf`.

A configuração do servidor realizada através da persistência de variáveis do sistema tem essas características:

- As configurações persistentes são feitas em tempo de execução.

- As configurações persistentes são permanentes. Elas se aplicam em reinicializações do servidor.

- As configurações persistentes podem ser feitas a partir de clientes locais ou clientes que se conectam a um host remoto. Isso oferece a conveniência de configurar remotamente vários servidores MySQL a partir de um host cliente central.

- Para persistir variáveis do sistema, você não precisa ter acesso de login ao host do servidor MySQL ou acesso ao sistema de arquivos para arquivos de opção. A capacidade de persistir as configurações é controlada usando o sistema de privilégios do MySQL. Veja a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

- Um administrador com privilégios suficientes pode recarregar um servidor persistindo variáveis do sistema, e então fazer com que o servidor use as configurações alteradas imediatamente, executando uma instrução `RESTART`.

- As configurações persistentes fornecem feedback imediato sobre erros. Um erro em uma configuração inserida manualmente pode não ser descoberto até muito mais tarde. As declarações `SET` que persistem em variáveis do sistema evitam a possibilidade de configurações malformadas, pois as configurações com erros sintáticos não têm sucesso e não alteram a configuração do servidor.

##### Sintaxe para variáveis de sistema persistentes

Essas opções de sintaxe `SET` estão disponíveis para persistir variáveis do sistema:

- Para persistir uma variável de sistema global no arquivo de opção `mysqld-auto.cnf` no diretório de dados, antecipe o nome da variável com a palavra-chave `PERSIST` ou o qualificador `@@PERSIST.`:

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

  Assim como `SET GLOBAL`, `SET PERSIST` define o valor da variável global runtime, mas também escreve a configuração da variável no arquivo `mysqld-auto.cnf` (substituindo qualquer configuração de variável existente, se houver).

- Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` sem definir o valor de execução da variável global, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`:

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```

  Assim como `PERSIST`, `PERSIST_ONLY` escreve o valor da variável para `mysqld-auto.cnf`. No entanto, ao contrário de `PERSIST`, `PERSIST_ONLY` não modifica o valor da variável global runtime. Isso torna `PERSIST_ONLY` adequado para configurar variáveis de sistema de leitura apenas, que podem ser definidas apenas no início do servidor.

Para obter mais informações sobre `SET`, consulte a Seção 15.7.6.1, “Sintaxe de definição para atribuição de variáveis”.

Essas opções de sintaxe `RESET PERSIST` estão disponíveis para remover variáveis de sistema persistentes:

- Para remover todas as variáveis persistentes de `mysqld-auto.cnf`, use `RESET PERSIST` sem nomear nenhuma variável do sistema:

  ```
  RESET PERSIST;
  ```

- Para remover uma variável persistente específica do `mysqld-auto.cnf`, nomeie-a na declaração:

  ```
  RESET PERSIST system_var_name;
  ```

  Isso inclui as variáveis do sistema de plugins, mesmo que o plugin não esteja instalado atualmente. Se a variável não estiver presente no arquivo, ocorrerá um erro.

- Para remover uma variável persistente específica do `mysqld-auto.cnf`, mas emitir um aviso em vez de um erro se a variável não estiver presente no arquivo, adicione uma cláusula `IF EXISTS` à sintaxe anterior:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

Para obter mais informações sobre `RESET PERSIST`, consulte a Seção 15.7.8.7, “Declaração de RESET PERSIST”.

Usar `SET` para persistir uma variável de sistema global para um valor de `DEFAULT` ou para seu valor padrão literal atribui o valor padrão à variável e adiciona uma configuração para a variável em `mysqld-auto.cnf`. Para remover a variável do arquivo, use `RESET PERSIST`.

Algumas variáveis do sistema não podem ser persistidas. Consulte a Seção 7.1.9.4, “Variáveis do sistema não persistíveis e com restrição de persistência”.

Uma variável de sistema implementada por um plugin pode ser persistente se o plugin estiver instalado quando a instrução `SET` for executada. A atribuição da variável persistente do plugin entra em vigor para reinicializações subsequentes do servidor se o plugin ainda estiver instalado. Se o plugin não estiver mais instalado, a variável do plugin não existirá quando o servidor ler o arquivo `mysqld-auto.cnf`. Nesse caso, o servidor escreve uma mensagem de aviso no log de erros e continua:

```
currently unknown variable 'var_name'
was read from the persisted config file
```

##### Obter informações sobre variáveis de sistema persistentes

A tabela do Schema de Desempenho `persisted_variables` fornece uma interface SQL para o arquivo `mysqld-auto.cnf`, permitindo que seu conteúdo seja inspecionado em tempo de execução usando instruções `SELECT`. Veja a Seção 29.12.14.1, “Tabela persist\_variables do Schema de Desempenho”.

A tabela do Schema de Desempenho `variables_info` contém informações que mostram quando e por qual usuário cada variável do sistema foi definida pela última vez. Veja a Seção 29.12.14.2, “Tabela variáveis\_info do Schema de Desempenho”.

`RESET PERSIST` afeta o conteúdo da tabela `persisted_variables`, pois o conteúdo da tabela corresponde ao conteúdo do arquivo `mysqld-auto.cnf`. Por outro lado, como `RESET PERSIST` não altera os valores das variáveis, ele não tem efeito no conteúdo da tabela `variables_info` até que o servidor seja reiniciado.

##### Formato e Gerenciamento de Servidor do arquivo mysqld-auto.cnf

O arquivo `mysqld-auto.cnf` usa um formato `JSON` assim (reformatado levemente para melhor legibilidade):

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
      "log_slave_updates": {
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

Ao iniciar, o servidor processa o arquivo `mysqld-auto.cnf` após todos os outros arquivos de opção (consulte a Seção 6.2.2.2, “Usando arquivos de opção”). O servidor lida com o conteúdo do arquivo da seguinte forma:

- Se a variável de sistema `persisted_globals_load` estiver desativada, o servidor ignora o arquivo `mysqld-auto.cnf`.

- A seção `"mysql_server_static_options"` contém variáveis de leitura somente que são persistentes usando `SET PERSIST_ONLY`. A seção também pode (apesar do nome) conter certas variáveis dinâmicas que não são de leitura somente. Todas as variáveis presentes dentro desta seção são anexadas à linha de comando e processadas com outras opções de linha de comando.

- Todas as variáveis persistentes restantes são definidas executando o equivalente a uma instrução `SET GLOBAL` mais tarde, logo antes do servidor começar a ouvir conexões de clientes. Esses ajustes, portanto, não entram em vigor até o final do processo de inicialização, o que pode não ser adequado para certas variáveis do sistema. Pode ser preferível definir essas variáveis em `my.cnf` em vez de em `mysqld-auto.cnf`.

A gestão do arquivo `mysqld-auto.cnf` deve ser deixada para o servidor. A manipulação do arquivo deve ser realizada apenas usando as instruções `SET` e `RESET PERSIST`, e não manualmente:

- A remoção do arquivo resulta na perda de todos os ajustes persistentes na próxima inicialização do servidor. (Isso é permitido se a intenção for reconfigurar o servidor sem esses ajustes.) Para remover todos os ajustes do arquivo sem remover o arquivo em si, use esta instrução:

  ```
  RESET PERSIST;
  ```

- Alterações manuais no arquivo podem resultar em um erro de análise no início do servidor. Nesse caso, o servidor relata um erro e sai. Se esse problema ocorrer, inicie o servidor com a variável de sistema `persisted_globals_load` desabilitada ou com a opção `--no-defaults`. Alternativamente, remova o arquivo `mysqld-auto.cnf`. No entanto, como mencionado anteriormente, a remoção desse arquivo resulta na perda de todos os ajustes persistentes.

##### Variáveis de sistema sensíveis persistentes

A partir do MySQL 8.0.29, o MySQL Server tem a capacidade de armazenar de forma segura valores persistentes de variáveis de sistema que contenham dados sensíveis, como chaves privadas ou senhas, e restringir a visualização dos valores. No momento, nenhuma variável de sistema do MySQL Server é marcada como sensível, mas a nova capacidade permite que variáveis de sistema que contenham dados sensíveis sejam armazenadas de forma segura no futuro. Após a atualização para o MySQL 8.0.29, o formato do arquivo de opção `mysqld-auto.cnf` permanece o mesmo até a primeira vez que uma declaração `SET PERSIST` ou `SET PERSIST ONLY` for emitida, e, nesse ponto, ele é alterado para um novo formato, mesmo que a variável de sistema envolvida não seja sensível. No novo formato, o arquivo de opção não pode ser lido por versões mais antigas do MySQL Server.

Nota

Um componente de chave de acesso deve ser habilitado na instância do servidor MySQL para suportar o armazenamento seguro de valores de variáveis de sistema persistentes, em vez de um plugin de chave de acesso, que não suportam essa função. Consulte a Seção 8.4.4, “O MySQL Keyring”.

No arquivo de opção `mysqld-auto.cnf`, os nomes e valores das variáveis de sistema sensíveis são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para descriptografá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestre (`persisted_variables_key`) que é armazenada em um chaveiro. Quando o servidor é iniciado, as variáveis de sistema sensíveis persistentes são descriptografadas e usadas. Por padrão, se os valores criptografados estiverem presentes no arquivo de opção, mas não puderem ser descriptografados com sucesso durante o inicialização, suas configurações padrão são usadas. A configuração mais segura opcional faz com que o servidor pare o inicialização se os valores criptografados não puderem ser descriptografados.

A variável de sistema `persist_sensitive_variables_in_plaintext` controla se o servidor está autorizado a armazenar os valores das variáveis de sistema sensíveis em um formato não criptografado, se o suporte ao componente do chaveiro não estiver disponível no momento em que `SET PERSIST` é usado para definir o valor. Também controla se o servidor pode ser iniciado ou não, se os valores criptografados não puderem ser descriptografados.

- A configuração padrão, `ON`, criptografa os valores se o suporte ao componente do chaveiro estiver disponível e os persistirá não criptografados (com um aviso) se não estiver. Na próxima vez que uma variável de sistema persistente for definida, se o suporte ao chaveiro estiver disponível naquela época, o servidor criptografará os valores de quaisquer variáveis de sistema sensíveis não criptografadas. A configuração `ON` também permite que o servidor seja iniciado se os valores das variáveis de sistema não criptografadas não puderem ser descriptografados, nesse caso, um aviso é emitido e os valores padrão das variáveis de sistema são usados. Nessa situação, seus valores não podem ser alterados até que possam ser descriptografados.

- A configuração mais segura, `OFF`, significa que os valores sensíveis das variáveis do sistema não podem ser persistentes se o suporte ao componente do chaveiro estiver indisponível. A configuração `OFF` também significa que o servidor não será iniciado se os valores criptografados das variáveis do sistema não puderem ser descriptografados.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` permite que o titular visualize os valores das variáveis de sistema sensíveis nas tabelas do Schema de Desempenho `global_variables`, `session_variables`, `variables_by_thread` e `persisted_variables`, emita instruções `SELECT` para retornar seus valores e acompanhar as alterações neles nos rastreadores de sessão para conexões. Os usuários sem esse privilégio não podem visualizar ou acompanhar esses valores das variáveis de sistema.

Se uma declaração `SET` for emitida para uma variável de sistema sensível, a consulta é reescrita para substituir o valor por “`<redacted>`” antes de ser registrada no log geral e no log de auditoria. Isso ocorre mesmo se o armazenamento seguro por meio de um componente de chave de segurança não estiver disponível na instância do servidor.
