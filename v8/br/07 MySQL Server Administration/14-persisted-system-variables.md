#### 7.1.9.3 Variaveis persistentes do sistema

O servidor MySQL mantém variáveis do sistema que configuram sua operação. Uma variável do sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual, ou ambos. Muitas variáveis do sistema são dinâmicas e podem ser alteradas no tempo de execução usando a instrução `SET` para afetar a operação da instância do servidor atual. `SET` também pode ser usado para persistir certas variáveis do sistema global para o arquivo `mysqld-auto.cnf` no diretório de dados, para afetar a operação do servidor para startups subsequentes. `RESET PERSIST` remove as configurações persistentes do `mysqld-auto.cnf`.

A discussão a seguir descreve aspectos das variáveis persistentes do sistema:

- Análise das variáveis de sistema persistentes
- Síntese para variáveis de sistema persistentes
- Obtenção de informações sobre variáveis persistentes do sistema
- Formato e manipulação do servidor do arquivo mysqld-auto.cnf
- Variaveis de sistema sensíveis persistentes

##### Análise das variáveis de sistema persistentes

Embora muitas variáveis do sistema possam ser definidas na inicialização a partir de um arquivo de opção `my.cnf`, ou no tempo de execução usando a instrução `SET`, esses métodos de configuração do servidor exigem acesso de login ao host do servidor, ou não fornecem a capacidade de configuração persistente do servidor no tempo de execução ou remotamente:

- Modificar um arquivo de opção requer acesso direto a esse arquivo, o que requer acesso de login ao host do servidor MySQL. Isso nem sempre é conveniente.
- Modificar variáveis do sistema com `SET GLOBAL` é uma capacidade de tempo de execução que pode ser feita a partir de clientes executados localmente ou de hosts remotos, mas as alterações afetam apenas a instância do servidor atualmente em execução.

Para aumentar as capacidades administrativas para a configuração do servidor além do que é alcançável através da edição de arquivos de opções ou usando `SET GLOBAL`, o MySQL fornece variantes da sintaxe `SET` que persistem configurações de variáveis do sistema para um arquivo chamado `mysqld-auto.cnf` arquivo no diretório de dados.

```
SET PERSIST max_connections = 1000;
SET @@PERSIST.max_connections = 1000;

SET PERSIST_ONLY back_log = 100;
SET @@PERSIST_ONLY.back_log = 100;
```

O MySQL também fornece uma instrução `RESET PERSIST` para remover variáveis persistentes do sistema de `mysqld-auto.cnf`.

A configuração do servidor executada por variáveis persistentes do sistema tem as seguintes características:

- As configurações persistentes são feitas no tempo de execução.
- As configurações persistentes são permanentes. Aplicam-se nas reinicializações do servidor.
- As configurações persistentes podem ser feitas a partir de clientes locais ou clientes que se conectam a partir de um host remoto. Isso fornece a conveniência de configurar remotamente vários servidores MySQL de um host cliente central.
- Para manter variáveis do sistema, você não precisa ter acesso de login ao host do servidor MySQL ou acesso do sistema de arquivos aos arquivos de opção. A capacidade de manter as configurações é controlada usando o sistema de privilégios do MySQL. Veja Seção 7.1.9.1, "Privilégios de variáveis do sistema".
- Um administrador com privilégios suficientes pode reconfigurar um servidor persistindo variáveis do sistema, então fazer com que o servidor use as configurações alteradas imediatamente executando uma instrução `RESTART`.
- As configurações persistentes fornecem feedback imediato sobre erros. Um erro em uma configuração inserida manualmente pode não ser descoberto até muito mais tarde.

##### Síntese para variáveis de sistema persistentes

Estas `SET` opções de sintaxe estão disponíveis para variáveis de sistema persistentes:

- Para persistir uma variável de sistema global para o arquivo de opção `mysqld-auto.cnf` no diretório de dados, precede o nome da variável pela palavra-chave `PERSIST` ou pelo qualificador `@@PERSIST.`:

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

  Como `SET GLOBAL`, `SET PERSIST` define o valor de tempo de execução da variável global, mas também escreve a configuração da variável no arquivo `mysqld-auto.cnf` (substituindo qualquer configuração de variável existente, se houver uma).
- Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` sem definir o valor de tempo de execução da variável global, precede o nome da variável pela palavra-chave `PERSIST_ONLY` ou pelo qualificador `@@PERSIST_ONLY.`:

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```

  Como o `PERSIST`, o `PERSIST_ONLY` escreve a configuração da variável para o `mysqld-auto.cnf`. No entanto, ao contrário do `PERSIST`, o `PERSIST_ONLY` não modifica o valor de tempo de execução da variável global. Isso torna o `PERSIST_ONLY` adequado para configurar variáveis de sistema somente leitura que podem ser definidas apenas no início do servidor.

Para obter mais informações sobre o `SET`, consulte a Secção 15.7.6.1, Sintaxe SET para atribuição de variáveis.

Estas opções de sintaxe estão disponíveis para remover variáveis persistentes do sistema:

- Para remover todas as variáveis persistentes do `mysqld-auto.cnf`, use `RESET PERSIST` sem nomear nenhuma variável do sistema:

  ```
  RESET PERSIST;
  ```
- Para remover uma variável persistente específica de `mysqld-auto.cnf`, nomeie-a na instrução:

  ```
  RESET PERSIST system_var_name;
  ```

  Isso inclui variáveis do sistema do plugin, mesmo que o plugin não esteja instalado. Se a variável não estiver presente no arquivo, ocorre um erro.
- Para remover uma variável persistente específica de `mysqld-auto.cnf`, mas produzir um aviso em vez de um erro se a variável não estiver presente no arquivo, adicione uma cláusula `IF EXISTS` à sintaxe anterior:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

Para obter mais informações sobre o `RESET PERSIST`, consulte a secção 15.7.8.7, "RESET PERSIST Statement".

Usando `SET` para persistir uma variável de sistema global para um valor de `DEFAULT` ou para seu valor padrão literal atribui à variável seu valor padrão e adiciona uma configuração para a variável para `mysqld-auto.cnf`. Para remover a variável do arquivo, use `RESET PERSIST`.

Algumas variáveis de sistema não podem ser persistentes, ver secção 7.1.9.4, "Variáveis de sistema não persistentes e restritas à persistência".

Uma variável de sistema implementada por um plugin pode ser persistente se o plugin estiver instalado quando a instrução `SET` for executada. A atribuição da variável de plugin persistente entra em vigor para reinicializações subsequentes do servidor se o plugin ainda estiver instalado. Se o plugin não estiver mais instalado, a variável do plugin não existe quando o servidor lê o arquivo `mysqld-auto.cnf`. Nesse caso, o servidor escreve um aviso para o registro de erros e continua:

```
currently unknown variable 'var_name'
was read from the persisted config file
```

##### Obtenção de informações sobre variáveis persistentes do sistema

A tabela de Performance Schema `persisted_variables` fornece uma interface SQL para o arquivo `mysqld-auto.cnf`, permitindo que seu conteúdo seja inspecionado no tempo de execução usando instruções `SELECT`.

A tabela de Performance Schema `variables_info` contém informações que mostram quando e por qual usuário cada variável do sistema foi definida mais recentemente.

Por outro lado, como o código 3 não altera os valores das variáveis, não tem efeito sobre o conteúdo da tabela 4 até que o servidor seja reiniciado.

##### Formato e manipulação do servidor do arquivo mysqld-auto.cnf

O arquivo `mysqld-auto.cnf` usa um formato `JSON` como este (reformatado ligeiramente para leitura):

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

Na inicialização, o servidor processa o arquivo `mysqld-auto.cnf` depois de todos os outros arquivos de opção (ver Seção 6.2.2.2, "Usar Arquivos de Opção").

- Se a variável de sistema `persisted_globals_load` for desativada, o servidor ignorará o arquivo `mysqld-auto.cnf`.
- A seção `"mysql_server_static_options"` contém variáveis somente de leitura persistentes usando `SET PERSIST_ONLY`. A seção também pode (apesar de seu nome) conter certas variáveis dinâmicas que não são somente de leitura. Todas as variáveis presentes dentro desta seção são anexadas à linha de comando e processadas com outras opções de linha de comando.
- Todas as variáveis persistentes restantes são definidas executando o equivalente a uma instrução `SET GLOBAL` mais tarde, pouco antes de o servidor começar a ouvir as conexões do cliente. Essas configurações, portanto, não entram em vigor até o final do processo de inicialização, o que pode ser inadequado para certas variáveis do sistema. Pode ser preferível definir essas variáveis em `my.cnf` em vez de em `mysqld-auto.cnf`.

