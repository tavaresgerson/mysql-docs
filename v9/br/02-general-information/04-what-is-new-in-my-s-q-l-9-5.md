## 1.4 O que há de novo no MySQL 9.5

Esta seção resume o que foi adicionado, descontinuado, alterado e removido no MySQL 9.5 desde o MySQL 9.4. Uma seção complementar lista as opções e variáveis do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 9.5; veja a Seção 1.5, “Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 9.5”.

* Recursos Adicionados ou Alterações no MySQL 9.5
* Recursos Descontinuados no MySQL 9.5
* Recursos Removidos no MySQL 9.5

### Recursos Adicionados ou Alterações no MySQL 9.5

Os seguintes recursos foram adicionados ao MySQL 9.5:

* **Mudança no comportamento padrão do `innodb_log_writer_threads`.** O valor padrão para `innodb_log_writer_threads` agora é determinado em parte pelo fato de o registro binário estar habilitado no servidor, conforme mostrado aqui:

  ```
  if (log_bin = OFF)
  {
    if ([number of logical CPUs] <= 4)
    {
      innodb_log_writer_threads = OFF
    }
    else
    {
      innodb_log_writer_threads = ON
    }
  }
  else
  {
    /* Same as in MySQL 9.4 and earlier: */
    if ([number of logical CPUs] < 32)
    {
      innodb_log_writer_threads = OFF
    }
    else
    {
      innodb_log_writer_threads = ON
    }
  }
  ```

  Em outras palavras, se o registro binário estiver habilitado (`log_bin` estiver em `ON`) e o número de CPUs lógicas disponíveis for de 32 ou mais, `innodb_log_writer_threads` tem o valor padrão `ON`; se o registro binário estiver desabilitado e o número de CPUs disponíveis for maior que 4, ele (também) tem o valor padrão `ON`; em todos os outros casos, o valor padrão de `innodb_log_writer_threads` é `OFF`. Isso não afeta o valor configurado da variável, se definido.

  Para mais informações, consulte a descrição de `innodb_log_writer_threads` na documentação, bem como a Seção 10.5.4, “Otimizando o registro de refazer do InnoDB”.

* **Aumento do tamanho da `binlog_transaction_dependency_history_size`.** O valor padrão da variável de sistema `binlog_transaction_dependency_history_size` foi aumentado no MySQL 9.5.0 de 25000 para 1000000 (um milhão). Além disso, o valor máximo dessa variável foi aumentado de 1000000 para 10000000 (dez milhões).

Essa mudança não afeta nenhum valor atualmente definido para essa variável, e, portanto, não deve ter nenhum efeito em configurações existentes.

### Recursos Desatualizados no MySQL 9.5

Os seguintes recursos são desatualizados no MySQL 9.5 e podem ser removidos em uma futura versão. Onde são mostradas alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações que usam recursos desatualizados no MySQL 9.5 que foram removidos em uma versão posterior do MySQL, as declarações podem falhar ao serem replicadas de uma fonte MySQL 9.5 para uma réplica executando uma versão posterior, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que usam recursos desatualizados no 9.5 devem ser revisadas para evitar esses recursos e usar alternativas quando possível.

* **Autenticação SCRAM-SHA-1.** O método de autenticação `SCRAM-SHA-1` para autenticação SASL LDAP é desatualizado a partir do MySQL 9.5.0. Use `SCRAM-SHA-256` em vez disso; este também é agora o valor padrão para `authentication_ldap_sasl_auth_method_name`.

Consulte a Seção 8.4.1.6, “LDAP Pluggable Authentication”, para obter mais informações.

### Recursos Removidos no MySQL 9.5

Os seguintes itens são obsoletos e foram removidos no MySQL 9.5. Onde são mostradas alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações MySQL 9.4 que usam recursos removidos no MySQL 9.5, as declarações podem falhar ao serem replicadas de uma fonte MySQL 9.4 para uma réplica MySQL 9.5, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que usam recursos removidos no MySQL 9.5 devem ser revisadas para evitar esses recursos e usar alternativas quando possível.

* **Variáveis de sistema e status do servidor removidas.** As variáveis de sistema e status do servidor removidas no MySQL 9.5 são mostradas na seguinte lista:

+ `permitir_grupo_replicação_join_local_de_versão_inferior`
+ `tipo_replicação_paralela`