O gerenciamento do arquivo `mysqld-auto.cnf` deve ser deixado para o servidor. A manipulação do arquivo deve ser realizada apenas usando instruções `SET` e `RESET PERSIST`, não manualmente:

- A remoção do arquivo resulta na perda de todas as configurações persistentes na próxima inicialização do servidor. (Isso é permitido se sua intenção é reconfigurar o servidor sem essas configurações.) Para remover todas as configurações no arquivo sem remover o próprio arquivo, use esta instrução:

  ```
  RESET PERSIST;
  ```
- Mudanças manuais no arquivo podem resultar em um erro de análise na inicialização do servidor. Neste caso, o servidor relata um erro e sai. Se este problema ocorrer, inicie o servidor com a variável de sistema `persisted_globals_load` desativada ou com a opção `--no-defaults`. Alternativamente, remova o arquivo `mysqld-auto.cnf`. No entanto, como observado anteriormente, a remoção deste arquivo resulta na perda de todas as configurações persistentes.

##### Variaveis de sistema sensíveis persistentes

O MySQL 8.4 tem a capacidade de armazenar valores de variáveis de sistema persistentes contendo dados confidenciais, como chaves privadas ou senhas, de forma segura, e de restringir a visualização dos valores.

::: info Note

Um componente de keyring deve ser habilitado na instância do MySQL Server para suportar armazenamento seguro para valores persistentes de variáveis do sistema, em vez de um plugin de keyring, que não suporta a função.

:::

No arquivo de opção `mysqld-auto.cnf` os nomes e valores das variáveis sensíveis do sistema são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para descodificá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestra (`persisted_variables_key`) que é armazenada em um chaveiro. Quando o servidor é iniciado, as variáveis persistentes do sistema sensível são descodificadas e usadas. Por padrão, se os valores criptografados estão presentes na opção de arquivo, mas não podem ser descodificados com sucesso, suas configurações padrão de inicialização são usadas. A configuração opcional mais segura faz com que o servidor pare de iniciar se os valores criptografados não puderem ser descodificados.

A variável do sistema `persist_sensitive_variables_in_plaintext` controla se o servidor pode armazenar os valores de variáveis sensíveis do sistema em um formato não criptografado, se o suporte do componente de chaveamento não estiver disponível no momento em que `SET PERSIST` é usado para definir o valor. Ele também controla se o servidor pode iniciar ou não se os valores criptografados não puderem ser decifrados.

- A configuração padrão, `ON`, criptografa os valores se o suporte ao componente de chave está disponível, e persiste sem criptografia (com um aviso) se não estiver. Na próxima vez que qualquer variável do sistema persistente for definida, se o suporte à chave estiver disponível naquele momento, o servidor criptografa os valores de quaisquer variáveis sensíveis do sistema não criptografadas. A configuração `ON` também permite que o servidor inicie se os valores das variáveis do sistema criptografadas não puderem ser decifrados, caso em que um aviso é emitido e os valores padrão para as variáveis do sistema são usados. Nessa situação, seus valores não podem ser alterados até que possam ser decifrados.
- A configuração mais segura, `OFF`, significa que os valores das variáveis do sistema sensíveis não podem ser mantidos se o suporte de componentes de chaveamento não estiver disponível. A configuração `OFF` também significa que o servidor não inicia se os valores das variáveis do sistema criptografados não puderem ser decifrados.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` permite que um detentor veja os valores de variáveis sensíveis do sistema nas tabelas do esquema de desempenho `global_variables`, `session_variables`, `variables_by_thread`, e `persisted_variables`, emita instruções `SELECT` para retornar seus valores, e rastrear mudanças neles em rastreadores de sessão para conexões. Usuários sem esse privilégio não podem ver ou rastrear esses valores de variáveis do sistema.

Se uma instrução `SET` for emitida para uma variável sensível do sistema, a consulta é reescrita para substituir o valor por `<redacted>` antes de ser registrada no log geral e no log de auditoria. Isso ocorre mesmo que o armazenamento seguro através de um componente de chaveamento não esteja disponível na instância do servidor.
